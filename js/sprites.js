'use strict';
// ═══════════════════════════════════════════════════════════════
//  SPRITES — ONDE ENTRAM AS ANIMAÇÕES E OS FUNDOS
// ═══════════════════════════════════════════════════════════════
//  Cada animação é uma FOLHA: um PNG com vários quadros do mesmo
//  tamanho em grade, lidos da esquerda para a direita, linha por linha.
//    arquivo      caminho da folha (ou arquivos: [...], um PNG por quadro)
//    quadroL      largura de UM quadro, em pixels
//    quadroA      altura de UM quadro, em pixels
//    colunas      quantos quadros cabem numa linha da folha
//    quadros      quantos quadros a animação usa
//    linha        (opcional) linha da folha em que a animação começa; padrão 0
//    fps          quadros por segundo (0 = imagem parada)
//    loop         true repete; false para no último quadro
//    sequencia    (opcional) ordem dos quadros; repetir um número segura
//                 aquele quadro: [0,0,0,1,0] = parado, pisca de vez em quando
//    ancora       ponto do quadro que fica na posição: {x:.5, y:1} = meio
//                 do pé (para quem voa, o meio do corpo)
//    olhaPara     (opcional) 'direita' (padrão) ou 'esquerda'
//    alturaNoMapa (opcional) altura desenhada no mapa, em pixels do mapa
//
//  ativo:false = o arquivo ainda não existe e o jogo usa a reserva.
//  Pôs o arquivo na pasta? Troque para ativo:true e abra
//  ferramentas/conferir-arquivos.html para ver se as medidas batem.
//  Pixel art: o ideal são quadros de 64 ou 128 px, mas qualquer
//  tamanho serve, desde que o manifesto diga qual.
// ═══════════════════════════════════════════════════════════════

