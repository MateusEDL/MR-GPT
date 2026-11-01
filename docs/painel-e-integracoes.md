# Painel de edição e integrações

O conteúdo público está em JSON dentro de `src/content`. O código do painel Decap CMS em `public/admin/` permite editar esses arquivos por Git; não há banco proprietário. Imagens ficam em `public/uploads`. O código e o conteúdo continuam exportáveis sem a Vercel.

**O build público padrão exclui `/admin/`.** A auditoria das dependências upstream do painel identificou pendências detalhadas em `docs/auditoria-dependencias.md`. O desenvolvimento local e `npm run build:editor` mantêm o painel para edição e validação local. O teste local de salvamento registrado abaixo não autoriza sua ativação em produção.

Antes de oferecer login editorial em produção, resolva ou submeta à avaliação e aprovação explícita as pendências da auditoria, configure OAuth e permissões e então habilite **`PUBLIC_CMS_ENABLED=true`** conscientemente, com novo build/deploy. Não use essa flag para contornar a revisão da auditoria. Com o padrão `false`, a presença do código do CMS no repositório não significa que o painel está publicado.

O site público pode funcionar estaticamente sem painel ou funções. Na Vercel, as funções `api/auth.ts`, `api/callback.ts` e `api/contact.ts` adicionam OAuth do painel e contato opcional. Essas funções não funcionam em uma hospedagem somente de arquivos; portar o site público não exige portá-las, mas habilitar esses recursos exige um runtime compatível ou outra integração.

O build Astro usa saída estática: o site público não precisa de um adaptador SSR. Os endpoints em `api/` são funções separadas do runtime Node da Vercel; o servidor local do Astro não os executa como rotas Astro. Para um teste integrado dessas funções no ambiente do provedor, é necessário conectar o projeto e usar o runtime de desenvolvimento/deploy da Vercel com suas variáveis. A configuração no repositório não equivale a um deploy remoto validado.

## Edição no computador/ambiente de desenvolvimento

1. Instale as dependências com o comando indicado no README e inicie o site.
2. Em outro terminal, execute `npm run cms` para iniciar o proxy local Decap na porta 8081.
3. Abra `/admin/` no mesmo servidor local do site (por exemplo, localhost na porta 4321). O proxy local só deve ficar acessível no computador de desenvolvimento. Nunca publique sua porta na internet.
4. Edite, salve e confira o resultado. Os arquivos no repositório são a fonte do conteúdo. Revisões locais devem ser revisadas antes de commit e publicação.

Apenas os hostnames localhost e 127.0.0.1 usam o backend local. Abrir a página por um endereço público ou host de preview não ativa acesso local sem autenticação. O backend local não substitui o login em produção.

## Conectar o painel com GitHub e Vercel

Pré-requisitos externos: repositório `MateusEDL/MR-GPT` publicado com branch `main`; projeto Vercel ligado a esse repositório; autorização da associação para cada editor; domínio ou endereço estável escolhido. A implementação não cria contas nem configura segredos por conta própria.

