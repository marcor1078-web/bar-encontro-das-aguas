# Reset de senhas online pelo app

Para o administrador trocar senhas reais do Supabase pelo app, configure esta variavel na Vercel:

```text
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_do_supabase
```

Onde encontrar:

1. Abra o projeto no Supabase.
2. Va em `Project Settings`.
3. Abra `API Keys`.
4. Copie a chave secreta/service role.
5. No projeto da Vercel, va em `Settings > Environment Variables`.
6. Crie `SUPABASE_SERVICE_ROLE_KEY` como `Sensitive`.
7. Selecione `Production` e `Preview`.
8. Salve e faca um novo deploy.

Uso no app:

1. Entre com um usuario admin online.
2. Abra `Usuarios`.
3. Clique em `Editar` no usuario.
4. Preencha `Nova senha online`.
5. Clique em `Salvar`.

Se deixar o campo de senha vazio, o app salva apenas nome, cargo, status e permissoes.
