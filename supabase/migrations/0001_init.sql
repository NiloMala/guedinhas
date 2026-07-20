-- Guedinhas - schema inicial
-- Rode este arquivo inteiro no SQL Editor do Supabase (dashboard do projeto bietcsymoftdzsnbgpgk).

create extension if not exists pgcrypto;

-- ---------- Tabelas ----------

create table categories (
  name text primary key
);

create table suppliers (
  name text primary key
);

create table coupons (
  code text primary key,
  type text not null check (type in ('percent', 'fixed')),
  value numeric not null check (value >= 0),
  valid_until date not null,
  active boolean not null default true
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  category text not null references categories(name),
  supplier text not null references suppliers(name),
  sale_price numeric not null check (sale_price >= 0),
  cost_price numeric not null default 0 check (cost_price >= 0),
  images text[] not null default '{}',
  tags text[] not null default '{}',
  featured boolean not null default false,
  promo boolean not null default false,
  created_at timestamptz not null default now()
);

create table product_variations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  size text not null,
  color text not null,
  stock integer not null default 0 check (stock >= 0),
  min_stock integer not null default 0 check (min_stock >= 0)
);

create index on product_variations (product_id);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigserial unique,
  customer text not null,
  email text,
  whatsapp text,
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  status text not null default 'pendente'
    check (status in ('pendente', 'pago', 'separado', 'enviado', 'entregue', 'cancelado')),
  tracking_code text,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id),
  variation_id uuid references product_variations(id),
  product_name text not null,
  variation_name text not null,
  sku text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null default 0
);

create index on order_items (order_id);

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  variation_id uuid references product_variations(id),
  product_name text not null,
  sku text not null,
  type text not null check (type in ('entrada', 'saida', 'venda', 'estorno')),
  quantity integer not null,
  reason text not null default '',
  responsible text not null default 'Admin',
  created_at timestamptz not null default now()
);

create index on stock_movements (sku);

