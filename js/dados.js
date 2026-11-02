'use strict';
// ═══════════════════════════════════════════════════════════════
//  DADOS DO JOGO — ANIMAIS, PERGUNTAS E MAPA
// ═══════════════════════════════════════════════════════════════
//  PARA ACRESCENTAR UM ANIMAL: copie uma ficha e preencha tudo.
//  id        minúsculo, sem acento e sem espaço. É também o nome dos
//            arquivos: assets/images/animais/<id>.png,
//            assets/sounds/<id>.mp3 e assets/sprites/animais/<id>/
//  artigo    'o' ou 'a' (a narração diz "era a arara", "era o tatu")
//  som, imagem, libras
//            null enquanto o arquivo não existir; quando existir,
//            troque o null pelo caminho
//  tom       frequências dos bipes de reserva, se o som falhar
//  charadas  em 1ª pessoa, sem dizer o nome, terminando em "Quem sou eu?"
//  tracos    os 9 são obrigatórios: true = tem, false = não tem,
//            null = depende (o bicho fica fora daquela pergunta)
//  parecidos bichos fáceis de confundir com este: não aparecem juntos
//            como opções na sombra nem na charada
//  escalaMapa (opcional) tamanho do bicho passeando no mapa (1 = 64 px)
//
//  Textos em capitalização normal: a caixa alta vem do CSS, porque
//  leitores de tela soletram palavras escritas em maiúsculas.
// ═══════════════════════════════════════════════════════════════

