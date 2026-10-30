# Jotas — Front-end (HTML, CSS e JavaScript)

Como abrir: dê dois cliques em `index.html` (não precisa de servidor).

## Quem mexe em quê
| Pasta / arquivo | O que tem | Equipe |
|---|---|---|
| `*.html` | Estrutura de cada página (comentários marcam cada bloco) | HTML |
| `produto.html` | UMA página para todos os produtos (`produto.html?id=...`) | HTML |
| `css/style.css` | Todo o visual (índice numerado no topo) | CSS / Design |
| `js/dados.js` | Produtos, categorias, lojas, notificações, compras | Dados |
| `js/script.js` | Menu, cabeçalho, carrinho, favoritos, busca, acessibilidade | JavaScript |
| `imagens/` | Fotos e logo (`imagens/produtos/*.svg` são desenhos provisórios) | Design |

## Receitas rápidas
- **Novo produto:** foto em `imagens/` + copiar um objeto em `js/dados.js`. A página dele nasce sozinha.
- **Nova categoria:** adicionar em `CATEGORIAS` (`dados.js`); ícones ficam em `ICONES` (`script.js`).
- **Mudar cores:** `css/style.css`, seção 1 (variáveis).
- **Item novo no menu:** `js/script.js`, função `montarMenuLateral`.

## Acessibilidade (procure `[A11Y]` nos comentários)
**Visão/baixa visão e motora:**
- Link "Pular para o conteúdo" (aparece com Tab); todo o site funciona só com teclado.
- Foco visível, menu do celular com ESC e foco preso, abas com setas do teclado.
- Leitor de tela: textos ocultos (`.so-leitor`) para preço/nota/desconto, `aria-pressed`, `aria-current`, `aria-live`.
- Botão "Acessibilidade": aumentar/diminuir texto, alto contraste, mais espaço entre letras e linhas (fica salvo).
- Respeita "reduzir animações" do sistema; áreas de toque de 44px no celular.

**Deficiência auditiva:**
- O site não usa NENHUM áudio: toda comunicação já é visual e escrita (não existe aviso "só sonoro").
- Todo aviso (toast) mostra texto + ícone + cor ao mesmo tempo — nunca só a cor sozinha.
- Modo "Alertas visuais reforçados" (no painel de Acessibilidade): deixa o aviso maior, com a borda piscando e mais tempo na tela — ajuda quem não percebe avisos sonoros de outros programas.
- Se o grupo adicionar vídeo no futuro, incluam legendas (`<track kind="captions">`) e uma transcrição em texto logo abaixo do vídeo.

Verificado com axe-core (WCAG 2.1 AA): 0 violações. Ainda vale testar com um leitor de tela de verdade (NVDA/TalkBack) e com alguém que use a função "Alertas visuais reforçados" no dia a dia.

## Responsivo
Computador (menu fixo) → até 900px (menu vira gaveta) → até 600px (2 colunas de produtos).

## Dados salvos
Carrinho, favoritos, histórico e ajustes de acessibilidade usam `localStorage`.
Para zerar: F12 > Application > Local Storage > Clear.


ATUALIZAÇÃO DE IMAGENS (01/10/2026)
Os novos produtos passaram a utilizar imagens externas reais nos campos de imagem do js/dados.js. As URLs foram mantidas diretamente no JavaScript para evitar quebrar os caminhos existentes.
