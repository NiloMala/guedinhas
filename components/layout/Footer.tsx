import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink pb-16 text-white md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h2 className="font-display text-2xl">Guedinhas</h2>
          <p className="mt-3 text-sm leading-6 text-white/65">Loja online de roupas e acessorios com curadoria elegante para todos os dias.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gold">Atendimento</h3>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            <Link href="/contato">Contato</Link>
            <Link href="/trocas-e-devolucoes">Trocas e Devolucoes</Link>
            <Link href="/politica-de-privacidade">Privacidade</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gold">Categorias</h3>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            <Link href="/catalogo?categoria=Vestidos">Vestidos</Link>
            <Link href="/catalogo?categoria=Acessorios">Acessorios</Link>
            <Link href="/catalogo?categoria=Masculino">Masculino</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gold">Redes</h3>
          <div className="mt-3 flex gap-3">
            <a aria-label="Instagram" className="rounded-md bg-white/10 p-2 hover:bg-white/15" href="https://www.instagram.com/guedinhas2026?igsh=dmxwcnFwcHNpeDg0" target="_blank" rel="noopener noreferrer">
              <Instagram size={18} />
            </a>
            <a aria-label="WhatsApp" className="rounded-md bg-white/10 p-2 hover:bg-white/15" href="https://wa.me/55129988945359" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
