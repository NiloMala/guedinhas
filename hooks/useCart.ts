"use client";

import { useEffect, useMemo, useState } from "react";
import { CartItem, readCart, writeCart } from "@/services/cart";
import { Coupon } from "@/types";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    setItems(readCart());
    const sync = () => setItems(readCart());
    window.addEventListener("cart:updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart:updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 0;
    const shipping = subtotal > 0 && subtotal < 299 ? 19.9 : 0;
    return { subtotal, discount, shipping, total: subtotal - discount + shipping };
  }, [items]);

  function calculateTotals(coupon?: Coupon) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon ? (coupon.type === "percent" ? subtotal * (coupon.value / 100) : coupon.value) : 0;
    const shipping = subtotal > 0 && subtotal < 299 ? 19.9 : 0;
    return { subtotal, discount: Math.min(discount, subtotal), shipping, total: subtotal - Math.min(discount, subtotal) + shipping };
  }

  function addItem(item: CartItem) {
    const current = readCart();
    const existing = current.find((cartItem) => cartItem.variationId === item.variationId);
    const next = existing
      ? current.map((cartItem) =>
          cartItem.variationId === item.variationId
            ? { ...cartItem, quantity: Math.min(cartItem.quantity + item.quantity, cartItem.stock) }
            : cartItem
        )
      : [...current, item];
    writeCart(next);
  }

  function updateQuantity(variationId: string, quantity: number) {
    const next = items.map((item) =>
      item.variationId === variationId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item
    );
    writeCart(next);
  }

  function removeItem(variationId: string) {
    writeCart(items.filter((item) => item.variationId !== variationId));
  }

  function clear() {
    writeCart([]);
  }

  return { items, totals, couponCode, setCouponCode, calculateTotals, addItem, updateQuantity, removeItem, clear };
}
