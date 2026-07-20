import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Usar SOMENTE dentro de app/api/* (route handlers), nunca em componentes
// client. Ignora RLS - e quem tem permissao para escrever em products,
// orders, stock_movements etc.
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false }
});
