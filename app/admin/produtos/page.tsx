"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StockBadge } from "@/components/admin/StockBadge";
import { currency } from "@/lib/utils";
import { useStore } from "@/services/store";
import { Category, Product, ProductVariation } from "@/types";

type ProductForm = {
  id?: string;
  name: string;
  description: string;
  category: string;
  supplier: string;
  salePrice: string;
  costPrice: string;
  images: string[];
  variations: ProductVariation[];
  featured: boolean;
  promo: boolean;
};

const blankForm: ProductForm = {
  name: "",
  description: "",
  category: "Vestidos",
  supplier: "",
  salePrice: "",
  costPrice: "",
  images: [],
  variations: [{ id: "", sku: "", size: "", color: "", stock: 0, minStock: 0 }],
  featured: false,
  promo: false
};

export default function AdminProductsPage() {
  const { products, categories, suppliers, upsertProduct, deleteProduct, upsertCategory, deleteCategory, upsertSupplier, deleteSupplier } = useStore();
  const [form, setForm] = useState<ProductForm>(blankForm);
  const [newCategory, setNewCategory] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function editProduct(product: Product) {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      supplier: product.supplier,
      salePrice: String(product.salePrice),
      costPrice: String(product.costPrice),
      images: product.images,
      variations: product.variations,
      featured: Boolean(product.featured),
      promo: Boolean(product.promo)
    });
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    await upsertProduct({
      id: form.id,
      name: form.name,
      description: form.description,
      category: form.category as Category,
      supplier: form.supplier,
      salePrice: Number(form.salePrice),
      costPrice: Number(form.costPrice),
      images: form.images.length ? form.images : ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"],
      tags: [],
      featured: form.featured,
      promo: form.promo,
      variations: form.variations.filter((variation) => variation.sku && variation.size && variation.color)
    });
    setForm(blankForm);
  }

  async function removeProduct(productId: string) {
    if (window.confirm("Excluir este produto?")) await deleteProduct(productId);
  }

  function updateVariation(index: number, patch: Partial<ProductVariation>) {
    setForm((current) => ({
      ...current,
      variations: current.variations.map((variation, itemIndex) => (itemIndex === index ? { ...variation, ...patch } : variation))
    }));
  }

  function addVariation() {
    setForm((current) => ({ ...current, variations: [...current.variations, { id: "", sku: "", size: "", color: "", stock: 0, minStock: 0 }] }));
  }

  function removeVariation(index: number) {
    setForm((current) => ({ ...current, variations: current.variations.filter((_, itemIndex) => itemIndex !== index) }));
  }

  async function handleImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setUploadError("");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body });
        const json = await response.json();
        if (!json.ok) {
          setUploadError(json.message);
          continue;
        }
        uploaded.push(json.url);
      }
      setForm((current) => ({ ...current, images: [...current.images, ...uploaded] }));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <form onSubmit={saveProduct} className="grid h-fit gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{form.id ? "Editar produto" : "Novo produto"}</h2>
          <ImagePlus size={20} className="text-gold" />
        </div>
        <Input required label="Nome" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <Input required label="Descricao" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Categoria" value={form.category} options={categories} onChange={(value) => setForm((current) => ({ ...current, category: value }))} />
          <Select label="Fornecedor" value={form.supplier} options={suppliers} onChange={(value) => setForm((current) => ({ ...current, supplier: value }))} />
          <Input required label="Preco de venda" type="number" step="0.01" value={form.salePrice} onChange={(event) => setForm((current) => ({ ...current, salePrice: event.target.value }))} />
          <Input required label="Preco de custo" type="number" step="0.01" value={form.costPrice} onChange={(event) => setForm((current) => ({ ...current, costPrice: event.target.value }))} />
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Fotos
          <input type="file" multiple accept="image/*" disabled={uploading} onChange={handleImages} className="focus-ring w-full min-w-0 rounded-md border border-ink/12 bg-white p-2 text-sm" />
        </label>
        {uploading && <p className="text-xs text-ink/45">Enviando imagens...</p>}
        {uploadError && <p className="text-xs text-rose">{uploadError}</p>}
        {form.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {form.images.map((image) => (
              <div key={image} className="relative aspect-square overflow-hidden rounded-md bg-champagne">
                <Image src={image} alt="Preview" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
        <div className="rounded-md bg-champagne p-3">
          <h3 className="text-sm font-semibold">Variacoes</h3>
          <div className="mt-3 grid gap-3">
            {form.variations.map((variation, index) => (
              <div key={`${variation.id}-${index}`} className="grid gap-2 rounded-md bg-white p-3 sm:grid-cols-2">
                <Input label="Tamanho" value={variation.size} onChange={(event) => updateVariation(index, { size: event.target.value })} />
                <Input label="Cor" value={variation.color} onChange={(event) => updateVariation(index, { color: event.target.value })} />
                <Input label="SKU" value={variation.sku} onChange={(event) => updateVariation(index, { sku: event.target.value })} />
                <Input label="Estoque" type="number" value={variation.stock} onChange={(event) => updateVariation(index, { stock: Number(event.target.value) })} />
                <Input label="Estoque minimo" type="number" value={variation.minStock} onChange={(event) => updateVariation(index, { minStock: Number(event.target.value) })} />
                <Button type="button" variant="ghost" onClick={() => removeVariation(index)}>Remover</Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="secondary" className="mt-3" onClick={addVariation}><Plus size={16} /> Adicionar variacao</Button>
        </div>
        <div className="flex gap-4 text-sm">
          <label><input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} className="mr-2 accent-ink" />Mais vendido</label>
          <label><input type="checkbox" checked={form.promo} onChange={(event) => setForm((current) => ({ ...current, promo: event.target.checked }))} className="mr-2 accent-ink" />Promocao</label>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="submit">Salvar produto</Button>
          <Button type="button" variant="secondary" onClick={() => setForm(blankForm)}>Limpar</Button>
        </div>
      </form>

      <section className="grid gap-6">
        <div className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm md:grid-cols-2">
          <SimpleCrud title="Categorias" value={newCategory} setValue={setNewCategory} items={categories} onAdd={upsertCategory} onDelete={deleteCategory} />
          <SimpleCrud title="Fornecedores" value={newSupplier} setValue={setNewSupplier} items={suppliers} onAdd={upsertSupplier} onDelete={deleteSupplier} />
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Produtos cadastrados</h2>
          <div className="mt-5 grid gap-4">
            {products.map((product) => (
              <article key={product.id} className="grid gap-4 rounded-lg border border-ink/10 p-4 md:grid-cols-[88px_1fr_auto]">
                <div className="relative aspect-square overflow-hidden rounded-md bg-champagne">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="mt-1 text-sm text-ink/55">{product.category} · {product.supplier} · {currency(product.salePrice)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.variations.map((variation) => (
                      <span key={variation.sku} className="rounded-md bg-champagne px-2.5 py-1 text-xs">{variation.size}/{variation.color} · {variation.sku} · {variation.stock} un.</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-2 md:justify-end">
                  <StockBadge stock={product.variations.reduce((sum, item) => sum + item.stock, 0)} min={product.variations.reduce((sum, item) => sum + item.minStock, 0)} />
                  <button type="button" aria-label="Editar" onClick={() => editProduct(product)} className="focus-ring rounded-md p-2 hover:bg-ink/5"><Pencil size={17} /></button>
                  <button type="button" aria-label="Excluir" onClick={() => removeProduct(product.id)} className="focus-ring rounded-md p-2 text-rose hover:bg-rose/10"><Trash2 size={17} /></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium">
      {label}
      <select required value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring h-11 w-full min-w-0 rounded-md border border-ink/12 bg-white px-3 text-sm">
        <option value="">Selecione</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function SimpleCrud({ title, value, setValue, items, onAdd, onDelete }: { title: string; value: string; setValue: (value: string) => void; items: string[]; onAdd: (value: string) => void; onDelete: (value: string) => void }) {
  return (
    <div>
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-3 flex gap-2">
        <Input aria-label={title} value={value} onChange={(event) => setValue(event.target.value)} placeholder={`Nova ${title.toLowerCase()}`} />
        <Button type="button" variant="secondary" onClick={() => { onAdd(value); setValue(""); }}>Adicionar</Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-2 rounded-md bg-champagne px-2 py-1 text-xs">
            {item}
            <button type="button" aria-label={`Excluir ${item}`} onClick={() => onDelete(item)} className="text-rose">x</button>
          </span>
        ))}
      </div>
    </div>
  );
}
