import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  const trimmed = (name || "").trim();
  if (!trimmed) return NextResponse.json({ ok: false, message: "Nome invalido." }, { status: 400 });

  const { error } = await supabaseAdmin.from("suppliers").upsert({ name: trimmed }, { onConflict: "name" });
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const { name } = await request.json();
  const { error } = await supabaseAdmin.from("suppliers").delete().eq("name", name);
  if (error) return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
