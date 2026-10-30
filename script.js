/* =====================================================================
   ARQUIVO: js/script.js
   RESPONSÁVEL: Equipe de JavaScript
   ---------------------------------------------------------------------
   Este arquivo controla TODAS as páginas do site. Ele precisa vir DEPOIS
   do dados.js no HTML (porque usa o array PRODUTOS).

   COMO O ARQUIVO ESTÁ ORGANIZADO (procure pelos números):
     1. Funções ajudantes (preço, storage, aviso na tela)
     2. Ícones (SVG) usados em todo o site
     3. Componentes repetidos: MENU LATERAL e CABEÇALHO
     4. Card de produto (usado em várias páginas)
     5. Ações: favoritar, adicionar ao carrinho, mudar quantidade...
     6. Uma função para CADA página (home, promoções, carrinho...)
     7. Início: descobre em qual página estamos e chama a função certa
     8. ACESSIBILIDADE: barra de ajustes (fonte/contraste/legendas) e menu do celular
        (procure os comentários marcados com [A11Y] = acessibilidade)
        8.3 trata de DEFICIÊNCIA AUDITIVA: o site não depende de nenhum som;
            os avisos (toasts) têm texto, ícone e cor ao mesmo tempo, e há
            um modo de "alerta visual reforçado" para quem não ouve sinais
            sonoros de outros aplicativos (ex.: notificação do navegador).

   COMO O JS SABE EM QUAL PÁGINA ESTÁ?
   Cada .html tem  <body data-pagina="carrinho">  (veja o HTML).
   ===================================================================== */


/* =====================================================================
   1. FUNÇÕES AJUDANTES
   ===================================================================== */

// Transforma 1199 em "R$ 1.199,00"
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Transforma 4.8 em "4,8"
function formatarNota(nota) {
    return nota.toFixed(1).replace(".", ",");
}

// Ordena uma lista de produtos. criterio vem do <select id="ordenar">.
// slice() faz uma cópia para não bagunçar o array original.
function ordenarLista(lista, criterio) {
    const copia = lista.slice();
    if (criterio === "menor-preco")  copia.sort(function (a, b) { return a.precoAtual - b.precoAtual; });
    if (criterio === "maior-preco")  copia.sort(function (a, b) { return b.precoAtual - a.precoAtual; });
    if (criterio === "desconto")     copia.sort(function (a, b) { return calcularDesconto(b) - calcularDesconto(a); });
    if (criterio === "avaliacao")    copia.sort(function (a, b) { return b.nota - a.nota; });
    return copia;
}

// Escreve "N produtos" no parágrafo #contagem (leitor de tela anuncia: aria-live)
function mostrarContagem(qtd) {
    const el = document.getElementById("contagem");
    if (el) el.textContent = qtd + (qtd === 1 ? " produto encontrado" : " produtos encontrados");
}

// Procura um produto do array PRODUTOS pelo id
function buscarProduto(id) {
    return PRODUTOS.find(function (p) { return p.id === id; });
}

// Calcula a porcentagem de desconto (ex.: 17). Retorna 0 se não houver desconto.
function calcularDesconto(p) {
    if (p.precoAtual >= p.precoOriginal) return 0;
    return Math.round((1 - p.precoAtual / p.precoOriginal) * 100);
}

// --- localStorage: guarda dados no navegador para não perder ao trocar de página ---
// Se a chave ainda não existir, salva e devolve o valor "padrao" (dados iniciais).
function lerStorage(chave, padrao) {
    try {
        const texto = localStorage.getItem(chave);
        if (texto === null) {
            localStorage.setItem(chave, JSON.stringify(padrao));
            return padrao;
        }
        return JSON.parse(texto);
    } catch (erro) {
        return padrao; // se o navegador bloquear o storage, usamos o padrão
    }
}

function salvarStorage(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (erro) { /* ignora */ }
}

// Dados iniciais (o mesmo que já existia no carrinho/favoritos do projeto antigo)
function getCarrinho() {
    return lerStorage("jotas_carrinho", [
        { id: "ps5-dualsense", qtd: 1, marcado: true },
        { id: "tablet-m11",    qtd: 1, marcado: true },
        { id: "veatool-fone",  qtd: 1, marcado: true }
    ]);
}
function getFavoritos() { return lerStorage("jotas_favoritos", ["ps5-dualsense", "apple-watch-s2"]); }
function getVistos()    { return lerStorage("jotas_vistos", ["tablet-m11", "veatool-fone", "xbox-g7"]); }

// Aviso rápido que aparece embaixo da tela (ex.: "Adicionado ao carrinho")
// [A11Y] O aviso é criado JÁ NO INÍCIO da página, vazio, com aria-live="polite".
// Assim o leitor de tela "anuncia" a mensagem quando o texto muda.
function criarAviso() {
    let aviso = document.getElementById("aviso");
    if (!aviso) {
        aviso = document.createElement("div");
        aviso.id = "aviso";
        aviso.className = "aviso";
        aviso.setAttribute("role", "status");
        aviso.setAttribute("aria-live", "polite");
        document.body.appendChild(aviso);
    }
    return aviso;
}

// [A11Y] tipo = "sucesso" | "remover" | "info". Cada aviso mostra TEXTO + ÍCONE + COR juntos,
// nunca só uma cor sozinha — importante para quem não distingue bem as cores.
// Se "Alertas visuais reforçados" estiver ligado (painel de acessibilidade), o aviso fica
// maior, demora mais para sumir e pisca a borda: isso ajuda quem não pode contar com
// avisos sonoros do sistema (ex.: notificação de outro programa) para perceber a mudança.
function mostrarAviso(mensagem, tipo) {
    tipo = tipo || "info";
    const aviso = criarAviso();
    const reforcado = getAjustes().alertaVisual;
    const nomeIcone = tipo === "sucesso" ? "sucesso" : (tipo === "remover" ? "remover" : "sino");
    aviso.innerHTML = '<span class="aviso-icone" aria-hidden="true">' + icone(nomeIcone) + '</span>' +
        '<span>' + mensagem + '</span>';
    aviso.className = "aviso visivel tipo-" + tipo + (reforcado ? " reforcado" : "");
    clearTimeout(aviso.temporizador);
    aviso.temporizador = setTimeout(function () {
        aviso.classList.remove("visivel");
    }, reforcado ? 4200 : 2200);
}


