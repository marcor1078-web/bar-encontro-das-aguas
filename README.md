# DISTRIBUIDORA ENCONTRO DAS ÁGUAS

Sistema para distribuidora com operacao local e integracao online via Supabase:

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
- Configuracoes da distribuidora
- Alertas por nivel baixo/critico
- Lotes e validade
- Inventario fisico
- Limite de fiado por cliente
- Relatorio de lucratividade
- Tela inicial por cargo
- Balcao com categorias visuais
- Modo garcom para celular
- Painel administrativo exclusivo
- Tema claro/escuro
- Cozinha/bar com fila de preparo
- Impressao de recibo
- Clientes e fiado
- Relatorios operacionais e financeiros
- Impressao/Salvar PDF dos relatorios
- PWA instalavel
- Modo de contingencia com fila local de vendas e sincronizacao automatica
- Sincronizacao quase em tempo real entre computadores, com protecao durante pagamentos
- Produtos
- Equipe
- Conciliacao automatica de pagamentos com referencia da operadora
- Curva ABC, giro, cobertura, sugestao de compra e estoque sem giro
- Fluxo de caixa projetado para 30, 60 e 90 dias
- Simulador de preco com custos, taxas, impostos e margem
- Conferencia detalhada do fechamento por forma de pagamento
- 2FA e central de aparelhos
- Auditoria imutavel
- Gerente diario com alertas de anomalias
- Paletas da marca, classica e rubro-negra

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
- Use `Configuracoes` para ajustar nome da distribuidora, taxa de servico, recibo, paleta e tela inicial por cargo.
- Use `Relatorios` para ver lucratividade, turnos por operador e auditoria.
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

Para ativar os recursos avancados no banco, execute uma vez no SQL Editor:

- `SUPABASE_GESTAO_AVANCADA.sql`

Esse arquivo cria conciliacao, central de aparelhos e auditoria imutavel. Ele nao
apaga os dados atuais.

Para receber mudancas feitas em outro computador sem recarregar a pagina, execute
uma vez no SQL Editor:

- `SUPABASE_TEMPO_REAL.sql`

O app adia essas atualizacoes enquanto houver carrinho, formulario, mesa em
fechamento ou pagamento aberto. Assim que a operacao termina, os dados pendentes
sao aplicados automaticamente.

Para publicar na internet, siga o arquivo:

- `PUBLICAR_ONLINE.md`

## Modo offline

Execute uma vez o arquivo `SUPABASE_MODO_OFFLINE.sql` no SQL Editor do Supabase.
Depois, abra o app e entre com a conta online ao menos uma vez em cada aparelho.
O app podera reabrir sem internet por ate 72 horas e guardara vendas pendentes
localmente para sincronizar quando a conexao voltar.

Sem internet, Pix, debito e credito nao podem ser enviados pelo app. Faça a
cobranca diretamente na maquininha, aguarde a aprovacao e registre a mesma forma
de pagamento no app. A maquininha ainda precisa de conexao propria, como 4G.

Enquanto houver venda marcada como `Aguardando nuvem`, nao limpe os dados do
navegador nem desinstale o app nesse aparelho.

## Importante

Em modo online, senhas reais ficam no Supabase Auth. O app pode editar perfil,
permissoes e exibicao na tela inicial, mas alteracao de senha deve ser feita em
`Supabase > Authentication > Users`.

## Creditos visuais

O arquivo `icons/flamengo-rowing-crest.png` reproduz o escudo de remo do Clube de
Regatas do Flamengo, de autoria do clube, obtido no Wikimedia Commons e usado sem
alteracoes sob a licenca CC BY-SA 4.0:

- https://commons.wikimedia.org/wiki/File:Flamengo-RJ_(Rowing;_2018).svg
- https://creativecommons.org/licenses/by-sa/4.0/
