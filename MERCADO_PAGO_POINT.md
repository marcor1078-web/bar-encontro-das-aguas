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
MP_PRINT_ON_TERMINAL=no_ticket
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
- Se o pagamento ficar pendente, confira a maquininha antes de tentar novamente.
