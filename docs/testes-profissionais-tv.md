# Testes das áreas de profissionais e TV

Os cenários em `tests/people-tv.spec.ts` cobrem as novas páginas públicas em Chromium desktop (1440 × 1000 px) e celular (390 × 844 px): `/profissionais/`, `/mr-cultural/profissionais/`, `/tv/` e `/tv/programas/`.

## Executar

```sh
npm ci
npm run check
npm run build
npm run test:e2e -- tests/people-tv.spec.ts
```

O Playwright utiliza `/usr/bin/chromium` por padrão e inicia o preview na porta 4321 se ela estiver disponível. Um preview existente deve servir o `dist/` do build atual. Não executar os testes durante outro build: a substituição do diretório pode causar respostas 404 transitórias.

Essa seleção não depende do painel editorial e pode utilizar o build público padrão. Para executar também o cenário do painel da suíte completa, gerar primeiro `npm run build:editor`, conforme `docs/testes-visuais.md`.

## Cobertura

- Resposta HTTP 200, idioma pt-BR, título principal único e visível, descrição e ausência de exceções JavaScript nas quatro rotas.
- Imagens carregadas, incluindo logos abaixo da dobra, e ausência de rolagem horizontal nas duas larguras.
- Acesso pelas entradas “Profissionais” e “TV e programas” da navegação principal. No celular, abertura do menu, navegação e fechamento após seguir o link.
- Acesso aos profissionais culturais pela página MR Cultural e acesso ao diretório geral pela lista cultural.
- Estados vazios de profissionais, com um caminho de contato, sem cartões ou registros profissionais fictícios.
- Estados vazios de programas e episódios e navegação da TV para o catálogo. Nenhum player ou pedido a provedores de vídeo durante essa navegação inicial sem acervo.
- Axe nas quatro páginas, com regras WCAG 2 A/AA e 2.1 A/AA. O teste percorre a página e aguarda as transições antes da análise, sem modificar CSS nem forçar classes de visibilidade.

São 24 execuções: 12 cenários em cada tamanho. O relatório navegável fica em `playwright-report/index.html`. Falhas preservam screenshot e trace; as análises Axe completas são anexadas ao relatório.

## Conteúdo e limites

O site de referência informado pelo usuário não pôde ser lido no ambiente: o proxy respondeu HTTP 403. As coleções começam vazias, sem perfis, credenciais, vínculos, programas, episódios ou horários inventados. Os cenários de ausência de acervo correspondem a essa condição inicial. Quando o conteúdo real for confirmado e publicado, devem passar a verificar os registros aprovados e as relações entre as áreas, preservando a checagem de exclusão dos rascunhos.

Sem registros publicados, esta seleção não exercita páginas individuais de profissionais ou programas, filtros com resultados, relacionamentos entre apresentadores e programas, nem reprodução de vídeo. A ausência de pedidos a provedores na TV vazia não comprova o carregamento voluntário de um vídeo real; esse comportamento requer um cenário próprio com material autorizado ou uma fixture isolada do conteúdo público. Nenhum registro de demonstração é gravado em `src/content` para os testes.

As verificações de layout e Axe não certificam acessibilidade integral nem confirmam nomes, formação ou habilitação profissional, direitos de imagem, programação efetiva ou funcionamento em produção. A leitura editorial da referência permanece pendente da liberação de acesso.

## Resultado

Em 7 de novembro de 2026, a seleção inicial de **24 cenários passou**, sem falhas ou cenários pulados, em **25,6 segundos**, usando o build público consolidado servido pelo preview local em `127.0.0.1:4321`.

As oito verificações de rota passaram sem imagens quebradas, exceções JavaScript ou rolagem horizontal. Navegação principal, ligação dos profissionais culturais, estados vazios e ausência de pedidos a provedores de vídeo passaram nos dois tamanhos. As oito análises Axe não encontraram violações nas regras selecionadas.

Capturas completas para revisão visual: `docs/previews/profissionais-desktop.png`, `docs/previews/tv-desktop.png` e `docs/previews/tv-mobile.png`. Representam a implementação local e o estado inicial sem acervo confirmado; não comprovam publicação em produção.

Na primeira tentativa, o comando de preview do Astro iniciou o servidor em segundo plano e encerrou o processo observado pelo Playwright. Nenhum cenário chegou a rodar nessa tentativa. Após confirmar HTTP 200 no preview ativo, a segunda execução concluiu os 24 testes. Isso não exigiu alteração de fonte nem novo build.

Após substituir as setas de texto por ícones SVG e ajustar o fundo da legenda da imagem da TV, a **suíte completa foi executada uma vez contra o build final com editor incluído: 90 cenários, 89 aprovados, 1 pulado e nenhuma falha**, com tempo reportado de **1,2 minuto**. Os 24 cenários desta seleção voltaram a passar nessa execução, assim como as oito análises Axe das novas páginas. O único cenário pulado é o menu de celular no projeto desktop; ele passou no projeto móvel.

As três capturas foram substituídas pelo estado final e revisadas visualmente: as setas SVG aparecem corretamente e a legenda da TV móvel permanece legível sobre um fundo claro. Uma medição adicional do cabeçalho em 1080 e 1200 px confirmou largura do documento igual à viewport e ausência de sobreposição entre marca, navegação, ações e links adjacentes. Essa medição foi pontual, sem acrescentar outro teste permanente à suíte.
