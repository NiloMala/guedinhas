import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status, trackingCode } = await request.json();

  const { data, error } = await supabaseAdmin.rpc("update_order_status", {
    p_order_id: id,
    p_status: status,
    p_tracking_code: trackingCode || null
  });

  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  if (!data.ok) return NextResponse.json({ ok: false, message: data.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
