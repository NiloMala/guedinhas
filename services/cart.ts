"use client";

import { Product, ProductVariation } from "@/types";

const CART_KEY = "guedinhas-cart";

export type CartItem = {
  productId: string;
  variationId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  sku: string;
  stock: number;
  quantity: number;
};

export function createCartItem(product: Product, variation: ProductVariation, quantity: number): CartItem {
  return {
    productId: product.id,
    variationId: variation.id,
    name: product.name,
    image: product.images[0],
    price: product.salePrice,
    size: variation.size,
    color: variation.color,
    sku: variation.sku,
    stock: variation.stock,
    quantity
  };
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:updated"));
}
