import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { mapStockMovement } from "@/lib/supabase/mappers";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("stock_movements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, stockMovements: data.map(mapStockMovement) });
}

export async function POST(request: NextRequest) {
  const { sku, type, quantity, reason, responsible } = await request.json();

  const { data, error } = await supabaseAdmin.rpc("register_stock_movement", {
    p_sku: sku,
    p_type: type,
    p_quantity: Number(quantity),
    p_reason: reason || "",
    p_responsible: responsible || "Admin"
  });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  if (!data.ok) return NextResponse.json({ ok: false, message: data.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
