import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { mapOrder } from "@/lib/supabase/mappers";

const ORDER_SELECT = "*, order_items(*)";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, orders: data.map(mapOrder) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customer, email, whatsapp, items, subtotal, discount, shipping, total } = body;

  const { data, error } = await supabaseAdmin.rpc("create_order_from_checkout", {
    p_customer: customer,
    p_email: email || null,
    p_whatsapp: whatsapp || null,
    p_items: items.map((item: { productId?: string; variationId: string; product: string; variation: string; quantity: number; sku: string; unitPrice: number }) => ({
      product_id: item.productId || null,
      variation_id: item.variationId,
      product: item.product,
      variation: item.variation,
      quantity: item.quantity,
      sku: item.sku,
      unit_price: item.unitPrice
    })),
    p_subtotal: subtotal,
    p_discount: discount,
    p_shipping: shipping,
    p_total: total
  });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  if (!data.ok) return NextResponse.json({ ok: false, message: data.message }, { status: 400 });

  const { data: order, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", data.order_id)
    .single();

  if (fetchError) return NextResponse.json({ ok: false, message: fetchError.message }, { status: 500 });
  return NextResponse.json({ ok: true, order: mapOrder(order) });
}
