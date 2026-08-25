# Backend Code Examples - Medusa v2 + MercurJS

**Complemento a:** BACKEND_REQUIREMENTS.md + BACKEND_SQL_MIGRATIONS.md  
**Para:** Equipo Backend - Implementation Examples  
**Fecha:** 21 Agosto 2026  
**Stack:** Node.js 18+, TypeScript, Medusa v2, PostgreSQL

---

## 📋 Estructura de Carpetas Sugerida

```
src/
├── api/
│   ├── admin/
│   │   └── custom/
│   │       ├── products/
│   │       │   ├── pending/
│   │       │   │   └── route.ts          # GET pending products
│   │       │   └── [id]/
│   │       │       └── pricing-approval/
│   │       │           └── route.ts      # PATCH approve/reject
│   │       └── sellers/
│   │           ├── route.ts              # GET all sellers
│   │           └── [id]/
│   │               ├── markup/
│   │               │   ├── route.ts      # GET/PATCH markup
│   │               │   └── history/
│   │               │       └── route.ts  # GET history
│   └── vendor/
│       └── custom/
│           ├── products/
│           │   └── route.ts              # GET/POST products
│           └── sellers/
│               └── me/
│                   └── markup/
│                       └── route.ts      # GET my markup
├── models/
│   ├── custom-product-proposal.ts
│   └── seller-markup-history.ts
├── services/
│   ├── product-pricing.ts
│   └── seller-markup.ts
└── utils/
    └── pricing-calculator.ts
```

---

## 🔧 Servicios Base

### Service: ProductPricingService

