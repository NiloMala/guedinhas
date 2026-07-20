import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { mapProduct } from "@/lib/supabase/mappers";
import { slugify } from "@/lib/utils";

const PRODUCT_SELECT = "*, product_variations(*)";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, products: data.map(mapProduct) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    id,
    name,
    description,
    category,
    supplier,
    salePrice,
    costPrice,
    images,
    tags,
    featured,
    promo,
    variations
  } = body;

  if (!name || !category || !supplier) {
    return NextResponse.json({ ok: false, message: "Nome, categoria e fornecedor sao obrigatorios." }, { status: 400 });
  }

  const productPayload = {
    name,
    description: description || "",
    category,
    supplier,
    sale_price: Number(salePrice) || 0,
    cost_price: Number(costPrice) || 0,
    images: images && images.length ? images : [],
    tags: tags || [],
    featured: Boolean(featured),
    promo: Boolean(promo)
  };

  await supabaseAdmin.from("categories").upsert({ name: category }, { onConflict: "name" });
  await supabaseAdmin.from("suppliers").upsert({ name: supplier }, { onConflict: "name" });

  let productId = id;

  if (productId) {
    const { error: updateError } = await supabaseAdmin.from("products").update(productPayload).eq("id", productId);
    if (updateError) return NextResponse.json({ ok: false, message: updateError.message }, { status: 500 });
  } else {
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("products")
      .insert({ ...productPayload, slug: slugify(name) })
      .select("id")
      .single();
    if (insertError) return NextResponse.json({ ok: false, message: insertError.message }, { status: 500 });
    productId = inserted.id;
  }

  const submittedVariations: Array<{ id?: string; sku: string; size: string; color: string; stock: number; minStock: number }> = variations || [];

  const { data: existingVariations } = await supabaseAdmin
    .from("product_variations")
    .select("id")
    .eq("product_id", productId);

  const existingIds = new Set((existingVariations || []).map((item) => item.id));
  const keepIds = new Set(submittedVariations.filter((item) => item.id).map((item) => item.id));
  const toDelete = [...existingIds].filter((existingId) => !keepIds.has(existingId));

  if (toDelete.length) {
    await supabaseAdmin.from("product_variations").delete().in("id", toDelete);
  }

  for (const variation of submittedVariations) {
    const payload = {
      product_id: productId,
      sku: variation.sku,
      size: variation.size,
      color: variation.color,
      stock: Number(variation.stock) || 0,
      min_stock: Number(variation.minStock) || 0
    };
    if (variation.id && existingIds.has(variation.id)) {
      await supabaseAdmin.from("product_variations").update(payload).eq("id", variation.id);
    } else {
      await supabaseAdmin.from("product_variations").insert(payload);
    }
  }

  const { data: finalProduct, error: finalError } = await supabaseAdmin
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", productId)
    .single();

  if (finalError) return NextResponse.json({ ok: false, message: finalError.message }, { status: 500 });
  return NextResponse.json({ ok: true, product: mapProduct(finalProduct) });
}