/* =====================================================================
   2. ÍCONES (SVG)
   Cada ícone é só o "miolo" do SVG. A função icone() monta o resto.
   Para usar num HTML:  <span data-icone="coracao"></span>
   ===================================================================== */
const ICONES = {
    inicio:       '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    sino:         '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    etiqueta:     '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    categorias:   '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    carrinho:     '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/>',
    "carrinho-ok":'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 7H6"/><path d="M10 11l2 2 4-4"/>',
    coracao:      '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    historico:    '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
    usuario:      '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    busca:        '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    olho:         '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    lixeira:      '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
    cadeado:      '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    "seta-dir":   '<path d="M9 6l6 6-6 6"/>',
    "seta-esq":   '<path d="M15 6l-6 6 6 6"/>',
    loja:         '<path d="M3 9l2-5h14l2 5"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/>',
    caixa:        '<path d="M21 8l-9-5-9 5 9 5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    escudo:       '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    caminhao:     '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>',
    games:        '<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="16" cy="11.5" r=".8"/><circle cx="18.5" cy="13.5" r=".8"/>',
    watch:        '<rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6l1-3h4l1 3M9 18l1 3h4l1-3"/>',
    fones:        '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    tablet:       '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 18h2"/>',
    notebook:     '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 20h20"/>',
    casa:         '<path d="M4 4h16v16H4z"/><path d="M4 9h16"/><circle cx="8" cy="6.5" r=".6"/><circle cx="16" cy="15" r="3"/>',
    decoracao:    '<path d="M9 3h6l-1 5c3 2 4 5 4 8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4c0-3 1-6 4-8z"/>',
    sofa:         '<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"/><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"/><path d="M6 18v2M18 18v2"/>',
    livro:        '<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-3a3 3 0 0 0-3 3"/><path d="M20 4v14h-6"/>',
    menu:         '<path d="M3 6h18M3 12h18M3 18h18"/>',
    fechar:       '<path d="M6 6l12 12M18 6L6 18"/>',
    acessibilidade:'<circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5c4 1.2 10 1.2 14 0M12 9v5m0 0l-3 7m3-7l3 7"/>',
    // [A11Y] ícone de "legendas" (CC), usado no botão de acessibilidade auditiva
    legenda:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M7 11.5a2 2 0 1 0 0 3M13.5 11.5a2 2 0 1 0 0 3"/>',
    sucesso:'<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    remover:'<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>'
};

// Monta o <svg> completo de um ícone
function icone(nome) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           (ICONES[nome] || "") + '</svg>';
}

// Procura no HTML todo elemento com data-icone="..." e coloca o SVG dentro dele
function preencherIcones() {
    document.querySelectorAll("[data-icone]").forEach(function (el) {
        el.innerHTML = icone(el.dataset.icone);
    });
}


/* =====================================================================
   3. COMPONENTES REPETIDOS (aparecem em TODAS as páginas)
   Em vez de copiar o menu e o cabeçalho em cada .html, o JS desenha os
   dois. Para mudar o menu do site inteiro, mude só aqui!
   ===================================================================== */

// ---------- 3.1 MENU LATERAL (barra verde escura da esquerda) ----------
// O item ativo é definido pelo  <body data-menu="...">  de cada página.
function montarMenuLateral() {
    const lugar = document.getElementById("menu-lateral");
    if (!lugar) return;

    // Para incluir um link novo no menu, é só adicionar uma linha aqui:
    const itens = [
        { chave: "inicio",       texto: "Início",        href: "index.html",        icone: "inicio" },
        { chave: "notificacoes", texto: "Notificações",  href: "notificacoes.html", icone: "sino",       badge: "badge-notificacoes" },
        { chave: "promocoes",    texto: "Promoções",     href: "promocoes.html",    icone: "etiqueta" },
        { chave: "categorias",   texto: "Categorias",    href: "categorias.html",   icone: "categorias" },
        { chave: "carrinho",     texto: "Carrinho",      href: "carrinho.html",     icone: "carrinho",   badge: "badge-carrinho" },
        { chave: "favoritos",    texto: "Favoritos",     href: "favoritos.html",    icone: "coracao" },
        { chave: "historico",    texto: "Histórico",     href: "historico.html",    icone: "historico" }
    ];
    const ativo = document.body.dataset.menu;

    // [A11Y] botão "Fechar menu": só aparece no celular (ver CSS, seção 16)
    let html = '<button type="button" class="menu-fechar" id="menu-fechar" aria-label="Fechar menu">' + icone("fechar") + '</button>' +
               '<a class="menu-usuario" href="perfil.html">' +
                   '<span class="avatar">' + icone("usuario") + '</span>' +
                   '<span class="menu-usuario-texto"><strong>Olá, Júlia</strong>' +
                   '<small>Ver seu perfil ' + icone("seta-dir") + '</small></span>' +
               '</a><nav aria-label="Menu principal"><ul class="menu-lista">';

    itens.forEach(function (item) {
        const eAtivo = (item.chave === ativo);
        const classe = eAtivo ? "menu-link ativo" : "menu-link";
        // [A11Y] aria-current avisa o leitor de tela qual é a página atual
        const atual = eAtivo ? ' aria-current="page"' : "";
        const badge = item.badge ? '<span class="badge ' + item.badge + '" aria-label="' + item.chave + '"></span>' : "";
        html += '<li><a class="' + classe + '" href="' + item.href + '"' + atual + '>' +
                    icone(item.icone) + '<span>' + item.texto + '</span>' + badge +
                '</a></li>';
    });
    html += "</ul></nav>";
    lugar.innerHTML = html;
}