```typescript
// src/services/product-pricing.ts

import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";

interface ProposeProductInput {
  sellerId: string;
  title: string;
  description?: string;
  basePrice: number;
  unitsPerPack: number;
  categoryId?: string;
  subcategory?: string;
  tags?: string[];
  thumbnail?: string;
  images?: string[];
  variants?: ProductVariant[];
  ean?: string;
  taxRate?: number;
}

interface ProductVariant {
  title: string;
  sku: string;
  basePrice: number;
  inventoryQuantity?: number;
  options?: Record<string, string>;
}

interface ApproveProductInput {
  productId: string;
  markupPercentage: number;
  approvedBy: string;
}

interface RejectProductInput {
  productId: string;
  rejectionReason: string;
  rejectedBy: string;
}

class ProductPricingService extends TransactionBaseService {
  
  /**
   * Get pending products for approval
   */
  async getPendingProducts(
    filters: {
      sellerId?: string;
      categoryId?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const manager = this.activeManager_;
    const { sellerId, categoryId, limit = 50, offset = 0 } = filters;

    const query = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.base_price,
        p.units_per_pack,
        p.category_id,
        p.subcategory,
        p.tags,
        p.thumbnail,
        p.images,
        p.seller_id,
        s.name as seller_name,
        s.email as seller_email,
        p.variants,
        p.status,
        p.markup_percentage,
        p.rejection_reason,
        p.ean,
        p.tax_rate,
        p.created_at,
        p.updated_at
      FROM custom_product_proposals p
      INNER JOIN sellers s ON s.id = p.seller_id
      WHERE p.status = 'pending_approval'
        AND ($1::VARCHAR IS NULL OR p.seller_id = $1)
        AND ($2::VARCHAR IS NULL OR p.category_id = $2)
      ORDER BY p.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const products = await manager.query(query, [
      sellerId || null,
      categoryId || null,
      limit,
      offset,
    ]);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM custom_product_proposals
      WHERE status = 'pending_approval'
        AND ($1::VARCHAR IS NULL OR seller_id = $1)
        AND ($2::VARCHAR IS NULL OR category_id = $2)
    `;
    
    const [{ total }] = await manager.query(countQuery, [
      sellerId || null,
      categoryId || null,
    ]);

    return {
      products,
      total: parseInt(total),
      limit,
      offset,
    };
  }

  /**
   * Propose new product
   */
  async proposeProduct(input: ProposeProductInput) {
    const manager = this.activeManager_;
    const id = `proposal_${this.generateId()}`;

    // Validate
    this.validateProductInput(input);

    const query = `
      INSERT INTO custom_product_proposals (
        id, seller_id, title, description, base_price, units_per_pack,
        category_id, subcategory, tags, thumbnail, images, variants,
        ean, tax_rate, status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
        'pending_approval', NOW(), NOW()
      )
      RETURNING *
    `;

    const [product] = await manager.query(query, [
      id,
      input.sellerId,
      input.title,
      input.description || null,
      input.basePrice,
      input.unitsPerPack,
      input.categoryId || null,
      input.subcategory || null,
      input.tags || [],
      input.thumbnail || null,
      input.images || [],
      input.variants ? JSON.stringify(input.variants) : null,
      input.ean || null,
      input.taxRate || 21.00,
    ]);

    return product;
  }

  /**
   * Approve product with markup
   */
  async approveProduct(input: ApproveProductInput) {
    const manager = this.activeManager_;
    const { productId, markupPercentage, approvedBy } = input;

    // Validate markup
    if (markupPercentage < 0 || markupPercentage > 500) {
      throw new Error("Markup must be between 0% and 500%");
    }

    return await manager.transaction(async (transactionManager) => {
      // Get product
      const [product] = await transactionManager.query(
        `SELECT * FROM custom_product_proposals WHERE id = $1`,
        [productId]
      );

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.status !== "pending_approval") {
        throw new Error("Product is not pending approval");
      }

      // Calculate final price
      const finalPrice = this.calculateFinalPrice(
        product.base_price,
        markupPercentage
      );

      // Create product in Medusa
      const medusaProduct = await this.createMedusaProduct({
        title: product.title,
        description: product.description,
        finalPrice,
        variants: product.variants,
        images: product.images,
        thumbnail: product.thumbnail,
        // ... other fields
      });

      // Update proposal
      const updateQuery = `
        UPDATE custom_product_proposals
        SET 
          status = 'approved',
          markup_percentage = $1,
          approved_at = NOW(),
          approved_by = $2,
          medusa_product_id = $3,
          updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `;

      const [updatedProduct] = await transactionManager.query(updateQuery, [
        markupPercentage,
        approvedBy,
        medusaProduct.id,
        productId,
      ]);

      return {
        product: updatedProduct,
        medusaProduct,
        message: "Producto aprobado y publicado en catálogo",
      };
    });
  }

  /**
   * Reject product
   */
  async rejectProduct(input: RejectProductInput) {
    const manager = this.activeManager_;
    const { productId, rejectionReason, rejectedBy } = input;

    if (!rejectionReason || rejectionReason.trim().length < 10) {
      throw new Error("Rejection reason must be at least 10 characters");
    }

    const query = `
      UPDATE custom_product_proposals
      SET 
        status = 'rejected',
        rejection_reason = $1,
        rejected_at = NOW(),
        rejected_by = $2,
        updated_at = NOW()
      WHERE id = $3 AND status = 'pending_approval'
      RETURNING *
    `;

    const [product] = await manager.query(query, [
      rejectionReason.trim(),
      rejectedBy,
      productId,
    ]);

    if (!product) {
      throw new Error("Product not found or already processed");
    }

    return {
      product,
      message: "Producto rechazado correctamente",
    };
  }

  /**
   * Get vendor products
   */
  async getVendorProducts(
    sellerId: string,
    filters: {
      status?: string;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const manager = this.activeManager_;
    const { status, limit = 50, offset = 0 } = filters;

    const query = `
      SELECT 
        p.*,
        s.name as seller_name,
        s.global_markup_percentage,
        COALESCE(p.markup_percentage, s.global_markup_percentage) as applied_markup
      FROM custom_product_proposals p
      INNER JOIN sellers s ON s.id = p.seller_id
      WHERE p.seller_id = $1
        AND ($2::VARCHAR IS NULL OR p.status = $2)
      ORDER BY p.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const products = await manager.query(query, [
      sellerId,
      status || null,
      limit,
      offset,
    ]);

    // Count total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM custom_product_proposals
      WHERE seller_id = $1
        AND ($2::VARCHAR IS NULL OR status = $2)
    `;
    
    const [{ total }] = await manager.query(countQuery, [
      sellerId,
      status || null,
    ]);

    return {
      products,
      total: parseInt(total),
    };
  }

  // Helper methods
  
  private validateProductInput(input: ProposeProductInput) {
    if (!input.title || input.title.trim().length < 3) {
      throw new Error("Title must be at least 3 characters");
    }

    if (input.basePrice < 0) {
      throw new Error("Base price must be positive");
    }

    if (input.unitsPerPack < 1) {
      throw new Error("Units per pack must be at least 1");
    }

    if (input.taxRate && ![0, 4, 10, 21].includes(input.taxRate)) {
      throw new Error("Invalid tax rate. Must be 0, 4, 10, or 21");
    }

    // Validate variants if present
    if (input.variants && input.variants.length > 0) {
      const skus = input.variants.map((v) => v.sku);
      const uniqueSkus = new Set(skus);
      if (skus.length !== uniqueSkus.size) {
        throw new Error("Variant SKUs must be unique");
      }
    }
  }

  private calculateFinalPrice(basePrice: number, markup: number): number {
    return Math.round(basePrice * (1 + markup / 100) * 100) / 100;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private async createMedusaProduct(data: any) {
    // Implementation depends on Medusa v2 API
    // This is a placeholder
    const productService = this.container.resolve("productService");
    return await productService.create({
      title: data.title,
      description: data.description,
      // ... map fields
    });
  }
}

export default ProductPricingService;
```

---

### Service: SellerMarkupService

```typescript
// src/services/seller-markup.ts

import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";

interface UpdateMarkupInput {
  sellerId: string;
  newMarkup: number;
  reason?: string;
  changedBy: string;
}

class SellerMarkupService extends TransactionBaseService {
  
  /**
   * Get all sellers with stats
   */
  async getAllSellers() {
    const manager = this.activeManager_;

    const query = `
      SELECT 
        s.id,
        s.name,
        s.email,
        s.global_markup_percentage,
        COUNT(p.id) FILTER (WHERE p.status IN ('pending_approval', 'approved', 'rejected')) as total_products,
        COUNT(p.id) FILTER (WHERE p.status = 'pending_approval') as pending_products,
        COUNT(p.id) FILTER (WHERE p.status = 'approved') as approved_products,
        COUNT(p.id) FILTER (WHERE p.status = 'rejected') as rejected_products,
        s.created_at
      FROM sellers s
      LEFT JOIN custom_product_proposals p ON p.seller_id = s.id
      GROUP BY s.id, s.name, s.email, s.global_markup_percentage, s.created_at
      ORDER BY s.name ASC
    `;

    return await manager.query(query);
  }

  /**
   * Get seller markup
   */
  async getSellerMarkup(sellerId: string) {
    const manager = this.activeManager_;

    const query = `
      SELECT 
        id as seller_id,
        global_markup_percentage,
        updated_at
      FROM sellers
      WHERE id = $1
    `;

    const [markup] = await manager.query(query, [sellerId]);

    if (!markup) {
      throw new Error("Seller not found");
    }

    return markup;
  }

  /**
   * Update seller global markup
   */
  async updateSellerMarkup(input: UpdateMarkupInput) {
    const manager = this.activeManager_;
    const { sellerId, newMarkup, reason, changedBy } = input;

    // Validate
    if (newMarkup < 0 || newMarkup > 500) {
      throw new Error("Markup must be between 0% and 500%");
    }

    return await manager.transaction(async (transactionManager) => {
      // Get current markup
      const [seller] = await transactionManager.query(
        `SELECT global_markup_percentage FROM sellers WHERE id = $1`,
        [sellerId]
      );

      if (!seller) {
        throw new Error("Seller not found");
      }

      const previousMarkup = seller.global_markup_percentage;

      // Count affected products (those using global markup)
      const [{ affected_count }] = await transactionManager.query(
        `
        SELECT COUNT(*) as affected_count
        FROM custom_product_proposals
        WHERE seller_id = $1
          AND status = 'approved'
          AND markup_percentage IS NULL
        `,
        [sellerId]
      );

      // Update seller markup
      await transactionManager.query(
        `
        UPDATE sellers
        SET global_markup_percentage = $1, updated_at = NOW()
        WHERE id = $2
        `,
        [newMarkup, sellerId]
      );

      // Insert history
      const historyId = `hist_${this.generateId()}`;
      await transactionManager.query(
        `
        INSERT INTO seller_markup_history (
          id, seller_id, previous_markup, new_markup, reason,
          changed_by, changed_at, affected_products_count
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
        `,
        [
          historyId,
          sellerId,
          previousMarkup,
          newMarkup,
          reason || null,
          changedBy,
          parseInt(affected_count),
        ]
      );

      return {
        seller_markup: {
          seller_id: sellerId,
          global_markup_percentage: newMarkup,
          updated_at: new Date().toISOString(),
          updated_by: changedBy,
        },
        affected_products: parseInt(affected_count),
        message: `Markup actualizado. ${affected_count} productos afectados`,
      };
    });
  }

  /**
   * Get markup change history
   */
  async getMarkupHistory(
    sellerId: string,
    filters: { limit?: number; offset?: number } = {}
  ) {
    const manager = this.activeManager_;
    const { limit = 20, offset = 0 } = filters;

    // Get history
    const historyQuery = `
      SELECT 
        h.id,
        h.seller_id,
        h.previous_markup,
        h.new_markup,
        h.reason,
        u.email as changed_by,
        h.changed_at,
        h.affected_products_count
      FROM seller_markup_history h
      LEFT JOIN users u ON u.id = h.changed_by
      WHERE h.seller_id = $1
      ORDER BY h.changed_at DESC
      LIMIT $2 OFFSET $3
    `;

    const history = await manager.query(historyQuery, [
      sellerId,
      limit,
      offset,
    ]);

    // Get total
    const [{ total }] = await manager.query(
      `SELECT COUNT(*) as total FROM seller_markup_history WHERE seller_id = $1`,
      [sellerId]
    );

    // Get seller info
    const [seller] = await manager.query(
      `SELECT id, name, email FROM sellers WHERE id = $1`,
      [sellerId]
    );

    return {
      history,
      total: parseInt(total),
      seller,
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

export default SellerMarkupService;
```

---

## 🌐 API Routes (Medusa v2 Style)

### Route: GET /admin/custom/products/pending

```typescript
// src/api/admin/custom/products/pending/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const pricingService = req.scope.resolve("productPricingService");

  try {
    const { seller_id, category_id, limit, offset } = req.query;

    const result = await pricingService.getPendingProducts({
      sellerId: seller_id as string,
      categoryId: category_id as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      error: error.stack,
    });
  }
};

// Middleware para autenticación admin
export const AUTHENTICATE = true;
```

---

### Route: PATCH /admin/custom/products/[id]/pricing-approval

```typescript
// src/api/admin/custom/products/[id]/pricing-approval/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const pricingService = req.scope.resolve("productPricingService");
  const { id } = req.params;
  const { status, markup_percentage, rejection_reason } = req.body;

  try {
    // Get authenticated user
    const userId = req.user?.id || req.user?.email;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let result;

    if (status === "approved") {
      if (!markup_percentage && markup_percentage !== 0) {
        return res.status(400).json({
          message: "markup_percentage is required for approval",
        });
      }

      result = await pricingService.approveProduct({
        productId: id,
        markupPercentage: parseFloat(markup_percentage),
        approvedBy: userId,
      });
    } else if (status === "rejected") {
      if (!rejection_reason) {
        return res.status(400).json({
          message: "rejection_reason is required for rejection",
        });
      }

      result = await pricingService.rejectProduct({
        productId: id,
        rejectionReason: rejection_reason,
        rejectedBy: userId,
      });
    } else {
      return res.status(400).json({
        message: "Invalid status. Must be 'approved' or 'rejected'",
      });
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
      error: error.stack,
    });
  }
};

export const AUTHENTICATE = true;
```

---

### Route: GET /admin/custom/sellers

```typescript
// src/api/admin/custom/sellers/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const markupService = req.scope.resolve("sellerMarkupService");

  try {
    const sellers = await markupService.getAllSellers();

    res.json({ sellers });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      error: error.stack,
    });
  }
};