const ANIMAIS = {

  // A arara do jogo é a arara-canindé, azul e amarela. A da abertura
  // (no kit) é outra, a arara-vermelha: não serve de sprite para esta.
  arara: {
    id: 'arara', nome: 'Arara', artigo: 'a', emoji: '🦜',
    som: 'assets/sounds/arara.mp3',
    tom: [880, 660, 990, 660, 880],
    onomatopeia: 'Aráááá! Aráááá!',
    charadas: [
      'Tenho penas azuis e amarelas bem coloridas, um bico grande e curvo, e voo bem alto entre as árvores. Quem sou eu?',
      'Sou uma ave bem colorida, adoro comer frutas e castanhas, e faço meu ninho no buraco dos troncos. Quem sou eu?',
      'Grito bem alto na floresta, tenho asas grandes e uma cauda comprida cheia de penas. Quem sou eu?',
    ],
    audiodescricao: 'Um pássaro grande de penas azuis nas costas e amarelas na barriga, com bico preto curvo.',
    libras: null,
    imagem: 'assets/images/animais/arara.png',
    cor: 'linear-gradient(135deg,#1565C0,#FFD700)',
    habitat: 'Floresta Amazônica',
    tracos: { penas:true, pelo:false, casco:false, voa:true, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:false },
    parecidos: [],
    curiosidade: 'A arara vive na Floresta Amazônica! 🌳 Ela ama árvores altíssimas e frutas tropicais.',
  },

  onca: {
    id: 'onca', nome: 'Onça', artigo: 'a', emoji: '🐆',
    som: 'assets/sounds/onca.mp3',
    tom: [220, 220, 196, 174, 220],
    onomatopeia: 'Rrroooar! Grrrr!',
    charadas: [
      'Meu pelo é amarelo cheio de pintinhas pretas, tenho garras bem fortes e ando sempre bem quietinha. Quem sou eu?',
      'Sou o maior gato selvagem das Américas, sei nadar muito bem e caço sozinha. Quem sou eu?',
      'Tenho bigodes compridos, dentes bem afiados, e minhas patas não fazem nenhum barulho no chão. Quem sou eu?',
    ],
    audiodescricao: 'Um felino grande de pelo amarelo coberto de manchas pretas arredondadas.',
    libras: null,
    imagem: 'assets/images/animais/onca.png',
    cor: 'linear-gradient(135deg,#FFD700,#FF8F00)',
    habitat: 'Pantanal',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:true, sobe:true, comeFrutas:false, comeCarne:true, comeInsetos:false },
    parecidos: ['gato'],
    curiosidade: 'A onça-pintada caça no Pantanal! 💧 É o maior felino das Américas.',
  },

  flamingo: {
    id: 'flamingo', nome: 'Flamingo', artigo: 'o', emoji: '🦩',
    som: 'assets/sounds/flamingo.mp3',
    tom: [523, 659, 784, 659, 523],
    onomatopeia: 'Gá-gá-gá!',
    charadas: [
      'Sou todo cor-de-rosa, tenho pernas bem compridas e fininhas, e durmo em pé numa perna só. Quem sou eu?',
      'Meu pescoço é comprido e curvado como um S, e eu procuro comida com a cabeça dentro da água. Quem sou eu?',
      'Vivo em bando perto da água rasa e fiquei todo rosa por causa daquilo que eu como. Quem sou eu?',
    ],
    audiodescricao: 'Uma ave rosa de pescoço comprido e curvo, em pé sobre pernas finas e altas.',
    libras: null,
    imagem: 'assets/images/animais/flamingo.png',
    cor: 'linear-gradient(135deg,#FF8F00,#E53935)',
    habitat: 'Lagoas rasas do litoral',
    tracos: { penas:true, pelo:false, casco:false, voa:true, nada:true, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:false },
    parecidos: [],
    curiosidade: 'O flamingo vive em lagoas de água rasa perto do mar! 🌊 Sua cor rosa vem dos alimentos que ele come.',
  },

  macaco: {
    id: 'macaco', nome: 'Macaco', artigo: 'o', emoji: '🐵',
    som: 'assets/sounds/macaco.mp3',
    tom: [392, 440, 494, 440, 392],
    onomatopeia: 'Uh-uh! Ah-ah!',
    charadas: [
      'Tenho pelo marrom, mãos parecidas com as suas e um rabo comprido para me pendurar nos galhos. Quem sou eu?',
      'Pulo de árvore em árvore, adoro frutas e sei usar pedrinhas para quebrar comida dura. Quem sou eu?',
      'Tenho cinco dedos em cada mão igual a você, e vivo em grupo lá no alto das árvores. Quem sou eu?',
    ],
    audiodescricao: 'Um animal peludo marrom, de rosto pequeno e cauda longa, sentado num galho.',
    libras: null,
    imagem: 'assets/images/animais/macaco.png',
    cor: 'linear-gradient(135deg,#FF8F00,#6D4C41)',
    habitat: 'Floresta Amazônica',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:true },
    parecidos: ['mico'],
    curiosidade: 'O macaco-prego vive na Floresta Amazônica! 🌳 Ele usa pedras para quebrar cocos.',
  },

  mico: {
    id: 'mico', nome: 'Mico-Leão', artigo: 'o', emoji: '🦁',
    som: 'assets/sounds/mico.mp3',
    tom: [660, 784, 988, 784, 660],
    onomatopeia: 'Piu-piu-piiii!',
    charadas: [
      'Sou pequenininho e todo dourado, com uma juba ao redor do rosto igualzinha à de um leão. Quem sou eu?',
      'Caibo quase na palma da mão, meu pelo brilha alaranjado no sol e eu moro na mata perto do mar. Quem sou eu?',
      'Sou um macaquinho bem raro, tenho rabo comprido e o pelo cor de ouro. Quem sou eu?',
    ],
    audiodescricao: 'Um macaquinho pequeno de pelo dourado brilhante, com muito pelo em volta da cara.',
    libras: null,
    imagem: 'assets/images/animais/mico.png',
    cor: 'linear-gradient(135deg,#FFD700,#FF8F00)',
    habitat: 'Mata Atlântica',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:true },
    parecidos: ['macaco'],
    curiosidade: 'O mico-leão-dourado vive na Mata Atlântica! 🌿 É um dos animais mais ameaçados do Brasil.',
  },

  tatu: {
    id: 'tatu', nome: 'Tatu', artigo: 'o', emoji: '🦔',
    som: 'assets/sounds/tatu.mp3',
    tom: [196, 220, 247, 220, 196],
    onomatopeia: 'Funf! Funf!',
    charadas: [
      'Carrego uma casquinha dura nas costas, tenho unhas fortes para cavar e me enrolo como uma bolinha. Quem sou eu?',
      'Faço buracos no chão para morar, minha armadura me protege e meu focinho é bem pontudo. Quem sou eu?',
      'Ando devagar pertinho do chão, uso minha carapaça de escudo e procuro formiguinhas para comer. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho baixo coberto por uma carapaça marrom de placas duras, com focinho pontudo.',
    libras: null,
    imagem: 'assets/images/animais/tatu.png',
    cor: 'linear-gradient(135deg,#8D6E63,#5D4037)',
    habitat: 'Caatinga',
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:false, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:true },
    parecidos: ['tartaruga'],
    curiosidade: 'O tatu vive na Caatinga! 🌵 Sua armadura de osso o protege dos predadores.',
  },

  capivara: {
    id: 'capivara', nome: 'Capivara', artigo: 'a', emoji: '🦫',
    som: 'assets/sounds/capivara.mp3',
    tom: [262, 330, 392, 330, 262],
    onomatopeia: 'Uíc-uíc!',
    charadas: [
      'Sou o maior roedor do mundo, tenho pelo marrom meio durinho e adoro tomar banho no rio. Quem sou eu?',
      'Pareço um porquinho-da-índia gigante, meus dentes da frente nunca param de crescer e eu nado muito bem. Quem sou eu?',
      'Vivo em grupo perto da água, como capim e fico horas dentro do rio só com o nariz de fora. Quem sou eu?',
    ],
    audiodescricao: 'Um roedor grande e gordinho, de pelo marrom curto, focinho quadrado e orelhas pequenas.',
    libras: null,
    imagem: 'assets/images/animais/capivara.png',
    cor: 'linear-gradient(135deg,#795548,#4E342E)',
    habitat: 'Pantanal',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:true, sobe:false, comeFrutas:true, comeCarne:false, comeInsetos:false },
    parecidos: [],
    curiosidade: 'A capivara vive perto de rios e lagoas, como no Pantanal! 💦 É o maior roedor do mundo!',
  },

  tartaruga: {
    id: 'tartaruga', nome: 'Tartaruga', artigo: 'a', emoji: '🐢',
    som: 'assets/sounds/tartaruga.mp3',
    tom: [330, 294, 262, 294, 330],
    onomatopeia: 'Pfff... (sopro)',
    charadas: [
      'Levo a minha casa nas costas, tenho nadadeiras no lugar das patas e nado bem devagarinho no mar. Quem sou eu?',
      'Meu casco é duro e arredondado, eu ponho meus ovos na areia da praia e volto sempre ao mesmo lugar. Quem sou eu?',
      'Nado no fundo do mar usando quatro remos, e posso viver muitos e muitos anos. Quem sou eu?',
    ],
    audiodescricao: 'Um animal de casco verde arredondado, com quatro nadadeiras abertas como remos.',
    libras: null,
    imagem: 'assets/images/animais/tartaruga.png',
    cor: 'linear-gradient(135deg,#006064,#0277BD)',
    habitat: 'Oceano Atlântico',
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:true, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:false },
    parecidos: ['tatu'],
    curiosidade: 'A tartaruga-marinha nada no Oceano Atlântico! 🌊 Ela volta à mesma praia onde nasceu para desovar.',
  },

  caranguejo: {
    id: 'caranguejo', nome: 'Caranguejo', artigo: 'o', emoji: '🦀',
    som: null,      // quando tiver: 'assets/sounds/caranguejo.mp3'
    tom: [700, 520, 700, 520, 700],
    onomatopeia: 'Clac! Clac!',
    charadas: [
      'Ando de lado, tenho duas pinças bem fortes e uma casca dura que me protege. Quem sou eu?',
      'Moro em buracos na lama do manguezal, tenho dez patas e meus olhos ficam em cima de hastinhas. Quem sou eu?',
      'Meu esqueleto fica do lado de fora do corpo e eu troco de casca quando fico grande. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho de corpo redondo e achatado, coberto por uma casca dura, com duas pinças grandes na frente, olhos em cima de hastes e várias patas finas nas laterais.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/caranguejo.png'
    cor: 'linear-gradient(135deg,#FF7043,#BF360C)',
    habitat: 'Manguezal',
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:false, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:false },
    parecidos: [],
    curiosidade: 'O caranguejo vive no Manguezal! 🦀 Ele tem o esqueleto por fora do corpo e troca de casca quando cresce.',
  },

  // ── NOVOS NA 3.0 ──────────────────────────────────────────────

  gato: {
    id: 'gato', nome: 'Gato', artigo: 'o', emoji: '🐱',
    som: null,      // quando tiver: 'assets/sounds/gato.mp3'
    tom: [740, 880, 660],
    onomatopeia: 'Miau! Miau!',
    charadas: [
      'Tenho bigodes, pelo macio e faço ronrom quando ganho carinho. Quem sou eu?',
      'Tomo banho me lambendo, adoro brincar com bolinha de lã e quase sempre caio de pé quando pulo. Quem sou eu?',
      'Escondo as unhas dentro das patinhas, meus olhos brilham no escuro e adoro caçar ratinhos. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho de estimação de pelo macio, orelhas pontudas, bigodes compridos e rabo levantado.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/gato.png'
    cor: 'linear-gradient(135deg,#FFB74D,#E65100)',
    habitat: 'Casa (animal doméstico)',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:null, sobe:true, comeFrutas:false, comeCarne:true, comeInsetos:null },
    parecidos: ['onca'],
    curiosidade: 'O gato é um animal doméstico: mora com a gente em casa! 🏠 Ele dorme boa parte do dia.',
  },

  cachorro: {
    id: 'cachorro', nome: 'Cachorro', artigo: 'o', emoji: '🐶',
    som: null,      // quando tiver: 'assets/sounds/cachorro.mp3'
    tom: [392, 392, 330, 392, 392],
    onomatopeia: 'Au au! Au au!',
    charadas: [
      'Sou o melhor amigo das pessoas, abano o rabo quando fico feliz e adoro buscar a bolinha. Quem sou eu?',
      'Meu focinho sente cheiro de longe, eu tomo conta da casa e lato quando chega alguém. Quem sou eu?',
      'Adoro passear de coleira, roer um ossinho e ganhar carinho na barriga. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho de estimação peludo, de orelhas caídas, focinho preto e rabo abanando.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/cachorro.png'
    cor: 'linear-gradient(135deg,#BCAAA4,#5D4037)',
    habitat: 'Casa (animal doméstico)',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:true, sobe:false, comeFrutas:null, comeCarne:true, comeInsetos:false },
    parecidos: [],
    curiosidade: 'O cachorro é um animal doméstico: mora com a gente em casa! 🏠 O focinho dele sente cheiros muito melhor que o nosso nariz.',
  },

  mosquito: {
    id: 'mosquito', nome: 'Mosquito', artigo: 'o', emoji: '🦟',
    som: null,      // quando tiver: 'assets/sounds/mosquito.mp3'
    tom: [880, 920, 880, 920, 880, 920],
    onomatopeia: 'Zum-zum-zum! Zuuuum!',
    charadas: [
      'Sou bem pequenininho, tenho asas fininhas e faço zum-zum no seu ouvido de noite. Quem sou eu?',
      'Nasço na água parada e, quando cresço, saio voando e dou picadas que coçam. Quem sou eu?',
      'Tenho seis patinhas bem finas e uma boca comprida e fininha, igual a um canudinho. Quem sou eu?',
    ],
    audiodescricao: 'Um inseto bem pequeno, de corpo fino, asas transparentes e patas longas e finas.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/mosquito.png'
    cor: 'linear-gradient(135deg,#B0BEC5,#37474F)',
    habitat: 'Água parada, em todo o Brasil',
    tracos: { penas:false, pelo:false, casco:false, voa:true, nada:null, sobe:false, comeFrutas:null, comeCarne:null, comeInsetos:false },
    parecidos: [],
    curiosidade: 'O mosquito nasce na água parada! 💧 Por isso não podemos deixar água acumulada em pneus, vasos e garrafas.',
  },

  cascavel: {
    id: 'cascavel', nome: 'Cascavel', artigo: 'a', emoji: '🐍',
    som: null,      // quando tiver: 'assets/sounds/cascavel.mp3'
    tom: [1200, 1000, 1200, 1000, 1200, 1000],
    onomatopeia: 'Tchic-tchic-tchic! Sssss!',
    charadas: [
      'Não tenho patas, ando arrastando a barriga no chão e tenho um chocalho na ponta do rabo. Quem sou eu?',
      'Meu corpo é comprido e coberto de escamas, e eu balanço o rabo fazendo barulho para dizer: fique longe! Quem sou eu?',
      'Ponho a língua para fora para sentir os cheiros e troco de pele quando cresço. Quem sou eu?',
    ],
    audiodescricao: 'Uma cobra comprida, de escamas marrons com desenhos de losango nas costas e um chocalho na ponta do rabo.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/cascavel.png'
    cor: 'linear-gradient(135deg,#D4E157,#827717)',
    habitat: 'Cerrado',
    tracos: { penas:false, pelo:false, casco:false, voa:false, nada:null, sobe:null, comeFrutas:false, comeCarne:true, comeInsetos:false },
    parecidos: [],
    curiosidade: 'A cascavel vive no Cerrado! 🌾 Quando ela balança o chocalho, está avisando: fique longe! Se ouvir esse barulho, afaste-se e chame um adulto.',
  },
};

