-- Execute todo este arquivo uma unica vez no SQL Editor do Supabase.
-- As imagens sao publicas para aparecerem no catalogo, mas somente usuarios
-- autenticados podem enviar, alterar ou excluir arquivos.

alter table public.products
  add column if not exists image_url text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
on storage.objects for select
to public
using (bucket_id = 'product-images');

drop policy if exists "product_images_authenticated_insert" on storage.objects;
create policy "product_images_authenticated_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "product_images_authenticated_update" on storage.objects;
create policy "product_images_authenticated_update"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "product_images_authenticated_delete" on storage.objects;
create policy "product_images_authenticated_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
