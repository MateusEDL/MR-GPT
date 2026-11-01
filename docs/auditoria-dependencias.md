# Auditoria das dependências — estado desta entrega

Revisão local em 1 de novembro de 2026. Foram lidos o `package-lock.json`, o resultado de `npm audit --json`, a configuração do painel e os artefatos instalados. Esta análise não realizou exploração, navegação externa, atualização de pacotes ou reconstrução personalizada do Decap.

## Resultado observado

- `npm audit --omit=dev`: **zero alertas** no resultado fornecido para as dependências de produção do projeto Astro.
- `npm audit` completo: **38 pacotes sinalizados** — 11 altos, 26 moderados e 1 baixo; nenhum crítico.
- Esses 38 registros incluem propagação pela árvore de dependências. O JSON contém **8 avisos de origem em 7 dependências**, não 38 vulnerabilidades independentes.

O Decap é uma dependência de desenvolvimento no manifesto, mas seu bundle é copiado para a área `/admin/` e enviado ao navegador do editor. Portanto, omitir dependências de desenvolvimento na auditoria **não** basta para declarar o painel livre de vulnerabilidades. O site público não carrega esse bundle nas páginas institucionais.

## Componentes efetivamente instalados

| Componente | Versão | Uso neste projeto |
| --- | --- | --- |
| decap-cms | 3.17.3 | Bundle oficial pré-compilado do painel |
| decap-cms-app | 3.17.3 | Dependência do pacote completo do CMS |
| decap-cms-core | 3.20.2 | Núcleo editorial do Decap |
| decap-server | 3.11.6 | Proxy de edição exclusivamente local |
| @decap/cli | 0.1.3 | Dependência do proxy local |

O arquivo `public/admin/config.yml` não utiliza widgets `markdown`, `richtext` ou `code`. Os textos são campos simples; há também listas, relações, arquivos de imagem, datas e campos de configuração. Essa escolha reduz o uso de parsers ricos, mas não remove os módulos do bundle oficial nem demonstra que todos os caminhos afetados sejam inalcançáveis.

## Avisos de origem e alcance identificado

| Dependência instalada | Aviso e nível | Alcance e limite da evidência |
| --- | --- | --- |
| @hapi/joi 17.1.1 | GHSA-6w3j-5fw6-r9vr: prototype pollution por chave de idioma em mensagens personalizadas; baixo | O proxy local usa Joi para validar ações e caminhos. A inspeção do `dev.cjs` não encontrou configuração de mensagens personalizadas correspondente ao gatilho descrito. Isso não equivale a auditar toda a biblioteca. |
| @hapi/joi 17.1.1 | GHSA-4528-x5fx-h6hg: DoS em `string().email({ multiple: true })`; alto | O schema do proxy inspecionado usa strings, objetos, listas e validação do corpo; não foi encontrada chamada `email()`. O endpoint próprio `/api/contact` não importa Joi. Não foi demonstrado um caminho desse gatilho na operação local utilizada. |
| @platejs/core 49.2.21 | GHSA-qrfj-mgw8-j9c6: desserialização de HTML pode desencadear comportamento no navegador; moderado | Chega pela família de edição richtext do Decap. Esse widget não é usado no projeto. Não foi feita prova de ausência de chamadas indiretas no bundle. O impacto exige atenção porque o painel lida com sessão de edição. |
| deepmerge 4.3.1 | GHSA-gcqx-w48m-w2h4: contaminação de protótipo do objeto retornado; baixo | Presente no núcleo do CMS. Os dados de configuração e conteúdo devem vir de editores e repositório confiáveis; não há prova de que uma entrada arbitrária externa alcance um merge vulnerável. Também não há prova formal de não alcance. |
| minimatch 7.4.9 | GHSA-g3hv-75wg-m249: amplificação em globs pode causar DoS; moderado | Sinalizado na árvore do CMS. Não há campo público de globs neste site. A análise não rastreou todos os padrões e consumidores dentro do painel. |
| trim 0.0.1 | GHSA-w5p7-h5w8-2hfq: ReDoS; alto | Propaga pelos parsers de Markdown do CMS. Widgets Markdown não são usados; o núcleo também possui dependências de renderização relacionadas. Não afirmar correção apenas por não cadastrar um widget Markdown. |
| uuid 8.3.2 | GHSA-w5hq-g745-h8pq: ausência de verificação de limites em v3/v5/v6 com `buf`; moderado | A condição do aviso é específica à API com buffer. Não foi demonstrado esse padrão de chamada no fluxo editorial testado. Não se infere execução remota ou comprometimento do site público somente pela presença do pacote. |
| zod 3.25.76 sob @decap/cli | GHSA-mrhx-c7xc-m3w5: esgotamento de memória com coleções restritas excessivas; alto | A CLI completa depende de Zod. O artefato `dev.cjs` usado pelo proxy local não importa Zod. A presença na árvore não prova exposição desse aviso pelo servidor usado nesta entrega; outros comandos da CLI, inclusive recursos MCP, não foram habilitados nem auditados. |

