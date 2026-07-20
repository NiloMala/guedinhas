"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { mapCoupon, mapProduct } from "@/lib/supabase/mappers";
import { Coupon, Order, OrderStatus, Product, ProductVariation, StockMovement } from "@/types";

type ProductInput = Omit<Product, "id" | "slug" | "createdAt"> & {
  id?: string;
  slug?: string;
  createdAt?: string;
};

type StoreState = {
  products: Product[];
  orders: Order[];
  stockMovements: StockMovement[];
  coupons: Coupon[];
  categories: string[];
  suppliers: string[];
};

type CheckoutInput = {
  customer: string;
  email?: string;
  whatsapp?: string;
  items: Array<{
    productId: string;
    variationId: string;
    product: string;
    variation: string;
    quantity: number;
    sku: string;
    unitPrice: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

type Result = { ok: true } | { ok: false; message: string };

type StoreContextValue = StoreState & {
  hydrated: boolean;
  findProduct: (slug: string) => Product | undefined;
  findVariation: (variationId: string) => { product: Product; variation: ProductVariation } | undefined;
  getCoupon: (code: string) => Coupon | undefined;
  upsertProduct: (product: ProductInput) => Promise<Result>;
  deleteProduct: (productId: string) => Promise<Result>;
  addStockMovement: (input: {
    sku: string;
    type: "entrada" | "saida";
    quantity: number;
    reason: string;
    responsible: string;
  }) => Promise<Result>;
  createOrderFromCheckout: (input: CheckoutInput) => Promise<{ ok: true; order: Order } | { ok: false; message: string }>;
  updateOrderStatus: (orderDbId: string, status: OrderStatus, trackingCode?: string) => Promise<Result>;
  upsertCategory: (name: string) => Promise<void>;
  deleteCategory: (name: string) => Promise<void>;
  upsertSupplier: (name: string) => Promise<void>;
  deleteSupplier: (name: string) => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | null>(null);

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return { ok: false, message: "Resposta invalida do servidor." };
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>({
    products: [],
    orders: [],
    stockMovements: [],
    coupons: [],
    categories: [],
    suppliers: []
  });
  const [hydrated, setHydrated] = useState(false);

  const refreshCatalog = useCallback(async () => {
    const [productsRes, categoriesRes, suppliersRes, couponsRes] = await Promise.all([
      supabaseBrowser.from("products").select("*, product_variations(*)").order("created_at", { ascending: false }),
      supabaseBrowser.from("categories").select("name"),
      supabaseBrowser.from("suppliers").select("name"),
      supabaseBrowser.from("coupons").select("*")
    ]);
    setState((current) => ({
      ...current,
      products: (productsRes.data || []).map(mapProduct),
      categories: (categoriesRes.data || []).map((row) => row.name as string),
      suppliers: (suppliersRes.data || []).map((row) => row.name as string),
      coupons: (couponsRes.data || []).map(mapCoupon)
    }));
  }, []);

  const refreshOrders = useCallback(async () => {
    const response = await fetch("/api/orders");
    const json = await readJson(response);
    if (json.ok) setState((current) => ({ ...current, orders: json.orders }));
  }, []);

  const refreshStockMovements = useCallback(async () => {
    const response = await fetch("/api/stock-movements");
    const json = await readJson(response);
    if (json.ok) setState((current) => ({ ...current, stockMovements: json.stockMovements }));
  }, []);

  useEffect(() => {
    (async () => {
      await Promise.all([refreshCatalog(), refreshOrders(), refreshStockMovements()]);
      setHydrated(true);
    })();
  }, [refreshCatalog, refreshOrders, refreshStockMovements]);

  function findProduct(slug: string) {
    return state.products.find((product) => product.slug === slug);
  }

  function findVariation(variationId: string) {
    for (const product of state.products) {
      const variation = product.variations.find((item) => item.id === variationId);
      if (variation) return { product, variation };
    }
    return undefined;
  }

  function getCoupon(code: string) {
    const coupon = state.coupons.find((item) => item.code.toLowerCase() === code.trim().toLowerCase());
    if (!coupon || !coupon.active || new Date(coupon.validUntil) < new Date()) return undefined;
    return coupon;
  }

  const upsertProduct = useCallback(
    async (input: ProductInput): Promise<Result> => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      const json = await readJson(response);
      if (!json.ok) return { ok: false, message: json.message };
      await refreshCatalog();
      return { ok: true };
    },
    [refreshCatalog]
  );

  const deleteProduct = useCallback(
    async (productId: string): Promise<Result> => {
      const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const json = await readJson(response);
      if (!json.ok) return { ok: false, message: json.message };
      await refreshCatalog();
      return { ok: true };
    },
    [refreshCatalog]
  );

  const addStockMovement = useCallback(
    async (input: { sku: string; type: "entrada" | "saida"; quantity: number; reason: string; responsible: string }): Promise<Result> => {
      const response = await fetch("/api/stock-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      const json = await readJson(response);
      if (!json.ok) return { ok: false, message: json.message };
      await Promise.all([refreshCatalog(), refreshStockMovements()]);
      return { ok: true };
    },
    [refreshCatalog, refreshStockMovements]
  );

  const createOrderFromCheckout = useCallback(
    async (input: CheckoutInput) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });
      const json = await readJson(response);
      if (!json.ok) return { ok: false as const, message: json.message };
      await Promise.all([refreshCatalog(), refreshOrders(), refreshStockMovements()]);
      return { ok: true as const, order: json.order as Order };
    },
    [refreshCatalog, refreshOrders, refreshStockMovements]
  );

  const updateOrderStatus = useCallback(
    async (orderDbId: string, status: OrderStatus, trackingCode?: string): Promise<Result> => {
      const response = await fetch(`/api/orders/${orderDbId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingCode })
      });
      const json = await readJson(response);
      if (!json.ok) return { ok: false, message: json.message };
      await Promise.all([refreshCatalog(), refreshOrders(), refreshStockMovements()]);
      return { ok: true };
    },
    [refreshCatalog, refreshOrders, refreshStockMovements]
  );

  const upsertCategory = useCallback(
    async (name: string) => {
      await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      await refreshCatalog();
    },
    [refreshCatalog]
  );

  const deleteCategory = useCallback(
    async (name: string) => {
      await fetch("/api/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      await refreshCatalog();
    },
    [refreshCatalog]
  );

  const upsertSupplier = useCallback(
    async (name: string) => {
      await fetch("/api/suppliers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      await refreshCatalog();
    },
    [refreshCatalog]
  );

  const deleteSupplier = useCallback(
    async (name: string) => {
      await fetch("/api/suppliers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      await refreshCatalog();
    },
    [refreshCatalog]
  );

  const value: StoreContextValue = {
    ...state,
    hydrated,
    findProduct,
    findVariation,
    getCoupon,
    upsertProduct,
    deleteProduct,
    addStockMovement,
    createOrderFromCheckout,
    updateOrderStatus,
    upsertCategory,
    deleteCategory,
    upsertSupplier,
    deleteSupplier
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return context;
}
