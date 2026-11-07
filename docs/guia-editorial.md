# Guia da equipe — Maria do Reino

O conteúdo do site é separado do desenho das páginas. A equipe edita os textos e os cadastros pelo painel; não precisa alterar arquivos de programação. Os arquivos de conteúdo continuam no repositório para permitir histórico, cópia de segurança e exportação.

## Acessar o painel

Abra `/admin/` no endereço do site. Na versão conectada ao GitHub, use uma conta individual autorizada a editar o repositório. A autenticação do painel precisa ser configurada conforme as instruções técnicas do projeto; o simples envio dos arquivos para uma hospedagem não cria esse acesso.

No desenvolvimento local, o painel pode usar o serviço local de edição. Esse serviço é apenas para a máquina de desenvolvimento e não deve ficar exposto na internet. Os comandos corretos estão no README do projeto.

Em produção, salvar pelo painel conectado ao GitHub grava alterações no repositório. A Vercel precisa estar conectada ao mesmo repositório e à branch escolhida para gerar uma nova versão. Confira o resultado do deploy e as páginas alteradas antes de considerar a atualização concluída.

Uma cópia dos arquivos estáticos exportados mostra o site sem precisar de um servidor de aplicação. Para continuar editando por painel e receber atualizações automáticas, mantenha também o projeto completo, o repositório e a autenticação do CMS configurados.

## Editar a apresentação da associação

Em **Dados da associação**, revise o nome, a descrição, a cidade, os perfis oficiais e os contatos. O WhatsApp usa número internacional sem espaços ou sinais: no cadastro atual, `5547999108994`. Os perfis e a Área do Associado usam URLs completas com `https://`.

Endereço, horários, e-mail e dados de doação ainda estão vazios porque precisam de confirmação. Não preencha um endereço de cadastro como se ele fosse necessariamente um local de atendimento. Não publique horários sem validar a operação atual.

O endereço da Área do Associado é `https://acesso.mariadoreino.com.br/`. Atualizar o site público não autoriza substituir esse sistema ou alterar seu acesso.

## Editar a home e outras páginas

A **Home** possui campos próprios para a abertura, os primeiros passos, o MR Cultural e o convite à participação. Os rótulos dos botões devem continuar claros e descrever o que acontece ao clicar.

Na home, **Imagem botânica de acolhimento** e **Paisagem botânica do manifesto** permitem trocar as imagens dessas duas seções. Os padrões são `/images/botanica-orvalho-ia.webp` e `/images/jardim-medicinal-ia.webp`, ilustrações geradas por IA e identificadas dessa forma na apresentação. Elas não representam instalações, cultivo ou atuação real da associação. Preencha a descrição acessível de cada imagem de acordo com seu conteúdo e preserve a identificação de IA quando a substituição também for gerada. Ao trocar o arquivo, confira enquadramento e nitidez no celular e no computador; um novo upload não cria automaticamente todas as variações responsivas dos arquivos originais preparados para o projeto.

Em **Páginas**, escolha o conteúdo desejado. Cada página tem título, descrição para busca, apresentação, seções e, quando apropriado, perguntas frequentes. Nos textos das seções, separe os parágrafos com uma linha em branco.

Preserve URLs já publicadas. Alterar o nome visível não exige trocar o endereço da página. Uma mudança de endereço precisa de revisão técnica e, quando pertinente, de redirecionamento individual para a página equivalente.

A afiliação gratuita não significa que todas as consultas ou atividades sejam gratuitas. Essa distinção deve permanecer nas páginas de associação e atendimento.

## Publicar uma notícia ou conteúdo

Crie um registro na coleção de notícias e preencha apenas informações confirmadas. Use título próprio, resumo, conteúdo útil, autoria autorizada e datas reais. Se o cadastro disponibilizar situação editorial, mantenha em rascunho até a revisão necessária.

Uma informação clínica exige cuidado adicional: fontes confiáveis, escopo claro e revisão por profissional habilitado quando aplicável. Não marque revisão, nome de revisor ou data de revisão antes de ela acontecer. Qualificação e identificação profissional precisam de conferência e autorização.

Não há notícias fictícias cadastradas nesta entrega. A coleção começa vazia até que a associação tenha material real aprovado. Não publique listas de doenças como promessa de resultado, doses, instruções de automedicação ou anúncios de produtos de cannabis.

