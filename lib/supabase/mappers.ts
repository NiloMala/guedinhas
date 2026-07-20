import { Coupon, Order, Product, StockMovement } from "@/types";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  supplier: string;
  sale_price: number;
  cost_price: number;
  images: string[];
  tags: string[];
  featured: boolean;
  promo: boolean;
  created_at: string;
  product_variations: Array<{
    id: string;
    sku: string;
    size: string;
    color: string;
    stock: number;
    min_stock: number;
  }>;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category as Product["category"],
    supplier: row.supplier,
    salePrice: Number(row.sale_price),
    costPrice: Number(row.cost_price),
    images: row.images,
    tags: row.tags,
    createdAt: row.created_at.slice(0, 10),
    featured: row.featured,
    promo: row.promo,
    variations: (row.product_variations || []).map((variation) => ({
      id: variation.id,
      sku: variation.sku,
      size: variation.size,
      color: variation.color,
      stock: variation.stock,
      minStock: variation.min_stock
    }))
  };
}

type OrderRow = {
  id: string;
  order_number: number;
  customer: string;
  email: string | null;
  whatsapp: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: Order["status"];
  tracking_code: string | null;
  created_at: string;
  order_items: Array<{
    product_id: string | null;
    variation_id: string | null;
    product_name: string;
    variation_name: string;
    sku: string;
    quantity: number;
    unit_price: number;
  }>;
};

export function displayOrderId(orderNumber: number) {
  return `#${1100 + orderNumber}`;
}

export function mapOrder(row: OrderRow): Order {
  return {
    id: displayOrderId(row.order_number),
    dbId: row.id,
    customer: row.customer,
    email: row.email || undefined,
    whatsapp: row.whatsapp || undefined,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: row.status,
    trackingCode: row.tracking_code || undefined,
    createdAt: row.created_at.slice(0, 10),
    items: (row.order_items || []).map((item) => ({
      productId: item.product_id || undefined,
      variationId: item.variation_id || undefined,
      product: item.product_name,
      variation: item.variation_name,
      quantity: item.quantity,
      sku: item.sku,
      unitPrice: Number(item.unit_price)
    }))
  };
}

type StockMovementRow = {
  id: string;
  product_name: string;
  sku: string;
  type: StockMovement["type"];
  quantity: number;
  reason: string;
  responsible: string;
  created_at: string;
};

export function mapStockMovement(row: StockMovementRow): StockMovement {
  return {
    id: row.id,
    product: row.product_name,
    sku: row.sku,
    type: row.type,
    quantity: row.quantity,
    reason: row.reason,
    responsible: row.responsible,
    date: new Date(row.created_at).toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  };
}

type CouponRow = {
  code: string;
  type: Coupon["type"];
  value: number;
  valid_until: string;
  active: boolean;
};

export function mapCoupon(row: CouponRow): Coupon {
  return {
    code: row.code,
    type: row.type,
    value: Number(row.value),
    validUntil: row.valid_until,
    active: row.active
  };
}
