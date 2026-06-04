# BAR ENCONTRO DAS AGUAS

Sistema para bar com operacao local e integracao online via Supabase:

- Login por perfil
- Permissoes configuraveis pelo administrador
- Caixa completo com sangria, suprimento, formas de pagamento e diferenca
- Mesas e comandas abertas
- Transferir/juntar mesas
- Cancelamento de venda com senha de administrador e motivo
- Controle de turnos por operador
- Vendas
- Auditoria de acoes
- Estoque com ficha tecnica por insumo
- Fornecedores e compras
- Produtos favoritos no balcao
- Configuracoes do bar
- Alertas por nivel baixo/critico
- Lotes e validade
- Inventario fisico
- Limite de fiado por cliente
- Relatorio de lucratividade
- Backup automatico local diario
- Tela inicial por cargo
- Balcao com categorias visuais
- Modo garcom para celular
- Painel administrativo exclusivo
- Tema claro/escuro
- Cozinha/bar com fila de preparo
- Impressao de recibo
- Clientes e fiado
- Relatorios e backup
- Impressao/Salvar PDF dos relatorios
- PWA instalavel
- Sincronizacao local entre abas
- Produtos
- Equipe

## Como abrir

No Codex e em navegadores modernos, nao use `file://` para testar o app. Abra por
um servidor local:

1. Dê dois cliques em `iniciar-app.bat`; ou
2. Rode `.\iniciar-app.ps1` no PowerShell; ou
3. Rode manualmente:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Depois acesse:

```text
http://127.0.0.1:5173/index.html
```

## Contas de teste

| Cargo | Email | Senha |
| --- | --- | --- |
| Administrador | `admin@bar.local` | `admin123` |
| Gerente | `gerente@bar.local` | `gerente123` |
| Caixa | `caixa@bar.local` | `caixa123` |
| Estoque | `estoque@bar.local` | `estoque123` |

## Permissoes

Entre como administrador, abra `Equipe`, edite um usuario e marque as areas que
ele podera acessar. O cargo continua servindo como um modelo rapido, mas o acesso
final fica definido pelas permissoes marcadas.

O `Painel admin` e a area `Internet` sao exclusivos do cargo Administrador.

## Operacao

- Use `Mesas` para abrir comandas, adicionar itens, transferir/juntar mesas e fechar conta.
- Use `Vendas` para imprimir recibo ou cancelar venda com senha de administrador.
- Use `Configuracoes` para ajustar nome do bar, taxa de servico, recibo, backup e tela inicial por cargo.
- Use `Relatorios` para ver lucratividade, turnos por operador, auditoria e backups.
- Em `Relatorios`, use `Imprimir/PDF` e escolha `Salvar como PDF` na janela de impressao do navegador.

## Internet

O app ja esta configurado para usar Supabase em login real e nas principais areas:

- usuarios e permissoes
- configuracoes
- estoque, produtos, insumos, lotes e inventario
- vendas, itens de venda e cozinha
- caixa e movimentos
- clientes e fiado
- fornecedores, compras e despesas
- mesas e comandas
- backups

Para publicar na internet, siga o arquivo:

- `PUBLICAR_ONLINE.md`

## Importante

Em modo online, senhas reais ficam no Supabase Auth. O app pode editar perfil,
permissoes e exibicao na tela inicial, mas alteracao de senha deve ser feita em
`Supabase > Authentication > Users`.
