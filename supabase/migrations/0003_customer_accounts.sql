-- Guedinhas - conta de cliente
-- Rode no SQL Editor do Supabase, depois de 0001 e 0002.

alter table orders add column if not exists customer_id uuid references auth.users(id);

-- Clientes autenticados podem ler os proprios pedidos (e so os proprios).
create policy "customers read own orders" on orders
  for select using (auth.uid() = customer_id);

create policy "customers read own order items" on order_items
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  );

-- create_order_from_checkout passa a aceitar o id do cliente logado (opcional -
-- checkout continua funcionando sem login, como convidado). Precisa dropar a
-- assinatura antiga: um novo parametro cria uma sobrecarga em vez de
-- substituir, e depois o grant fica ambiguo entre as duas.
drop function if exists create_order_from_checkout(text, text, text, jsonb, numeric, numeric, numeric, numeric);

create or replace function create_order_from_checkout(
  p_customer text,
  p_email text,
  p_whatsapp text,
  p_items jsonb,
  p_subtotal numeric,
  p_discount numeric,
  p_shipping numeric,
  p_total numeric,
  p_customer_id uuid default null
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

  insert into orders (customer, email, whatsapp, subtotal, discount, shipping, total, status, customer_id)
  values (p_customer, p_email, p_whatsapp, p_subtotal, p_discount, p_shipping, p_total, 'pendente', p_customer_id)
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

grant execute on function create_order_from_checkout to service_role;
