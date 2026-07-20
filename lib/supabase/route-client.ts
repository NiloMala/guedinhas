import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Le a sessao a partir dos cookies da requisicao dentro de um Route Handler.
// Usado para descobrir quem esta logado (se alguem) sem confiar em nada que
// o corpo da requisicao declare.
export async function getRouteUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // ignora: alguns contextos de Route Handler nao permitem set
            }
          });
        }
      }
    }
  );
  const { data } = await supabase.auth.getUser();
  return data.user;
}