// ---------- 3.2 CABEÇALHO (logo + busca + carrinho + perfil) ----------
function montarCabecalho() {
    const lugar = document.getElementById("cabecalho");
    if (!lugar) return;

    lugar.innerHTML =
        '<div class="cabecalho-topo">' +
            // [A11Y] botão que abre o menu no celular (no computador fica escondido pelo CSS)
            '<button type="button" class="btn-menu" id="btn-menu" aria-label="Abrir menu" ' +
                'aria-expanded="false" aria-controls="menu-lateral">' + icone("menu") + '</button>' +
            '<a class="logo" href="index.html"><img src="imagens/logo_recortado.png" alt="Jotas - página inicial"></a>' +
            '<div class="cabecalho-acoes">' +
                '<a class="icone-topo" href="carrinho.html" aria-label="Carrinho">' + icone("carrinho") +
                    '<span class="badge badge-carrinho" role="img"></span></a>' +
                '<a class="icone-topo" href="perfil.html" aria-label="Meu perfil">' + icone("usuario") + '</a>' +
            '</div>' +
        '</div>' +
        '<form class="busca" id="form-busca" role="search">' +
            icone("busca") +
            // [A11Y] o placeholder some ao digitar, então o aria-label garante o nome do campo
            '<input type="search" id="campo-busca" placeholder="O que você está procurando?" aria-label="Pesquisar produtos" autocomplete="off">' +
            '<button type="submit" aria-label="Pesquisar">' + icone("busca") + '</button>' +
        '</form>';

    // Quando a pessoa pesquisa:
    //  - na Home: filtra os produtos na hora
    //  - em outra página: vai para a Home levando o termo na URL (?busca=...)
    document.getElementById("form-busca").addEventListener("submit", function (evento) {
        evento.preventDefault();
        const termo = document.getElementById("campo-busca").value.trim();
        if (document.body.dataset.pagina === "home") {
            filtrarHome(termo);
        } else {
            window.location.href = "index.html?busca=" + encodeURIComponent(termo);
        }
    });
}

// Rodapé compartilhado: fica dentro do conteúdo principal para acompanhar
// o layout responsivo e não ser coberto pelo menu lateral.
function montarRodape() {
    const conteudo = document.querySelector("main.conteudo");
    if (!conteudo || document.querySelector(".rodape-site")) return;
    const rodape = document.createElement("footer");
    rodape.className = "rodape-site";
    rodape.innerHTML =
        '<div class="rodape-marca"><a href="index.html">Jotas</a>' +
            '<p>Sua loja online de tecnologia e inovação.</p></div>' +
        '<div class="rodape-coluna"><h2>Institucional</h2>' +
            '<a href="sobre-nos.html">Sobre nós</a>' +
            '<a href="index.html">Início</a></div>' +
        '<div class="rodape-coluna"><h2>Conta</h2>' +
            '<a href="perfil.html">Minha conta</a>' +
            '<a href="perfil.html">Perfil</a></div>' +
        '<div class="rodape-coluna"><h2>Atendimento</h2>' +
            '<a href="mailto:contato@jotas.com.br">contato@jotas.com.br</a></div>' +
        '<p class="rodape-copyright">© ' + new Date().getFullYear() + ' Jotas. Todos os direitos reservados.</p>';
    conteudo.appendChild(rodape);
}

// Atualiza as bolinhas com números (carrinho e notificações)
function atualizarContadores() {
    const totalCarrinho = getCarrinho().length;
    document.querySelectorAll(".badge-carrinho").forEach(function (el) {
        el.textContent = totalCarrinho;
        el.hidden = (totalCarrinho === 0);
        // [A11Y] "3" sozinho não diz nada; o aria-label completa a informação
        el.setAttribute("aria-label", totalCarrinho + (totalCarrinho === 1 ? " item no carrinho" : " itens no carrinho"));
    });
    document.querySelectorAll(".badge-notificacoes").forEach(function (el) {
        el.textContent = NOTIFICACOES.length;
        el.setAttribute("aria-label", NOTIFICACOES.length + " notificações");
    });
}


/* =====================================================================
   4. CARD DE PRODUTO
   O mesmo card aparece na Home, Promoções, Categorias e Histórico.
   O CSS dele está em css/style.css na parte "CARD DE PRODUTO".
   opcoes.economia = true  -> mostra "Economize R$ X" no lugar das parcelas
   ===================================================================== */
// [A11Y] Nota com estrela: o símbolo ★ é escondido e o leitor lê a frase completa
function textoNota(p, comTexto) {
    return '<p class="card-nota">' +
        '<span class="so-leitor">Nota ' + formatarNota(p.nota) + ' de 5, ' + p.avaliacoes + ' avaliações</span>' +
        '<span aria-hidden="true"><span class="estrela">★</span> ' + formatarNota(p.nota) +
        ' <span class="card-avaliacoes">(' + p.avaliacoes + (comTexto ? ' avaliações' : '') + ')</span></span></p>';
}

function criarCardProduto(p, opcoes) {
    opcoes = opcoes || {};
    const desconto = calcularDesconto(p);
    const favorito = getFavoritos().includes(p.id);

    // [A11Y] textos com classe "so-leitor" só são lidos por leitores de tela (ficam invisíveis)
    const selo = desconto ? '<span class="selo-desconto" aria-hidden="true">-' + desconto + '%</span>' : "";
    const precoAntigo = desconto
        ? '<p class="preco-antigo"><span class="so-leitor">Preço original: </span>' + formatarPreco(p.precoOriginal) +
          '<span class="so-leitor">, ' + desconto + '% de desconto</span></p>'
        : "";
    const linhaExtra = (opcoes.economia && desconto)
        ? '<p class="economia">Economize ' + formatarPreco(p.precoOriginal - p.precoAtual) + '</p>'
        : '<p class="parcelas">em até 12x sem juros</p>';

    return '<article class="card-produto">' +
        '<div class="card-imagem">' + selo +
            // [A11Y] aria-pressed diz se o botão está ligado (favoritado) ou desligado
            '<button class="btn-favorito' + (favorito ? " ativo" : "") + '" data-fav="' + p.id + '" ' +
                'aria-pressed="' + favorito + '" aria-label="Favoritar ' + p.nome + '">' + icone("coracao") + '</button>' +
            // [A11Y] o nome do produto já é um link; este link da foto fica fora do teclado para não repetir
            '<a href="' + urlProduto(p) + '" tabindex="-1" aria-hidden="true"><img src="' + p.imagem + '" alt="" loading="lazy"></a>' +
        '</div>' +
        '<div class="card-corpo">' +
            '<a class="card-nome" href="' + urlProduto(p) + '">' + p.nome + '</a>' +
            textoNota(p, false) +
            precoAntigo +
            '<div class="card-rodape">' +
                '<div><p class="preco"><span class="so-leitor">Preço atual: </span>' + formatarPreco(p.precoAtual) + '</p>' + linhaExtra + '</div>' +
                '<button class="btn-carrinho" data-add="' + p.id + '" aria-label="Adicionar ' + p.nome + ' ao carrinho">' +
                    icone("carrinho") + '</button>' +
            '</div>' +
        '</div>' +
    '</article>';
}

