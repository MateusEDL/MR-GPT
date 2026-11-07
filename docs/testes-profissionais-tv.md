# Testes das áreas de profissionais e TV

Os cenários em `tests/people-tv.spec.ts` cobrem as novas páginas públicas em Chromium desktop (1440 × 1000 px) e celular (390 × 844 px): `/profissionais/`, `/mr-cultural/profissionais/`, `/tv/`, `/tv/programas/` e os sete detalhes dos perfis e programas. Também verificam os destaques da home e da página MR Cultural.

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
- Acesso à equipe da associação pela página MR Cultural e acesso ao diretório geral pela lista. A paleta cultural não atribui atuação artística aos profissionais de saúde.
- Os quatro perfis informados pelo usuário: Dr. Alireza Dargahi, Dr. Leonardo Coelho, Wellington Medina e Thaís Simões. Conferência dos nomes, áreas e funções, iniciais, aviso “Foto em breve”, ausência de retratos e de registros profissionais não fornecidos.
- CTA “Consultar disponibilidade” apontando para o WhatsApp da associação. Presença dos quatro profissionais na home, em MR Cultural e nas duas listas; navegação para os quatro detalhes e retorno ao diretório.
- Os três espaços autorizados: “Participações na TV”, “Entrevistas e reportagens” e “Maria do Reino Talks”, na home, na TV e no catálogo. Todos são apresentados como “Conteúdo em preparação”, com links para conhecer o espaço, sem botão de reprodução ou promessa de vídeo disponível.
- Navegação para os três detalhes dos programas e contato com a associação. Ausência de episódios, players, iframes e pedidos a provedores de vídeo durante esses fluxos.
- Carregamento de imagens e ausência de rolagem horizontal também nos sete detalhes e nos destaques da home e MR Cultural.
- Axe nas quatro páginas, com regras WCAG 2 A/AA e 2.1 A/AA. O teste percorre a página e aguarda as transições antes da análise, sem modificar CSS nem forçar classes de visibilidade.

São 30 execuções: 15 cenários em cada tamanho. O relatório navegável fica em `playwright-report/index.html`. Falhas preservam screenshot e trace; as análises Axe completas são anexadas ao relatório.

## Conteúdo e limites

O site de referência informado pelo usuário não pôde ser lido no ambiente: o proxy respondeu HTTP 403. Posteriormente, o usuário forneceu um screenshot que autorizou os quatro nomes, funções, resumos e os três títulos de programas. Os testes conferem esse conjunto fornecido e não transformam a captura em confirmação de credenciais, disponibilidade de atendimento ou existência de episódios.

Fotos, números de registro, horários, relações de apresentação e URLs de vídeos não foram fornecidos. Os testes preservam as fotos pendentes, a consulta de disponibilidade e os programas em preparação. Não exercitam reprodução de vídeo, pois não há episódio autorizado. A ausência de pedidos a provedores sem episódios não comprova o carregamento voluntário de um vídeo real; esse comportamento requer material autorizado ou uma fixture isolada do conteúdo público. Nenhum registro de demonstração é gravado em `src/content` para os testes.

As verificações de layout e Axe não certificam acessibilidade integral nem confirmam nomes, formação ou habilitação profissional, direitos de imagem, programação efetiva ou funcionamento em produção. A leitura editorial da referência permanece pendente da liberação de acesso.

## Resultado atual

Em 7 de novembro de 2026, a suíte completa contra o build com editor e os novos registros identificou **96 cenários: 93 aprovados, 1 pulado e 2 falhas**, em **1,6 minuto**. As duas falhas eram o mesmo cenário de detalhes dos programas, em desktop e celular: o teste ainda procurava o rótulo antigo “Conhecer outros programas”, enquanto a interface correta já usava “Conhecer outros espaços”. O link preservava o destino `/tv/programas/`.

Foi ajustada apenas essa asserção do teste, mantendo a conferência do destino. A repetição dirigida do cenário nos dois projetos passou: **2 aprovados em 3,8 segundos**. Considerando a execução completa e essa repetição, **todos os 95 cenários aplicáveis foram aprovados**, incluindo os 30 desta seleção. O único cenário pulado foi o menu de celular no projeto desktop; ele passou no projeto móvel. Não houve alteração de fonte ou novo build entre as execuções.

As 14 análises Axe da suíte completa não encontraram violações nas regras selecionadas, incluindo as oito análises das quatro novas rotas. Os quatro perfis, três programas, destaques, disponibilidade, fotos pendentes, sete detalhes e ausência de players e pedidos a provedores de vídeo foram validados nos dois tamanhos. O relatório HTML padrão pode refletir apenas a repetição dirigida mais recente; ele não deve ser descrito como uma nova execução completa de 96 cenários.

As capturas de profissionais e TV em desktop e celular, a home completa e a primeira dobra foram atualizadas em `docs/previews/`. Os recortes `home-profissionais-mobile.png` e `home-midia-mobile.png` mostram as duas seções atuais com largura de 390 px. Para evitar que um recorte maior que a viewport expusesse a posição negativa do link fixo de pular conteúdo, cada seção foi capturada inteiramente visível em uma viewport alta (4200 e 2400 px, respectivamente), com `BODY` ativo e o link sem foco, em `top: -100px`. Não houve alteração de CSS, classes de visibilidade ou conteúdo para as capturas. A revisão visual dos recortes finais não encontrou textos ou botões sobrepostos.

## Verificação anterior, antes do screenshot

Em 7 de novembro de 2026, a seleção inicial de 24 cenários passou em 25,6 segundos. Depois dos ajustes de ícones e legenda, a suíte completa anterior identificou 90 cenários: 89 aprovados, 1 pulado e nenhuma falha, em 1,2 minuto. O único cenário pulado foi o menu de celular no desktop; ele passou no projeto móvel. As oito análises Axe das novas áreas passaram naquele estado sem acervo.

Na versão anterior, a revisão visual confirmou setas SVG e legenda legível. Uma medição pontual do cabeçalho em 1080 e 1200 px não encontrou rolagem horizontal nem sobreposição. Essas evidências não comprovam publicação em produção.
