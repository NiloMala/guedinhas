import { Badge } from "@/components/ui/Badge";

export function StockBadge({ stock, min }: { stock: number; min: number }) {
  if (stock === 0) return <Badge tone="danger">Esgotado</Badge>;
  if (stock <= min) return <Badge tone="warning">Estoque baixo</Badge>;
  return <Badge tone="success">Disponivel</Badge>;
}