// Coloca vários cards dentro de um elemento (pelo id dele)
function desenharCards(idLugar, lista, opcoes) {
    const lugar = document.getElementById(idLugar);
    if (!lugar) return;
    if (lista.length === 0) {
        lugar.innerHTML = '<p class="vazio">Nenhum produto encontrado.</p>';
        return;
    }
    lugar.innerHTML = lista.map(function (p) { return criarCardProduto(p, opcoes); }).join("");
}


/* =====================================================================
   5. AÇÕES (favoritar, carrinho, quantidade, remover...)
   Os cliques são tratados no fim do arquivo (seção 7) usando os
   atributos data-* dos botões:
        data-fav="id"      -> favoritar
        data-add="id"      -> adicionar ao carrinho
        data-mais / data-menos / data-remover="id" -> carrinho
   ===================================================================== */

function alternarFavorito(id, botao) {
    let favoritos = getFavoritos();
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(function (f) { return f !== id; });
        mostrarAviso("Removido dos favoritos", "remover");
    } else {
        favoritos.push(id);
        mostrarAviso("Adicionado aos favoritos", "sucesso");
    }
    salvarStorage("jotas_favoritos", favoritos);

    if (document.body.dataset.pagina === "favoritos") {
        iniciarFavoritos();              // redesenha a lista
    } else if (botao) {
        botao.classList.toggle("ativo"); // só pinta/despinta o coração
        botao.setAttribute("aria-pressed", botao.classList.contains("ativo")); // [A11Y]
    }
}

function adicionarAoCarrinho(id) {
    const carrinho = getCarrinho();
    const item = carrinho.find(function (i) { return i.id === id; });
    if (item) {
        item.qtd = Math.min(item.qtd + 1, 10);   // limite de 10 unidades
    } else {
        carrinho.push({ id: id, qtd: 1, marcado: true });
    }
    salvarStorage("jotas_carrinho", carrinho);
    atualizarContadores();
    mostrarAviso("Produto adicionado ao carrinho", "sucesso");
}

// Muda quantidade (+1 ou -1), remove ou marca/desmarca um item do carrinho
function mudarQuantidade(id, diferenca) {
    const carrinho = getCarrinho();
    const item = carrinho.find(function (i) { return i.id === id; });
    if (!item) return;
    item.qtd = Math.min(10, Math.max(1, item.qtd + diferenca));
    salvarStorage("jotas_carrinho", carrinho);
    iniciarCarrinho();
    // [A11Y] a lista é redesenhada, então devolvemos o foco ao botão clicado
    const botao = document.querySelector(diferenca > 0 ? '[data-mais="' + id + '"]' : '[data-menos="' + id + '"]');
    if (botao) botao.focus();
}

function removerDoCarrinho(id) {
    const carrinho = getCarrinho().filter(function (i) { return i.id !== id; });
    salvarStorage("jotas_carrinho", carrinho);
    atualizarContadores();
    iniciarCarrinho();
    // [A11Y] o botão removido sumiu: levamos o foco para o título da lista
    const titulo = document.getElementById("titulo-carrinho");
    if (titulo) titulo.focus();
    mostrarAviso("Produto removido do carrinho", "remover");
}

function marcarItem(id, marcado) {
    const carrinho = getCarrinho();
    const item = carrinho.find(function (i) { return i.id === id; });
    if (item) item.marcado = marcado;
    salvarStorage("jotas_carrinho", carrinho);
    iniciarCarrinho();
    const check = document.querySelector('[data-marcar="' + id + '"]');   // [A11Y] devolve o foco
    if (check) check.focus();
}


/* =====================================================================
   6. UMA FUNÇÃO PARA CADA PÁGINA
   ===================================================================== */

// ---------- 6.1 HOME (index.html) ----------
function filtrarHome(termo) {
    const t = termo.toLowerCase();
    const lista = PRODUTOS.filter(function (p) {
        return p.nome.toLowerCase().includes(t) || p.categoria.toLowerCase().includes(t);
    });
    document.getElementById("titulo-lista").textContent =
        termo ? 'Resultados para "' + termo + '"' : "Produtos e ofertas";
    const ordenada = ordenarLista(lista, document.getElementById("ordenar").value);
    desenharCards("lista-produtos", ordenada);
    mostrarContagem(ordenada.length);
}

function iniciarHome() {
    // Se veio de outra página pesquisando, a URL é index.html?busca=fone
    const termo = new URLSearchParams(window.location.search).get("busca") || "";
    document.getElementById("campo-busca").value = termo;
    filtrarHome(termo);
    // Trocar a ordenação refaz a lista mantendo o termo pesquisado
    document.getElementById("ordenar").addEventListener("change", function () {
        filtrarHome(document.getElementById("campo-busca").value.trim());
    });
}

// ---------- 6.2 NOTIFICAÇÕES (notificacoes.html) ----------
function iniciarNotificacoes() {
    const lugar = document.getElementById("lista-notificacoes");
    lugar.innerHTML = NOTIFICACOES.map(function (n) {
        const p = buscarProduto(n.idProduto);
        return '<article class="card-horizontal">' +
            '<img src="' + p.imagem + '" alt="">' +
            '<div class="card-horizontal-info">' +
                '<p class="notificacao-texto">' + n.texto + '</p>' +
                '<h3>' + p.nome + '</h3>' +
                '<p class="preco-antigo">Preço anterior: ' + formatarPreco(p.precoOriginal) + '</p>' +
                '<p class="preco">Preço atual: ' + formatarPreco(p.precoAtual) + '</p>' +
            '</div>' +
            '<a class="btn-secundario" href="' + urlProduto(p) + '">Ver detalhes</a>' +
        '</article>';
    }).join("");
}

