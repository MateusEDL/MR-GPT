# Inventário das imagens ilustrativas

As quatro imagens abaixo foram geradas para este projeto. Não são fotografias da Associação Maria do Reino, de seus espaços ou de atividades realizadas pelo MR Cultural. Não foram obtidas dos perfis sociais. Nenhum logo foi criado, redesenhado ou alterado nesta tarefa.

Os originais PNG gerados permanecem em `/workspace/generated_images/`. Os arquivos WebP do site são conversões desses originais, sem modificação da composição. As versões menores contêm a mesma imagem com redimensionamento proporcional.

## Hero inicial — jardim acolhedor

- Arquivo principal: `public/images/hero-jardim-ia.webp`.
- Dimensões: 1448 × 1086 px, proporção 4:3, 364.344 bytes.
- Versões responsivas: `hero-jardim-ia-960.webp` (960 × 720 px) e `hero-jardim-ia-640.webp` (640 × 480 px).
- Local inicial: imagem principal da primeira versão da home, ao lado da abertura institucional. Preservada como alternativa; o redesign adota o hero botânico descrito abaixo.
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

## Redesign — hero botânico imersivo

- Arquivo principal: `public/images/hero-botanico-ia.webp`.
- Dimensões reais: **1774 × 887 px**, proporção **2:1**, 220.262 bytes.
- Versões responsivas: `hero-botanico-ia-1280.webp` (1280 × 640 px, 130.446 bytes) e `hero-botanico-ia-768.webp` (768 × 384 px, 61.054 bytes).
- Não foi criada versão de 1920 px: o original tem 1774 px de largura e não foi ampliado artificialmente.
- Local proposto: abertura imersiva de largura total da home, com título sobre a metade esquerda escura.
- Assunto: folhagens botânicas de cannabis entre hortaliças e plantas comuns, com feixes de luz natural. É uma composição ilustrativa, não um cultivo da associação, nem prova de instalação ou atividade atual.
- Texto alternativo informativo: `Folhagens botânicas de cannabis e hortaliças em um jardim ilustrativo sob luz natural.`
- Legenda obrigatória visível: **Imagem ilustrativa gerada por IA**.
- Desktop: manter a região de folhagens mais definida à direita e o espaço escuro à esquerda para o texto. Não assumir que a imagem sozinha garante contraste: medir o título sobre o fundo composto.
- Celular: preservar o foco nas folhagens e conferir o contraste do texto; usar camada de fundo escura se a composição responsiva exigir.
- Carregamento: `width="1774"`, `height="887"`, `fetchpriority="high"`, sem lazy-loading se for a imagem LCP. `srcset`: 768w, 1280w e 1774w.
- Original gerado: `/workspace/generated_images/exec-1a101ab3-e538-41cc-9b7b-6589be55117e.png`.

### Prompt em inglês

> Generate a SINGLE extra-wide cinematic botanical editorial photograph, horizontal panorama roughly 2:1, for the full-width hero of an institutional medicinal cannabis and community care website in Brazil. Immersive healthy growing medicinal cannabis foliage mixed naturally with ordinary edible garden plants and ferns in a lush organic garden, large beautifully detailed cannabis leaves on the RIGHT SIDE and upper right, layered green foliage, authentic botanical leaves, visible fine veins and soft dew, shafts of natural early morning light entering from upper right. Deep forest green shadows dominate the LEFT HALF and lower left, with quiet low-detail empty dark green negative space suitable for a large white title overlay. No text in the image. Realistic full-frame camera photograph, refined premium editorial art direction, natural colors, tactile photorealism, depth, subtle organic soft bokeh. This is a generic AI-generated illustrative botanical garden, not an actual association facility or evidence of real cultivation. No people, no faces, no children, no patients, no smoking, no consumption, no finished products, no containers, no medicine bottles, no packaging, no dosage, no logos, no brand names, no writing, no signage, no watermark. Botanical educational atmosphere, contemplative, welcoming, spacious. Make the photograph wide landscape panoramic with dark readable space on left.

## Redesign — cultivo vivo ilustrativo

- Arquivo principal: `public/images/cultivo-vivo-ia.webp`.
- Dimensões reais: **1536 × 1024 px**, proporção **3:2**, 216.210 bytes.
- Versões responsivas: `cultivo-vivo-ia-1440.webp` (1440 × 960 px, 180.302 bytes), `cultivo-vivo-ia-960.webp` (960 × 640 px, 107.028 bytes) e `cultivo-vivo-ia-640.webp` (640 × 427 px, 60.746 bytes).
- Local proposto: seção ampla de natureza, cuidado com a terra e sustentabilidade na home.
- Assunto: mãos adultas não identificáveis cuidando da terra e de mudas verdes em uma horta. A imagem não demonstra atividade realizada pela associação nem disponibilidade de serviço.
- Texto alternativo informativo: `Mãos adultas cuidando da terra e de mudas verdes em uma horta ilustrativa.`
- Legenda obrigatória visível: **Imagem ilustrativa gerada por IA**.
- Desktop e celular: preservar o contexto da terra e das mudas junto às mãos; não recortar de forma a parecer atendimento clínico ou evento documentado.
- Carregamento: `width="1536"`, `height="1024"`, `loading="lazy"` e `decoding="async"` quando abaixo da primeira dobra; `srcset`: 640w, 960w, 1440w e 1536w.
- Original gerado: `/workspace/generated_images/exec-be76bfcd-2006-4d80-acdc-77d0be1124e5.png`.

### Prompt em inglês

> Create a single realistic editorial photograph, horizontal landscape 3:2, illustrating gentle organic gardening and care for living plants. Close-up of only a pair of adult hands, naturally proportioned and anatomically correct, carefully tending dark rich living soil around small healthy green seedlings in an outdoor raised garden bed. Natural golden early morning sunlight, subtle warmth, organic textures, lush green leaf garden softly blurred in the background, honest unstaged feel, tactile soil, tiny roots and young leaves, earthy browns, warm orange highlights and deep institutional forest greens. Focus on the intimate act of planting and nurturing, not a portrait. Adult person not identifiable, no faces, no jewelry or identifying clothing, no children, no patients, no smoking, no consumption, no medicine bottles, no commercial products, no logos, no brand names, no text, no watermark. This is a generic illustrative fictional garden, not documentary evidence of any nonprofit's work or current cultivation. Premium documentary-style editorial composition, calm, photorealistic natural textures, human care and sustainability without therapeutic claims. Composition allows a clean, generous garden atmosphere around the hands.

## Verificação realizada

- Os quatro arquivos principais foram abertos e inspecionados visualmente; os dois novos assets do redesign também tiveram suas variantes e dimensões conferidas.
- As imagens não contêm logos, pacientes, crianças ou alegações de resultado clínico.
- As dimensões e os arquivos WebP foram verificados após a conversão.
- Desempenho real, posição LCP e recortes finais devem ser conferidos na página implementada. A geração das imagens não comprova metas Lighthouse ou Core Web Vitals.
- Fotografias reais e autorizadas podem substituir essas ilustrações futuramente; nesse caso atualizar legenda, alt e origem no inventário.