## Cadastrar profissionais de saúde e cultura

Use a coleção **Profissionais (saúde e cultura)** para criar um único cadastro por pessoa. Preencha nome público, atuação, apresentação breve e áreas confirmadas. A área **Saúde** identifica a atuação de saúde; a área **MR Cultural** permite que o mesmo perfil apareça também na página cultural. Se a pessoa participa das duas áreas, selecione ambas em vez de duplicar o cadastro.

Biografia, foto, qualificação, perfil e contato são opcionais. Publique somente informações profissionais que a pessoa autorizou divulgar, com fonte e vínculo com a associação confirmados. Use links HTTPS reais. Não copie dados de contato privados, documentos pessoais, atestados, receitas, comprovantes ou autorizações para o cadastro ou a biblioteca pública. Guarde as verificações em controle privado apropriado.

A marcação **Credencial conferida** só pode ser ativada após verificar a qualificação ou o registro informado e sua divulgação. Não invente CRM, especialidade, título ou registro. Essa marcação permite apresentar a credencial conferida; não indica que a pessoa revisou artigos, aprova os conteúdos do site ou oferece uma consulta disponível. A revisão editorial de cada artigo continua sendo registrada separadamente em notícias.

Os perfis começam com **Publicar perfil** desativado. Ative apenas depois de confirmar a fonte, o vínculo, os textos e a autorização pública da pessoa. A existência de um cadastro no painel não comprova vínculo nem autorização.

## Organizar a TV, os programas e os episódios

Em **Configurações e início → TV e programas**, edite o título e a apresentação da TV. O link do canal é opcional e deve apontar para um canal oficial confirmado. Não deduza um canal pelo nome da associação.

Na coleção **Programas da TV**, crie um registro por programa real, com título, resumo, área e situação atual: ativo, arquivo ou em planejamento. Apresentação longa, imagem, periodicidade e participantes são opcionais. O campo de participantes seleciona pessoas já cadastradas em **Profissionais**; confirme a participação antes de associá-las. Não converta um vídeo isolado em série nem anuncie periodicidade sem uma fonte atual.

Na coleção **Episódios e vídeos da TV**, crie um registro por vídeo real e selecione o programa correspondente. Um programa pode ter vários episódios: mantenha o programa cadastrado uma única vez. Informe título, descrição e URL HTTPS do vídeo autorizado. Inclua data de publicação somente quando confirmada; não use a data de cadastro como substituição. Capa, descrição acessível e transcrição ajudam a apresentar o vídeo com contexto.

Programas e episódios começam com **Publicar** desativado. Revise as fontes, os vínculos, os direitos do vídeo e de sua trilha, a participação das pessoas e os links antes de ativar. Um episódio só deve ficar disponível quando seu programa também estiver publicado. Não use nomes de programas, horários, apresentadores ou URLs fictícios para preencher espaços.

Vídeos do YouTube e Vimeo só devem carregar o player após o visitante escolher assistir. Não carregue iframes, capas remotas ou rastreadores desses serviços antes desse clique; envie uma capa autorizada à biblioteca do próprio site, se houver. Outros links de vídeo precisam continuar claramente identificados como destinos externos. A transcrição deve corresponder ao vídeo e não substituir uma revisão clínica quando necessária.

O endereço de referência `https://maria-do-reino-cuidado.designdoreino-edl.chatgpt.site/` ainda não pôde ser lido por restrição de acesso da rede deste ambiente. Nenhum nome de profissional, programa ou episódio foi importado desse endereço. As novas coleções permanecem vazias até que seja possível consultar a fonte ou receber o material confirmado, verificar os vínculos e autorizar a publicação.

## Cadastrar um evento uma única vez

Use a coleção **Eventos** tanto para programação geral quanto cultural. Selecione a categoria cultural no mesmo cadastro; não crie uma cópia do evento para a outra agenda.

Antes de publicar, confira:

- Nome, descrição e situação real da atividade.
- Data, início e término; o fuso local é America/Sao_Paulo.
- Local confirmado e orientações de participação.
- Condições de inscrição e acessibilidade.
- Gratuidade ou eventual valor específico dessa atividade.
- Contato responsável e link correto, quando houver.
- Cancelamento, mudança de local ou reagendamento, se aplicável.