// ---------- 6.3 PROMOÇÕES (promocoes.html) ----------
function iniciarPromocoes() {
    // Ordena do MAIOR para o MENOR desconto
    const emPromocao = PRODUTOS.filter(function (p) { return calcularDesconto(p) > 0; })
        .sort(function (a, b) { return calcularDesconto(b) - calcularDesconto(a); });

    // Os 3 melhores vão em destaque, o resto em "Mais ofertas"
    desenharCards("lista-destaque", emPromocao.slice(0, 3), { economia: true });
    desenharCards("lista-mais-ofertas", emPromocao.slice(3), { economia: true });
}

// ---------- 6.4 CATEGORIAS (categorias.html) ----------
let categoriaAtual = "";   // guarda a categoria escolhida (para a ordenação refazer a lista)

function desenharCategoria(nome) {
    document.getElementById("titulo-categoria").textContent = nome;
    categoriaAtual = nome;
    const lista = ordenarLista(
        PRODUTOS.filter(function (p) { return p.categoria === nome; }),
        document.getElementById("ordenar").value);
    desenharCards("lista-categoria", lista);
    mostrarContagem(lista.length);

    // Pinta só o chip da categoria escolhida
    // [A11Y] aria-pressed="true" avisa o leitor de tela qual chip está escolhido
    document.querySelectorAll(".chip").forEach(function (chip) {
        const escolhido = (chip.dataset.categoria === nome);
        chip.classList.toggle("ativo", escolhido);
        chip.setAttribute("aria-pressed", escolhido);
    });
}

function iniciarCategorias() {
    const chips = document.getElementById("chips-categorias");
    chips.innerHTML = CATEGORIAS.map(function (c) {
        return '<button type="button" class="chip" data-categoria="' + c.nome + '" aria-pressed="false">' +
                   icone(c.icone) + '<span>' + c.nome + '</span></button>';
    }).join("");

    chips.addEventListener("click", function (evento) {
        const chip = evento.target.closest(".chip");
        if (chip) desenharCategoria(chip.dataset.categoria);
    });

    document.getElementById("ordenar").addEventListener("change", function () {
        desenharCategoria(categoriaAtual);
    });
    desenharCategoria(CATEGORIAS[0].nome); // começa em "Games"
}

// ---------- 6.5 CARRINHO (carrinho.html) ----------
function iniciarCarrinho() {
    const carrinho = getCarrinho();
    const lugarItens = document.getElementById("itens-carrinho");
    document.getElementById("qtd-produtos").textContent = carrinho.length;

    // --- Lista de itens (coluna da esquerda) ---
    if (carrinho.length === 0) {
        lugarItens.innerHTML = '<p class="vazio">Seu carrinho está vazio. ' +
                               '<a href="index.html">Continuar comprando</a></p>';
    } else {
        lugarItens.innerHTML = carrinho.map(function (item) {
            const p = buscarProduto(item.id);
            const desconto = calcularDesconto(p);
            return '<article class="card-produto card-carrinho">' +
                '<div class="card-imagem">' +
                    '<input type="checkbox" class="check-item" data-marcar="' + p.id + '" ' +
                        (item.marcado ? "checked" : "") + ' aria-label="Selecionar ' + p.nome + '">' +
                    '<img src="' + p.imagem + '" alt="">' +
                '</div>' +
                '<div class="card-corpo">' +
                    '<a class="card-nome" href="' + urlProduto(p) + '">' + p.nome + '</a>' +
                    textoNota(p, false) +
                    (desconto ? '<p class="preco-antigo">' + formatarPreco(p.precoOriginal) +
                                ' <span class="selo-mini">-' + desconto + '%</span></p>' : "") +
                    '<p class="preco">' + formatarPreco(p.precoAtual) + '</p>' +
                    '<div class="card-rodape">' +
                        '<div class="quantidade">' +
                            '<button type="button" data-menos="' + p.id + '" aria-label="Diminuir quantidade de ' + p.nome + '"' +
                                (item.qtd <= 1 ? ' disabled' : '') + '>−</button>' +
                            '<span aria-label="Quantidade: ' + item.qtd + '">' + item.qtd + '</span>' +
                            '<button type="button" data-mais="' + p.id + '" aria-label="Aumentar quantidade de ' + p.nome + '"' +
                                (item.qtd >= 10 ? ' disabled' : '') + '>+</button>' +
                        '</div>' +
                        '<button type="button" class="btn-lixeira" data-remover="' + p.id + '" ' +
                            'aria-label="Remover ' + p.nome + '">' + icone("lixeira") + '</button>' +
                    '</div>' +
                '</div>' +
            '</article>';
        }).join("");
    }

    // --- Resumo da compra (coluna da direita) ---
    const marcados = carrinho.filter(function (i) { return i.marcado; });
    let subtotal = 0, economia = 0, totalUnidades = 0;
    let htmlResumo = "";

    marcados.forEach(function (item) {
        const p = buscarProduto(item.id);
        subtotal += p.precoOriginal * item.qtd;
        economia += (p.precoOriginal - p.precoAtual) * item.qtd;
        totalUnidades += item.qtd;
        htmlResumo += '<li><img src="' + p.imagem + '" alt="">' +
            '<div><strong>' + p.nome + '</strong>' +
            '<span class="preco">' + formatarPreco(p.precoAtual) + '</span>' +
            '<small>' + item.qtd + ' un.</small></div></li>';
    });

    // Regra do banner da Home: frete grátis acima de R$ 199
    const totalSemFrete = subtotal - economia;
    const frete = (marcados.length === 0 || totalSemFrete >= 199) ? 0 : 40;

    document.getElementById("resumo-itens").innerHTML =
        htmlResumo || '<li class="vazio">Nenhum item selecionado.</li>';
    document.getElementById("resumo-qtd").textContent = marcados.length;
    document.getElementById("resumo-subtotal-texto").textContent = "Subtotal (" + totalUnidades + " itens)";
    document.getElementById("resumo-subtotal").textContent = formatarPreco(subtotal);
    document.getElementById("resumo-desconto").textContent = "- " + formatarPreco(economia);
    document.getElementById("resumo-frete").textContent = frete === 0 ? "Grátis" : formatarPreco(frete);
    document.getElementById("resumo-total").textContent = formatarPreco(totalSemFrete + frete);
    document.getElementById("resumo-economizou").textContent = formatarPreco(economia);

    const botao = document.getElementById("btn-finalizar");
    botao.querySelector("span:last-child").textContent = "Finalizar compra (" + marcados.length + ")";
    botao.disabled = (marcados.length === 0);
}

