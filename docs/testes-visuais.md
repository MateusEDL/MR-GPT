# Testes de interface e acessibilidade

## Executar

```sh
npm ci
npm run build:editor
npm run test:e2e
```

O Playwright inicia `npm run preview -- --port 4321` se não existir um servidor nessa porta. O preview usa o último diretório `dist/` gerado; sempre reconstruir após alterações. São executados dois projetos Chromium: desktop 1440 × 1000 px e celular 390 × 844 px.

Esta suíte inclui o smoke test do painel e, por isso, usa o build local com editor (`npm run build:editor`). O build público padrão (`npm run build`) remove `dist/admin`; nele o painel não é distribuído e `/admin/` deve retornar 404. O editor é uma opção de desenvolvimento local, não uma indicação de que seu bundle está autorizado para produção.

Por padrão, usa o navegador em `/usr/bin/chromium`. Em outra máquina, indicar um executável compatível:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/caminho/do/chromium npm run test:e2e
```

Para examinar o painel usando o backend local, iniciar `npm run cms` em outro terminal. O smoke test de `/admin/` não faz login externo, não altera arquivos e não comprova publicação de conteúdo no GitHub ou autenticação na Vercel.

## Cobertura

- Resposta HTTP, idioma pt-BR, título principal único, descrição, ausência de imagens quebradas e rolagem horizontal em 17 rotas públicas, nas duas larguras.
- Legendas das duas imagens de IA, endereço preservado da Área do Associado e screenshot da home completa em cada largura.
- Abertura e fechamento do menu móvel, Escape, retorno do foco e navegação.
- Acordeão nativo de perguntas frequentes usando teclado.
- Busca local com termos sem acentos, resultados culturais, mensagem de ausência e limpeza.
- Estados vazios de notícias, agenda e galeria, adequados ao acervo inicialmente não validado.
- Fallback para WhatsApp enquanto `PUBLIC_CONTACT_FORM_ENABLED` não estiver habilitado no build; ausência de confirmação falsa de envio.
- Ausência de textos de demonstração e de termos de governança/documentos internos no conteúdo principal.
- Axe nas páginas início, quem somos e contato, com regras WCAG 2 A/AA e 2.1 A/AA.
- Carregamento do painel e de sua configuração, uso de bundle local e `noindex`.

## Evidências e limites

Relatório navegável: `playwright-report/index.html`. Screenshots completos da home: `test-results/**/home-full.png`. Falhas preservam screenshot e trace no diretório de resultados; resultados Axe completos ficam anexos ao relatório.

As verificações de estados vazios e formulário desabilitado correspondem ao lançamento inicial sem acervo aprovado e sem provedor de recebimento configurado. Atualizar esses cenários quando essas condições mudarem; não remover as verificações de entrega real, privacidade ou conteúdo autorizado.

Esta suíte automatizada não certifica conformidade integral com WCAG 2.2 AA. Revisão humana de textos, contraste contextual, leitura com tecnologia assistiva, navegação completa, consentimentos, direitos de imagem e operação das integrações continua necessária. Não mede INP de campo nem substitui métricas reais de uso. O painel local não comprova o OAuth de produção; os handlers de API têm testes próprios em `tests/*.test.ts`.

## Resultado verificado desta entrega

Execução completa em 1 de novembro de 2026, contra o build local **com painel de edição incluído**, servido em `127.0.0.1:4321`, com proxy do CMS local em `8081`:

- **54 cenários identificados: 53 passaram, 1 não aplicável foi pulado e nenhum falhou.**
- O cenário pulado é o menu expansível de celular no projeto desktop; ele foi executado e passou no projeto móvel.
- As 34 verificações de rota passaram nos dois tamanhos, sem imagens quebradas, exceções de JavaScript ou rolagem horizontal.
- As seis execuções Axe (três páginas × dois tamanhos) terminaram sem violações nas regras selecionadas.
- Menu móvel, FAQ por teclado, busca com acentos normalizados, estados vazios, fallback WhatsApp, legendas de IA, link dos associados e carregamento do painel passaram.
- Tempo reportado pelo runner: 27,8 segundos. Resultado de saída: `0`.

Capturas persistidas para revisão: `docs/previews/inicio-desktop.png` (1440 × 4853 px) e `docs/previews/inicio-mobile.png` (390 × 6681 px). São capturas da implementação local; não comprovam publicação ou funcionamento do OAuth na Vercel. O teste do painel carregou o bundle e a configuração sem erros de execução; não publicou conteúdo nem fez login externo.

Os resultados acima correspondem à configuração inicial sem formulário habilitado e sem registros de eventos/notícias publicados. Não equivalem a validação de e-mail transacional, credenciais OAuth, hospedagem real, Core Web Vitals de campo ou certificação completa de acessibilidade.
