"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/Input";

type Props = {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  size: string;
  setSize: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
};

export function ProductFilters(props: Props) {
  const selectClass = "focus-ring h-11 rounded-md border border-ink/12 bg-white px-3 text-sm";

  return (
    <aside className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-gold" />
        <h2 className="font-semibold">Filtros</h2>
      </div>
      <div className="grid gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-ink/35" size={18} />
          <Input aria-label="Buscar produtos" value={props.query} onChange={(event) => props.setQuery(event.target.value)} placeholder="Buscar produto" className="pl-10" />
        </div>
        <select className={selectClass} value={props.category} onChange={(event) => props.setCategory(event.target.value)}>
          <option value="">Todas as categorias</option>
          <option>Vestidos</option>
          <option>Blusas</option>
          <option>Calcas</option>
          <option>Acessorios</option>
          <option>Masculino</option>
        </select>
        <select className={selectClass} value={props.size} onChange={(event) => props.setSize(event.target.value)}>
          <option value="">Todos os tamanhos</option>
          <option>P</option>
          <option>M</option>
          <option>G</option>
          <option>38</option>
          <option>40</option>
          <option>Unico</option>
        </select>
        <select className={selectClass} value={props.color} onChange={(event) => props.setColor(event.target.value)}>
          <option value="">Todas as cores</option>
          <option>Preto</option>
          <option>Rosa</option>
          <option>Dourado</option>
          <option>Off White</option>
          <option>Bege</option>
        </select>
        <select className={selectClass} value={props.price} onChange={(event) => props.setPrice(event.target.value)}>
          <option value="">Qualquer preco</option>
          <option value="0-130">Ate R$ 130</option>
          <option value="130-170">R$ 130 a R$ 170</option>
          <option value="170-999">Acima de R$ 170</option>
        </select>
        <select className={selectClass} value={props.sort} onChange={(event) => props.setSort(event.target.value)}>
          <option value="recentes">Mais recentes</option>
          <option value="menor">Menor preco</option>
          <option value="maior">Maior preco</option>
        </select>
      </div>
    </aside>
  );
}