// ---------- 6.6 FAVORITOS (favoritos.html) ----------
function iniciarFavoritos() {
    // Lojas (só visual, vêm do array LOJAS)
    document.getElementById("lista-lojas").innerHTML = LOJAS.map(function (l) {
        return '<article class="card-loja">' +
            '<span class="loja-logo">' + l.nome.charAt(0) + '</span>' +
            '<div class="loja-info">' +
                '<h3>' + l.nome + '</h3>' +
                '<p class="loja-selo">Loja oficial</p>' +
                '<p class="card-nota"><span class="estrela">★</span> ' + formatarNota(l.nota) +
                    ' <span class="card-avaliacoes">(' + l.avaliacoes.toLocaleString("pt-BR") + ' avaliações)</span></p>' +
                '<ul class="loja-vantagens">' +
                    '<li>' + icone("caminhao") + 'Entrega rápida</li>' +
                    '<li>' + icone("escudo") + l.selo + '</li>' +
                    '<li>' + icone("coracao") + 'Favorita por você</li>' +
                '</ul>' +
            '</div>' +
        '</article>';
    }).join("");

    // Produtos favoritos (vêm do localStorage)
    const favoritos = getFavoritos().map(buscarProduto).filter(Boolean);
    const lugar = document.getElementById("lista-favoritos");
    if (favoritos.length === 0) {
        lugar.innerHTML = '<p class="vazio">Você ainda não favoritou nenhum produto.</p>';
        return;
    }
    lugar.innerHTML = favoritos.map(function (p) {
        return '<article class="card-horizontal">' +
            '<img src="' + p.imagem + '" alt="">' +
            '<div class="card-horizontal-info">' +
                '<h3><a href="' + urlProduto(p) + '">' + p.nome + '</a></h3>' +
                '<p class="card-avaliacoes">' + p.categoria + '</p>' + textoNota(p, true) +
                '<p class="preco">' + formatarPreco(p.precoAtual) + '</p>' +
                '<p class="parcelas">em até 12x sem juros</p>' +
            '</div>' +
            '<button class="btn-favorito ativo" data-fav="' + p.id + '" aria-pressed="true" aria-label="Remover ' + p.nome + ' dos favoritos">' +
                icone("coracao") + '</button>' +
        '</article>';
    }).join("");
}

// Troca entre as abas "Lojas" e "Produtos" da página Favoritos
// [A11Y] Abas seguem o padrão WAI-ARIA: role="tab", aria-selected e
// navegação pelas SETAS do teclado (esquerda/direita, Home e End).
function configurarAbasFavoritos() {
    const abas = Array.from(document.querySelectorAll(".aba"));

    function selecionar(aba, mudarFoco) {
        abas.forEach(function (a) {
            const ativa = (a === aba);
            a.classList.toggle("ativo", ativa);
            a.setAttribute("aria-selected", ativa);
            a.tabIndex = ativa ? 0 : -1;   // só a aba ativa entra na ordem do Tab
        });
        document.querySelectorAll(".painel").forEach(function (painel) {
            painel.hidden = (painel.id !== "painel-" + aba.dataset.aba);
        });
        if (mudarFoco) aba.focus();
    }

    abas.forEach(function (aba, posicao) {
        aba.addEventListener("click", function () { selecionar(aba, false); });
        aba.addEventListener("keydown", function (evento) {
            let nova = null;
            if (evento.key === "ArrowRight") nova = abas[(posicao + 1) % abas.length];
            if (evento.key === "ArrowLeft")  nova = abas[(posicao - 1 + abas.length) % abas.length];
            if (evento.key === "Home") nova = abas[0];
            if (evento.key === "End")  nova = abas[abas.length - 1];
            if (nova) { evento.preventDefault(); selecionar(nova, true); }
        });
    });
}

// ---------- 6.7 HISTÓRICO (historico.html) ----------
function iniciarHistorico() {
    // "Já visto antes": produtos que a pessoa abriu (o mais recente primeiro)
    const vistos = getVistos().map(buscarProduto).filter(Boolean);
    desenharCards("lista-vistos", vistos);

    // "Suas compras": lista fixa do array COMPRAS
    document.getElementById("lista-compras").innerHTML = COMPRAS.map(function (c, i) {
        const p = buscarProduto(c.idProduto);
        return '<article class="card-horizontal">' +
            '<img src="' + p.imagem + '" alt="">' +
            '<div class="card-horizontal-info">' +
                '<p class="notificacao-texto">Compra ' + (i + 1) + ' — Julia, você comprou este produto em ' + c.data + '!</p>' +
                '<h3>' + p.nome + '</h3>' +
                '<p class="preco">Preço: ' + formatarPreco(p.precoOriginal) + '</p>' +
            '</div>' +
            '<a class="btn-secundario" href="' + urlProduto(p) + '">Ver detalhes</a>' +
        '</article>';
    }).join("");
}