Os identificadores acima foram extraídos do relatório local. Seus links de referência podem ser consultados em `https://github.com/advisories/IDENTIFICADOR`. A versão e o alcance de cada aviso devem ser rechecados antes de habilitar o painel em produção.

## Servidor de edição local

O proxy atual é um servidor que pode ler e escrever arquivos do checkout. A inspeção do pacote mostrou bind padrão em loopback, verificação de origem e validação de host. O parser JSON local aceita até 50 MB. Esses controles reduzem exposição de rede; não tornam seguro expor o proxy indiscriminadamente.

Usar `npm run cms` somente em máquina de desenvolvimento confiável, manter o bind local e encerrar o processo após a edição. Não usar `--host 0.0.0.0`, não abrir um túnel público e não publicar a porta 8081 como painel de produção. O servidor local não deve fazer parte das funções Vercel. O modo local não exige a autenticação GitHub usada no painel de produção.

## Remediação segura

1. **Não executar `npm audit fix --force` de forma automática.** O relatório sugere Decap 3.16.0 e decap-server 3.11.3 em alguns caminhos, marcando a mudança como incompatível. Não foi obtido nem inspecionado o bundle dessas versões. Um número menor de alertas na árvore de uma versão antiga não prova correção dos arquivos pré-compilados ou preservação dos controles recentes de host e origem.
2. Para o **painel**, buscar uma versão oficial do Decap que inclua dependências corrigidas e um bundle reconstruído, ou realizar uma reconstrução controlada do fonte oficial com correções compatíveis e revisão. Repetir login, edição, uploads, publicação e testes de segurança sobre os arquivos finais entregues.
3. Não declarar o bundle corrigido por adicionar `overrides` apenas ao `package-lock.json`. O bundle distribuído pelo pacote já foi compilado; modificar a árvore instalada não altera automaticamente o JavaScript enviado ao editor. Uma remediação desse tipo precisaria reconstruir o bundle, identificar a versão resultante e validar sua integridade e comportamento.
4. Enquanto isso, limitar o uso do painel ao ambiente local confiável e aos editores autorizados. Antes de habilitar OAuth em produção, resolver os avisos relevantes ou concluir e registrar uma análise de alcance suficientemente detalhada para aceitar os riscos. Não importar HTML, Markdown ou configurações de origem desconhecida para testar o CMS.
5. Se houver necessidade de publicar o site público antes da liberação do painel, entregar uma compilação que **não disponibilize `/admin/`** e manter a edição pelo checkout local até a resolução. Essa decisão exige uma mudança concreta no empacotamento; apenas deixar OAuth sem configuração não remove o JavaScript vulnerável da hospedagem.
6. Reexecutar auditoria e verificações após qualquer atualização. Os testes funcionais locais desta entrega não substituem correções de segurança nem provam não exploração dos avisos.

## Decisão desta revisão

**O painel ainda não recebe aprovação de segurança para operação em produção nesta revisão.** O resultado comprova funcionamento editorial local e separa os riscos do CMS daqueles da aplicação pública; não elimina os avisos do bundle nem valida o OAuth real de um projeto Vercel.

A auditoria sem dependências de desenvolvimento passou para a aplicação pública, mas isso não autoriza afirmar que o pacote inteiro está livre de vulnerabilidades. A mitigação ou atualização do painel deve constar como pendência real de lançamento, com nova verificação dos artefatos efetivamente publicados.

## Mitigação aplicada nesta entrega

O script `scripts/build.mjs` foi implementado para remover integralmente `dist/admin/` do build público padrão. A exclusão foi verificada no filesystem e por requisição HTTP: `/admin/` retornou 404, enquanto home, contato e MR Cultural retornaram 200. O pacote estático de exportação é gerado a partir desse build público.

O comando `npm run build:editor` preserva o painel exclusivamente para a validação local. A opção `PUBLIC_CMS_ENABLED=true` também existe, mas não deve ser habilitada na Vercel antes da remediação ou revisão de alcance descrita acima. As dependências do editor continuam presentes no pacote fonte para edição local; a mitigação não elimina os avisos do upstream.