Eventos passados são registros de atividades realizadas. Não atualize sua data apenas para fazê-los parecer futuros. Se ainda não há uma data definida, apresente a ideia como projeto em planejamento, não como evento confirmado.

A agenda começa sem eventos cadastrados. Isso evita anunciar uma programação inventada ou reaproveitar uma publicação antiga como se fosse vigente.

## Organizar projetos e parceiros

Um projeto deve mostrar propósito, situação (ativo, encerrado ou em planejamento), descrição e vínculo com registros reais. As atividades mencionadas no briefing não representam, por si só, uma oferta semanal disponível.

Parceiros e coletivos só podem aparecer com vínculo e uso de identidade confirmados. Não apresente iniciativas comerciais independentes como parte da associação. O MR Cultural pertence à própria Associação Maria do Reino.

## Inserir fotos e vídeos

Priorize arquivos originais em boa qualidade e com autorização adequada. Para cada material, registre no controle editorial a origem, o autor, a legenda, o contexto e a situação dos direitos de uso. Os comprovantes de autorização ficam em local privado; não devem ir para a biblioteca pública do site.

Use um texto alternativo curto que descreva o conteúdo real da foto quando ele for informativo. Uma foto decorativa não precisa repetir em voz o texto da página. Recortes não podem alterar o contexto ou fabricar acontecimentos.

Fotografias de pacientes e de crianças exigem cuidados e autorizações adequados. Uma postagem pública em rede social não resolve automaticamente os direitos de republicação. Vídeos também podem conter música com direitos próprios.

Os logos fornecidos foram identificados pelo responsável como Maria do Reino e MR Cultural. Preserve suas proporções e características. Não invente um símbolo alternativo para substituir a identidade oficial.

Em **Dados da associação**, use os campos de logo institucional e logo cultural para enviar os arquivos fornecidos. Escolha o original na melhor qualidade disponível e preserve o arquivo; não distorça, redesenhe ou substitua o símbolo. Os campos já apontam para os arquivos originais extraídos de `logos-mr.zip`: `/uploads/logo-maria-do-reino.png` e `/uploads/logo-mr-cultural.png`.

Para os logos, prefira **SVG vetorial original** ou **PNG original com transparência e pelo menos 800 pixels de largura**, em boa resolução e sem recorte. Não redesenhe por IA nem invente detalhes para ampliar uma imagem de baixa qualidade. Os originais do ZIP já estão aplicados no cabeçalho, no rodapé e nas apresentações culturais. O institucional possui 1016 × 867 pixels. O MR Cultural possui apenas 150 × 150 pixels e é exibido em tamanho limitado para preservar nitidez; se precisar de uma aplicação maior, substitua-o por arquivo original maior ou vetorial. Nenhum detalhe ou cor foi redesenhado e não foi usada ampliação generativa.

### Galerias

Na coleção **Galerias**, crie um registro por atividade ou edição real. Preencha título, descrição, endereço curto e, quando conhecidos, data e atividade. Cada imagem deve ter arquivo, texto alternativo, legenda e crédito coerentes com o registro. O cadastro também permite link de vídeo, título e transcrição quando houver material autorizado.

A marcação **Aprovado** indica que o conteúdo passou pela verificação editorial e de direitos de uso. Só a utilize após essa conferência. Guarde os comprovantes e autorizações em um ambiente privado adequado, fora do repositório público; no cadastro público deve existir apenas a marcação de aprovação. A marcação não substitui o controle privado da autorização.

Não copie PDFs, documentos internos, autorizações, receitas ou outros originais sensíveis para `public/`, para a biblioteca de mídia ou para qualquer outro diretório servido pelo site. Esses arquivos não precisam acompanhar o projeto público para que uma galeria possa ser publicada.

### Parceiros

Na coleção **Parceiros**, cadastre apenas vínculos confirmados. O registro tem nome, endereço curto, descrição opcional, link e imagem com texto alternativo quando fornecidos. Marque **Aprovado** somente depois de validar o vínculo, a forma de apresentação e o uso da identidade. Não cadastre uma marca apenas porque ela apareceu em uma fotografia ou publicação.

### Autores e revisores

Na coleção **Autores e revisores**, informe nome público, endereço curto e apresentação. Qualificação, link, foto e texto alternativo são opcionais e precisam corresponder a informações autorizadas e verificáveis. Escolha a função apropriada: autor ou revisor.

