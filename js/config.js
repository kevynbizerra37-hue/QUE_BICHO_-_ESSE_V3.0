'use strict';
// ═══════════════════════════════════════════════════════════════
//  NÚMEROS AJUSTÁVEIS DO JOGO
//  Mexa aqui, nunca no meio do código. Distâncias em pixels do
//  desenho do mapa, velocidades em pixels por segundo.
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  prefixoSalvo: 'qbe3_',          // a 2.0 usa 'aq_' no mesmo domínio
  versaoSalvo: 1,
  etapasPorMoita: 3,
  pontos: { som: 25, sombra: 20, traco: 20, charada: 30, bonusMoita: 30 },

  limiteSomMs: 8000,              // o som do bicho para depois disto
  vozVelocidades: { devagar: 0.7, normal: 0.9, rapido: 1.1 },
  vozVelocidadePadrao: 0.9,

  sapo: {
    velMax: 130, acel: 900, freioPorQuadro60: 0.78, velMinima: 3,
    ajudaCurva: 28, arrastoToque: 0.45,
    margem: { lados: 40, topo: 80, base: 40 },
  },
  camera: { suavidadePorQuadro60: 0.18 },

  distancias: { avisoMoita: 110, pararMoita: 130, soltarMoita: 170, arvore: 140, encaixeAncora: 120 },
  moita: {
    raioPadrao: 90, vel: 30, pausaMin: 1.5, pausaMax: 3, voltarDepoisDe: 1,
    margem: { lados: 80, topo: 140, base: 110 },   // longe do placar e do minimapa
  },
  bichoNoMapa: { raio: 70, vel: 40, altura: 64, flutuar: 6 },

  tempos: {            // milissegundos
    avancoSemVoz: 1400, avancoComVozMax: 6000, tremor: 600,
    transicao: 300, revelacao: 800, luzAcerto: 700, preCargaMax: 8000, testeSomMax: 4000,
  },

  canvasDprMax: 2,
  efeitos: {           // cada efeito liga e desliga aqui (5.2 e 5.5)
    // no mapa
    brilhoAgua: true, sombraNuvem: true, borboletas: 5, vagalumes: 6,
    // nas telas, por cima do fundo e atrás do conteúdo (0 ou ausente = nenhum)
    telas: {
      som:            { folhas: 6 },
      sombra:         { vagalumes: 8 },
      caracteristica: { folhas: 6 },
      charada:        { folhas: 4, vagalumes: 2 },
      celebracao:     { confete: 60, estrelas: 6 },
      final:          { vagalumes: 6, estrelas: 4 },
    },
    // alturas: no mapa, em pixels do mapa; nas telas, em pixels da tela
    altura: { borboletaMapa: 26, vagalumeMapa: 22, brilhoAgua: 22, folhaMoita: 16,
              folhaTela: 32, vagalumeTela: 30, estrelaTela: 40, estrelaAcerto: 56, luzAcerto: 64 },
  },
  abertura: { animada: true },    // false = a arte da abertura parada, sem a cena (5.8)
  conferir: false,     // modo de conferência (também F9 ou ?conferir=1)
};
