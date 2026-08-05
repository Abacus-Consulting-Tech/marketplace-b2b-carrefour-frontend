export interface User {
  id: string;
  name: string;
  email: string;
  franchiseId: string;
  franchiseName: string;
  role: "franchisee" | "admin" | "supplier";
  annualFeeStatus: "pending" | "paid" | "overdue";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  supplierId: string;
  supplierName: string;
  imageUrl?: string;
  stock: number;
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  franchiseeId: string;
  franchiseeName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  invoiceId?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Invoice {
  id: string;
  orderId: string;
  franchiseeId: string;
  franchiseeName: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  status: "issued" | "paid" | "overdue" | "cancelled";
  issuedAt: string;
  dueAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Incident {
  id: string;
  orderId: string;
  franchiseeId: string;
  type: "damage" | "missing_item" | "wrong_item" | "delay" | "other";
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  resolution?: string;
}

export interface Return {
  id: string;
  orderId: string;
  franchiseeId: string;
  items: ReturnItem[];
  reason: string;
  status: "requested" | "approved" | "rejected" | "completed";
  createdAt: string;
  refundAmount?: number;
}

export interface ReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  categories: string[];
  status: "active" | "inactive" | "pending";
  totalProducts: number;
}

export interface AnnualFee {
  id: string;
  franchiseeId: string;
  franchiseeName: string;
  year: number;
  amount: number;
  status: "pending" | "paid" | "overdue";
  paidAt?: string;
  dueAt: string;
}
