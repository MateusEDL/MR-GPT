# Direção visual e interação

A home usa fotografia botânica de abertura em toda a largura, formas curvas e capítulos alternando verde institucional, vinho e laranja do MR Cultural. Os caminhos institucionais, a cultura e a natureza têm composições próprias; as imagens ilustrativas não representam eventos, instalações ou cultivo real da associação.

## Movimento

O fundo decorativo reage a ponteiro e toque, sem bloquear cliques nem capturar dados para analytics. A imagem reage levemente à posição e à rolagem. Curvas, formas e textos decorativos usam animações CSS leves. O botão de movimento permite pausar; a escolha fica somente neste navegador. A preferência de movimento reduzido do sistema é respeitada. O canvas limita densidade e quantidade de elementos e interrompe o trabalho em uma aba oculta.

O efeito visual é progressivo: conteúdo, navegação, associação e links continuam disponíveis sem depender do canvas. Não há vídeo com reprodução automática nem som. A legenda de IA fica inteira dentro das imagens orgânicas.

## Revisão interativa sem instalar

Execute `npm run export`. O arquivo `exports/maria-do-reino-previa.html` incorpora as imagens, fontes, CSS e o JavaScript efetivo da home. Baixe o arquivo e abra em um navegador comum. A navegação completa pertence ao pacote do site; a prévia avisa isso ao clicar em outro caminho interno. Links externos e âncoras continuam como ações identificáveis.

O HTML autocontido foi renderizado em Chromium com requisições remotas bloqueadas: imagens, fontes, canvas e pausa/retomada funcionaram sem requisições HTTP externas nem erros de execução. A navegação pelo protocolo file:// não pôde ser testada diretamente neste ambiente porque a política do navegador gerenciado bloqueia esse protocolo; a validação usou o mesmo conteúdo autocontido na página. Isso não altera o pacote do site nem a configuração da Vercel.

Para publicar, use a configuração Vercel e o build padrão já documentados. A revisão visual não habilita o editor em produção nem muda as integrações.
