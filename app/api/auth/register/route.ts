import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ ok: false, message: "Preencha nome, e-mail e senha." }, { status: 400 });
  }
  if (String(password).length < 6) {
    return NextResponse.json({ ok: false, message: "A senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
  }

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (error) {
    const message = error.message.includes("already been registered") ? "Este e-mail ja tem cadastro." : error.message;
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
