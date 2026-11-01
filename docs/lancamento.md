# Migração e lançamento

O código desta entrega é independente do site em produção. Nenhuma mudança de DNS, domínio, Área do Associado ou sistema de e-mail foi realizada.

## Preparação

1. Revisar os textos com a equipe, os canais e o fluxo de associação/acolhimento. Rever informações clínicas antes de ampliar o conteúdo de saúde; não atribuir revisão que não ocorreu.
2. Inserir os logos originais em configurações e revisar o layout nas duas larguras. Confirmar foto, crédito, contexto, consentimentos e direitos de cada mídia. Manter arquivos privados fora do repositório e de `public/`.
3. Cadastrar eventos reais e condições específicas. Uma data passada não comprova realização. Sem programação confirmada, manter os estados vazios informativos.
4. Validar chave Pix, titular e instituição antes de preencher. O site só exibe o bloco de Pix quando os três dados estão presentes; nenhuma informação foi presumida do CNPJ. QR Code bancário está pendente de chave oficial e validação; não há QR demonstrativo em produção.
5. Fazer backup verificável do site antigo, banco, arquivos e configurações antes da troca. Confirmar acesso ao domínio, e-mail e subdomínio de associados.

## URLs e SEO

A rede bloqueou a inspeção do site atual. Portanto, não existe inventário de URLs antigas nem lista real de 301 já aplicada. Obter sitemap, rastrear links existentes e consultar Search Console/Analytics se disponíveis. Classificar cada URL como manter/atualizar/substituir/consolidar/remover; registrar origem e destino equivalente. Evitar redirecionar tudo para a home.

O site gera sitemap e robots e inclui metadados/canonicals. Para um primeiro deploy Vercel de teste, manter indexação desligada. No lançamento aprovado, confirmar `SITE_URL`, domínio canônico nas configurações, HTTPS e `PUBLIC_INDEXABLE=true` apenas em produção. Previews da Vercel permanecem noindex mesmo com a opção de produção ligada; confirmar o resultado publicado.

Preservar conteúdo educativo válido depois de revisão. Não alterar a Área do Associado nem suas rotas por consequência da troca do site público. A comprovação do funcionamento integrado exige testes no sistema real.

## Operação

- Produção deve usar o build padrão, com `/admin/` excluído. O pacote editorial possui alertas upstream documentados; resolver/revisar antes de habilitar painel online. Edição local e Git podem manter o fluxo enquanto isso.
- Formulário depende de receptor aprovado e recebimento confirmado. O WhatsApp é o contato disponível até a integração. Sem simulação de mensagens recebidas.
- Não adicionar analytics, pixels ou embeds antes de rever privacidade, preferências, base legal e dados transmitidos. Não enviar conteúdo de saúde a publicidade ou métricas.
- Confirmar conta/plano Vercel adequado à associação. A configuração está incluída; conexão real e testes de deploy exigem a conta e autorização GitHub.
- Manter backups do repositório e mídia, segredos em gerenciador seguro, permissões individuais e rotina de atualizações. Backup de código não substitui backup de dados externos recebidos por outros sistemas.

## Verificar antes da troca

Testar domínio de teste, links internos/externos, associação, contato real quando habilitado, busca, filtros e eventos, teclado, foco, textos ampliados, celular, imagens e cartão de compartilhamento. Conferir HTTP 404, redirecionamentos necessários, robots, canonicals, sitemap e ausência de documentos internos em arquivos públicos.

Não foram medidos Lighthouse nem INP/LCP/CLS em produção nesta entrega. As metas do briefing continuam objetivos, não resultados comprovados. O teste automatizado de acessibilidade não substitui revisão humana e com tecnologias assistivas.

Apresentar a versão final e pendências para aprovação antes de alterar o site público. Preparar reversão: restaurar backup anterior ou reverter o deploy e confirmar que domínio, e-mail e acesso dos associados permanecem operacionais.
