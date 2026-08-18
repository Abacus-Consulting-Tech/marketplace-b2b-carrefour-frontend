import type { CartItem, CartSummary, Product } from '@/types'
import type { MercurCart } from '@/lib/api/mercur-store-client'

interface MercurStoreProductVariant {
  id?: string
  offer_id?: string | null
  sku?: string | null
  inventory_quantity?: number | null
  calculated_price?: {
    calculated_amount?: number | null
    currency_code?: string | null
  } | null
  prices?: Array<{
    amount?: number | null
    currency_code?: string | null
  }>
}

interface MercurStoreProductCategory {
  id?: string
  name?: string | null
}

interface MercurStoreProductImage {
  url?: string | null
}

export interface MercurStoreProduct {
  id: string
  title?: string | null
  handle?: string | null
  description?: string | null
  thumbnail?: string | null
  images?: MercurStoreProductImage[]
  variants?: MercurStoreProductVariant[]
  categories?: MercurStoreProductCategory[]
  collection?: MercurStoreProductCategory | null
  metadata?: Record<string, unknown> | null
  created_at?: string
  updated_at?: string
}

const getStringMetadata = (
  metadata: Record<string, unknown> | null | undefined,
  key: string
) => {
  const value = metadata?.[key]
  return typeof value === 'string' ? value : undefined
}

const getNumberMetadata = (
  metadata: Record<string, unknown> | null | undefined,
  key: string
) => {
  const value = metadata?.[key]
  return typeof value === 'number' ? value : undefined
}

const getProductPrice = (variant: MercurStoreProductVariant | undefined) => {
  return (
    variant?.calculated_price?.calculated_amount ??
    variant?.prices?.find(price => typeof price.amount === 'number')?.amount ??
    0
  )
}

const getProductCurrency = (variant: MercurStoreProductVariant | undefined) => {
  return (
    variant?.calculated_price?.currency_code ??
    variant?.prices?.find(price => price.currency_code)?.currency_code ??
    'eur'
  ).toUpperCase()
}

export const mapMercurProductToProduct = (product: MercurStoreProduct): Product => {
  const primaryVariant = product.variants?.[0]
  const category = product.categories?.[0] ?? product.collection ?? undefined
  const supplierId = getStringMetadata(product.metadata, 'supplier_id') ?? 'mercur'
  const supplierName = getStringMetadata(product.metadata, 'supplier_name') ?? 'Mercur'
  const categoryName = getStringMetadata(product.metadata, 'category_name')
  const images = [
    product.thumbnail,
    ...(product.images?.map(image => image.url).filter(Boolean) ?? []),
  ].filter((image): image is string => Boolean(image))

  return {
    id: product.id,
    name: product.title ?? product.handle ?? 'Producto sin nombre',
    description: product.description ?? '',
    sku: primaryVariant?.sku ?? product.id,
    categoryId: category?.id ?? 'uncategorized',
    supplierId,
    price: getProductPrice(primaryVariant),
    currency: getProductCurrency(primaryVariant),
    stock: getNumberMetadata(product.metadata, 'stock') ?? primaryVariant?.inventory_quantity ?? 0,
    images,
    rating: 0,
    reviewCount: 0,
    specifications: product.metadata ?? {},
    category: categoryName ?? category?.name ?? 'Sin categoría',
    supplier: {
      id: supplierId,
      name: supplierName,
    },
    offerId: primaryVariant?.offer_id ?? undefined,
    variantId: primaryVariant?.id,
    createdAt: product.created_at ?? new Date(0).toISOString(),
    updatedAt: product.updated_at ?? product.created_at ?? new Date(0).toISOString(),
  }
}

export interface MappedMercurCart {
  cartId: string
  items: CartItem[]
  summary: CartSummary
}

export const mapMercurCartToCartState = (cart: MercurCart): MappedMercurCart => {
  return {
    cartId: cart.id,
    items: cart.items.map(item => ({
      productId: item.product_id ?? item.variant_id ?? item.id,
      name: item.product_title ?? item.title,
      quantity: item.quantity,
      price: item.unit_price,
      image: item.thumbnail ?? undefined,
      backendLineItemId: item.id,
      offerId: item.metadata?.offer_id,
      variantId: item.variant_id ?? undefined,
    })),
    summary: {
      subtotal: cart.item_subtotal ?? cart.subtotal - cart.shipping_total,
      tax: cart.tax_total,
      shipping: cart.shipping_total,
      discount: cart.discount_total,
      total: cart.total,
      currency: cart.currency_code.toUpperCase(),
    },
  }
}