# Inventário das imagens ilustrativas

As duas imagens abaixo foram geradas para este projeto. Não são fotografias da Associação Maria do Reino, de seus espaços ou de atividades realizadas pelo MR Cultural. Não foram obtidas dos perfis sociais. Nenhum logo foi criado, redesenhado ou alterado nesta tarefa.

Os originais PNG gerados permanecem em `/workspace/generated_images/`. Os arquivos WebP do site são conversões desses originais, sem modificação da composição. As versões menores contêm a mesma imagem com redimensionamento proporcional.

## Hero — jardim acolhedor

- Arquivo principal: `public/images/hero-jardim-ia.webp`.
- Dimensões: 1448 × 1086 px, proporção 4:3, 364.344 bytes.
- Versões responsivas: `hero-jardim-ia-960.webp` (960 × 720 px) e `hero-jardim-ia-640.webp` (640 × 480 px).
- Local proposto: imagem principal da home, ao lado da abertura institucional.
- Assunto: pátio ilustrativo com plantas comuns, mesa e banco de madeira, cerâmica e luz natural. Não representa a sede real da associação.
- Texto alternativo informativo: `Jardim ilustrativo com plantas, mesa e banco de madeira sob luz natural.`
- Legenda obrigatória visível: **Imagem ilustrativa gerada por IA**.
- Desktop: enquadramento amplo, com foco na mesa e na profundidade do jardim. Preservar proporção 4:3 quando possível.
- Celular: imagem abaixo do texto principal, com proporção 4:3; evitar corte excessivo.
- Carregamento: definir `width="1448"`, `height="1086"`, `fetchpriority="high"` e não aplicar lazy-loading se for a imagem LCP. Usar `srcset` com as versões 640, 960 e 1448 px.
- Original gerado: `/workspace/generated_images/exec-3ef42494-ab4b-484a-ab86-1f832271c9f1.png`.

### Prompt em inglês

> Create a single realistic editorial photograph for a Brazilian nonprofit community care website. A welcoming sunlit courtyard garden somewhere in southern Brazil, with an empty wooden table, a simple bench, ceramic vessels and plentiful ordinary green tropical garden foliage, warm natural morning light, soft organic shadows, inviting human scale, tactile wood and plaster, subtle warm terracotta accents. Compose a refined horizontal landscape photograph with the garden table on the right half and open quiet space on the left. Natural documentary photographic aesthetic, understated, premium magazine art direction, calm and honest, no people, no cannabis leaves or cannabis plants, no smoking, no medicines, no products, no signs, no words, no logos. This is a purely illustrative fictional environment, not the actual premises of any association. Landscape composition, about 4:3, high quality, no collage, no watermark.

## Cultura — oficina ilustrativa

- Arquivo principal: `public/images/cultura-oficina-ia.webp`.
- Dimensões: 1448 × 1086 px, proporção 4:3, 197.626 bytes.
- Versões responsivas: `cultura-oficina-ia-960.webp` (960 × 720 px) e `cultura-oficina-ia-640.webp` (640 × 480 px).
- Local proposto: bloco de apresentação do MR Cultural na home ou cabeçalho da página cultural.
- Assunto: mãos adultas não identificáveis realizando pintura em cerâmica e papel numa oficina genérica. Não é um registro de evento passado do MR Cultural.
- Texto alternativo informativo: `Mãos adultas pintando cerâmica e papel em uma oficina cultural ilustrativa.`
- Legenda obrigatória visível: **Imagem ilustrativa gerada por IA**.
- Desktop e celular: proporção 4:3 para manter o contexto das mãos, dos materiais e da atividade; não usar a imagem como prova de realização de evento.
- Carregamento: definir `width="1448"`, `height="1086"`, `loading="lazy"`, `decoding="async"` quando abaixo da primeira dobra, e usar `srcset` com as versões 640, 960 e 1448 px.
- Original gerado: `/workspace/generated_images/exec-e2a04512-8803-43b2-8c7d-cb34f08654a6.png`.

### Prompt em inglês

> Create one realistic editorial documentary style photograph illustrating a generic community arts workshop in Brazil, NOT a real recorded event or organization. Close crop of a shared wooden craft table with adult hands only, no identifiable faces, quietly painting an earthy ceramic vessel and working with watercolor on textured paper. Two or three adult participants' hands at most, realistic anatomically correct hands, ordinary brushes, small bowls of purple, ochre, burnt orange and forest green paint, natural window light, relaxed spontaneous activity, subtle Brazilian courtyard setting blurred in background. Warm natural colors, tactile craft materials, candid editorial magazine photography, refined framing, landscape composition about 4:3. No children, no cannabis leaves, no smoking, no medicine, no clinical scene, no invented documentary evidence, no words, no letters, no text, no brands, no logos, no watermark. An illustrative fictional workshop, inviting culture and community care without medical promises.

## Verificação realizada

- Os dois arquivos principais foram abertos e inspecionados visualmente.
- As imagens não contêm logos, pacientes, crianças ou alegações de resultado clínico.
- As dimensões e os arquivos WebP foram verificados após a conversão.
- Desempenho real, posição LCP e recortes finais devem ser conferidos na página implementada. A geração das imagens não comprova metas Lighthouse ou Core Web Vitals.
- Fotografias reais e autorizadas podem substituir essas ilustrações futuramente; nesse caso atualizar legenda, alt e origem no inventário.
