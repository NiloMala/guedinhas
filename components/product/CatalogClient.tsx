"use client";

import { useMemo, useState } from "react";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useStore } from "@/services/store";

export function CatalogClient({ initialCategory = "" }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("recentes");
  const { products } = useStore();

  const filtered = useMemo(() => {
    const [minPrice, maxPrice] = price ? price.split("-").map(Number) : [0, Infinity];
    return products
      .filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
      .filter((product) => !category || product.category === category)
      .filter((product) => !size || product.variations.some((variation) => variation.size === size && variation.stock > 0))
      .filter((product) => !color || product.variations.some((variation) => variation.color === color && variation.stock > 0))
      .filter((product) => product.salePrice >= minPrice && product.salePrice <= maxPrice)
      .sort((a, b) => {
        if (sort === "menor") return a.salePrice - b.salePrice;
        if (sort === "maior") return b.salePrice - a.salePrice;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [query, category, size, color, price, products, sort]);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <ProductFilters
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        size={size}
        setSize={setSize}
        color={color}
        setColor={setColor}
        price={price}
        setPrice={setPrice}
        sort={sort}
        setSort={setSort}
      />
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-ink/55">{filtered.length} produtos encontrados</p>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
