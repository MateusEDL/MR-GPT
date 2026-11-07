# Maria do Reino

Site institucional em português da Associação Maria do Reino, com destaque para o MR Cultural. Construído com Astro, HTML estático, fontes locais e conteúdo em JSON. O projeto não depende da Vercel para servir suas páginas.

A direção visual usa paisagens botânicas amplas, imagens com recortes orgânicos e transições curvas. O verde institucional alterna com vinho e laranja do MR Cultural. Um fundo decorativo reage ao ponteiro e ao toque, com pausa manual e respeito à preferência do sistema por movimento reduzido. Não há rastreamento dessa interação; apenas a escolha de pausar pode ser guardada neste navegador.

## Começar

Requisito: Node.js 24 e npm. Use o checkout existente; não é preciso criar outro worktree.

```sh
npm ci
npm run dev
```

O endereço de desenvolvimento é mostrado pelo Astro. Para editar pelo painel local, execute também `npm run cms` em outro terminal e abra `/admin/` no servidor de desenvolvimento. O proxy de edição fica vinculado somente à própria máquina. Não o exponha na internet.

O painel local foi testado com alteração real de um título, gravação de `home.json` e restauração do original. Não é necessário programar para editar os campos disponíveis.

## O que está incluído

- Home, associação, acolhimento, informação introdutória em saúde, MR Cultural, apoio, contato, FAQ, privacidade e cookies.
- Agenda geral e cultural com uma base única; projetos, galeria e notícias preparados para registros reais.
- Profissionais por áreas, com uma listagem cultural compartilhada e perfis individuais.
- TV, catálogo de programas, episódios e player externo apenas após escolha do visitante.
- Busca local, menu móvel, perguntas acessíveis por teclado, links oficiais e Área do Associado preservada.
- Conteúdo e configurações editáveis: páginas, home, contatos, logos, notícias, eventos, projetos, galerias, parceiros, autores/revisores, profissionais, programas e episódios.
- Metadados, cartão social PNG, sitemap e robots; indexação desativada inicialmente.
- APIs Vercel opcionais para autenticação editorial e contato. Não há confirmação falsa de envio.
- Imagens ilustrativas de IA identificadas. Não são registros de eventos ou da sede.

Não foram inventados eventos, depoimentos, profissionais, parceiros, números de impacto, dados Pix ou serviços em funcionamento. Estatuto, notas internas, documentos de pacientes e arquivos originais dos anexos não fazem parte deste repositório.

## Build e exportação

```sh
npm run check
npm test
npm run build
npm run export
```

`npm run build` gera `dist/` para hospedagem estática. Por segurança, o painel administrativo **é excluído do build público por padrão**. Leia a auditoria abaixo.

`npm run export` verifica e constrói o projeto, produzindo em `exports/`:

- `maria-do-reino-fonte.zip`: código, conteúdo, imagens, configuração e documentação, sem segredos nem node_modules.
- `maria-do-reino-estatico.zip`: somente os arquivos de `dist/` para hospedagem estática.
- `maria-do-reino-previa.html`: prévia interativa da home em um único arquivo, com imagens, fontes e scripts incorporados. Abra no navegador para revisar o movimento sem instalar dependências; a navegação completa pertence ao pacote do site.

Os arquivos ZIP podem ser extraídos por ferramentas comuns de arquivo. No pacote fonte, execute `npm ci` e `npm run build` para reconstruir. Em uma hospedagem estática genérica, APIs `/api/*` precisam de um runtime separado; os links de WhatsApp e o conteúdo público continuam independentes dessas funções.

## Conectar à Vercel

A conta Vercel e a autorização GitHub pertencem à associação. Nenhum login ou token pessoal foi solicitado em chat, e nenhum projeto Vercel foi criado por esta entrega.

1. Crie uma conta em https://vercel.com/signup e conecte o GitHub com acesso ao repositório `MateusEDL/MR-GPT`.
2. Em https://vercel.com/new, importe o repositório. Se o código ainda não estiver no GitHub, envie primeiro o conteúdo deste pacote ao repositório.
3. A configuração `vercel.json` define framework **Astro**, instalação **npm ci**, build **npm run build** e saída **dist**. Use Node.js **24.x**. A Vercel servirá os arquivos estáticos e as funções Node de `api/`.
4. Comece pelo endereço de teste fornecido pela Vercel. Mantenha `PUBLIC_INDEXABLE=false` e `PUBLIC_CMS_ENABLED=false`. Não altere o domínio existente nem o subdomínio `acesso.mariadoreino.com.br` nesta etapa.
5. Confira a versão publicada no endereço de teste. O deploy real e as funções precisam de verificação nesse ambiente; o build local não comprova a infraestrutura da Vercel.
6. Quando a conexão Git estiver ativa, alterações aprovadas e publicadas na branch `main` acionam novo deploy. Defina a produção para `main` e aplique as permissões de revisão adequadas à equipe.
7. Troque o domínio somente após aprovação final, backup e plano de migração. Revise os dados de `src/content/site.json`, o `SITE_URL`, os canonicals, o sitemap e os redirecionamentos reais antes de ativar `PUBLIC_INDEXABLE=true`.

Nenhum provedor ou plano pago é presumido; os termos e custos da hospedagem devem corresponder ao uso institucional da associação.

## Painel e segurança

A edição local está disponível por Decap CMS. A auditoria completa encontrou alertas em dependências do editor. Dependências usadas para preparar um bundle de navegador continuam relevantes mesmo quando classificadas como desenvolvimento.

