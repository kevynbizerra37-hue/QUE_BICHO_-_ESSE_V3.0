'use strict';
// ═══════════════════════════════════════════════════════════════
//  UTILIDADES — e a única global de código do jogo, QBE
//  Cada arquivo pendura o seu módulo nela (QBE.audio, QBE.mapa...).
//  Os dados ficam fora, em CONFIG, ANIMAIS, PERGUNTAS, MAPA, SPRITES
//  e TRILHAS, para quem mexe no conteúdo nunca precisar abrir o código.
// ═══════════════════════════════════════════════════════════════
const QBE = {};

QBE.util = (() => {
  function embaralhar(lista) {
    const a = [...lista];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const limitar = (v, min, max) => Math.max(min, Math.min(max, v));
  const distancia = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const sortear = (min, max) => min + Math.random() * (max - min);
  // Os dados usam [mín, máx] para "sorteie entre": um número sozinho vale ele mesmo
  const sortearDe = v => (Array.isArray(v) ? sortear(v[0], v[1]) : v);
  const escolher = lista => lista[Math.floor(Math.random() * lista.length)];
  const $ = id => document.getElementById(id);
  // "a arara", "o tatu" — sem `artigo` na ficha, fala só o nome
  const comArtigo = a => (a.artigo ? `${a.artigo} ${a.nome}` : a.nome);
  // A palavra-chave das perguntas vem entre asteriscos: a narração lê sem eles
  const semAsteriscos = t => String(t).replace(/\*/g, '');
  // Para pôr texto do jogo dentro de innerHTML sem virar código
  const escapar = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const suave = t => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

  // Consulta ao vivo: a criança (ou o professor) pode mudar a opção do
  // sistema com o jogo aberto.
  const consulta = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const movimentoReduzido = () => !!(consulta && consulta.matches);

  // Um único aviso por arquivo: na 2.0 o console enchia com a mesma
  // imagem quebrada a cada quadro.
  const avisados = new Set();
  function avisoArquivo(caminho, reserva) {
    if (avisados.has(caminho)) return;
    avisados.add(caminho);
    console.warn(`Arquivo não abriu: ${caminho} — usando ${reserva}.`);
  }

  // Canvas nítido: o tamanho interno acompanha a tela × devicePixelRatio
  // (no máximo CONFIG.canvasDprMax). Só mexe quando a medida muda, porque
  // redimensionar apaga o canvas e custa caro.
  function ajustarCanvas(canvas) {
    const dpr = Math.min(CONFIG.canvasDprMax, window.devicePixelRatio || 1);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const iw = Math.max(1, Math.round(w * dpr)), ih = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== iw || canvas.height !== ih) { canvas.width = iw; canvas.height = ih; }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h, dpr };
  }

  // Está na tela agora? (getClientRects e não offsetParent: os elementos
  // fixos não têm offsetParent). A tela de trás fica com visibility:
  // hidden e continua ocupando lugar: sem olhar o estilo, o JOGAR da
  // abertura contava como visível no mapa e roubava o ENTER.
  const visivel = el => !!(el && el.isConnected && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');

  return {
    embaralhar, limitar, distancia, sortear, sortearDe, escolher, $, comArtigo,
    semAsteriscos, escapar, suave, movimentoReduzido, avisoArquivo, ajustarCanvas, visivel,
  };
})();
