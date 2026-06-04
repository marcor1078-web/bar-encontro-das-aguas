# Plano para transformar o BarControl em app online

## Versao atual

A versao atual e um prototipo funcional em HTML, CSS e JavaScript puro. Ela serve para
validar telas, fluxos e regras basicas:

- Login simulado
- Permissoes por perfil
- Venda rapida
- Baixa de estoque
- Caixa completo
- Auditoria
- Mesas e comandas
- Cancelamento com senha e motivo
- Ficha tecnica e insumos
- Fornecedores e compras
- Lotes e validade
- Inventario
- Cozinha/bar
- Clientes e fiado
- Relatorios, lucratividade e backup
- PWA
- Produtos
- Equipe

Ela nao deve ser usada em producao porque senhas e dados ficam no navegador.

## Arquitetura recomendada para internet

- Next.js para o app web responsivo
- Supabase Auth para login
- Supabase/PostgreSQL para banco de dados
- Vercel para hospedagem
- GitHub para versionamento e deploy automatico

## Perfis iniciais

- Administrador: acesso total
- Gerente: vendas, caixa, estoque e produtos
- Caixa: venda rapida, vendas e caixa
- Estoque: estoque e produtos

## Tabelas principais

- profiles: dados do usuario e cargo
- products: produtos vendidos
- ingredients: insumos controlados por ficha tecnica
- product_recipes: composicao de cada produto
- product_lots: lotes e validade
- stock_movements: entradas, saidas e ajustes de estoque
- cash_sessions: abertura e fechamento de caixa
- cash_movements: entradas e saidas manuais do caixa
- sales: cabecalho da venda
- sale_items: itens de cada venda
- tables: mesas e comandas abertas
- cancellations: cancelamentos com senha/motivo
- kitchen_orders: fila de cozinha/bar
- clients: clientes e fiado
- suppliers: fornecedores
- purchases: compras
- inventory_counts: contagens fisicas
- audit_log: auditoria

## Regras importantes

- Usuario so ve areas permitidas pelo cargo.
- Venda finalizada deve criar `sale`, criar `sale_items` e baixar estoque.
- Ajuste de estoque deve gerar historico em `stock_movements`.
- Caixa aberto deve registrar usuario, data e valor inicial.
- Fechamento de caixa deve registrar valor contado e diferenca.
- Senhas nunca ficam no codigo nem no navegador.

## Caminho de publicacao

1. Criar projeto Next.js.
2. Criar projeto no Supabase.
3. Criar tabelas e regras de acesso.
4. Migrar a interface atual para React/Next.js.
5. Conectar login real do Supabase.
6. Publicar na Vercel.
7. Testar em desktop e celular.
8. Opcional: conectar dominio proprio.
