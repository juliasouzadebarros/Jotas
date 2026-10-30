/* =====================================================================
   ARQUIVO: js/dados.js
   RESPONSÁVEL: Equipe de Dados (quem cuida dos produtos do site)
   ---------------------------------------------------------------------
   Aqui ficam os "dados" do site: lista de produtos, lojas e notificações.
   Como não temos back-end, usamos arrays de objetos do JavaScript.

   COMO ADICIONAR UM PRODUTO NOVO (só 2 passos!):
   1) Coloque a foto na pasta /imagens
   2) Copie um objeto abaixo, cole no fim do array PRODUTOS e mude os campos
   A página do produto (produto.html?id=...) é criada sozinha pelo JS.
   ATENÇÃO: o "id" tem que ser ÚNICO e não pode ter espaço!
   Se a "categoria" for nova, adicione também no array CATEGORIAS.

   FOTOS: cada produto deve apontar para uma imagem de produto.
   Os produtos novos usam imagens externas para evitar ilustrações provisórias.
   Lembre de escrever o texto alternativo (alt) com o nome do produto: o JS já faz isso.
   ===================================================================== */

const PRODUTOS = [
    {
        id: "ps5-dualsense",
        nome: "Sony DualSense Edge (PS5)",
        categoria: "Games",
        imagem: "imagens/controle_ps5_black.webp",
        precoOriginal: 1199.00,
        precoAtual: 999.00,
        nota: 4.8,
        avaliacoes: 1284,
        detalhes: [
            ["Controles Traseiros Reconfiguráveis", "Duas pás traseiras trocáveis para mapear atalhos rápidos sem tirar os polegares dos analógicos."],
            ["Ajuste de Gatilhos", "Travas físicas nos gatilhos (R2/L2) para encurtar a distância de disparo em jogos de tiro."],
            ["Módulos do Analógico Substituíveis", "Permite trocar apenas o módulo do stick caso ocorra desgaste ou drift, sem precisar trocar o controle inteiro."],
            ["Perfis e Botões Fn", "Botões dedicados para alternar perfis de mapeamento e ajustar o volume/balanço de áudio em tempo real."],
            ["Imersão Imersiva do DualSense", "Mantém o feedback tátil e os gatilhos adaptáveis do modelo original."]
        ]
    },
    {
        id: "apple-watch-s2",
        nome: "Apple Watch Series 2",
        categoria: "Smartwatches",
        imagem: "imagens/Apple-2030-Watch.jpg",
        precoOriginal: 9699.00,
        precoAtual: 7999.00,
        nota: 4.7,
        avaliacoes: 642,
        detalhes: [
            ["Resistência à Água (50m)", "Construção pronta para natação e esportes aquáticos, com sistema de drenagem do alto-falante por vibração."],
            ["GPS Integrado", "Permite rastrear corridas e caminhadas com precisão sem a necessidade de levar o iPhone junto."],
            ["Tela OLED Mais Brilhante", "Painel Retina com até 1.000 nits de brilho (2x mais brilhante que a 1ª geração), facilitando a leitura sob luz solar direta."],
            ["Desempenho (Processador S2)", "Chip dual-core mais rápido, garantindo melhor fluidez em aplicativos e no sistema watchOS."],
            ["Opções de Caixa e Tamanhos", "Disponível nos tamanhos de 38 mm e 42 mm em caixas de alumínio, aço inoxidável ou cerâmica (Edition)."]
        ]
    },
    {
        id: "tablet-m11",
        nome: "Tablet Le Novo M11",
        categoria: "Tablets",
        imagem: "imagens/tablet_le_novo_M11.avif",
        precoOriginal: 1799.99,
        precoAtual: 1000.00,
        nota: 4.5,
        avaliacoes: 918,
        detalhes: [
            ["Processador", "MediaTek Helio G80 Octa-core, garantindo desempenho eficiente para multitarefas e jogos."],
            ["Tela", "11 polegadas IPS LCD com resolução de 2000 x 1200 pixels, proporcionando cores vibrantes e ângulos de visão amplos."],
            ["Armazenamento", "64GB de armazenamento interno, expansível via cartão microSD até 256GB."],
            ["Bateria", "Capacidade de 7500mAh, oferecendo até 10 horas de uso contínuo com uma única carga."],
            ["Sistema Operacional", "Android 11, com acesso à Google Play Store e suporte a aplicativos populares."]
        ]
    },
    {
        id: "veatool-fone",
        nome: "VEATOOL Bluetooth Headphones",
        categoria: "Fones de ouvido",
        imagem: "imagens/VEATOOL-Bluetooth-Headphones-True-Wireless-Earbuds-65H.jpeg",
        precoOriginal: 185.00,
        precoAtual: 129.90,
        nota: 4.6,
        avaliacoes: 2103,
        detalhes: [
            ["Conectividade Bluetooth 5.0", "Permite uma conexão estável e rápida com dispositivos compatíveis, garantindo áudio de alta qualidade sem interrupções."],
            ["Design Ergonômico", "Fones de ouvido leves e confortáveis, ideais para uso prolongado sem causar desconforto."],
            ["Bateria de Longa Duração", "Até 65 horas de reprodução contínua com uma única carga, permitindo uso durante todo o dia."],
            ["Microfone Integrado", "Facilita chamadas em mãos livres com clareza de voz, ideal para reuniões e conversas."],
            ["Compatibilidade Universal", "Funciona com smartphones, tablets, laptops e outros dispositivos habilitados para Bluetooth."]
        ]
    },
    {
        id: "xbox-g7",
        nome: "Controle Xbox G7",
        categoria: "Games",
        imagem: "imagens/controle_G7_xbox.jpg",
        precoOriginal: 299.00,
        precoAtual: 199.00,
        nota: 4.4,
        avaliacoes: 756,
        detalhes: [
            ["Compatibilidade", "Funciona com Xbox Series X|S, Xbox One, Windows 10/11 e dispositivos móveis via Bluetooth."],
            ["Design Ergonômico", "Formato confortável para longas sessões de jogo, com texturas antiderrapantes nos gatilhos e alças."],
            ["Botões Programáveis", "Permite personalizar os botões traseiros para ações rápidas em jogos competitivos."],
            ["Bateria de Longa Duração", "Até 40 horas de uso contínuo com pilhas AA ou bateria recarregável opcional."],
            ["Conectividade Sem Fio", "Conexão estável e de baixa latência para uma experiência de jogo fluida."]
        ]
    },
    {
        id: "headset-gamer",
        nome: "Headset Gamer 7.1 com Microfone",
        categoria: "Games",
        imagem: "https://i5.walmartimages.com/seo/Razer-Kraken-V3-X-Wired-USB-Type-A-Gaming-Headset-for-PC-PS5-PS4-Chroma-RGB-Black-0-62-lb_b6f55dc4-d2d3-4e95-b2be-f0f882f4b064.4bc7fdcd91c0e5fb019161c932acc104.jpeg?odnBg=FFFFFF&odnHeight=573&odnWidth=573",
        precoOriginal: 349.90,
        precoAtual: 249.90,
        nota: 4.5,
        avaliacoes: 1432,
        detalhes: [
            ["Som envolvente 7.1", "Ajuda a perceber de que lado vem cada passo ou tiro nos jogos."],
            ["Microfone removível", "Com cancelamento de ruído para conversar com o time."],
            ["Almofadas macias", "Conforto para sessões longas de jogo."]
        ]
    },
    {
        id: "mouse-gamer",
        nome: "Mouse Gamer RGB 12000 DPI",
        categoria: "Games",
        imagem: "https://m.media-amazon.com/images/I/61U1x0-SJ7L._AC_SL1500_.jpg",
        precoOriginal: 159.90,
        precoAtual: 99.90,
        nota: 4.6,
        avaliacoes: 3120,
        detalhes: [
            ["Sensor de 12000 DPI", "Sensibilidade ajustável por botão."],
            ["6 botões programáveis", "Configure atalhos para o seu estilo de jogo."],
            ["Iluminação RGB", "Várias cores e efeitos de luz."]
        ]
    },
    {
        id: "notebook-15",
        nome: "Notebook 15,6\" 8GB 512GB SSD",
        categoria: "Informática",
        imagem: "https://i5-mx.walmartimages.com/mg/gm/3pp/asr/d3da9946-5fe7-4f25-b249-df0541148b63.eb97ca1ecd8adcfc93ab9bcd6ef21398.jpeg?odnBg=FFFFFF&odnHeight=612&odnWidth=612",
        precoOriginal: 3299.00,
        precoAtual: 2799.00,
        nota: 4.9,
        avaliacoes: 846,
        detalhes: [
            ["Tela de 15,6 polegadas", "Full HD, boa para estudar e trabalhar."],
            ["8GB de memória e SSD de 512GB", "Abre programas e arquivos rapidamente."],
            ["Bateria para o dia de aula", "Até 8 horas de uso leve."]
        ]
    },
    {
        id: "teclado-mecanico",
        nome: "Teclado Mecânico Compacto",
        categoria: "Informática",
        imagem: "https://m.media-amazon.com/images/I/61If22BpmQL._AC_SL1500_.jpg",
        precoOriginal: 279.90,
        precoAtual: 199.90,
        nota: 4.7,
        avaliacoes: 1875,
        detalhes: [
            ["Switches mecânicos", "Resposta rápida e som agradável ao digitar."],
            ["Formato compacto", "Ocupa menos espaço na mesa."],
            ["Conexão USB-C", "Cabo removível e fácil de trocar."]
        ]
    },
    {
        id: "mochila-notebook",
        nome: "Mochila para Notebook 15,6\"",
        categoria: "Informática",
        imagem: "https://static.wixstatic.com/media/085579_a82a1c7a783b49e1bf9c6e0d826cf589~mv2.jpg/v1/fill/w_900%2Ch_900%2Cal_c%2Cq_85%2Cenc_avif%2Cquality_auto/085579_a82a1c7a783b49e1bf9c6e0d826cf589~mv2.jpg",
        precoOriginal: 249.90,
        precoAtual: 199.90,
        nota: 4.6,
        avaliacoes: 742,
        detalhes: [
            ["Compartimento acolchoado", "Protege o notebook de batidas."],
            ["Tecido resistente à água", "Suporta chuva fraca."],
            ["Alças ergonômicas", "Distribuem melhor o peso nas costas."]
        ]
    },
    {
        id: "airfryer-4l",
        nome: "Fritadeira Elétrica Air Fryer 4L",
        categoria: "Eletrodomésticos",
        imagem: "https://carrefourbr.vtexassets.com/arquivos/ids/136407526-848-848/3254542_1.jpg?v=638406786275100000",
        precoOriginal: 699.90,
        precoAtual: 499.90,
        nota: 4.6,
        avaliacoes: 987,
        detalhes: [
            ["Capacidade de 4 litros", "Serve de 3 a 4 pessoas."],
            ["Fritura sem óleo", "Receitas mais leves e práticas."],
            ["Painel digital", "Temperatura e tempo com poucos toques."]
        ]
    },
    {
        id: "microondas-23l",
        nome: "Micro-ondas 23L",
        categoria: "Eletrodomésticos",
        imagem: "https://consul.vtexassets.com/arquivos/ids/283815-1440-auto/01_Consul_Micro_ondas_CMS23AE.webp?quality=80&v=639107534154700000",
        precoOriginal: 999.90,
        precoAtual: 649.90,
        nota: 4.7,
        avaliacoes: 1210,
        detalhes: [
            ["Capacidade de 23 litros", "Bom tamanho para cozinhas pequenas."],
            ["Funções prontas", "Descongelar, pipoca e reaquecer."],
            ["Trava de segurança", "Protege crianças contra uso acidental."]
        ]
    },
    {
        id: "cafeteira-expresso",
        nome: "Cafeteira Expresso Mini",
        categoria: "Eletrodomésticos",
        imagem: "https://cb.scene7.com/is/image/Crate/BrevilleBSBrsExpImpSSS24_VND?$web_pdp_main_carousel_thumb_med$=",
        precoOriginal: 799.00,
        precoAtual: 589.90,
        nota: 4.8,
        avaliacoes: 655,
        detalhes: [
            ["Cápsulas", "Café pronto em menos de um minuto."],
            ["Design compacto", "Cabe em qualquer bancada."],
            ["Desligamento automático", "Economiza energia."]
        ]
    },
    {
        id: "aspirador-vertical",
        nome: "Aspirador de Pó Vertical",
        categoria: "Eletrodomésticos",
        imagem: "https://m.magazineluiza.com.br/a-static/420x420/aspirador-de-po-vertical-britania-bas1290v-2-em-1-vermelho-1250w-1-litro/efacil/2222564/49f98b2ce2a059647f6ac31762af2832.jpeg",
        precoOriginal: 499.90,
        precoAtual: 349.90,
        nota: 4.4,
        avaliacoes: 532,
        detalhes: [
            ["Leve e prático", "Fácil de guardar em pé."],
            ["Filtro lavável", "Não precisa comprar refil."],
            ["Cabo de 5 metros", "Alcança a sala inteira."]
        ]
    },
    {
        id: "vaso-ceramica",
        nome: "Vaso de Cerâmica Minimalista 20cm",
        categoria: "Decoração",
        imagem: "https://d2j8fs2ysc1prx.cloudfront.net/image/689692738949/ca0849441404438d82ab3e0281c26b38/-FWEBP-S3840",
        precoOriginal: 129.90,
        precoAtual: 87.90,
        nota: 4.8,
        avaliacoes: 523,
        detalhes: [
            ["Cerâmica de qualidade", "Acabamento fosco e delicado."],
            ["Altura de 20 cm", "Combina com plantas e flores."],
            ["Estilo minimalista", "Fica bem em qualquer ambiente."]
        ]
    },
    {
        id: "abajur-madeira",
        nome: "Abajur de Mesa Moderno Base de Madeira",
        categoria: "Decoração",
        imagem: "https://assets.kmart.com.au/transform/3159d6be-c4f2-4105-986c-7912b931c33f/43633388-1?io=transform%3Afit%2Cwidth%3A3840%2Cheight%3A4800&quality=90",
        precoOriginal: 249.90,
        precoAtual: 149.90,
        nota: 4.6,
        avaliacoes: 367,
        detalhes: [
            ["Base de madeira", "Peso firme, não tomba fácil."],
            ["Luz aconchegante", "Ideal para quarto e sala."],
            ["Cúpula de tecido", "Espalha a luz de forma suave."]
        ]
    },
    {
        id: "quadros-decorativos",
        nome: "Kit 3 Quadros Decorativos Moldura Madeira",
        categoria: "Decoração",
        imagem: "https://m.media-amazon.com/images/I/61z93r8ej-L._AC_SL1000_.jpg",
        precoOriginal: 199.90,
        precoAtual: 149.90,
        nota: 4.7,
        avaliacoes: 812,
        detalhes: [
            ["Kit com 3 quadros", "Composição pronta para pendurar."],
            ["Moldura de madeira", "Acabamento resistente."],
            ["Arte botânica", "Tons suaves e neutros."]
        ]
    },
    {
        id: "tapete-redondo",
        nome: "Tapete Redondo Sala 1,50m",
        categoria: "Decoração",
        imagem: "https://product-hub-prd.madeiramadeira.com.br/697205/images/19dcfe69-b6eb-4786-864a-46cd5e059f20oliso150m1635262153194zoom.jpg",
        precoOriginal: 219.90,
        precoAtual: 157.90,
        nota: 4.5,
        avaliacoes: 621,
        detalhes: [
            ["Diâmetro de 1,50 m", "Ideal para sala e quarto."],
            ["Base antiderrapante", "Mais segurança no dia a dia."],
            ["Fácil de limpar", "Pode ser aspirado ou passado pano úmido."]
        ]
    },
    {
        id: "sofa-3-lugares",
        nome: "Sofá Retrátil e Reclinável 3 Lugares Suede",
        categoria: "Móveis",
        imagem: "https://i5.walmartimages.com/asr/4e8d6caf-b705-4b10-8e7b-b1bd6f7c00ce.3f0e786f00461f8a460f5a509fd6097b.jpeg?odnBg=FFFFFF&odnHeight=612&odnWidth=612",
        precoOriginal: 2399.00,
        precoAtual: 1899.00,
        nota: 4.7,
        avaliacoes: 612,
        detalhes: [
            ["3 lugares", "Encosto reclinável e assento retrátil."],
            ["Tecido suede", "Toque macio e agradável."],
            ["Estrutura reforçada", "Feita para uso diário."]
        ]
    },
    {
        id: "mesa-jantar",
        nome: "Mesa de Jantar 6 Cadeiras Madeira",
        categoria: "Móveis",
        imagem: "https://i5.walmartimages.cl/asr/54e0d54f-1bc2-4ab8-8213-ce8186a1763f.35ce1ba16ca07e1f07fa0716722e1a6d.jpeg?null=&odnBg=FFFFFF&odnHeight=612&odnWidth=612",
        precoOriginal: 1599.00,
        precoAtual: 1299.00,
        nota: 4.8,
        avaliacoes: 543,
        detalhes: [
            ["Acompanha 6 cadeiras", "Pronta para receber a família."],
            ["Madeira maciça", "Estrutura resistente e durável."],
            ["Montagem simples", "Manual ilustrado incluso."]
        ]
    },
    {
        id: "livro-python",
        nome: "Livro: Aprendendo Python do Zero",
        categoria: "Livros",
        imagem: "https://i5.walmartimages.com/seo/Learn-Python-Programming-Beginners-Complete-Guide-Learn-Coding-Python-Become-Fluent-High-Level-Programming-Language-Paperback-9798682523313_398531a8-534e-4945-93f3-e68fab52c02a.468966826080734cf3de168bcad6ffab.jpeg",
        precoOriginal: 89.90,
        precoAtual: 59.90,
        nota: 4.9,
        avaliacoes: 2210,
        detalhes: [
            ["Para iniciantes", "Explica lógica de programação passo a passo."],
            ["Exercícios resolvidos", "Pratique depois de cada capítulo."],
            ["Projetos práticos", "Do primeiro programa a um pequeno sistema."]
        ]
    },
    {
        id: "caixa-som",
        nome: "Caixa de Som Bluetooth Portátil",
        categoria: "Fones de ouvido",
        imagem: "https://media.ldlc.com/r705/ld/products/00/06/23/20/LD0006232034.jpg",
        precoOriginal: 249.90,
        precoAtual: 169.90,
        nota: 4.6,
        avaliacoes: 1740,
        detalhes: [
            ["Bluetooth 5.0", "Conexão estável até 10 metros."],
            ["Bateria de 12 horas", "Leve para a praia ou a viagem."],
            ["Resistente à água", "Protegida contra respingos."]
        ]
    },
    {
        id: "pulseira-fitness",
        nome: "Pulseira Inteligente Fitness",
        categoria: "Smartwatches",
        imagem: "https://image.made-in-china.com/202f0j00iGRqHmwlfgkN/Smart-Watch-Rejor-Stainless-Steel-Mul-Function-IP68-Bt-Smartwatch-Heart-Rate-Sport-Bracelet-Band-Fitness-Tracker-Blood-Pressure-Monitoring-Smartwatch.webp",
        precoOriginal: 199.90,
        precoAtual: 129.90,
        nota: 4.3,
        avaliacoes: 978,
        detalhes: [
            ["Monitor de batimentos", "Acompanha os batimentos durante o dia."],
            ["Contador de passos", "Meta diária configurável."],
            ["Bateria de 10 dias", "Carrega rápido por USB."]
        ]
    }
];

