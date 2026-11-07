# Verificação da validação de conteúdo

Verificação independente de `scripts/validate-content.mjs`, executada em 7 de novembro de 2026 com Node sobre cópias temporárias de `src/content` em `/tmp`. Nenhum cadastro de teste foi criado no conteúdo do projeto. As cópias foram removidas após a execução. Não houve instalação de dependências, compilação ou acesso às URLs dos vídeos.

Foram executados 18 cenários: dois controles positivos retornaram código `0`; os 16 cenários inválidos retornaram código `1`.

| Cenário | Quantidade | Resultado observado |
| --- | ---: | --- |
| Conteúdo atual, sem novos registros | 1 | Aceito; 10 registros válidos. |
| Profissional, programa e episódio sintéticos publicados, com relações válidas | 1 | Aceito; 13 registros válidos na cópia. |
| Episódio publicado sem programa cadastrado | 1 | Rejeitado: programa relacionado não está publicado. |
| Episódio publicado associado a programa em rascunho | 1 | Rejeitado: programa relacionado não está publicado. |
| Programa publicado com participante inexistente | 1 | Rejeitado: participante não está publicado. |
| Programa publicado com participante em rascunho | 1 | Rejeitado: participante não está publicado. |
| Imagem remota HTTPS em profissionais, programas e episódios | 3 | Rejeitados: imagem deve ser enviada à biblioteca local. |
| Slug com maiúsculas, espaços e pontuação em cada nova coleção | 3 | Rejeitados: slug inválido. |
| Vídeo com URL HTTP | 1 | Rejeitado: vídeo deve usar HTTPS. |
| Vídeo com prefixo HTTPS, mas sem domínio | 1 | Rejeitado: URL inválida. |
| Vídeo HTTPS com credenciais embutidas | 1 | Rejeitado: use HTTPS sem credenciais. |
| Perfil e contato de profissional com HTTP | 2 | Rejeitados: use HTTPS sem credenciais. |
| Canal da TV com HTTP | 1 | Rejeitado: use HTTPS sem credenciais. |

Os dados sintéticos tiveram apenas a finalidade de exercitar o validador. Nenhuma pessoa, participação, programa ou publicação real foi inferida a partir desses testes.

Na revisão estática de `scripts/build.mjs`, o validador é o primeiro comando executado. Um código de saída diferente de zero encerra o processo antes de preparar o painel e compilar o site. Essa ordem foi conferida no código; não foi necessário executar uma compilação para estes testes.

Esta verificação cobre estrutura, relações e restrições de URL. Ela não comprova a existência, a autoria ou a autorização de um conteúdo e não substitui a revisão editorial das fontes.