export const AUTHENTICATE = true;
```

---

### Route: GET/PATCH /admin/custom/sellers/[id]/markup

```typescript
// src/api/admin/custom/sellers/[id]/markup/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const markupService = req.scope.resolve("sellerMarkupService");
  const { id } = req.params;

  try {
    const markup = await markupService.getSellerMarkup(id);
    res.json(markup);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  const markupService = req.scope.resolve("sellerMarkupService");
  const { id } = req.params;
  const { global_markup_percentage, reason } = req.body;

  try {
    const userId = req.user?.id || req.user?.email;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (global_markup_percentage === undefined) {
      return res.status(400).json({
        message: "global_markup_percentage is required",
      });
    }

    const result = await markupService.updateSellerMarkup({
      sellerId: id,
      newMarkup: parseFloat(global_markup_percentage),
      reason,
      changedBy: userId,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const AUTHENTICATE = true;
```

---

### Route: GET /admin/custom/sellers/[id]/markup/history

```typescript
// src/api/admin/custom/sellers/[id]/markup/history/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const markupService = req.scope.resolve("sellerMarkupService");
  const { id } = req.params;
  const { limit, offset } = req.query;

  try {
    const result = await markupService.getMarkupHistory(id, {
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const AUTHENTICATE = true;
```

---

### Route: GET/POST /vendor/custom/products

```typescript
// src/api/vendor/custom/products/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const pricingService = req.scope.resolve("productPricingService");

  try {
    // Get seller_id from authenticated vendor
    const sellerId = req.user?.seller_id;

    if (!sellerId) {
      return res.status(401).json({
        message: "Seller ID not found in user session",
      });
    }

    const { status, limit, offset } = req.query;

    const result = await pricingService.getVendorProducts(sellerId, {
      status: status as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pricingService = req.scope.resolve("productPricingService");

  try {
    const sellerId = req.user?.seller_id;

    if (!sellerId) {
      return res.status(401).json({
        message: "Seller ID not found in user session",
      });
    }

    const product = await pricingService.proposeProduct({
      sellerId,
      ...req.body,
    });

    res.status(201).json({
      product,
      message: "Producto propuesto correctamente. Pendiente de aprobación",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const AUTHENTICATE = true;
```

---

### Route: GET /vendor/custom/sellers/me/markup

```typescript
// src/api/vendor/custom/sellers/me/markup/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const markupService = req.scope.resolve("sellerMarkupService");

  try {
    const sellerId = req.user?.seller_id;

    if (!sellerId) {
      return res.status(401).json({
        message: "Seller ID not found in user session",
      });
    }

    const markup = await markupService.getSellerMarkup(sellerId);
    res.json(markup);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const AUTHENTICATE = true;
```

---

## 🧪 Testing Examples

### Test Script: Create Proposal

```typescript
// test/product-pricing.test.ts

import { describe, it, expect, beforeAll } from "@jest/globals";
import { ProductPricingService } from "../src/services/product-pricing";

describe("ProductPricingService", () => {
  let service: ProductPricingService;

  beforeAll(() => {
    // Setup service with test container
    service = new ProductPricingService(/* container */);
  });

  it("should create product proposal", async () => {
    const input = {
      sellerId: "seller_01",
      title: "Agua Mineral 1.5L - Pack 6 uds",
      description: "Pack de 6 botellas",
      basePrice: 3.50,
      unitsPerPack: 6,
      categoryId: "cat_bebidas",
      taxRate: 10,
    };

    const product = await service.proposeProduct(input);

    expect(product.id).toMatch(/^proposal_/);
    expect(product.status).toBe("pending_approval");
    expect(product.base_price).toBe(3.50);
  });

  it("should reject invalid markup", async () => {
    await expect(
      service.approveProduct({
        productId: "proposal_01",
        markupPercentage: 600, // > 500
        approvedBy: "admin",
      })
    ).rejects.toThrow("Markup must be between 0% and 500%");
  });

  it("should calculate final price correctly", async () => {
    const basePrice = 10.00;
    const markup = 15.00;
    const finalPrice = service["calculateFinalPrice"](basePrice, markup);
    
    expect(finalPrice).toBe(11.50);
  });
});
```

---

### Postman Collection Example

```json
{
  "info": {
    "name": "Marketplace B2B - Pricing Module",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Admin - Get Pending Products",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{admin_token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/admin/custom/products/pending?limit=20",
          "host": ["{{base_url}}"],
          "path": ["admin", "custom", "products", "pending"],
          "query": [
            { "key": "limit", "value": "20" },
            { "key": "seller_id", "value": "seller_01", "disabled": true }
          ]
        }
      }
    },
    {
      "name": "Admin - Approve Product",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{admin_token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"status\": \"approved\",\n  \"markup_percentage\": 18.50\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/admin/custom/products/proposal_01/pricing-approval",
          "host": ["{{base_url}}"],
          "path": ["admin", "custom", "products", "proposal_01", "pricing-approval"]
        }
      }
    },
    {
      "name": "Vendor - Propose Product",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{vendor_token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Aceite Oliva 1L\",\n  \"description\": \"Aceite virgen extra\",\n  \"base_price\": 8.50,\n  \"units_per_pack\": 1,\n  \"category_id\": \"cat_alimentacion\",\n  \"tax_rate\": 10\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/vendor/custom/products",
          "host": ["{{base_url}}"],
          "path": ["vendor", "custom", "products"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://marketplace-b2b-backend-dev.onrender.com"
    },
    {
      "key": "admin_token",
      "value": ""
    },
    {
      "key": "vendor_token",
      "value": ""
    }
  ]
}
```

---

## 📝 Notas de Implementación

### Autenticación

```typescript
// Middleware para extraer seller_id del JWT
export const extractSellerFromJWT = (req: MedusaRequest, res: MedusaResponse, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For vendor users, add seller_id to request
    if (decoded.domain === "vendor" && decoded.actor_id) {
      // Query to get seller_id from member
      const sellerId = await getSel lerIdFromMember(decoded.actor_id);
      req.user = { ...decoded, seller_id: sellerId };
    } else {
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

---

### Rate Limiting

```typescript
// Rate limiter para POST /vendor/custom/products
import rateLimit from "express-rate-limit";

export const productProposalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 requests per minute
  message: "Demasiadas propuestas. Máximo 10 por minuto.",
  keyGenerator: (req) => req.user?.seller_id || req.ip,
});

// Usage in route:
export const POST = [
  productProposalLimiter,
  async (req: MedusaRequest, res: MedusaResponse) => {
    // ... handler
  }
];
```

---

## 🔍 Debugging Tips

### Enable SQL Logging

```typescript
// medusa-config.js
module.exports = {
  projectConfig: {
    database_logging: true, // Log all SQL queries
    // ...
  },
};
```

### Log Request/Response

```typescript
// Middleware para debug
export const logRequest = (req: MedusaRequest, res: MedusaResponse, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("Body:", JSON.stringify(req.body, null, 2));
  console.log("User:", req.user);
  next();
};
```

---

**Documento generado:** 21 Agosto 2026  
**Versión:** 1.0  
**Próxima actualización:** Post-implementación Sprint 1