Um registro de revisor no painel não comprova que ele revisou todos os textos. A atribuição a cada conteúdo e sua data de revisão só podem ser feitas após a revisão efetiva. Não publicar identificações profissionais ou fotografias sem conferência e autorização.

As coleções de galerias, parceiros e autores começam vazias, sem registros de demonstração apresentados como pessoas, vínculos ou atividades reais.

Não use IA para produzir pacientes, equipe, instalações ou eventos como se fossem reais. Eventual ilustração genérica deve ser identificada como **Imagem ilustrativa gerada por IA** e nunca usada como registro de atuação.

## Atualizar doações

Os campos de doação estão vazios até que a associação confirme chave Pix, titular e instituição recebedora. Não transforme o CNPJ em chave Pix por suposição.

Antes de publicar um meio de pagamento, confira os dados com o responsável e teste o link ou QR Code conforme o fluxo real. Verifique o nome do destinatário exibido ao pagador. Não publique QR Code de demonstração ou promessa de recorrência sem plataforma efetivamente configurada.

Doações são voluntárias. Não condicione a associação gratuita a uma contribuição.

## Formulários e privacidade

O canal de retorno e a integração precisam estar configurados antes de ativar um envio. Uma mensagem de sucesso só deve aparecer quando o destino tiver recebido a solicitação. Se um serviço não estiver pronto, mantenha a alternativa de contato real e informe a situação sem simular confirmação.

Formulários públicos devem solicitar poucos dados. Não peça laudos, receitas, diagnósticos ou documentos pessoais. Quando houver necessidade desses materiais em outro processo, a equipe deve indicar um ambiente adequado e protegido.

Antes de ativar uma integração, defina quem recebe os dados, quem tem acesso, finalidade, base legal aplicável, retenção e exclusão. Não enviar conteúdo de formulários para pixels, ferramentas de publicidade ou analytics. Não pedir autorização promocional genérica ou pré-marcada.

As páginas de privacidade e cookies descrevem uma versão sem publicidade comportamental e sem analytics. A TV oferece links externos e, para YouTube e Vimeo, o player só é carregado após a escolha explícita de assistir; esse clique estabelece a conexão com o provedor externo. Revise essas páginas antes de alterar esse fluxo, incluir rastreadores, novos destinatários ou outro tratamento. Habilitar uma variável de ambiente não substitui essa revisão operacional.

## Revisar e publicar

Leia a página como se fosse a primeira visita de uma pessoa com poucas informações sobre a associação. Confira se ela entende onde está, o que pode fazer e qual é o próximo passo.

Antes de salvar uma alteração pública:

- Revise fatos, datas, disponibilidade e condições.
- Confira links, imagens, créditos e autorizações.
- Valide autoria e eventual revisão profissional.
- Confira o resultado no celular e por teclado.
- Certifique-se de que não há documento interno, dado pessoal ou segredo no conteúdo.

Após salvar, acompanhe o deploy. Abra a versão gerada e teste a alteração. O histórico do Git ajuda a identificar e reverter mudanças; uma cópia de segurança precisa incluir todo o projeto e o acervo original, não apenas as páginas prontas.

## Pendências para a publicação final

Confirmar contatos vigentes, endereço de atendimento e horários; detalhar o fluxo associativo real; informar serviços atuais e suas condições; aprovar fontes e revisão profissional para conteúdos clínicos; obter fotos reais e permissões; confirmar agenda, projetos e parceiros; validar dados de doação; configurar o receptor dos formulários e as regras de privacidade; concluir a autenticação do painel e a conexão com a Vercel; revisar URLs antigas e redirecionamentos.

A ausência de números de impacto, depoimentos, parceiros ou eventos não impede uma apresentação honesta. Esses campos devem permanecer ausentes até haver conteúdo real aprovado.

Nas novas coleções, as imagens precisam estar na biblioteca local (`/uploads/...`), com descrição acessível. Isso evita conexões a provedores externos apenas para exibir uma foto ou capa. O build verifica os dados e as relações: um episódio publicado precisa pertencer a programa publicado; participantes de programa precisam ter perfil publicado. Registros não publicados ficam fora das páginas, mas o repositório e seus arquivos de mídia podem continuar públicos; não use os campos como cofre de documentos ou informações privadas.
