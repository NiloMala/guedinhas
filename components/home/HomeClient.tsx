"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { heroSlides } from "@/services/mock-data";
import { useStore } from "@/services/store";

export function HomeClient() {
  const { products, categories } = useStore();
  const bestSellers = products.filter((product) => product.featured);
  const promos = products.filter((product) => product.promo);

  return (
    <div>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <Image src={heroSlides[0].image} alt="Editorial Guedinhas" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-gold">
              <Sparkles size={16} /> Online Store
            </span>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight sm:text-7xl">Guedinhas</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/78 sm:text-lg">{heroSlides[0].subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/catalogo">Ver colecao <ArrowRight size={18} /></Button>
              <Button href="https://wa.me/55129988945359" variant="secondary"><MessageCircle size={18} /> Comprar pelo WhatsApp</Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((slide, index) => (
            <span key={slide.title} className={`h-1.5 rounded-full ${index === 0 ? "w-8 bg-gold" : "w-2 bg-white/70"}`} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Categorias</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Escolha por estilo</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link key={category} href={`/catalogo?categoria=${category}`} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm transition hover:border-gold hover:shadow-soft">
              <span className="font-semibold">{category}</span>
              <p className="mt-2 text-sm text-ink/55">Ver produtos</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold">Mais vendidos</h2>
          <div className="mt-6"><ProductGrid products={bestSellers} /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-ink p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Promocoes</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <h2 className="font-display text-3xl font-semibold">Pecas selecionadas com preco especial.</h2>
            <ProductGrid products={promos} />
          </div>
        </div>
      </section>
    </div>
  );
}
