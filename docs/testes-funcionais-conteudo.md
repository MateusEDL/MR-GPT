# Validação funcional com conteúdo isolado

Executada em 7 de novembro de 2026, de 02:18:31 a 02:18:41 UTC. Resultado: **26 verificações aprovadas**, sendo 13 em desktop e 13 em celular. Nenhuma falha funcional ou erro JavaScript não tratado foi encontrado nesses fluxos.

## Isolamento e método

O projeto foi copiado para `/workspace/scratch/people-tv-fixture-site`, incluindo `src`, `public`, `scripts`, `package.json`, lockfile e configurações. A pasta `node_modules` foi vinculada à instalação existente; nenhuma dependência foi instalada ou atualizada. `.git`, o build principal e arquivos de credenciais não foram copiados.

Somente nessa cópia foram acrescentados registros claramente sintéticos:

- Dois profissionais publicados: um de saúde, com credencial de teste marcada como verificada; um de cultura, com uma credencial de teste não verificada.
- Um profissional em rascunho.
- Um programa publicado relacionado ao profissional de cultura e um programa em rascunho.
- Três episódios publicados: URL de YouTube com identificador sintético de 11 caracteres, URL externa e domínio que imita YouTube; mais um episódio em rascunho.

Os JSON foram submetidos ao validador real do projeto. `ASTRO_TELEMETRY_DISABLED=1 npm run check` passou com **0 erros, 0 avisos e 0 sugestões em 42 arquivos**; o validador aceitou **19 registros**. `ASTRO_TELEMETRY_DISABLED=1 npm run build` gerou **25 páginas** exclusivamente em `scratch/people-tv-fixture-site/dist/`.

O servidor temporário foi iniciado com `node scripts/astro.mjs preview --host 127.0.0.1 --port 4322`. Um script local de Playwright, `verify-fixture.mjs`, utilizou `/usr/bin/chromium` em duas configurações: desktop 1440 × 1000 e celular 390 × 844. Todos os pedidos a destinos diferentes de `http://127.0.0.1:4322` foram interceptados e respondidos localmente por `route.fulfill`; nenhum foi encaminhado ao provedor. Service workers foram bloqueados no contexto do teste.

## Resultados

Os mesmos resultados foram obtidos nas duas configurações:

| Fluxo | Resultado observado |
| --- | --- |
| Lista geral de profissionais | Somente os dois perfis publicados aparecem. A credencial verificada aparece; a credencial não verificada e o rascunho não aparecem. |
| Filtros de área | Saúde e MR Cultural exibem um perfil cada; Todas as áreas restaura os dois. Contagem e `aria-pressed` são atualizados. |
| Lista cultural | Contém somente o profissional marcado com a área cultura; oferece caminho para todas as áreas. |
| Perfil cultural | A lista abre `/profissionais/teste-cultura/`, com canonical correspondente; a credencial não verificada continua ausente no HTML. |
| Perfil de saúde | Canonical correto; credencial verificada e iniciais presentes; nenhuma foto é inventada. |
| Perfil em rascunho | A URL direta retorna HTTP 404. |
| Programa e apresentação | A listagem abre o detalhe canônico `/tv/programas/programa-teste/`; a apresentação aponta para o perfil publicado relacionado. |
| Vídeo antes da autorização | Zero iframes e zero tentativas de requisição externa, incluindo YouTube. |
| URLs fora da lista de incorporação | A URL externa e o domínio que imita YouTube geram somente links; não geram iframe ou botão de carregamento. |
| Transcrição | Abre e fecha com Enter após foco no elemento `summary`; o texto fica visível quando aberta. |
| Vídeo após clique explícito | Um iframe com título correto e `src="https://www.youtube-nocookie.com/embed/abcdefghijk?rel=0"`. A única tentativa de requisição externa foi interceptada e respondida localmente. |
| Rascunhos de programa e episódio | O programa em rascunho retorna HTTP 404; o episódio em rascunho não aparece no detalhe. |
| Página TV | Exibe somente o programa e os episódios publicados. Após navegar para essa página, o vídeo volta a exigir clique, sem novas conexões automáticas. |

O relatório estruturado ficou em `/workspace/scratch/people-tv-fixture-site/fixture-results.json`; nenhuma captura de tela com dados sintéticos foi criada. O teste verifica o comportamento da interface e o controle de carregamento. A reprodução real do vídeo e a disponibilidade dos serviços externos não foram testadas.

## Encerramento

O servidor temporário criado pelo teste (PID 203217) foi encerrado por `node scripts/astro.mjs preview stop`. Em seguida, `node scripts/astro.mjs preview status` confirmou: `No preview server is running.`

As coleções reais `src/content/professionals`, `src/content/programs` e `src/content/episodes` permaneceram sem arquivos JSON. Nenhum registro sintético foi inserido no site, no build principal ou no pacote exportável.