// ═══════════════════════════════════════════════════════════════
//  PERGUNTAS DE CARACTERÍSTICA (uma das versões da 2ª etapa)
//  Cada pergunta olha UM traço. A palavra-chave vai entre asteriscos:
//  a tela destaca, a narração lê sem eles.
//  Pergunta nova = traço novo em TODAS as fichas + uma linha aqui.
// ═══════════════════════════════════════════════════════════════
const PERGUNTAS = [
  // Corpo — o mais concreto para a idade
  { traco:'penas',       icone:'🪶', texto:'Qual destes animais tem *penas*?' },
  { traco:'pelo',        icone:'🧸', texto:'Qual destes animais tem *pelo*?' },
  { traco:'casco',       icone:'🛡️', texto:'Qual destes animais tem uma *casca dura*?' },
  // Movimento — fácil de imitar na sala
  { traco:'voa',         icone:'🕊️', texto:'Qual destes animais *voa*?' },
  { traco:'nada',        icone:'🌊', texto:'Qual destes animais *nada*?' },
  { traco:'sobe',        icone:'🌳', texto:'Qual destes animais *sobe* nas árvores?' },
  // Alimentação
  { traco:'comeFrutas',  icone:'🍌', texto:'Qual destes animais come *frutas*?' },
  { traco:'comeCarne',   icone:'🥩', texto:'Qual destes animais come *carne*?' },
  { traco:'comeInsetos', icone:'🐜', texto:'Qual destes animais come *insetos*?' },
];

