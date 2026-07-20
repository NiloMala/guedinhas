import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para uso no browser (RLS ativo, so enxerga o que as policies de
// leitura publica liberam: products, product_variations, categories,
// suppliers, coupons). Usa @supabase/ssr para guardar a sessao de login em
// cookies, para o middleware (server-side) conseguir ler quem esta logado.
export const supabaseBrowser = createBrowserClient(url, anonKey);