const SPRITES = {

  // ── SAPO EXPLORADOR ──────────────────────────────────────────
  sapo: {
    alturaNoMapa: 90,
    // Sapo novo (estilo da folha de referência): visto de lado, olhando
    // para a direita. Para a esquerda, o jogo espelha; para cima ou para
    // baixo, mantém o último lado. Entra quando os dois estiverem ligados.
    parado:  { ativo:false, arquivo:'assets/sprites/sapo/parado.png',  quadroL:128, quadroA:128, colunas:4, quadros:4, fps:6,  loop:true, ancora:{x:.5, y:.95} },
    andando: { ativo:false, arquivo:'assets/sprites/sapo/andando.png', quadroL:128, quadroA:128, colunas:6, quadros:6, fps:10, loop:true, ancora:{x:.5, y:.95} },
    // Enquanto o sapo novo não chega: o sapo do tronco da abertura (kit),
    // já no estilo novo. Parado, usa SPRITES.abertura.sapo.parado (pisca,
    // sorri e coaxa); andando, o 1º quadro dela dando pulinhos por código.
    // O pulo da abertura NÃO serve para andar: sobe mais que o dobro da
    // altura do sapo.
    tronco: { ativo:true, alturaNoMapa:72, pulinho:{ altura:8, porSegundo:3 } },
    // Reserva final: a folha da 2.0, com 4 linhas (baixo, cima, esquerda,
    // direita) × 4 quadros de 180×210 e ciclo de 0,92 s.
    antigo: {
      ativo: true, arquivo: 'assets/images/sapo-sprite.png',
      quadroL: 180, quadroA: 210, colunas: 4, quadros: 4, fps: 4.35, loop: true,
      linhas: { baixo: 0, cima: 1, esquerda: 2, direita: 3 },
      ancora: { x: 0.5, y: 1 },
    },
  },

  // ── MOITA ────────────────────────────────────────────────────
  // Na folha de referência: "Arbusto" (Tiles Animados) e "Explosão de folhas".
  moita: {
    alturaNoMapa: 110,
    parada:     { ativo:false, arquivo:'assets/sprites/moita/parada.png',     quadroL:128, quadroA:128, colunas:4, quadros:4, fps:4,  loop:true,  ancora:{x:.5, y:.95} },
    balancando: { ativo:false, arquivo:'assets/sprites/moita/balancando.png', quadroL:128, quadroA:128, colunas:6, quadros:6, fps:10, loop:true,  ancora:{x:.5, y:.95} },
    abrindo:    { ativo:false, arquivo:'assets/sprites/moita/abrindo.png',    quadroL:128, quadroA:128, colunas:6, quadros:6, fps:12, loop:false, ancora:{x:.5, y:.95} },
  },

  // ── ÁRVORE SAGRADA ───────────────────────────────────────────
  arvore: {
    alturaNoMapa: 180,
    parada:   { ativo:false, arquivo:'assets/sprites/arvore/parada.png',   quadroL:128, quadroA:128, colunas:4, quadros:4, fps:4, loop:true, ancora:{x:.5, y:.95} },
    liberada: { ativo:false, arquivo:'assets/sprites/arvore/liberada.png', quadroL:128, quadroA:128, colunas:6, quadros:6, fps:8, loop:true, ancora:{x:.5, y:.95} },
  },

  // ── MAPA ─────────────────────────────────────────────────────
  mapa: {
    // Mapa novo (kit). 1 quadro; pode virar folha de até 4.
    // ATENÇÃO: se o desenho das trilhas mudar, refaça js/trilhas.js.
    fundo: { ativo:true, arquivo:'assets/sprites/mapa/fundo.png', quadroL:1536, quadroA:1024, colunas:1, quadros:1, fps:0, loop:true, ancora:{x:0, y:0} },
    // Pedaços animados por cima do fundo; x e y em pixels do mapa (onde
    // fica a âncora). Posições já conferidas no mapa novo:
    cenario: [
      // { ativo:false, arquivo:'assets/sprites/mapa/cachoeira.png', quadroL:64, quadroA:96, colunas:4, quadros:4, fps:10, loop:true, ancora:{x:.5, y:0}, x:503,  y:0,   alturaNoMapa:90 },   // cachoeira de cima
      // { ativo:false, arquivo:'assets/sprites/mapa/cachoeira.png', quadroL:64, quadroA:96, colunas:4, quadros:4, fps:10, loop:true, ancora:{x:.5, y:0}, x:1345, y:835, alturaNoMapa:95 },   // cachoeira de baixo, à direita
      // { ativo:false, arquivo:'assets/sprites/mapa/ponte.png',     quadroL:64, quadroA:80, colunas:4, quadros:4, fps:4,  loop:true, ancora:{x:.5, y:.5}, x:852,  y:468, alturaNoMapa:84 },   // ponte do meio
      // { ativo:false, arquivo:'assets/sprites/mapa/barraca.png',   quadroL:64, quadroA:64, colunas:4, quadros:4, fps:6,  loop:true, ancora:{x:.5, y:1},  x:1055, y:166, alturaNoMapa:50 },   // barraca com bandeira
      // { ativo:false, arquivo:'assets/sprites/mapa/caverna.png',   quadroL:64, quadroA:64, colunas:4, quadros:4, fps:6,  loop:true, ancora:{x:.5, y:1},  x:85,   y:585, alturaNoMapa:80 },   // luz da caverna
    ],
  },

  // ── FUNDOS DAS TELAS ─────────────────────────────────────────
  // Cada tela usa o seu fundo; sem ele, as camadas da floresta; sem elas,
  // um degradê. Os fundos cobrem a tela inteira sem distorcer, como
  // background-size: cover.
  //   largura, altura  medidas da imagem, em pixels
  //   panorama         segundos para ir de uma ponta à outra: o fundo vai
  //                    e volta devagar, começando pelo meio e freando nas
  //                    pontas (5.5). 0 = parado e centrado.
  //   pintado          true = pintura, não pixel art: sempre com suavização
  fases: {
    // Fundos pintados do kit (referencias/fundos-das-telas.png mostra todos)
    som:             { ativo:true, arquivo:'assets/sprites/fases/som.jpg',              largura:2576, altura:475, panorama:180, pintado:true },   // moldura verde da selva
    sombra:          { ativo:true, arquivo:'assets/sprites/fases/sombra.jpg',           largura:2576, altura:475, panorama:180, pintado:true },   // floresta à noite
    caracteristica:  { ativo:true, arquivo:'assets/sprites/fases/caracteristica.jpg',   largura:1286, altura:478, panorama:0,   pintado:true },   // painel verde-azulado
    charada:         { ativo:true, arquivo:'assets/sprites/fases/charada.jpg',          largura:1286, altura:478, panorama:0,   pintado:true },   // toca de terra
    celebracao:      { ativo:true, arquivo:'assets/sprites/fases/celebracao.jpg',       largura:2576, altura:475, panorama:180, pintado:true },   // noite com estrelas e confete
    final:           { ativo:true, arquivo:'assets/sprites/fases/final.jpg',            largura:2576, altura:477, panorama:180, pintado:true },   // Pantanal ao pôr do sol
    aberturaMontada: { ativo:true, arquivo:'assets/sprites/fases/abertura-montada.jpg', largura:2576, altura:476, panorama:180, pintado:true },   // Cerrado de dia (modo montado)
    // A arte da abertura SEM bichos, SEM letreiro e SEM botões (falta).
    abertura:        { ativo:false, arquivo:'assets/sprites/fases/abertura.png',        largura:1920, altura:1080, panorama:0 },

    // Camadas em parallax (opcionais, reserva dos fundos; folha de
    // referência: "Cenários Extras"). PNGs de 1920×1080 que se repetem na
    // horizontal e deslizam devagar (velocidade em px/s; as de trás, mais
    // devagar). Só o céu é opaco; as outras têm fundo transparente.
    floresta: {
      camadas: [
        { ativo:false, arquivo:'assets/sprites/fases/floresta-1-ceu.png',           velocidade:0  },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-2-montanhas.png',     velocidade:3  },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-3-arvores-longe.png', velocidade:6  },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-4-arvores-meio.png',  velocidade:10 },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-5-arvores-perto.png', velocidade:16 },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-6-plantas.png',       velocidade:24 },
      ],
    },

    // Arte pronta da abertura (kit): já traz o letreiro, os três letreiros
    // dos desafios, o JOGAR e a engrenagem desenhados (ver 5.8).
    // Áreas em % da arte: [esquerda, topo, largura, altura].
    aberturaPronta: {
      ativo: true, arquivo: 'assets/sprites/fases/abertura-pronta.png', largura: 1779, altura: 884,
      proporcaoMinima: 1.5,      // tela mais estreita que isto usa o modo montado
      areas: {
        jogar:     [39.3, 80.9, 22.2, 12.4],
        config:    [93.8,  2.5,  5.2, 10.0],
        som:       [35.4, 48.5, 29.5,  8.6],
        sombra:    [35.4, 58.5, 29.2,  8.5],
        charada:   [35.4, 68.4, 29.2,  9.0],
        // Continuar e Apagar: vazios na arte, placas em HTML, as duas a
        // 19 px do JOGAR; o Apagar termina antes do sapo do tronco.
        continuar: [23.2, 82.5, 15.0, 10.0],
        apagar:    [62.6, 82.5, 15.0, 10.0],
      },
    },
  },

  // ── ABERTURA ANIMADA (kit) ───────────────────────────────────
  // Posições (x, y) em pixels da ARTE da abertura (1779×884), como se
  // ela estivesse no tamanho original: a cena acompanha a arte na tela.
  // escala = tamanho do sprite na arte (0.52 = cada pixel do sprite vira
  // 0,52 px da arte). Intervalos [mín, máx] são sorteados a cada vez;
  // primeiraVez = segundos até a 1ª vez (cedo, como na prévia).
  // A prévia ferramentas/previa-abertura.html mostra tudo funcionando.
  abertura: {
    // A arte SEM o tatu, o sapo do tronco e as borboletas, que agora se
    // mexem por cima. Provisória (tirados por programa). Só vale se o tatu,
    // o sapo e a borboleta carregarem; senão, volta a arte original (5.8).
    fundoLimpo: { ativo:true, arquivo:'assets/sprites/fases/abertura-pronta-limpa.png', largura:1779, altura:884 },

    // Pousados: ficam exatamente em cima dos que estão desenhados na arte.
    arara: { ativo:true, arquivo:'assets/sprites/abertura/arara-pousada.png', quadroL:199, quadroA:315, colunas:4, quadros:4, fps:6, loop:true,
             ancora:{x:.603, y:.987}, sequencia:[0,0,0,0,0,1,0,0,0,0,3,3,0,0,0,0,2,2,2,0],
             x:202.1, y:211.9, escala:0.52 },
    tucano: { ativo:true, arquivo:'assets/sprites/abertura/tucano-pousado.png', quadroL:230, quadroA:255, colunas:4, quadros:4, fps:6, loop:true,
              ancora:{x:.426, y:.701}, sequencia:[0,0,0,0,0,1,0,0,0,3,3,0,0,0,0,2,2,0], olhaPara:'esquerda',
              x:1690.8, y:318, escala:0.54, atraso:1.3 },

    // Sapo do tronco: pisca, sorri e coaxa; de tempos em tempos pula no lugar.
    sapo: {
      x:1428.2, y:745.8, escala:0.553, pulaACada:[6, 11], primeiraVez:6,
      parado:  { ativo:true, arquivo:'assets/sprites/abertura/sapo-parado.png',  quadroL:166, quadroA:130, colunas:5, quadros:5, fps:6,  loop:true,
                 ancora:{x:.456, y:.965}, sequencia:[0,0,0,1,1,0,0,2,0,0,0,1,1,0,0,3,3,0,4,4] },
      pulando: { ativo:true, arquivo:'assets/sprites/abertura/sapo-pulando.png', quadroL:154, quadroA:355, colunas:6, quadros:6, fps:12, loop:false,
                 ancora:{x:.516, y:.99} },
    },

    // Tatu: usa SPRITES.animais.tatu. Parado → anda `caminho` px para a
    // direita → festa uma vez (enrola, segura, desenrola) → volta → parado.
    tatu: { x:374.1, y:695.5, escala:0.458, caminho:165, vel:38, paradoPor:[5, 9], primeiraVez:5 },

    // Arara voando: atravessa o céu, para um lado ou para o outro.
    araraVoando: { ativo:true, arquivo:'assets/sprites/abertura/arara-voando.png', quadroL:275, quadroA:318, colunas:5, quadros:5, fps:10, loop:true,
                   ancora:{x:.554, y:.445}, sequencia:[0,1,2,3,4,3,2,1],
                   altura:120, vel:230, faixaY:[70, 150], ondula:10, aCada:[10, 16], primeiraVez:6 },

    // Daqui para baixo, os desenhos vêm de SPRITES.efeitos.
    // Borboletas em "oito": x = cx + ax·sen(t·fx + fase)
    //                       y = cy + ay·sen(t·fy + 1,7·fase)
    borboletas: [
      { cx:470,  cy:362, ax:95,  ay:40, fx:0.55, fy:0.9, fase:0 },
      { cx:1600, cy:470, ax:80,  ay:50, fx:0.45, fy:0.8, fase:2 },
      { cx:260,  cy:560, ax:110, ay:45, fx:0.5,  fy:1.0, fase:4 },
    ],
    alturaBorboleta: 46,
    // Vaga-lumes piscando, cada um no seu ritmo (velocidade 0,7 a 1,2)
    vagalumes: [[160,320], [96,388], [52,662], [95,752], [240,470], [1345,826], [1565,420], [1712,610], [1228,522], [600,600]],
    alturaVagalume: 38,
    // Vaga-lume voando da caverna para o meio, aparecendo e sumindo
    vooVagalume: { de:[150, 600], ate:[530, 440], duracao:6, ondula:20, altura:60, aCada:[7, 12], primeiraVez:4 },
    // Folhas caindo das copas (faixas de x)
    folhas: { copas:[[20, 560], [1230, 1760]], aCada:[0.8, 1.5], max:10, vel:[32, 52], balanco:26, tamanho:[28, 40], somemEntre:[760, 860] },
    // Brilhos sobre as letras do letreiro (160 pontos medidos na arte,
    // os mesmos da prévia)
    brilhos: {
      aCada:[0.45, 0.95], tamanho:[40, 58],
      pontos: [
        [766,145], [771,140], [861,144], [876,134], [881,133], [884,129], [889,130], [906,155], [911,141], [940,131],
        [978,151], [987,157], [994,143], [1024,141], [1053,156], [1054,152], [1089,152], [1096,151], [613,195], [630,191],
        [637,181], [645,190], [683,183], [684,179], [685,165], [686,169], [686,174], [728,195], [731,160], [734,164],
        [734,192], [770,174], [775,192], [777,193], [783,180], [863,160], [887,199], [903,176], [936,199], [940,199],
        [946,163], [974,185], [976,177], [978,192], [980,187], [985,163], [993,187], [998,195], [1056,189], [1059,180],
        [1077,176], [1088,182], [1094,162], [1119,199], [1120,199], [1130,175], [1133,172], [1151,169], [1154,172], [1161,178],
        [1167,161], [1167,193], [1176,182], [1207,170], [618,225], [618,203], [620,223], [625,233], [649,227], [650,226],
        [655,229], [664,200], [667,204], [709,221], [717,221], [726,202], [731,202], [735,212], [740,216], [775,206],
        [789,202], [789,215], [806,207], [868,203], [884,207], [890,205], [998,205], [999,204], [1003,211], [1011,210],
        [1017,209], [1022,205], [1041,206], [1048,209], [1084,217], [1085,206], [1086,219], [1093,216], [1134,224], [1137,223],
        [1141,233], [1142,227], [1147,235], [1167,206], [1173,213], [650,245], [650,246], [653,246], [725,251], [796,252],
        [804,255], [821,249], [830,248], [833,250], [863,279], [879,257], [896,253], [942,279], [966,258], [1003,276],
        [1030,256], [1054,261], [1075,270], [1080,275], [710,305], [715,283], [717,285], [719,297], [727,301], [800,294],
        [800,284], [805,294], [811,288], [819,281], [819,311], [824,319], [824,288], [826,282], [828,288], [863,306],
        [877,315], [886,312], [892,295], [895,290], [925,314], [934,311], [935,313], [935,316], [956,284], [957,287],
        [989,316], [990,281], [992,316], [995,296], [1000,315], [1055,303], [814,322], [1018,325], [1058,322], [1060,324],
      ],
    },
    // Cachoeira da arte: fios brancos descendo dentro destes contornos e
    // espuma na base (por código: a folha de cachoeira não serve — Anexo D)
    cachoeira: [
      { contorno:[[1447,252], [1488,252], [1482,398], [1431,398]], fios:12 },
      { contorno:[[1394,402], [1460,402], [1438,496], [1381,496]], fios:14 },
    ],
  },

  // ── EFEITOS (kit) ────────────────────────────────────────────
  // Usados na abertura, no mapa e nas telas. Sem o arquivo, cada efeito
  // é desenhado por código, com formas simples (5.1).
  efeitos: {
    borboleta:        { ativo:true, arquivo:'assets/sprites/efeitos/borboleta.png',         quadroL:133, quadroA:118, colunas:3,  quadros:3,  fps:14, loop:true,  ancora:{x:.498, y:.459}, sequencia:[0,1,2,1] },
    // 18 folhas diferentes, uma por quadro: cada folha que cai sorteia a sua
    folhas:           { ativo:true, arquivo:'assets/sprites/efeitos/folhas.png',            quadroL:96,  quadroA:97,  colunas:18, quadros:18, fps:0,  loop:true,  ancora:{x:.513, y:.487} },
    vagalumePiscando: { ativo:true, arquivo:'assets/sprites/efeitos/vagalume-piscando.png', quadroL:99,  quadroA:104, colunas:8,  quadros:8,  fps:10, loop:true,  ancora:{x:.494, y:.503}, sequencia:[0,1,2,3,4,5,6,7,6,5,4,3,2,1] },
    vagalumeVoando:   { ativo:true, arquivo:'assets/sprites/efeitos/vagalume-voando.png',   quadroL:149, quadroA:111, colunas:8,  quadros:8,  fps:12, loop:true,  ancora:{x:.6,   y:.582} },
    // Estrela que acende e some (toca uma vez)
    brilho:           { ativo:true, arquivo:'assets/sprites/efeitos/brilho-estrela.png',    quadroL:120, quadroA:120, colunas:8,  quadros:8,  fps:14, loop:false, ancora:{x:.498, y:.499} },
    // Bola de luz subindo, com rastro de faíscas (a luz do acerto)
    luzRastro:        { ativo:true, arquivo:'assets/sprites/efeitos/luz-rastro.png',        quadroL:136, quadroA:134, colunas:8,  quadros:8,  fps:12, loop:true,  ancora:{x:.316, y:.331} },
  },

  // ── INTERFACE ────────────────────────────────────────────────
  ui: {
    // Letreiro "Que Bicho É Esse?" com fundo transparente (modo montado).
    logo:  { ativo:false, arquivo:'assets/sprites/ui/logo.png', quadroL:1024, quadroA:512, colunas:1, quadros:1, fps:0, loop:true },
    // Placa de madeira vazia para os botões, usada como border-image
    // (9 partes). `corte` = largura da borda, em pixels da imagem.
    placa: { ativo:false, arquivo:'assets/sprites/ui/placa.png', corte:24 },
  },

  // ── BICHOS ───────────────────────────────────────────────────
  animais: {
    // Medidas de todo bicho. Os arquivos ficam em
    // assets/sprites/animais/<id>/parado.png, andando.png e festa.png
    padrao: {
      parado:  { quadroL:128, quadroA:128, colunas:4, quadros:4, fps:6,  loop:true },
      andando: { quadroL:128, quadroA:128, colunas:6, quadros:6, fps:10, loop:true },
      festa:   { quadroL:128, quadroA:128, colunas:6, quadros:6, fps:10, loop:true },
      ancora:  { x:0.5, y:0.95 },
    },
    // false = ainda não tenho · true = tenho, com as medidas do padrão
    // { ... } = tenho, com estas medidas no lugar das do padrão (a âncora
    //   também pode vir em cada animação)
    //   ex.: gato: { parado:true, andando:{ colunas:8, quadros:8 }, festa:false },
    arara:      { parado:false, andando:false, festa:false },   // a azul e amarela (Anexo B)
    onca:       { parado:false, andando:false, festa:false },
    flamingo:   { parado:false, andando:false, festa:false },
    macaco:     { parado:false, andando:false, festa:false },
    mico:       { parado:false, andando:false, festa:false },
    // Tatu do kit (também anda na abertura). Quadros maiores que o padrão
    // e de tamanhos diferentes: o jogo usa UMA escala para o bicho inteiro
    // (5.4). O parado tem 1 quadro só e respira por código.
    tatu: {
      parado:  { quadroL:339, quadroA:147, colunas:1,  quadros:1,  fps:0,  ancora:{x:.556, y:.963} },
      andando: { quadroL:339, quadroA:147, colunas:8,  quadros:8,  fps:10, ancora:{x:.556, y:.963} },
      festa:   { quadroL:328, quadroA:169, colunas:11, quadros:11, fps:10, ancora:{x:.554, y:.968},
                 // enrola (0 → 10), segura e desenrola (10 → 0): 3,6 s
                 sequencia:[0,1,2,3,4,5,6,7,8,9,10, 10,10,10,10,10,10,10,10,10,10,10,10,10,10, 10,9,8,7,6,5,4,3,2,1,0] },
    },
    capivara:   { parado:false, andando:false, festa:false },
    tartaruga:  { parado:false, andando:false, festa:false },
    caranguejo: { parado:false, andando:false, festa:false },
    gato:       { parado:false, andando:false, festa:false },
    cachorro:   { parado:false, andando:false, festa:false },
    mosquito:   { parado:false, andando:false, festa:false },
    cascavel:   { parado:false, andando:false, festa:false },
  },
};
