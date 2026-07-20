-- Guedinhas - dados iniciais (mesmos produtos/cupons que estavam no mock local)
-- Rode depois de 0001_init.sql, tambem no SQL Editor do Supabase.

insert into categories (name) values
  ('Vestidos'), ('Blusas'), ('Calcas'), ('Acessorios'), ('Masculino');

insert into suppliers (name) values
  ('Atelie Rosa'), ('Norte Conf'), ('Lumi Bags'), ('Linea Basic');

insert into coupons (code, type, value, valid_until, active) values
  ('GUEDINHAS8', 'percent', 8, '2026-12-31', true),
  ('ROSA20', 'fixed', 20, '2026-12-31', true);

with p1 as (
  insert into products (slug, name, description, category, supplier, sale_price, cost_price, images, tags, featured, created_at)
  values (
    'vestido-midi-aurora', 'Vestido Midi Aurora',
    'Vestido midi acetinado com caimento fluido, fenda lateral e acabamento delicado.',
    'Vestidos', 'Atelie Rosa', 189.9, 92,
    array['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80'],
    array['mais vendido','festa'], true, '2026-07-10'
  ) returning id
),
p2 as (
  insert into products (slug, name, description, category, supplier, sale_price, cost_price, images, tags, featured, created_at)
  values (
    'camisa-linho-noir', 'Camisa Linho Noir',
    'Camisa de linho misto, modelagem reta e toque fresco para producoes urbanas.',
    'Masculino', 'Norte Conf', 149.9, 70,
    array['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'],
    array['novo'], true, '2026-07-15'
  ) returning id
),
p3 as (
  insert into products (slug, name, description, category, supplier, sale_price, cost_price, images, tags, promo, created_at)
  values (
    'bolsa-mini-lumi', 'Bolsa Mini Lumi',
    'Bolsa compacta com corrente dourada, estrutura firme e espaco para essenciais.',
    'Acessorios', 'Lumi Bags', 119.9, 58,
    array['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80'],
    array['promocao'], true, '2026-07-08'
  ) returning id
),
p4 as (
  insert into products (slug, name, description, category, supplier, sale_price, cost_price, images, tags, featured, created_at)
  values (
    'calca-tailoring-essencial', 'Calca Tailoring Essencial',
    'Calca de alfaiataria com cintura alta, bolsos faca e barra reta.',
    'Calcas', 'Linea Basic', 169.9, 81,
    array['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80'],
    array['mais vendido'], true, '2026-07-03'
  ) returning id
)
insert into product_variations (product_id, sku, size, color, stock, min_stock)
select id, 'GUE-VES-AUR-P-PRE', 'P', 'Preto', 7, 3 from p1
union all select id, 'GUE-VES-AUR-M-ROS', 'M', 'Rosa', 2, 3 from p1
union all select id, 'GUE-VES-AUR-G-DOU', 'G', 'Dourado', 0, 2 from p1
union all select id, 'GUE-CAM-NOI-M-PRE', 'M', 'Preto', 11, 4 from p2
union all select id, 'GUE-CAM-NOI-G-OFF', 'G', 'Off White', 4, 4 from p2
union all select id, 'GUE-BOL-LUM-U-PRE', 'Unico', 'Preto', 6, 2 from p3
union all select id, 'GUE-BOL-LUM-U-ROS', 'Unico', 'Rosa', 1, 2 from p3
union all select id, 'GUE-CAL-ESS-38-PRE', '38', 'Preto', 8, 3 from p4
union all select id, 'GUE-CAL-ESS-40-BEG', '40', 'Bege', 3, 3 from p4;

-- historico de estoque inicial (mesmo do mock)
insert into stock_movements (variation_id, product_name, sku, type, quantity, reason, responsible, created_at)
select v.id, 'Vestido Midi Aurora', 'GUE-VES-AUR-P-PRE', 'entrada', 10, 'Compra fornecedor', 'Admin', timestamptz '2026-07-15 09:20'
from product_variations v where v.sku = 'GUE-VES-AUR-P-PRE'
union all
select v.id, 'Vestido Midi Aurora', 'GUE-VES-AUR-M-ROS', 'saida', -1, 'Ajuste por troca', 'Admin', timestamptz '2026-07-20 10:45'
from product_variations v where v.sku = 'GUE-VES-AUR-M-ROS';

-- pedidos de exemplo (usa a mesma funcao do app, ja da baixa real no estoque acima)
select create_order_from_checkout(
  'Igor Santos', null, null,
  jsonb_build_array(jsonb_build_object(
    'variation_id', (select id from product_variations where sku = 'GUE-CAM-NOI-G-OFF'),
    'product_id', (select product_id from product_variations where sku = 'GUE-CAM-NOI-G-OFF'),
    'product', 'Camisa Linho Noir', 'variation', 'G / Off White',
    'quantity', 1, 'sku', 'GUE-CAM-NOI-G-OFF', 'unit_price', 149.9
  )),
  149.9, 0, 19.9, 169.8
);

select create_order_from_checkout(
  'Rafaela Lima', null, null,
  jsonb_build_array(jsonb_build_object(
    'variation_id', (select id from product_variations where sku = 'GUE-BOL-LUM-U-ROS'),
    'product_id', (select product_id from product_variations where sku = 'GUE-BOL-LUM-U-ROS'),
    'product', 'Bolsa Mini Lumi', 'variation', 'Unico / Rosa',
    'quantity', 1, 'sku', 'GUE-BOL-LUM-U-ROS', 'unit_price', 119.9
  )),
  119.9, 0, 19.9, 139.8
);

select create_order_from_checkout(
  'Mariana Alves', null, null,
  jsonb_build_array(jsonb_build_object(
    'variation_id', (select id from product_variations where sku = 'GUE-VES-AUR-P-PRE'),
    'product_id', (select product_id from product_variations where sku = 'GUE-VES-AUR-P-PRE'),
    'product', 'Vestido Midi Aurora', 'variation', 'P / Preto',
    'quantity', 1, 'sku', 'GUE-VES-AUR-P-PRE', 'unit_price', 189.9
  )),
  189.9, 0, 19.9, 209.8
);

update orders set status = 'enviado', tracking_code = 'BR123456789' where customer = 'Rafaela Lima';
update orders set status = 'pago' where customer = 'Mariana Alves';
