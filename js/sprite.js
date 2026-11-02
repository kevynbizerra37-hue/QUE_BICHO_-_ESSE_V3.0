'use strict';
// ═══════════════════════════════════════════════════════════════
//  SPRITES — relógio, quadros, silhueta, reservas e VisorDeSprite
//  Tudo o que se mexe passa por aqui: os bichos, a moita, a árvore e o
//  sapo. Sem o arquivo do sprite, cada um tem a sua reserva desenhada
//  por código (seção 5.1), e o jogo vai do começo ao fim sem nenhum.
// ═══════════════════════════════════════════════════════════════
QBE.sprite = (() => {
  const U = QBE.util, R = QBE.recursos;
  const TAU = Math.PI * 2;
  let tempo = 0;                       // relógio único, em segundos
  const avancar = dt => { tempo += dt; };
  const agora = () => tempo;

  // ── Quadros ──────────────────────────────────────────────────
  // `t` = segundos desde que a animação começou. Com movimento reduzido
  // as animações de quadro rodam na metade do fps.
  function quadroDe(def, t) {
    let fps = def.fps || 0;
    if (U.movimentoReduzido()) fps /= 2;
    const seq = def.sequencia;
    const n = seq ? seq.length : (def._imgs ? def._imgs.length : def.quadros || 1);
    if (!fps || n <= 1) return seq ? seq[0] : 0;
    let k = Math.floor(Math.max(0, t) * fps);
    k = def.loop === false ? Math.min(k, n - 1) : k % n;
    return seq ? seq[k] : k;
  }
  function duracao(def) {
    const n = def.sequencia ? def.sequencia.length : def.quadros || 1;
    return def.fps ? n / def.fps : 0;
  }
  function recorte(def, q, linhaExtra) {
    if (def._imgs) {
      const img = def._imgs[Math.min(q, def._imgs.length - 1)];
      return { img, sx: 0, sy: 0, sw: img.naturalWidth, sh: img.naturalHeight };
    }
    const col = q % def.colunas;
    const lin = (def.linha || 0) + (linhaExtra || 0) + Math.floor(q / def.colunas);
    return { img: def._img, sx: col * def.quadroL, sy: lin * def.quadroA, sw: def.quadroL, sh: def.quadroA };
  }
  const larguraQuadro = def => def.quadroL || (def._imgs ? def._imgs[0].naturalWidth : def._img ? def._img.naturalWidth : 0);
  const alturaQuadro = def => def.quadroA || (def._imgs ? def._imgs[0].naturalHeight : def._img ? def._img.naturalHeight : 0);

  // ── Nitidez (seção 3, item 13) ───────────────────────────────
  // Pixel art ampliada 2× ou mais vai sem suavização (não borra); reduzida
  // ou pouco ampliada, com suavização (não cintila). Pinturas, sempre suaves.
  const escalaNaTela = (ctx, escala) => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b) * escala; };
  function ajustarNitidez(ctx, escalaTela, pintado) {
    const suavizar = !!pintado || escalaTela < 2;
    ctx.imageSmoothingEnabled = suavizar;
    if (suavizar) ctx.imageSmoothingQuality = 'high';
  }

  // ── Silhueta ─────────────────────────────────────────────────
  // Desenha numa tela auxiliar e pinta com 'source-in': o mesmo contorno
  // do bicho, todo preto. Não lê pixel nenhum, então vale no file://.
  const aux = document.createElement('canvas');
  const auxCtx = aux.getContext('2d');
  function pintarSilhueta(w, h, desenhar, cor) {
    w = Math.max(1, Math.ceil(w)); h = Math.max(1, Math.ceil(h));
    if (aux.width < w) aux.width = w;
    if (aux.height < h) aux.height = h;
    auxCtx.setTransform(1, 0, 0, 1, 0, 0);
    auxCtx.globalCompositeOperation = 'source-over';
    auxCtx.globalAlpha = 1;
    auxCtx.clearRect(0, 0, w + 2, h + 2);
    desenhar(auxCtx);
    auxCtx.globalCompositeOperation = 'source-in';
    auxCtx.fillStyle = cor || '#000';
    auxCtx.fillRect(0, 0, w, h);
    auxCtx.globalCompositeOperation = 'source-over';
    return { w, h };
  }

  // ── Desenhar um sprite do manifesto ──────────────────────────
  // op: escala, espelhar, silhueta, alfa, giro, quadro, linhaExtra, escalaY
  function desenharSprite(ctx, def, t, x, y, op = {}) {
    if (!R.pronto(def)) return false;
    const escala = op.escala == null ? 1 : op.escala;
    const q = op.quadro == null ? quadroDe(def, t) : op.quadro;
    const r = recorte(def, q, op.linhaExtra);
    const w = r.sw * escala, h = r.sh * escala;
    const ax = def.ancora ? def.ancora.x : 0.5, ay = def.ancora ? def.ancora.y : 1;
    ctx.save();
    ctx.globalAlpha *= op.alfa == null ? 1 : op.alfa;
    ctx.translate(x, y);
    if (op.giro) ctx.rotate(op.giro);
    if (op.espelhar) ctx.scale(-1, 1);
    if (op.escalaY && op.escalaY !== 1) ctx.scale(1, op.escalaY);
    const s = escalaNaTela(ctx, 1);
    ajustarNitidez(ctx, s * escala, def.pintado);
    if (op.silhueta) {
      const m = pintarSilhueta(w * s, h * s, c => {
        ajustarNitidez(c, s * escala, def.pintado);
        c.drawImage(r.img, r.sx, r.sy, r.sw, r.sh, 0, 0, w * s, h * s);
      }, op.corSilhueta);
      ctx.drawImage(aux, 0, 0, m.w, m.h, -ax * w, -ay * h, m.w / s, m.h / s);
    } else {
      ctx.drawImage(r.img, r.sx, r.sy, r.sw, r.sh, -ax * w, -ay * h, w, h);
    }
    ctx.restore();
    return true;
  }
  // O bicho anda para a direita ou para a esquerda; o desenho olha para
  // um lado só (`olhaPara`, padrão direita). Espelha quando não bate.
  const espelharPara = (def, lado) => (lado === 'esquerda') !== ((def && def.olhaPara) === 'esquerda');

  // ── Emoji (a última reserva) ─────────────────────────────────
  const FONTE_EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';
  function desenharEmoji(ctx, emoji, x, y, tamanho, op = {}) {
    ctx.save();
    ctx.globalAlpha *= op.alfa == null ? 1 : op.alfa;
    ctx.translate(x, y);
    if (op.giro) ctx.rotate(op.giro);
    if (op.espelhar) ctx.scale(-1, 1);
    if (op.escalaY && op.escalaY !== 1) ctx.scale(1, op.escalaY);
    const escrever = (c, tam, px, py) => {
      c.font = `${tam}px ${FONTE_EMOJI}`;
      c.textAlign = 'center';
      c.textBaseline = 'bottom';
      c.fillStyle = '#000';
      c.fillText(emoji, px, py);
    };
    if (op.silhueta) {
      const s = escalaNaTela(ctx, 1);
      const lado = tamanho * 1.3 * s;
      const m = pintarSilhueta(lado, lado, c => escrever(c, tamanho * s, lado / 2, lado * 0.92), op.corSilhueta);
      ctx.drawImage(aux, 0, 0, m.w, m.h, -lado / s / 2, -lado / s * 0.92, m.w / s, m.h / s);
    } else {
      escrever(ctx, tamanho, 0, 0);
    }
    ctx.restore();
  }

  // ── Ilustração estática (PNG 512×512 da ficha) ───────────────
  function desenharImagem(ctx, img, x, y, lado, op = {}) {
    ctx.save();
    ctx.globalAlpha *= op.alfa == null ? 1 : op.alfa;
    ctx.translate(x, y);
    if (op.giro) ctx.rotate(op.giro);
    if (op.espelhar) ctx.scale(-1, 1);
    if (op.escalaY && op.escalaY !== 1) ctx.scale(1, op.escalaY);
    const s = escalaNaTela(ctx, 1);
    const escala = lado / img.naturalWidth;
    ajustarNitidez(ctx, s * escala, false);
    if (op.silhueta) {
      const m = pintarSilhueta(lado * s, lado * s, c => { ajustarNitidez(c, s * escala, false); c.drawImage(img, 0, 0, lado * s, lado * s); }, op.corSilhueta);
      ctx.drawImage(aux, 0, 0, m.w, m.h, -lado / 2, -lado, m.w / s, m.h / s);
    } else {
      ctx.drawImage(img, -lado / 2, -lado, lado, lado);
    }
    ctx.restore();
  }

  // ── Movimento por código das reservas (5.1) ──────────────────
  // parado respira (altura ±3%, 1,2 Hz); andando quica (3 px, 3 Hz) e
  // inclina ±4°; festa pula (20 px, 2 Hz). Reduzido: só a respiração.
  function movimentoDe(anim, t, caixa) {
    const reduzido = U.movimentoReduzido();
    const fator = caixa / 64;          // os números valem para o bicho de 64 px
    if (anim === 'andando' && !reduzido) {
      const f = Math.sin(Math.PI * 3 * t);
      return { dy: -3 * fator * Math.abs(f), giro: (4 * Math.PI / 180) * f, escalaY: 1 };
    }
    if (anim === 'festa' && !reduzido) {
      return { dy: -20 * fator * Math.abs(Math.sin(Math.PI * 2 * t)), giro: 0, escalaY: 1 };
    }
    return { dy: 0, giro: 0, escalaY: 1 + 0.03 * Math.sin(TAU * 1.2 * t) };
  }

  // Uma escala só por bicho: a que faz o MAIOR quadro entre as animações
  // dele caber no quadrado. Assim o tatu (339×147 andando, 328×169 na
  // festa) não cresce nem encolhe ao trocar de animação.
  function maiorQuadro(id) {
    let m = 0;
    for (const anim of ['parado', 'andando', 'festa']) {
      const d = R.defAnimal(id, anim);
      if (d) m = Math.max(m, larguraQuadro(d), alturaQuadro(d));
    }
    return m;
  }

  // ── O bicho, com todas as reservas ───────────────────────────
  // (x, y) = o pé do bicho; `caixa` = o quadrado em que ele precisa caber.
  // op: lado ('direita'|'esquerda'), silhueta, alfa, cor (0..1: a sombra
  // ganhando cor), sombraNoChao (para os que voam)
  function desenharBicho(ctx, id, anim, t, x, y, caixa, op = {}) {
    const a = ANIMAIS[id];
    if (!a) return;
    const reduzido = U.movimentoReduzido();
    let dyVoo = 0;
    if (a.tracos && a.tracos.voa === true) {
      // Bichos que voam flutuam: sobem e descem 6 px a 1 Hz, com sombrinha
      const fator = caixa / 64;
      dyVoo = -fator * (6 + (reduzido ? 0 : 3 * Math.sin(TAU * t)));
      if (op.sombraNoChao !== false) {
        ctx.save();
        ctx.globalAlpha *= 0.25 * (op.alfa == null ? 1 : op.alfa);
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(x, y - caixa * 0.02, caixa * 0.28, caixa * 0.07, 0, 0, TAU);
        ctx.fill();
        ctx.restore();
      }
    }
    // A sombra ganhando cor (revelação): o bicho colorido por cima da
    // silhueta, cada vez mais forte, até sobrar só ele
    if (op.silhueta && op.cor != null) {
      const alfa = op.alfa == null ? 1 : op.alfa;
      if (op.cor >= 1) op = Object.assign({}, op, { silhueta: false, cor: null });
      else {
        desenharBicho(ctx, id, anim, t, x, y, caixa, Object.assign({}, op, { cor: null, alfa: alfa * (1 - op.cor), sombraNoChao: false }));
        if (op.cor <= 0) return;
        op = Object.assign({}, op, { silhueta: false, cor: null, alfa: alfa * op.cor });
      }
    }

    // 1) sprite
    let def = R.animal(id, anim), mov = { dy: 0, giro: 0, escalaY: 1 }, animUsada = anim;
    if (!def && anim !== 'parado') {
      // sem `festa` (ou sem `andando`): o parado, com o movimento por código
      def = R.animal(id, 'parado');
      if (def) mov = movimentoDe(anim, t, caixa);
      animUsada = 'parado';
    }
    if (def) {
      const maior = maiorQuadro(id) || Math.max(larguraQuadro(def), alturaQuadro(def));
      const escala = caixa / maior;
      const umQuadro = (def.sequencia ? def.sequencia.length : def.quadros || 1) <= 1;
      if (umQuadro && animUsada === 'parado' && anim === 'parado') mov = movimentoDe('parado', t, caixa);
      desenharSprite(ctx, def, t, x, y + mov.dy + dyVoo, {
        escala, espelhar: espelharPara(def, op.lado), silhueta: op.silhueta, alfa: op.alfa,
        giro: mov.giro, escalaY: mov.escalaY, corSilhueta: op.corSilhueta,
      });
      return;
    }
    // 2) ilustração parada, com movimento por código
    mov = movimentoDe(anim, t, caixa);
    const img = R.imagemAnimal(id);
    const desenho = { espelhar: (op.lado === 'esquerda'), silhueta: op.silhueta, alfa: op.alfa, giro: mov.giro, escalaY: mov.escalaY, corSilhueta: op.corSilhueta };
    if (img) { desenharImagem(ctx, img, x, y + mov.dy + dyVoo, caixa, desenho); return; }
    // 3) emoji (os emojis olham para a esquerda quase sempre: não espelha)
    desenho.espelhar = false;
    desenharEmoji(ctx, a.emoji, x, y + mov.dy + dyVoo, caixa * 0.86, desenho);
  }

  // ── Moita ────────────────────────────────────────────────────
  // Reserva: 5 a 7 círculos em três tons de verde, contorno escuro e
  // brilho. parada balança ±2°; balancando ±7°; abrindo afasta os
  // círculos e some em 0,5 s. Bloqueada fica apagada (pouca saturação).
  const CIRCULOS = [   // x, y (fração da altura, a partir do pé), raio, tom
    [-0.34, -0.30, 0.25, 0], [0.34, -0.30, 0.25, 0], [0, -0.58, 0.27, 1],
    [-0.20, -0.60, 0.18, 2], [-0.44, -0.12, 0.19, 1], [0.44, -0.12, 0.19, 1], [0, -0.24, 0.30, 2],
  ];
  const TONS = ['#2E7D32', '#43A047', '#66BB6A'], TONS_APAGADOS = ['#4E5B50', '#627164', '#7A8A7C'];
  function balancoMoita(estado, t) {
    if (U.movimentoReduzido()) return 0;
    if (estado === 'balancando') return (7 * Math.PI / 180) * Math.sin(TAU * 2.2 * t);
    if (estado === 'parada') return (2 * Math.PI / 180) * Math.sin(TAU * 0.5 * t);
    return 0;
  }
  // (x, y) = base da moita; `altura` em pixels de quem desenha.
  function desenharMoita(ctx, estado, t, x, y, altura, op = {}) {
    const def = SPRITES.moita[estado];
    const alfa = op.alfa == null ? 1 : op.alfa;
    if (R.pronto(def)) {
      // O balanço já vem nos quadros. Apagada = pouca saturação (o filtro
      // do canvas existe no Chrome, no Edge e no Firefox; sem ele, mais clara)
      ctx.save();
      if (op.apagada) { if ('filter' in ctx) ctx.filter = 'saturate(.25) brightness(.85)'; else ctx.globalAlpha *= 0.6; }
      desenharSprite(ctx, def, t, x, y, { escala: altura / def.quadroA, alfa });
      ctx.restore();
      return;
    }
    const tons = op.apagada ? TONS_APAGADOS : TONS;
    const abrindo = estado === 'abrindo' ? U.limitar(t / 0.5, 0, 1) : 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(op.semBalanco ? 0 : balancoMoita(estado, t) * (op.balanco == null ? 1 : op.balanco));
    ctx.globalAlpha *= alfa * (1 - abrindo);
    const contorno = Math.max(2, altura * 0.035);
    const pos = CIRCULOS.map(([cx, cy, r, tom]) => {
      const afasta = 1 + abrindo * 0.9;
      return { x: cx * altura * afasta, y: cy * altura - abrindo * altura * 0.15, r: r * altura, tom };
    });
    ctx.fillStyle = '#1A1209';
    for (const c of pos) { ctx.beginPath(); ctx.arc(c.x, c.y, c.r + contorno, 0, TAU); ctx.fill(); }
    for (const c of pos) { ctx.fillStyle = tons[c.tom]; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, TAU); ctx.fill(); }
    ctx.fillStyle = op.apagada ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.28)';
    for (const c of pos) { ctx.beginPath(); ctx.arc(c.x - c.r * 0.32, c.y - c.r * 0.38, c.r * 0.28, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ── Árvore sagrada ───────────────────────────────────────────
  function desenharArvore(ctx, liberada, t, x, y, altura) {
    const def = liberada ? SPRITES.arvore.liberada : SPRITES.arvore.parada;
    const reduzido = U.movimentoReduzido();
    if (liberada) {
      // anel de brilho em volta, pulsando
      const p = reduzido ? 0.5 : 0.5 + 0.5 * Math.sin(TAU * 0.8 * t);
      ctx.save();
      ctx.strokeStyle = `rgba(253,179,14,${0.55 + 0.4 * p})`;
      ctx.lineWidth = altura * (0.05 + 0.03 * p);
      ctx.beginPath();
      ctx.ellipse(x, y - altura * 0.45, altura * 0.62, altura * 0.58, 0, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }
    if (R.pronto(def)) { desenharSprite(ctx, def, t, x, y, { escala: altura / def.quadroA }); return; }
    desenharEmoji(ctx, '🌳', x, y, altura * 0.95);
  }

  // ── Sapo explorador ──────────────────────────────────────────
  // Sapo novo de lado (quando os dois chegarem) → sapo do tronco da
  // abertura → folha da 2.0, com 4 direções → 🐸, sempre com o mesmo
  // quique. `lado` = para onde ele olha; `dir` = direção da 2.0.
  function pulinho(andando, t) {
    if (!andando || U.movimentoReduzido()) return 0;
    const p = SPRITES.sapo.tronco.pulinho;
    return -p.altura * Math.abs(Math.sin(Math.PI * p.porSegundo * t));
  }
  function desenharSapo(ctx, s, x, y) {
    const S = SPRITES.sapo;
    const t = s.t || 0;
    if (R.pronto(S.parado) && R.pronto(S.andando)) {
      const def = s.andando ? S.andando : S.parado;
      desenharSprite(ctx, def, t, x, y, { escala: S.alturaNoMapa / def.quadroA, espelhar: espelharPara(def, s.lado) });
      return 'novo';
    }
    const tronco = SPRITES.abertura.sapo.parado;
    if (S.tronco.ativo && R.pronto(tronco)) {
      const escala = S.tronco.alturaNoMapa / tronco.quadroA;
      desenharSprite(ctx, tronco, t, x, y + pulinho(s.andando, t), {
        escala, espelhar: espelharPara(tronco, s.lado), quadro: s.andando ? 0 : undefined,
      });
      return 'tronco';
    }
    const antigo = S.antigo;
    if (R.pronto(antigo)) {
      const linha = antigo.linhas[s.dir || 'baixo'] || 0;
      desenharSprite(ctx, antigo, t, x, y, {
        escala: S.alturaNoMapa / antigo.quadroA, linhaExtra: linha, quadro: s.andando ? undefined : 0,
      });
      return 'antigo';
    }
    desenharEmoji(ctx, '🐸', x, y + pulinho(s.andando, t), S.alturaNoMapa * 0.7);
    return 'emoji';
  }

  // ── VisorDeSprite ────────────────────────────────────────────
  // Um <canvas> pequeno (aria-hidden) que mostra um bicho, a moita ou um
  // sprite numa animação. É ele que aparece nas cartas, na moita das
  // etapas, na sombra, na celebração e no painel. O laço único desenha
  // todos os que estão na tela.
  const visores = new Set();
  function criarVisor(op) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'visor';
    const v = {
      canvas, inicio: tempo,
      op: Object.assign({ tipo: 'bicho', anim: 'parado', lado: 'direita', margem: 0.08 }, op),
      definir(novo) {
        if ((novo.anim && novo.anim !== this.op.anim) || (novo.estado && novo.estado !== this.op.estado)) this.inicio = tempo;
        Object.assign(this.op, novo);
        return this;
      },
      revelar() { this.op.revelarEm = tempo; return this; },
    };
    visores.add(v);
    return v;
  }
  function desenharVisor(v) {
    const { ctx, w, h } = U.ajustarCanvas(v.canvas);
    ctx.clearRect(0, 0, w, h);
    const op = v.op, t = tempo - v.inicio;
    if (op.tipo === 'moita') {
      // A moita por código é mais larga que alta (círculos de -0,63 a
      // +0,63 da altura) e sobe 0,85 da altura acima do pé: cabe assim.
      const estado = op.estado || 'parada';
      const sprite = R.pronto(SPRITES.moita[estado]);
      const util = 1 - op.margem * 2;
      const altura = sprite ? Math.min(w, h) * util : Math.min(w / 1.32, h / 0.98) * util;
      const base = sprite ? h - (h - altura) / 2 : h / 2 + altura * 0.39;
      desenharMoita(ctx, estado, t, w / 2, base, altura, { apagada: op.apagada });
      return;
    }
    if (op.tipo === 'bicho') {
      const caixa = Math.min(w, h) * (1 - op.margem * 2);
      let x = w / 2, lado = op.lado;
      if (op.passeio && !U.movimentoReduzido()) {
        // a silhueta anda de um lado para o outro dentro do palco
        const ida = Math.max(1, (w - caixa) * 0.9);
        const vel = caixa * 0.5;
        const periodo = (ida * 2) / vel;
        const fase = (t % periodo) / periodo;
        const p = fase < 0.5 ? fase * 2 : 2 - fase * 2;
        x = (w - ida) / 2 + ida * p;
        lado = fase < 0.5 ? 'direita' : 'esquerda';
      }
      let cor = null;
      if (op.silhueta && op.revelarEm != null) cor = U.limitar((tempo - op.revelarEm) / 0.6, 0, 1);
      desenharBicho(ctx, op.id, op.anim, t, x, h - (h - caixa) / 2, caixa, {
        lado, silhueta: op.silhueta, cor: cor, sombraNoChao: true, corSilhueta: op.corSilhueta,
      });
    }
  }
  function desenharVisores() {
    for (const v of visores) {
      if (!v.canvas.isConnected) { visores.delete(v); continue; }
      if (!U.visivel(v.canvas)) continue;
      desenharVisor(v);
    }
  }

  return {
    avancar, agora, quadroDe, duracao, desenharSprite, desenharEmoji, desenharImagem, desenharBicho,
    desenharMoita, desenharArvore, desenharSapo, espelharPara, balancoMoita, criarVisor, desenharVisores,
  };
})();
