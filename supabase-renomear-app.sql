-- Atualiza o nome exibido do app no Supabase.
-- Rode este SQL uma unica vez no Supabase SQL Editor.

update public.app_settings
set bar_name = 'DISTRIBUIDORA AMÉRICA BJ'
where id = 'main';