// ---------- 6.8 PÁGINA DE PRODUTO (produto.html?id=xxx) ----------
// UMA página só serve para TODOS os produtos: o id vem do endereço (?id=...)
// e os detalhes vêm do campo "detalhes" de cada produto em js/dados.js.
function iniciarProduto() {
    const id = new URLSearchParams(window.location.search).get("id");
    const p = buscarProduto(id);
    const topo = document.getElementById("produto-topo");

    if (!p) {   // id errado ou sem id
        document.title = "Produto não encontrado | Jotas";
        topo.innerHTML = '<div class="produto-info"><h1>Produto não encontrado</h1>' +
            '<p>Não achamos este produto. <a class="link-voltar" href="index.html">Voltar para a página inicial</a></p></div>';
        document.getElementById("detalhes-produto").hidden = true;
        return;
    }
    document.title = p.nome + " | Jotas";

    const desconto = calcularDesconto(p);
    const favorito = getFavoritos().includes(p.id);

    topo.innerHTML =
        '<div class="produto-foto"><img src="' + p.imagem + '" alt="Foto do produto ' + p.nome + '"></div>' +
        '<div class="produto-info">' +
            '<p class="produto-categoria">' + p.categoria + '</p>' +
            '<h1>' + p.nome + '</h1>' +
            textoNota(p, true) +
            (desconto ? '<p class="preco-antigo"><span class="so-leitor">Preço original: </span>' + formatarPreco(p.precoOriginal) +
                        ' <span class="selo-mini">-' + desconto + '%<span class="so-leitor"> de desconto</span></span></p>' : "") +
            '<p class="preco preco-grande"><span class="so-leitor">Preço atual: </span>' + formatarPreco(p.precoAtual) + '</p>' +
            '<p class="parcelas">em até 12x sem juros</p>' +
            '<div class="produto-botoes">' +
                '<button type="button" class="btn-principal" data-add="' + p.id + '">' +
                    icone("carrinho") + 'Adicionar ao carrinho</button>' +
                '<button type="button" class="btn-favorito btn-favorito-texto' + (favorito ? " ativo" : "") +
                    '" data-fav="' + p.id + '" aria-pressed="' + favorito + '">' + icone("coracao") + 'Favoritar</button>' +
            '</div>' +
            '<a class="link-voltar" href="index.html">' + icone("seta-esq") + 'Voltar para a página inicial</a>' +
        '</div>';

    // Lista de detalhes (cada item é [título, texto])
    document.getElementById("lista-detalhes").innerHTML = p.detalhes.map(function (d) {
        return '<li><strong>' + d[0] + ':</strong> ' + d[1] + '</li>';
    }).join("");

    // Produtos parecidos: mesma categoria, sem repetir o atual
    const parecidos = PRODUTOS.filter(function (x) { return x.categoria === p.categoria && x.id !== p.id; }).slice(0, 5);
    const secao = document.getElementById("secao-parecidos");
    if (parecidos.length) {
        desenharCards("lista-parecidos", parecidos);
    } else {
        secao.hidden = true;
    }

    // Guarda no histórico ("Já visto antes"): tira repetido e coloca no começo
    let vistos = getVistos().filter(function (v) { return v !== p.id; });
    vistos.unshift(p.id);
    salvarStorage("jotas_vistos", vistos.slice(0, 10));
}

// ---------- 6.9 PERFIL (perfil.html) ----------
function iniciarPerfil() {
    document.getElementById("form-perfil").addEventListener("submit", function (evento) {
        evento.preventDefault(); // não recarrega a página
        mostrarAviso("Perfil atualizado com sucesso!", "sucesso");
    });
}


/* =====================================================================
   7. INÍCIO: roda quando o HTML terminou de carregar
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function () {
    // Primeiro: componentes que existem em todas as páginas
    aplicarAcessibilidade();      // [A11Y] aplica fonte/contraste salvos
    criarAviso();                 // [A11Y] região de avisos para leitor de tela
    montarMenuLateral();
    montarCabecalho();
    montarRodape();
    configurarMenuCelular();      // [A11Y] menu deslizante do celular
    montarBarraAcessibilidade();  // [A11Y] botão flutuante de ajustes
    preencherIcones();
    atualizarContadores();

    // Depois: a função da página atual (vem do <body data-pagina="...">)
    const paginas = {
        home: iniciarHome,
        notificacoes: iniciarNotificacoes,
        promocoes: iniciarPromocoes,
        categorias: iniciarCategorias,
        carrinho: iniciarCarrinho,
        favoritos: function () { iniciarFavoritos(); configurarAbasFavoritos(); },
        historico: iniciarHistorico,
        produto: iniciarProduto,
        perfil: iniciarPerfil
    };
    const iniciar = paginas[document.body.dataset.pagina];
    if (iniciar) iniciar();
});

// Cliques: um único "ouvinte" no documento inteiro (event delegation).
// Funciona até para cards criados depois pelo JS.
document.addEventListener("click", function (evento) {
    const alvo = evento.target;
    const fav = alvo.closest("[data-fav]");
    if (fav) return alternarFavorito(fav.dataset.fav, fav);

    const add = alvo.closest("[data-add]");
    if (add) return adicionarAoCarrinho(add.dataset.add);

    const mais = alvo.closest("[data-mais]");
    if (mais) return mudarQuantidade(mais.dataset.mais, 1);

    const menos = alvo.closest("[data-menos]");
    if (menos) return mudarQuantidade(menos.dataset.menos, -1);

    const remover = alvo.closest("[data-remover]");
    if (remover) return removerDoCarrinho(remover.dataset.remover);

    if (alvo.closest("#btn-limpar")) {
        salvarStorage("jotas_carrinho", []);
        atualizarContadores();
        return iniciarCarrinho();
    }

    if (alvo.closest("#btn-finalizar")) {
        // Finalizar = remove do carrinho os itens marcados
        const restantes = getCarrinho().filter(function (i) { return !i.marcado; });
        salvarStorage("jotas_carrinho", restantes);
        atualizarContadores();
        iniciarCarrinho();
        mostrarAviso("Compra finalizada! Obrigado por comprar na Jotas.", "sucesso");
    }
});

// Mudança nos checkboxes do carrinho
document.addEventListener("change", function (evento) {
    const check = evento.target.closest("[data-marcar]");
    if (check) marcarItem(check.dataset.marcar, check.checked);
});


/* =====================================================================
   8. ACESSIBILIDADE  ([A11Y])
   Duas partes:
     8.1  Menu do celular (abre/fecha, teclado, foco)
     8.2  Barra de ajustes: tamanho do texto, alto contraste, espaçamento
   O CSS correspondente está em css/style.css (seções 16 e 17).
   ===================================================================== */

