# Configurar o Assistente IA

O assistente usa a API da OpenAI. A assinatura do ChatGPT nao inclui automaticamente creditos da API; o consumo da API e cobrado separadamente na conta da plataforma.

## 1. Criar a chave da OpenAI

1. Acesse: https://platform.openai.com/api-keys
2. Entre ou crie sua conta da plataforma OpenAI.
3. Cadastre uma forma de pagamento e um limite de uso em **Billing**, se a conta solicitar.
4. Clique em **Create new secret key**.
5. Copie a chave no momento da criacao. Nao envie essa chave por mensagem e nao coloque no arquivo `app.js`.

## 2. Configurar na Vercel

1. Acesse: https://vercel.com/marcor1078-webs-projects/bar-encontro-das-aguas/settings/environment-variables
2. Clique em **Add Environment Variable**.
3. Em **Name**, coloque: `OPENAI_API_KEY`
4. Em **Value**, cole a chave secreta da OpenAI.
5. Marque **Production** e **Preview**.
6. Salve.

Opcionalmente, crie `OPENAI_MODEL` com o valor `gpt-5-mini`. Sem essa variavel, o app ja usa esse modelo como padrao.

## 3. Republicar

1. Na Vercel, abra **Deployments**.
2. No deployment mais recente, abra o menu de tres pontos.
3. Clique em **Redeploy** e confirme.
4. Aguarde o status ficar **Ready**.

## 4. Testar

1. Entre no app usando uma conta online.
2. Abra **Assistente IA**.
3. Pergunte: `Como estao minhas vendas de hoje?`
4. Depois teste uma tarefa: `Altere o preco da Agua sem gas para 7 reais.`
5. Confira o cartao apresentado e clique em **Confirmar execucao** somente se os dados estiverem corretos.

## Seguranca

- A chave fica somente na Vercel e nunca e enviada ao navegador.
- A rota valida a sessao do Supabase e a permissao do usuario.
- A IA recebe apenas um resumo necessario dos dados do negocio.
- Toda alteracao exige confirmacao humana no aplicativo.
- Nesta primeira versao, a IA nao pode excluir dados, criar vendas, fechar caixa, alterar usuarios ou operar maquininhas.