O build público remove `/admin/` por padrão. **Não habilite `PUBLIC_CMS_ENABLED=true` em produção antes de resolver ou aprovar formalmente o alcance dos alertas**, atualizar/reconstruir o bundle quando necessário e revalidar o painel. Não aplicar downgrade ou override às cegas, porque isso não garante que o JavaScript pré-compilado esteja corrigido.

Para testar o painel apenas localmente:

```sh
npm run build:editor
npm run preview
# Em outro terminal:
npm run cms
```

Depois da revisão do pacote, o login online tem endpoints de OAuth preparados e requer configuração segura de `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` e `CMS_ORIGIN`. O escopo GitHub deve refletir o repositório; a OAuth App não tem a mesma granularidade de um GitHub App. Consulte [painel e integrações](docs/painel-e-integracoes.md) e [auditoria](docs/auditoria-dependencias.md).

## Contato e privacidade

O caminho público inicial é o WhatsApp fornecido no briefing. A associação deve confirmar os contatos antes do lançamento. Não há formulário público ativo sem receptor configurado. O endpoint retorna indisponibilidade real quando falta configuração.

O formulário só deve ser habilitado depois de configurar e testar um receptor HTTPS aprovado, revisar a retenção e a política de privacidade e estabelecer proteção contra abuso no provedor. Campos públicos não pedem documentos ou diagnósticos. Variáveis privadas nunca devem receber prefixo `PUBLIC_`.

Sem analytics, pixels, embeds sociais automáticos ou cookies publicitários. Links para serviços externos dependem das políticas dos destinos. Conteúdo público não substitui acompanhamento profissional.

## Validação

```sh
npm run check
npm test
npm run build:editor
npm run test:e2e
npm run build
```

Playwright usa `/usr/bin/chromium` neste ambiente; fora dele, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE` para seu Chromium compatível. Os testes incluem desktop, celular, busca, acessibilidade automatizada e painel local. Confira as contagens e os limites em [testes visuais](docs/testes-visuais.md). Não foi feita medição Lighthouse ou de Core Web Vitals em campo.

## Conteúdo e pendências

Os dois logos foram recebidos em `logos-mr.zip` e copiados sem alteração para `public/uploads/`. O institucional tem 1016 × 867 px e o MR Cultural, 150 × 150 px. Eles aparecem no cabeçalho, nas apresentações culturais e no rodapé, conforme cada identidade. O arquivo pequeno do MR Cultural é apresentado em tamanho controlado; ampliar seus pixels não recuperaria detalhes. Uma versão maior ou vetorial pode ser substituída pelos campos de logo no painel. Consulte `docs/logos-originais.md` para dimensões, origem e conferência dos arquivos.

Fotos e vídeos das redes não foram obtidos: a rede do ambiente bloqueou as requisições. Os domínios necessários foram salvos no rascunho do ambiente, cuja aplicação ainda está pendente. Não confundir as ilustrações de IA com esse acervo.

Ainda precisam de confirmação: contatos atuais, endereço e horários, serviços e condições de participação, programação, autorizações de mídia, profissionais revisores, parceiros, dados oficiais de doação, hospedagem, integração real e inventário de URLs antigas. Campos operacionais sem dados ficam ausentes da interface. Os espaços de fotos e mídia previstos nas capturas mantêm as indicações de preparação da referência. A área atual dos associados não foi alterada nem testada com autenticação.

Documentação:

- [Guia da equipe](docs/guia-editorial.md)
- [Painel e integrações](docs/painel-e-integracoes.md)
- [Auditoria de dependências](docs/auditoria-dependencias.md)
- [Inventário das ilustrações](docs/inventario-imagens.md)
- [Testes visuais](docs/testes-visuais.md)
- [Testes de profissionais e TV](docs/testes-profissionais-tv.md)
- [Validação com conteúdo isolado](docs/testes-funcionais-conteudo.md)
- [Validação de cadastros e vínculos](docs/testes-validacao-conteudo.md)
- [Migração e lançamento](docs/lancamento.md)

## Profissionais e mídia — conteúdo das capturas

As abas `/profissionais/`, `/mr-cultural/profissionais/`, `/tv/` e `/tv/programas/` foram preparadas com conteúdo editável. Profissionais, programas e episódios usam coleções próprias; somente registros com publicação ativada aparecem no site. Credenciais profissionais só são exibidas quando a conferência é marcada e não representam revisão automática de artigos. Os programas podem relacionar participantes já publicados; vídeos pertencem a um programa publicado.

O usuário forneceu duas capturas com os quatro profissionais (Alireza Dargahi, Leonardo Coelho, Wellington Medina e Thaís Simões) e três espaços de mídia (Participações na TV, Entrevistas e reportagens e Maria do Reino Talks). Esses registros agora aparecem na home e nas páginas próprias, com a identidade visual orgânica do projeto. O MR Cultural também apresenta os profissionais da associação, preservando sua atuação em saúde. As capturas indicam **Foto em breve** e **Conteúdo em preparação**; esses estados foram mantidos, sem fotos ou vídeos fabricados. A transcrição e seus limites estão em [referencia-profissionais-midia.md](docs/referencia-profissionais-midia.md). O endereço remoto continua sem leitura pelo ambiente; esta atualização se baseia nas imagens enviadas pelo usuário.

No painel, use Profissionais, Programas, Episódios e TV e programas. Envie as fotos à biblioteca local. YouTube e Vimeo são incorporados apenas após clique, com explicação da conexão e alternativa de assistir na origem. URLs que não forem desses provedores não viram iframe. Não há transmissão ao vivo ou programação presumida. O build valida links, áreas, publicação e relações entre registros antes de gerar as páginas.