// ---------- 8.1 MENU DO CELULAR ----------
// No celular o menu lateral vira uma gaveta. Regras de acessibilidade:
//  - o botão avisa se está aberto (aria-expanded)
//  - ao abrir, o foco vai para dentro do menu; ao fechar, volta ao botão
//  - a tecla ESC fecha
//  - o Tab não escapa para trás do menu enquanto ele está aberto
function configurarMenuCelular() {
    const botao = document.getElementById("btn-menu");
    const menu = document.getElementById("menu-lateral");
    if (!botao || !menu) return;

    const fundo = document.createElement("div");   // fundo escuro atrás do menu
    fundo.className = "menu-fundo";
    document.body.appendChild(fundo);

    function abrir() {
        document.body.classList.add("menu-aberto");
        botao.setAttribute("aria-expanded", "true");
        botao.setAttribute("aria-label", "Fechar menu");
        document.getElementById("menu-fechar").focus();
    }
    function fechar(devolverFoco) {
        document.body.classList.remove("menu-aberto");
        botao.setAttribute("aria-expanded", "false");
        botao.setAttribute("aria-label", "Abrir menu");
        if (devolverFoco) botao.focus();
    }

    botao.addEventListener("click", function () {
        if (document.body.classList.contains("menu-aberto")) fechar(true); else abrir();
    });
    document.getElementById("menu-fechar").addEventListener("click", function () { fechar(true); });
    fundo.addEventListener("click", function () { fechar(true); });

    document.addEventListener("keydown", function (evento) {
        if (!document.body.classList.contains("menu-aberto")) return;
        if (evento.key === "Escape") { fechar(true); return; }
        if (evento.key === "Tab") {           // mantém o foco dentro do menu
            const focaveis = menu.querySelectorAll("a[href], button");
            const primeiro = focaveis[0];
            const ultimo = focaveis[focaveis.length - 1];
            if (evento.shiftKey && document.activeElement === primeiro) { evento.preventDefault(); ultimo.focus(); }
            else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primeiro.focus(); }
        }
    });

    // Se a tela ficar grande (girar o celular), fecha o menu
    window.addEventListener("resize", function () {
        if (window.innerWidth > 900) fechar(false);
    });
}

// ---------- 8.2 BARRA DE AJUSTES DE ACESSIBILIDADE ----------
const NIVEIS_TEXTO = [100, 112, 125, 150];   // tamanhos em % (100 = normal)

function getAjustes() {
    return lerStorage("jotas_a11y", { nivel: 0, contraste: false, espacamento: false, alertaVisual: false });
}

// Aplica os ajustes: o CSS usa "rem", então mudar o font-size do <html>
// aumenta TODOS os textos do site de uma vez.
function aplicarAcessibilidade() {
    const a = getAjustes();
    const html = document.documentElement;
    html.style.fontSize = NIVEIS_TEXTO[a.nivel] + "%";
    html.classList.toggle("alto-contraste", a.contraste);
    html.classList.toggle("espacamento", a.espacamento);
}

function montarBarraAcessibilidade() {
    const caixa = document.createElement("div");
    caixa.className = "a11y";
    caixa.innerHTML =
        '<button type="button" class="a11y-abrir" id="a11y-abrir" aria-expanded="false" aria-controls="a11y-painel">' +
            icone("acessibilidade") + '<span>Acessibilidade</span></button>' +
        '<div class="a11y-painel" id="a11y-painel" role="group" aria-label="Ajustes de acessibilidade" hidden>' +
            '<p class="a11y-titulo">Tamanho do texto</p>' +
            '<div class="a11y-linha">' +
                '<button type="button" data-a11y="menos" aria-label="Diminuir texto">A−</button>' +
                '<button type="button" data-a11y="normal" aria-label="Tamanho normal do texto">A</button>' +
                '<button type="button" data-a11y="mais" aria-label="Aumentar texto">A+</button>' +
            '</div>' +
            '<button type="button" class="a11y-opcao" data-a11y="contraste" aria-pressed="false">Alto contraste</button>' +
            '<button type="button" class="a11y-opcao" data-a11y="espacamento" aria-pressed="false">Mais espaço entre letras e linhas</button>' +
            '<p class="a11y-titulo">Deficiência auditiva</p>' +
            // [A11Y] o site não usa som, mas este modo reforça visualmente os avisos
            // (toasts maiores, com borda piscando) para quem não conta com sinais sonoros.
            '<button type="button" class="a11y-opcao" data-a11y="alertaVisual" aria-pressed="false">' +
                icone("legenda") + ' Alertas visuais reforçados</button>' +
            '<p class="a11y-nota">Este site não usa áudio: todo aviso já aparece escrito na tela.</p>' +
            '<button type="button" class="a11y-opcao" data-a11y="limpar">Restaurar padrão</button>' +
        '</div>';
    document.body.appendChild(caixa);

    const abrir = document.getElementById("a11y-abrir");
    const painel = document.getElementById("a11y-painel");

    function atualizarBotoes() {
        const a = getAjustes();
        painel.querySelector('[data-a11y="contraste"]').setAttribute("aria-pressed", a.contraste);
        painel.querySelector('[data-a11y="espacamento"]').setAttribute("aria-pressed", a.espacamento);
        painel.querySelector('[data-a11y="alertaVisual"]').setAttribute("aria-pressed", a.alertaVisual);
        painel.querySelector('[data-a11y="menos"]').disabled = (a.nivel === 0);
        painel.querySelector('[data-a11y="mais"]').disabled = (a.nivel === NIVEIS_TEXTO.length - 1);
    }

    abrir.addEventListener("click", function () {
        const vaiAbrir = painel.hidden;
        painel.hidden = !vaiAbrir;
        abrir.setAttribute("aria-expanded", vaiAbrir);
        if (vaiAbrir) painel.querySelector("button:not(:disabled)").focus();
    });

    painel.addEventListener("click", function (evento) {
        const b = evento.target.closest("[data-a11y]");
        if (!b) return;
        const a = getAjustes();
        const acao = b.dataset.a11y;
        if (acao === "mais")   a.nivel = Math.min(a.nivel + 1, NIVEIS_TEXTO.length - 1);
        if (acao === "menos")  a.nivel = Math.max(a.nivel - 1, 0);
        if (acao === "normal") a.nivel = 0;
        if (acao === "contraste")    a.contraste = !a.contraste;
        if (acao === "espacamento")  a.espacamento = !a.espacamento;
        if (acao === "alertaVisual") a.alertaVisual = !a.alertaVisual;
        if (acao === "limpar") { a.nivel = 0; a.contraste = false; a.espacamento = false; a.alertaVisual = false; }
        salvarStorage("jotas_a11y", a);
        aplicarAcessibilidade();
        atualizarBotoes();
        // Se o botão clicado ficou desativado (limite de tamanho), passa o foco para o vizinho
        if (b.disabled) painel.querySelector("button:not(:disabled)").focus();
    });

    // ESC fecha o painel e devolve o foco ao botão
    caixa.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && !painel.hidden) {
            painel.hidden = true;
            abrir.setAttribute("aria-expanded", "false");
            abrir.focus();
        }
    });
    atualizarBotoes();
}
