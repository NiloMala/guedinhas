export type Category = "Vestidos" | "Blusas" | "Calcas" | "Acessorios" | "Masculino";

export type ProductVariation = {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  minStock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  supplier: string;
  salePrice: number;
  costPrice: number;
  images: string[];
  tags: string[];
  createdAt: string;
  variations: ProductVariation[];
  featured?: boolean;
  promo?: boolean;
};

export type OrderStatus = "pendente" | "pago" | "separado" | "enviado" | "entregue" | "cancelado";

export type Order = {
  id: string;
  dbId?: string;
  customer: string;
  email?: string;
  whatsapp?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  status: OrderStatus;
  trackingCode?: string;
  createdAt: string;
  items: Array<{
    productId?: string;
    variationId?: string;
    product: string;
    variation: string;
    quantity: number;
    sku?: string;
    unitPrice?: number;
  }>;
};

export type StockMovement = {
  id: string;
  product: string;
  sku: string;
  type: "entrada" | "saida" | "venda" | "estorno";
  quantity: number;
  reason: string;
  responsible: string;
  date: string;
};

export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  validUntil: string;
  active: boolean;
};
