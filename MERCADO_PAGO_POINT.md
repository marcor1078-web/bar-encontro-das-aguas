# Integracao Mercado Pago Point

Esta integracao usa funcoes serverless da Vercel para manter o Access Token fora do navegador.

## Como funciona no app

1. O caixa escolhe `Debito` ou `Credito`.
2. O app chama `/api/mercadopago/create-order`.
3. A funcao da Vercel envia a cobranca para a maquininha Point.
4. O app consulta `/api/mercadopago/order-status`.
5. Se o status voltar `processed`, a venda e registrada no Supabase.
6. Se falhar, expirar ou nao confirmar, a venda nao e registrada automaticamente.

## Variaveis na Vercel

Em `Vercel > Project > Settings > Environment Variables`, crie:

```text
MP_ACCESS_TOKEN=seu_access_token_do_mercado_pago
MP_TERMINAL_ID=id_do_terminal_point
MP_PRINT_ON_TERMINAL=seller_ticket
MP_DEFAULT_INSTALLMENTS=1
```

Opcionais:

```text
MP_INTEGRATOR_ID=
MP_PLATFORM_ID=
MP_SPONSOR_ID=
```

Depois de salvar as variaveis, faca um novo deploy na Vercel.

## Como testar

1. Abra o app online.
2. Entre como administrador.
3. Va em `Internet`.
4. Clique em `Testar Mercado Pago Point`.
5. Se aparecer configurado, faca uma venda pequena em `Debito` ou `Credito`.
6. Confira a cobranca na maquininha.

## Importante

- Nunca coloque `MP_ACCESS_TOKEN` dentro de `app.js`, `supabase-config.js` ou qualquer arquivo publico.
- Tokens e chaves privadas ficam apenas nas variaveis de ambiente da Vercel.
- `MP_PRINT_ON_TERMINAL=seller_ticket` imprime o comprovante simples do vendedor na maquininha depois do pagamento. As fichas personalizadas ficam no app, em formato de bobina.
- Depois da venda, a janela permite imprimir pelo navegador, enviar todas as fichas individuais juntas em um lote ou enviar o recibo para uma Point Smart. O envio direto exige sessao online e permissao de Balcao ou Vendas.
- O recibo direto e enviado como imagem PNG pela API de Terminals e inclui a logo, o nome da distribuidora, o CNPJ cadastrado e a mensagem de agradecimento. A API aceita imagens PNG/JPEG em Base64 com limite de 1 MB.
- A impressao personalizada usa a API de Terminals. O Mercado Pago pode exigir uma atualizacao/liberacao do terminal antes que ele receba essas acoes; o status `created` significa que a acao esta na fila e `on_terminal` significa que a Point a recebeu. Confira a impressao fisica antes de entregar o produto.
- A selecao da Point usada para imprimir e independente da Point usada para cobrar. O app guarda o andamento por venda e terminal para evitar reenviar fichas que ja chegaram ao dispositivo.
- Se o pagamento ficar pendente, confira a maquininha antes de tentar novamente.