// ═══════════════════════════════════════════════════════════════
//  O MAPA — mapa novo (do kit)
//  As moitas guardam só a posição: quais bichos cada uma esconde é
//  sorteado a cada partida. Coordenadas em pixels do desenho do mapa.
//  Trocou o desenho? Reveja estes números e refaça js/trilhas.js com
//  ferramentas/gerar-trilhas.html.
// ═══════════════════════════════════════════════════════════════
const MAPA = {
  nome: 'Fauna Brasileira',
  badge: '🌿',
  largura: 1536,
  altura: 1024,
  // A árvore do final fica ao lado do lago do centro, perto da trilha
  arvore: { x: 655, y: 495 },
  // O sapo nasce EM CIMA da trilha, logo abaixo da árvore
  inicio: { x: 676, y: 556 },
  // Âncoras das 6 moitas, na ordem em que abrem (sentido horário).
  // Já estão sobre a trilha do js/trilhas.js do kit; cada uma passeia
  // até `raio` px daqui (ver referencias/trilhas-e-moitas-no-mapa.png).
  moitas: [
    { x: 100,  y: 204, raio: 90 },   // clareira de areia, canto de cima à esquerda
    { x: 740,  y: 252, raio: 90 },   // curva da trilha no meio de cima
    { x: 1388, y: 252, raio: 90 },   // à direita do lago, canto de cima à direita
    { x: 1196, y: 852, raio: 90 },   // perto da cachoeira, canto de baixo à direita
    { x: 668,  y: 876, raio: 90 },   // trilha do meio de baixo
    { x: 156,  y: 820, raio: 90 },   // à beira do lago, canto de baixo à esquerda
  ],
  // Pontos sobre a água do mapa novo, onde acendem os brilhos (5.2).
  // Medidos no fundo.png: pixel azul (matiz 175–220°, saturação e
  // brilho de pelo menos 45%), em pedaços de água de pelo menos 400 px,
  // a 6 px ou mais da margem e 12 px da borda do mapa, um ponto a cada
  // 30 px. As elipses da rodada 4 cobriam pouca água e o brilho
  // acendia no mato. Trocou o mapa? Refaça a lista com
  // ferramentas/gerar-trilhas.html.
  brilhosAgua: [
    [481,38], [503,59], [513,30], [463,104], [509,119], [542,96], [575,107], [521,150],
    [560,154], [564,184], [597,164], [597,130], [1205,245], [1240,232], [1294,247], [1204,278],
    [1206,308], [1235,266], [1242,301], [1266,267], [1290,298], [1309,274], [502,440], [546,428],
    [812,392], [844,413], [459,456], [478,505], [484,473], [508,500], [530,454], [539,508],
    [561,454], [577,497], [854,509], [1328,476], [1344,507], [1366,485], [1371,454], [1396,494],
    [1402,458], [499,529], [865,546], [1376,517], [881,577], [908,592], [930,615], [927,655],
    [954,676], [964,725], [326,811], [211,888], [241,868], [275,863], [307,865], [309,895],
    [1347,862], [228,913], [256,900], [1299,955], [1333,923], [1360,908], [1327,972], [1350,992],
    [1379,982], [1430,995],
  ],
};
