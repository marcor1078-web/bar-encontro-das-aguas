# Publicar o BAR ENCONTRO DAS AGUAS online

Este app ja esta preparado para rodar como site estatico com Supabase. A publicacao mais simples e usar GitHub + Vercel.

## 1. Conferir antes de publicar

- O login real deve funcionar localmente.
- Os arquivos SQL das etapas anteriores devem ter sido executados no Supabase.
- O arquivo `supabase-config.js` deve conter a URL do projeto e a chave publicavel.
- Nunca coloque chave secreta do Supabase no app.

## 2. Criar repositorio no GitHub

1. Acesse `https://github.com`.
2. Clique em `New repository`.
3. Nome sugerido: `bar-encontro-das-aguas`.
4. Deixe como privado se quiser controlar o acesso ao codigo.
5. Crie o repositorio vazio.

## 3. Enviar os arquivos para o GitHub

No PowerShell, dentro desta pasta do app, rode:

```powershell
git init
git add .
git commit -m "Primeira versao online do bar"
git branch -M main
git remote add origin URL_DO_REPOSITORIO_GITHUB
git push -u origin main
```

Troque `URL_DO_REPOSITORIO_GITHUB` pela URL que o GitHub mostrar, por exemplo:

```text
https://github.com/seu-usuario/bar-encontro-das-aguas.git
```

## 4. Publicar na Vercel

1. Acesse `https://vercel.com`.
2. Entre com sua conta GitHub.
3. Clique em `Add New...` e depois `Project`.
4. Escolha o repositorio `bar-encontro-das-aguas`.
5. Em framework, escolha `Other` se a Vercel perguntar.
6. Build command: deixe vazio.
7. Output directory: deixe vazio ou coloque `.`.
8. Clique em `Deploy`.

Quando terminar, a Vercel vai gerar um link parecido com:

```text
https://bar-encontro-das-aguas.vercel.app
```

## 5. Liberar o dominio no Supabase Auth

Depois que a Vercel gerar o link:

1. Entre no Supabase.
2. Abra o projeto `bar-encontro-das-aguas`.
3. Va em `Authentication`.
4. Va em `URL Configuration`.
5. Em `Site URL`, coloque o link da Vercel.
6. Em `Redirect URLs`, adicione tambem o link da Vercel.
7. Salve.

## 6. Testar online

1. Abra o link da Vercel.
2. Entre com `Marcos Admin`.
3. Teste:
   - cadastrar produto
   - abrir caixa
   - fazer venda
   - abrir mesa
   - cadastrar despesa
   - editar permissao de usuario
   - gerar backup manual

## 7. Integracao com maquininhas

Depois do app publicado com HTTPS, a proxima etapa segura e criar um backend para Mercado Pago e Stone.

Nao coloque token secreto de Mercado Pago ou Stone no navegador. Esses tokens precisam ficar em um servidor ou funcao serverless.

Ordem recomendada:

1. Publicar o app na Vercel.
2. Criar backend/API seguro.
3. Integrar primeiro Mercado Pago, porque a documentacao costuma ser mais acessivel.
4. Depois avaliar Stone conforme o modelo exato da maquininha e tipo de integracao liberada na sua conta.