1. Importe o repositório na Vercel conforme o README. O deploy do site deve ter sucesso antes do login editorial. O build padrão não publica `/admin/`; cumpra a revisão de auditoria acima antes de habilitar `PUBLIC_CMS_ENABLED=true`.
2. Crie, na conta/organização responsável, uma **GitHub OAuth App**. Use o domínio estável do painel como homepage e `https://SEU-DOMINIO/api/callback` como callback. A aplicação só deve ser confiada a editores autorizados.
3. Na configuração segura de variáveis da Vercel, defina `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `CMS_ORIGIN` e `SITE_URL`. `CMS_ORIGIN` precisa ser a origem exata do painel, sem caminho; `SITE_URL` é a origem permitida para formulário e deve corresponder ao ambiente efetivamente usado.
4. Use `GITHUB_OAUTH_SCOPE=public_repo` quando o repositório for público. O GitHub exige `repo` para a operação de um CMS Git-based em repositório privado; esse escopo é amplo. Avalie a concessão antes de habilitar e use contas com acesso restrito ao necessário. Não trate o OAuth App como um GitHub App com permissão apenas neste repositório.
5. Faça novo deploy depois de alterar variáveis e teste `/api/auth` e o fluxo em `/admin/`. Sem configuração o endpoint exibe indisponibilidade real. Não compartilhe o segredo da OAuth App com editores.
6. Autorize cada pessoa pelo GitHub e dê apenas a permissão necessária no repositório. O CMS não mantém uma lista separada de usuários; permissão de escrita depende do GitHub. Remover acesso ao GitHub e revogar a autorização OAuth faz parte do desligamento de editores.

O endpoint usa estado de sessão com cookie HttpOnly, SameSite=Lax e Secure em HTTPS. O token retornado pelo GitHub só é comunicado à janela do painel na origem configurada. Nenhum token aparece na URL pública ou em mensagens de erro. Esse controle de origem não torna seguro um navegador comprometido; mantenha contas, dependências e permissões atualizadas.

O Decap mantém sua sessão editorial no navegador. Saia do painel e do GitHub ao terminar em um computador compartilhado; não compartilhe contas entre editores. A senha do GitHub é fornecida apenas ao próprio GitHub, nunca ao site ou à equipe técnica.

Os previews aleatórios da Vercel não são adicionados automaticamente como origens. Para testar OAuth, use um endereço estável de staging e uma configuração de aplicativo correspondente. Não ampliar os destinos de `postMessage` para `*`.

## O que editar

- **Configurações e início:** contatos oficiais, dados de doação, domínio canônico e textos da home.
- **Logotipos:** envie os originais institucionais e do MR Cultural nos campos correspondentes das configurações. Preserve o desenho e as proporções; não redesenhe o símbolo nem use um avatar recortado como substituto de um original de boa qualidade.
- **Páginas institucionais:** título visível (H1), título opcional para buscadores, descrição, introdução, seções e perguntas frequentes. O título de buscadores pode ser mais curto; buscar aproximadamente até 60 caracteres não garante ranking. Não altere a URL sem avaliar histórico e redirecionamentos.
- **Notícias e conteúdos:** título, resumo, autor, data verdadeira, texto e imagem. Atribua revisor e data somente depois de uma revisão realmente realizada.
- **Agenda única:** cadastre uma vez e marque “Mostrar também na agenda MR Cultural” quando pertinente. Preencha data, local, condições de participação e situação real. Um evento passado deve continuar como registro histórico, sem fingir ser futuro.
- **Projetos culturais:** diferencie atividade atual, planejamento e projeto encerrado.
- **Galerias culturais:** registre contexto, data conhecida, atividade/edição, fotos com descrição, legenda e crédito, vídeo e transcrição quando disponíveis. O campo de aprovação começa desligado; só ative após conferir os direitos de uso e o contexto. Galerias não aprovadas não aparecem no site público.
- **Parceiros autorizados:** cadastre apenas vínculo confirmado e uso de identidade visual autorizado. O campo de aprovação começa desligado; sem ele o cadastro não é exibido no site público.
- **Autores e revisores:** cadastre nome, apresentação e qualificação pública verificada; depois selecione a pessoa no artigo. A existência do cadastro não equivale a revisão realizada. Preencha a revisão e sua data no artigo somente depois da aprovação efetiva do conteúdo.
- **Mídia:** carregue apenas arquivos autorizados, preencha descrição acessível e confira se a imagem corresponde ao contexto. Não coloque autorizações com dados pessoais na pasta pública de uploads.

O fluxo editorial está configurado para rascunhos/revisão no backend GitHub. Alterações publicadas geram commits e o deploy automático da Vercel, quando a conexão Git estiver ativa. A permissão para publicar depende do repositório e das regras de branch. Se `main` exigir pull request ou revisão obrigatória, teste o workflow do CMS com essas regras antes de liberar acesso da equipe.

O CMS não garante revisão de saúde ou direitos de imagem automaticamente. A equipe precisa estabelecer quem aprova cada tipo de conteúdo. Verifique as alterações em preview antes de publicar. Não publicar anexos internos, notas do manifesto, dados de pacientes ou materiais sem direito de uso.

Os campos de aprovação editorial são controles de publicação, não um sistema de permissão independente: quem tem escrita no repositório pode alterar o JSON e os campos. Para exigir revisão por outra pessoa, aplique regras de branch e pull requests no GitHub e valide sua compatibilidade com o fluxo do CMS. Não guarde cópias de documentos de consentimento, dados de pacientes ou contatos privados em galerias, parceiros, autores, uploads ou outros arquivos versionados públicos.

## Formulário de contato opcional

O WhatsApp fornecido no briefing é o caminho de contato disponível enquanto a associação não configurar um receptor. `POST /api/contact` só confirma recebimento após uma resposta HTTP 2xx do webhook configurado. Sem `CONTACT_WEBHOOK_URL` válida retorna **503**; erros de entrega retornam **502**. O endpoint não simula uma mensagem enviada.

Para ativar:

1. A associação escolhe um receptor HTTPS aprovado e verifica sua finalidade, controle de acesso, retenção, destino de dados e contrato quando aplicável. Não usar um endpoint público de teste para receber contatos reais.
2. Configure `CONTACT_WEBHOOK_URL` e, se exigido, `CONTACT_WEBHOOK_TOKEN` no gerenciador seguro da Vercel. A URL não pode conter usuário e senha. Segredos não devem ser prefixados com `PUBLIC_` nem inseridos no conteúdo ou no painel.
3. Configure `SITE_URL` com a origem exata. O backend aceita apenas origens explicitamente configuradas em `SITE_URL` ou `CMS_ORIGIN`; ele não usa cabeçalhos forwarded para decidir uma origem autorizada.
4. Faça deploy e envie uma mensagem de teste sem dados pessoais reais. Confira o recebimento no destino. Um 2xx significa aceitação pelo receptor, não que uma pessoa leu a mensagem nem que um e-mail chegou à caixa postal. Ajuste e teste essa operação com a equipe.
5. Habilite limitação de requisições distribuída no provedor, por exemplo regras da Vercel Firewall/WAF compatíveis com o plano. O limitador adicional em memória da função é por instância e não substitui essa proteção. Reavalie CAPTCHA se houver abuso; não há CAPTCHA ou rastreador de terceiro embutido por padrão.
6. Só depois defina `PUBLIC_CONTACT_FORM_ENABLED=true`, gere novo build e atualize a política de privacidade para o fluxo efetivo, canal do titular e retenção aprovada. Mantenha o contato alternativo por WhatsApp. A flag controla a interface pública; o endpoint continua validando sua própria configuração no servidor e não confirma recebimento quando não houver receptor.

Contrato de envio: JSON com `name`, `email`, `city` opcional, `subject` (`geral`, `cultura`, `associacao` ou `apoio`), `message`, `website` vazio (honeypot) e `consent: true`. O corpo tem limite de 8 KiB; mensagem de até 2.000 caracteres. Campos são validados no servidor. Falhas usam `error`; sucesso usa `message`. Uma interface não deve mostrar sucesso antes de receber a resposta real.

O texto junto ao formulário deve pedir explicitamente que **não sejam enviados diagnósticos, laudos, receitas, documentos pessoais ou outros dados de saúde**. Mensagem livre ainda pode receber dados indevidos; quem opera o canal precisa de procedimento restrito para isso. Nenhum payload é registrado pela aplicação nos logs, mas é necessário verificar também os logs e a retenção do provedor escolhido.

O endpoint não guarda contatos em arquivo, banco ou repositório. Ele encaminha somente os campos necessários ao receptor configurado. Não há analytics/pixels embutidos no fluxo. O receptor é responsável por aceitar a mensagem com semântica correta; uma integração incorreta que retorne 2xx sem guardar/encaminhar não constitui um teste de recebimento bem-sucedido.

## Exportação, backup e reversão

Faça backup do repositório, incluindo `src/content` e `public/uploads`. Segredos ficam no gerenciador do provedor e não no pacote exportável; restaure-os por meio seguro. O arquivo estático gerado pelo build não contém o painel autenticado em funcionamento nem as funções portadas automaticamente para qualquer host.

Para reverter uma publicação, reverta o commit de conteúdo e gere novo deploy, ou restaure uma versão anterior verificada na Vercel. Teste o procedimento com conteúdo não sensível antes do lançamento. Não importe documentos internos nem dados clínicos para experimentar o painel.

## Limitações reais antes da configuração externa

Código e conteúdo podem ser preparados, construídos e testados localmente. Login editorial em produção depende da revisão explícita da auditoria upstream, de `PUBLIC_CMS_ENABLED=true`, das credenciais OAuth e do acesso GitHub; deploy automático depende da conexão do projeto Vercel; contato depende do receptor configurado e validado. A presença desses arquivos não comprova que essas contas e integrações externas já estejam conectadas.

`PUBLIC_INDEXABLE=false` deve permanecer no ambiente de teste. Ative a indexação somente para o domínio de produção no lançamento aprovado e confira robots, meta robots, canonicals e sitemap no build final. As flags `PUBLIC_` não são segredos: são opções públicas do build; nunca use esse prefixo para credenciais.

## Validação desta entrega

Foi testada edição real pelo navegador Chromium, com site local na porta 4321 e proxy Decap na porta 8081: abrir `/admin/`, entrar pelo login local, escolher **Configurações e início → Página inicial**, alterar temporariamente apenas o título principal e clicar em **Publish**. A interface exibiu **Entry saved / Changes saved / Published**, e o arquivo `src/content/home.json` recebeu efetivamente o título de teste. As requisições de escrita ao proxy local retornaram HTTP 200.

Ao terminar, o arquivo original foi restaurado byte a byte em um bloco `finally`. O navegador bloqueou requisições fora de localhost/127.0.0.1 durante esse teste; não houve publicação GitHub, commit remoto ou uso de credenciais externas. Essa evidência verifica o caminho de edição e salvamento local, não a autenticação OAuth em produção nem o deploy automático na Vercel. As funções de contato e OAuth têm testes de servidor com respostas simuladas, sem alegação de entrega real a provedores externos.
