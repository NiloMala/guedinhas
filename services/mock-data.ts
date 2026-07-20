import { Coupon, Order, Product, StockMovement } from "@/types";

export const heroSlides = [
  {
    title: "Guedinhas",
    subtitle: "Moda e acessorios para uma rotina elegante, leve e cheia de presenca.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Nova Colecao",
    subtitle: "Tons neutros, brilho pontual e pecas versateis para sair do comum.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Acessorios Que Fecham o Look",
    subtitle: "Bolsas, bijus e detalhes dourados para finalizar com intencao.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80"
  }
];

export const products: Product[] = [
  {
    id: "p1",
    slug: "vestido-midi-aurora",
    name: "Vestido Midi Aurora",
    description: "Vestido midi acetinado com caimento fluido, fenda lateral e acabamento delicado.",
    category: "Vestidos",
    supplier: "Atelie Rosa",
    salePrice: 189.9,
    costPrice: 92,
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80"
    ],
    tags: ["mais vendido", "festa"],
    createdAt: "2026-07-10",
    featured: true,
    variations: [
      { id: "v1", sku: "GUE-VES-AUR-P-PRE", size: "P", color: "Preto", stock: 7, minStock: 3 },
      { id: "v2", sku: "GUE-VES-AUR-M-ROS", size: "M", color: "Rosa", stock: 2, minStock: 3 },
      { id: "v3", sku: "GUE-VES-AUR-G-DOU", size: "G", color: "Dourado", stock: 0, minStock: 2 }
    ]
  },
  {
    id: "p2",
    slug: "camisa-linho-noir",
    name: "Camisa Linho Noir",
    description: "Camisa de linho misto, modelagem reta e toque fresco para producoes urbanas.",
    category: "Masculino",
    supplier: "Norte Conf",
    salePrice: 149.9,
    costPrice: 70,
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"],
    tags: ["novo"],
    createdAt: "2026-07-15",
    featured: true,
    variations: [
      { id: "v4", sku: "GUE-CAM-NOI-M-PRE", size: "M", color: "Preto", stock: 11, minStock: 4 },
      { id: "v5", sku: "GUE-CAM-NOI-G-OFF", size: "G", color: "Off White", stock: 4, minStock: 4 }
    ]
  },
  {
    id: "p3",
    slug: "bolsa-mini-lumi",
    name: "Bolsa Mini Lumi",
    description: "Bolsa compacta com corrente dourada, estrutura firme e espaco para essenciais.",
    category: "Acessorios",
    supplier: "Lumi Bags",
    salePrice: 119.9,
    costPrice: 58,
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80"],
    tags: ["promocao"],
    createdAt: "2026-07-08",
    promo: true,
    variations: [
      { id: "v6", sku: "GUE-BOL-LUM-U-PRE", size: "Unico", color: "Preto", stock: 6, minStock: 2 },
      { id: "v7", sku: "GUE-BOL-LUM-U-ROS", size: "Unico", color: "Rosa", stock: 1, minStock: 2 }
    ]
  },
  {
    id: "p4",
    slug: "calca-tailoring-essencial",
    name: "Calca Tailoring Essencial",
    description: "Calca de alfaiataria com cintura alta, bolsos faca e barra reta.",
    category: "Calcas",
    supplier: "Linea Basic",
    salePrice: 169.9,
    costPrice: 81,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80"],
    tags: ["mais vendido"],
    createdAt: "2026-07-03",
    featured: true,
    variations: [
      { id: "v8", sku: "GUE-CAL-ESS-38-PRE", size: "38", color: "Preto", stock: 8, minStock: 3 },
      { id: "v9", sku: "GUE-CAL-ESS-40-BEG", size: "40", color: "Bege", stock: 3, minStock: 3 }
    ]
  }
];

export const orders: Order[] = [
  { id: "#1048", customer: "Mariana Alves", subtotal: 189.9, discount: 0, shipping: 19.9, total: 209.8, status: "pago", createdAt: "2026-07-20", items: [{ productId: "p1", variationId: "v1", product: "Vestido Midi Aurora", variation: "P / Preto", quantity: 1, sku: "GUE-VES-AUR-P-PRE", unitPrice: 189.9 }] },
  { id: "#1047", customer: "Rafaela Lima", subtotal: 119.9, discount: 0, shipping: 19.9, total: 139.8, status: "enviado", trackingCode: "BR123456789", createdAt: "2026-07-19", items: [{ productId: "p3", variationId: "v7", product: "Bolsa Mini Lumi", variation: "Unico / Rosa", quantity: 1, sku: "GUE-BOL-LUM-U-ROS", unitPrice: 119.9 }] },
  { id: "#1046", customer: "Igor Santos", subtotal: 149.9, discount: 0, shipping: 19.9, total: 169.8, status: "pendente", createdAt: "2026-07-18", items: [{ productId: "p2", variationId: "v5", product: "Camisa Linho Noir", variation: "G / Off White", quantity: 1, sku: "GUE-CAM-NOI-G-OFF", unitPrice: 149.9 }] }
];

export const stockMovements: StockMovement[] = [
  { id: "m1", product: "Vestido Midi Aurora", sku: "GUE-VES-AUR-P-PRE", type: "entrada", quantity: 10, reason: "Compra fornecedor", responsible: "Admin", date: "2026-07-15 09:20" },
  { id: "m2", product: "Bolsa Mini Lumi", sku: "GUE-BOL-LUM-U-ROS", type: "venda", quantity: -1, reason: "Pedido #1047", responsible: "Sistema", date: "2026-07-19 14:10" },
  { id: "m3", product: "Vestido Midi Aurora", sku: "GUE-VES-AUR-M-ROS", type: "saida", quantity: -1, reason: "Ajuste por troca", responsible: "Admin", date: "2026-07-20 10:45" }
];

export const coupons: Coupon[] = [
  { code: "GUEDINHAS8", type: "percent", value: 8, validUntil: "2026-12-31", active: true },
  { code: "ROSA20", type: "fixed", value: 20, validUntil: "2026-12-31", active: true }
];

// Trocar estes mocks por chamadas aos endpoints reais:
// GET /api/products, GET /api/products/:slug, POST /api/orders,
// GET/POST /api/stock-movements, PATCH /api/orders/:id/status.