// Endereço da página de um produto (usado em todos os links de produto)
function urlProduto(p) {
    return "produto.html?id=" + encodeURIComponent(p.id);
}

// Lista usada nos "chips" da página de Categorias.
// O campo "icone" precisa existir no objeto ICONES (js/script.js).
const CATEGORIAS = [
    { nome: "Games", icone: "games" },
    { nome: "Smartwatches", icone: "watch" },
    { nome: "Fones de ouvido", icone: "fones" },
    { nome: "Tablets", icone: "tablet" },
    { nome: "Informática", icone: "notebook" },
    { nome: "Eletrodomésticos", icone: "casa" },
    { nome: "Decoração", icone: "decoracao" },
    { nome: "Móveis", icone: "sofa" },
    { nome: "Livros", icone: "livro" }
];

// Lojas favoritas (página Favoritos). São lojas fictícias do projeto.
const LOJAS = [
    { nome: "Games Center",      nota: 4.8, avaliacoes: 12543, selo: "Produtos originais" },
    { nome: "Smart Tech Store",  nota: 4.7, avaliacoes: 8921,  selo: "Produtos originais" },
    { nome: "Som & Cia",         nota: 4.6, avaliacoes: 4230,  selo: "Produtos de qualidade" }
];

// Notificações (página Notificações). "idProduto" liga com o array PRODUTOS.
const NOTIFICACOES = [
    { idProduto: "ps5-dualsense",  texto: "Julia, uma nova oferta está disponível!" },
    { idProduto: "apple-watch-s2", texto: "Julia, o preço deste produto baixou!" },
    { idProduto: "xbox-g7",        texto: "Julia, aproveite: este item entrou em promoção!" }
];

// Compras antigas (página Histórico, parte "Suas compras").
const COMPRAS = [
    { idProduto: "ps5-dualsense",  data: "01/01/2024" },
    { idProduto: "apple-watch-s2", data: "15/02/2024" }
];