-- ---------- RLS ----------
-- Leitura publica liberada apenas para o que a vitrine precisa.
-- Pedidos e movimentacoes de estoque so sao acessiveis via service_role
-- (rotas server-side em app/api/*), nunca direto do browser.

alter table categories enable row level security;
alter table suppliers enable row level security;
alter table coupons enable row level security;
alter table products enable row level security;
alter table product_variations enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table stock_movements enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read suppliers" on suppliers for select using (true);
create policy "public read coupons" on coupons for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read variations" on product_variations for select using (true);
-- orders, order_items e stock_movements: sem policy de select/insert/update/delete
-- para anon/authenticated -> so o service_role (que ignora RLS) acessa.

-- ---------- Funcoes RPC atomicas ----------
-- Cada funcao roda dentro de uma unica transacao com "FOR UPDATE" para travar
-- a linha da variacao durante a validacao+escrita, evitando duas vendas
-- simultaneas derrubarem o estoque para negativo (race condition apontada na
-- auditoria do store local em memoria).

create or replace function register_stock_movement(
  p_sku text,
  p_type text,
  p_quantity integer,
  p_reason text,
  p_responsible text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_variation product_variations%rowtype;
  v_product products%rowtype;
  v_delta integer;
begin
  if p_type not in ('entrada', 'saida') then
    return jsonb_build_object('ok', false, 'message', 'Tipo de movimento invalido.');
  end if;

  select * into v_variation from product_variations where sku = p_sku for update;
  if not found then
    return jsonb_build_object('ok', false, 'message', 'SKU nao encontrado.');
  end if;

  select * into v_product from products where id = v_variation.product_id;

  v_delta := case when p_type = 'entrada' then p_quantity else -p_quantity end;

  if v_variation.stock + v_delta < 0 then
    return jsonb_build_object('ok', false, 'message', 'Estoque insuficiente para esta saida.');
  end if;

  update product_variations set stock = stock + v_delta where sku = p_sku;

  insert into stock_movements (variation_id, product_name, sku, type, quantity, reason, responsible)
  values (v_variation.id, v_product.name, p_sku, p_type, v_delta, p_reason, coalesce(p_responsible, 'Admin'));

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function create_order_from_checkout(
  p_customer text,
  p_email text,
  p_whatsapp text,
  p_items jsonb, -- [{variation_id, product_id, product, variation, quantity, sku, unit_price}]
  p_subtotal numeric,
  p_discount numeric,
  p_shipping numeric,
  p_total numeric
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_variation product_variations%rowtype;
  v_order_id uuid;
  v_order_number bigint;
begin
  if jsonb_array_length(p_items) = 0 then
    return jsonb_build_object('ok', false, 'message', 'Carrinho vazio.');
  end if;

  -- valida estoque de todos os itens antes de escrever qualquer coisa
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_variation
    from product_variations
    where id = (v_item->>'variation_id')::uuid
    for update;

    if not found then
      return jsonb_build_object('ok', false, 'message', format('Variacao nao encontrada: %s', v_item->>'variation'));
    end if;

    if v_variation.stock < (v_item->>'quantity')::integer then
      return jsonb_build_object('ok', false, 'message', format('Estoque insuficiente para %s (%s).', v_item->>'product', v_item->>'variation'));
    end if;
  end loop;

  insert into orders (customer, email, whatsapp, subtotal, discount, shipping, total, status)
  values (p_customer, p_email, p_whatsapp, p_subtotal, p_discount, p_shipping, p_total, 'pendente')
  returning id, order_number into v_order_id, v_order_number;

  for v_item in select * from jsonb_array_elements(p_items) loop
    update product_variations
    set stock = stock - (v_item->>'quantity')::integer
    where id = (v_item->>'variation_id')::uuid;

    insert into order_items (order_id, product_id, variation_id, product_name, variation_name, sku, quantity, unit_price)
    values (
      v_order_id,
      nullif(v_item->>'product_id', '')::uuid,
      (v_item->>'variation_id')::uuid,
      v_item->>'product',
      v_item->>'variation',
      v_item->>'sku',
      (v_item->>'quantity')::integer,
      coalesce((v_item->>'unit_price')::numeric, 0)
    );

    insert into stock_movements (variation_id, product_name, sku, type, quantity, reason, responsible)
    values (
      (v_item->>'variation_id')::uuid,
      v_item->>'product',
      v_item->>'sku',
      'venda',
      -(v_item->>'quantity')::integer,
      format('Venda #%s', 1100 + v_order_number),
      'Sistema'
    );
  end loop;

  return jsonb_build_object('ok', true, 'order_id', v_order_id, 'display_id', format('#%s', 1100 + v_order_number));
end;
$$;

create or replace function update_order_status(
  p_order_id uuid,
  p_status text,
  p_tracking_code text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order orders%rowtype;
  v_item order_items%rowtype;
  v_variation product_variations%rowtype;
  v_should_restock boolean;
  v_should_deduct_again boolean;
begin
  select * into v_order from orders where id = p_order_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'message', 'Pedido nao encontrado.');
  end if;

  v_should_restock := p_status = 'cancelado' and v_order.status <> 'cancelado';
  v_should_deduct_again := v_order.status = 'cancelado' and p_status <> 'cancelado';

  if v_should_deduct_again then
    for v_item in select * from order_items where order_id = p_order_id loop
      select * into v_variation from product_variations where id = v_item.variation_id for update;
      if v_variation.stock < v_item.quantity then
        return jsonb_build_object('ok', false, 'message', format('Estoque insuficiente para reativar %s.', v_item.product_name));
      end if;
    end loop;
  end if;

  if v_should_restock then
    for v_item in select * from order_items where order_id = p_order_id loop
      update product_variations set stock = stock + v_item.quantity where id = v_item.variation_id;
      insert into stock_movements (variation_id, product_name, sku, type, quantity, reason, responsible)
      values (v_item.variation_id, v_item.product_name, v_item.sku, 'estorno', v_item.quantity, format('Cancelamento #%s', 1100 + v_order.order_number), 'Admin');
    end loop;
  elsif v_should_deduct_again then
    for v_item in select * from order_items where order_id = p_order_id loop
      update product_variations set stock = stock - v_item.quantity where id = v_item.variation_id;
      insert into stock_movements (variation_id, product_name, sku, type, quantity, reason, responsible)
      values (v_item.variation_id, v_item.product_name, v_item.sku, 'venda', -v_item.quantity, format('Reativacao #%s', 1100 + v_order.order_number), 'Admin');
    end loop;
  end if;

  update orders set status = p_status, tracking_code = coalesce(p_tracking_code, tracking_code) where id = p_order_id;

  return jsonb_build_object('ok', true);
end;
$$;

-- As funcoes usam security definer para poder ser chamadas com a service_role
-- key a partir das rotas app/api/* (nunca diretamente do browser com a anon key).
revoke all on function register_stock_movement from public;
revoke all on function create_order_from_checkout from public;
revoke all on function update_order_status from public;
grant execute on function register_stock_movement to service_role;
grant execute on function create_order_from_checkout to service_role;
grant execute on function update_order_status to service_role;
