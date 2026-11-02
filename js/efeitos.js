'use strict';
// ═══════════════════════════════════════════════════════════════
//  EFEITOS — fundos das telas, borboletas, folhas, vaga-lumes,
//  brilhos, luz do acerto e confete
//  Cada efeito usa o sprite do kit e, sem ele, uma forma simples
//  desenhada por código. Os sistemas não sabem em que tela estão:
//  recebem a área (em pixels de quem desenha) a cada quadro.
// ═══════════════════════════════════════════════════════════════
QBE.efeitos = (() => {
  const U = QBE.util, R = QBE.recursos, S = QBE.sprite;
  const E = SPRITES.efeitos;
  const TAU = Math.PI * 2;
  const CORES = ['#47920F', '#771B93', '#D24D07', '#FDB30E', '#FFD700', '#5BB51C', '#ffffff'];

  // ── Desenhos de cada efeito (sprite → forma por código) ──────
  function borboleta(ctx, x, y, altura, t, lado) {
    if (R.pronto(E.borboleta)) {
      S.desenharSprite(ctx, E.borboleta, t, x, y, { escala: altura / E.borboleta.quadroA, espelhar: lado === 'esquerda' });
      return;
    }
    // asas de elipse batendo
    const bate = U.movimentoReduzido() ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(TAU * 4 * t));
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#FDB30E'; ctx.strokeStyle = '#1A1209'; ctx.lineWidth = Math.max(1, altura * 0.06);
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(s * altura * 0.26 * bate, -altura * 0.08, altura * 0.28 * bate, altura * 0.34, s * 0.4, 0, TAU);
      ctx.fill(); ctx.stroke();
    }
    ctx.fillStyle = '#1A1209';
    ctx.fillRect(-altura * 0.04, -altura * 0.3, altura * 0.08, altura * 0.5);
    ctx.restore();
  }
  function folha(ctx, x, y, tamanho, quadro, giro, alfa) {
    if (R.pronto(E.folhas)) {
      S.desenharSprite(ctx, E.folhas, 0, x, y, { escala: tamanho / E.folhas.quadroA, quadro: quadro % E.folhas.quadros, giro, alfa });
      return;
    }
    ctx.save();
    ctx.globalAlpha *= alfa;
    ctx.translate(x, y); ctx.rotate(giro);
    ctx.fillStyle = ['#5BB51C', '#47920F', '#8BC34A', '#C0A030'][quadro % 4];
    ctx.strokeStyle = '#1A1209'; ctx.lineWidth = Math.max(1, tamanho * 0.06);
    ctx.beginPath(); ctx.ellipse(0, 0, tamanho * 0.22, tamanho * 0.44, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -tamanho * 0.4); ctx.lineTo(0, tamanho * 0.4); ctx.stroke();
    ctx.restore();
  }
  function vagalume(ctx, x, y, tamanho, t, alfa = 1) {
    if (R.pronto(E.vagalumePiscando)) {
      S.desenharSprite(ctx, E.vagalumePiscando, t, x, y, { escala: tamanho / E.vagalumePiscando.quadroA, alfa });
      return;
    }
    // círculo com halo amarelo, acendendo e apagando devagar (bem menos de 3 vezes por segundo)
    const luz = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(TAU * 0.7 * t));
    ctx.save();
    ctx.globalAlpha *= alfa * luz;
    const g = ctx.createRadialGradient(x, y, 0, x, y, tamanho * 0.5);
    g.addColorStop(0, 'rgba(255,250,170,1)'); g.addColorStop(0.3, 'rgba(255,230,80,.8)'); g.addColorStop(1, 'rgba(255,220,60,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, tamanho * 0.5, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function vagalumeVoando(ctx, x, y, tamanho, t, alfa, lado) {
    if (R.pronto(E.vagalumeVoando)) {
      S.desenharSprite(ctx, E.vagalumeVoando, t, x, y, { escala: tamanho / E.vagalumeVoando.quadroA, alfa, espelhar: lado === 'esquerda' });
      return;
    }
    vagalume(ctx, x, y, tamanho * 0.8, t, alfa);
  }
  // Estrela que acende e some (toca uma vez): `t` vai de 0 até a duração
  const duracaoBrilho = () => (R.pronto(E.brilho) ? S.duracao(E.brilho) : 0.6);
  function brilho(ctx, x, y, tamanho, t) {
    if (R.pronto(E.brilho)) {
      S.desenharSprite(ctx, E.brilho, t, x, y, { escala: tamanho / E.brilho.quadroA });
      return;
    }
    const p = U.limitar(t / 0.6, 0, 1);
    const k = Math.sin(Math.PI * p);
    const r = tamanho * 0.5 * k;
    ctx.save();
    ctx.globalAlpha *= k;
    ctx.translate(x, y); ctx.rotate(p * 0.8);
    ctx.fillStyle = '#FFF6B0';
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU, raio = i % 2 ? r * 0.28 : r;
      ctx.lineTo(Math.cos(a) * raio, Math.sin(a) * raio);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function luz(ctx, x, y, tamanho, t, rastro) {
    if (R.pronto(E.luzRastro)) {
      S.desenharSprite(ctx, E.luzRastro, t, x, y, { escala: tamanho / E.luzRastro.quadroA });
      return;
    }
    // bolinha dourada com rastro de pontinhos
    ctx.save();
    (rastro || []).forEach((p, i, l) => {
      ctx.globalAlpha = (i + 1) / (l.length + 1) * 0.7;
      ctx.fillStyle = '#FFE27A';
      ctx.beginPath(); ctx.arc(p.x, p.y, tamanho * 0.06 * (i + 1) / l.length + 1, 0, TAU); ctx.fill();
    });
    ctx.globalAlpha = 1;
    const g = ctx.createRadialGradient(x, y, 0, x, y, tamanho * 0.32);
    g.addColorStop(0, '#FFFBE0'); g.addColorStop(0.45, '#FDB30E'); g.addColorStop(1, 'rgba(253,179,14,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, tamanho * 0.32, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ── Sistemas ─────────────────────────────────────────────────
  // area = {x, y, w, h}, na medida de quem desenha (pixels da tela ou do mapa)

  // Folhas caindo, balançando e girando; somem aos poucos no fim
  function sistemaFolhas({ max = 6, tamanho = 32, vel = [32, 52], balanco = 26, aCada = [0.6, 1.2], faixas = null, somemEntre = null }) {
    const folhas = [];
    let prox = 0.2;
    return {
      atualizar(dt, area) {
        if (U.movimentoReduzido()) { folhas.length = 0; return; }
        prox -= dt;
        if (prox <= 0 && folhas.length < max) {
          prox = U.sortearDe(aCada);
          const faixa = faixas ? U.escolher(faixas) : [area.x, area.x + area.w];
          folhas.push({ x: U.sortear(faixa[0], faixa[1]), y: area.y - U.sortear(10, 40), vy: U.sortearDe(vel),
            fase: U.sortear(0, TAU), giro: U.sortear(0, TAU), vg: U.sortear(-1.1, 1.1), q: Math.floor(U.sortear(0, 18)),
            tam: Array.isArray(tamanho) ? U.sortearDe(tamanho) : tamanho, t: 0 });
        }
        const fim = somemEntre ? somemEntre[1] : area.y + area.h;
        for (const f of folhas) { f.t += dt; f.y += f.vy * dt; f.giro += f.vg * dt; }
        for (let i = folhas.length - 1; i >= 0; i--) if (folhas[i].y > fim + 20 || folhas[i].t > 30) folhas.splice(i, 1);
      },
      desenhar(ctx, area) {
        const [ini, fim] = somemEntre || [area.y + area.h * 0.85, area.y + area.h];
        for (const f of folhas) {
          const alfa = f.y > ini ? U.limitar((fim - f.y) / (fim - ini), 0, 1) : 1;
          folha(ctx, f.x + Math.sin(f.t * 1.6 + f.fase) * balanco, f.y, f.tam, f.q, f.giro, alfa);
        }
      },
    };
  }

  // Vaga-lumes piscando em pontos sorteados, derivando devagar
  function sistemaVagalumes({ quantos = 6, tamanho = 30, pontos = null, deriva = 8 }) {
    let lumes = null;
    return {
      atualizar(dt, area) {
        if (!lumes) {
          const base = pontos || Array.from({ length: quantos }, () => [U.sortear(area.x, area.x + area.w), U.sortear(area.y, area.y + area.h)]);
          lumes = base.map(([x, y]) => ({ x, y, x0: x, y0: y, fase: U.sortear(0, 3), vel: U.sortear(0.7, 1.2), dir: U.sortear(0, TAU) }));
        }
        if (U.movimentoReduzido() || !deriva) return;
        for (const l of lumes) {
          l.dir += U.sortear(-1, 1) * dt;
          l.x += Math.cos(l.dir) * deriva * dt;
          l.y += Math.sin(l.dir) * deriva * dt;
          // não se afasta mais que 40 px do ponto onde nasceu
          if (U.distancia(l.x, l.y, l.x0, l.y0) > 40) l.dir = Math.atan2(l.y0 - l.y, l.x0 - l.x);
        }
      },
      desenhar(ctx) {
        if (!lumes) return;
        const t = S.agora();
        for (const l of lumes) vagalume(ctx, l.x, l.y, tamanho, t * l.vel + l.fase);
      },
      reiniciar() { lumes = null; },
    };
  }

  // Estrelas/brilhos acendendo em pontos sorteados (cada um toca uma vez)
  function sistemaBrilhos({ aCada = [0.45, 0.95], tamanho = [40, 58], pontos = null, maxJuntos = 6 }) {
    const vivos = [];
    let prox = 0.3;
    return {
      atualizar(dt, area) {
        prox -= dt;
        if (prox <= 0 && vivos.length < maxJuntos) {
          prox = U.sortearDe(aCada);
          const p = pontos && pontos.length ? U.escolher(pontos)
            : [U.sortear(area.x, area.x + area.w), U.sortear(area.y, area.y + area.h)];
          vivos.push({ x: p[0], y: p[1], t: 0, tam: U.sortearDe(tamanho) });
        }
        const dur = duracaoBrilho();
        for (const b of vivos) b.t += dt;
        for (let i = vivos.length - 1; i >= 0; i--) if (vivos[i].t > dur) vivos.splice(i, 1);
      },
      desenhar(ctx) { for (const b of vivos) brilho(ctx, b.x, b.y, b.tam, b.t); },
      soltar(x, y, tam) { vivos.push({ x, y, t: 0, tam }); },
    };
  }

  // Confete: pedacinhos por código, nas cores do jogo, caindo e girando.
  // Movimento reduzido: um quarto dos pedacinhos, caindo devagar.
  function sistemaConfete({ quantos = 60 }) {
    let pecas = null, reduzido = null;
    return {
      atualizar(dt, area) {
        const r = U.movimentoReduzido();
        if (!pecas || r !== reduzido) {
          reduzido = r;
          const n = r ? Math.ceil(quantos / 4) : quantos;
          pecas = Array.from({ length: n }, () => ({ x: U.sortear(area.x, area.x + area.w), y: U.sortear(area.y - area.h, area.y),
            vy: U.sortear(70, 140) * (r ? 0.35 : 1), vx: U.sortear(-20, 20), giro: U.sortear(0, TAU), vg: U.sortear(-4, 4) * (r ? 0.2 : 1),
            cor: U.escolher(CORES), w: U.sortear(8, 14), h: U.sortear(5, 9) }));
        }
        for (const p of pecas) {
          p.y += p.vy * dt; p.x += p.vx * dt; p.giro += p.vg * dt;
          if (p.y > area.y + area.h + 20) { p.y = area.y - 20; p.x = U.sortear(area.x, area.x + area.w); }
        }
      },
      desenhar(ctx) {
        if (!pecas) return;
        for (const p of pecas) {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.giro);
          ctx.fillStyle = p.cor; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      },
    };
  }

  // Borboletas em trajetos suaves (soma de senos): nunca param de repente
  function sistemaBorboletas({ quantos = 5, altura = 26, area0 = null }) {
    let bs = null;
    return {
      atualizar(dt, area) {
        if (!bs) {
          const a = area0 || area;
          bs = Array.from({ length: quantos }, () => ({ cx: U.sortear(a.x + 80, a.x + a.w - 80), cy: U.sortear(a.y + 120, a.y + a.h - 100),
            ax: U.sortear(60, 140), ay: U.sortear(30, 70), fx: U.sortear(0.15, 0.3), fy: U.sortear(0.25, 0.45), fase: U.sortear(0, TAU), x: 0, y: 0, lado: 'direita' }));
        }
        const t = U.movimentoReduzido() ? 0 : S.agora();
        for (const b of bs) {
          const nx = b.cx + b.ax * Math.sin(t * b.fx + b.fase), ny = b.cy + b.ay * Math.sin(t * b.fy + 1.7 * b.fase);
          if (Math.abs(nx - b.x) > 0.01) b.lado = nx < b.x ? 'esquerda' : 'direita';
          b.x = nx; b.y = ny;
        }
      },
      desenhar(ctx) { if (bs) for (const b of bs) borboleta(ctx, b.x, b.y, altura, S.agora() + b.fase, b.lado); },
    };
  }

  // Sombra de uma nuvem atravessando devagar (por código)
  function sistemaNuvem() {
    let x = null;
    return {
      atualizar(dt, area) {
        if (x == null) x = area.x - 400;
        if (!U.movimentoReduzido()) x += 12 * dt;
        if (x > area.x + area.w + 400) x = area.x - 400;
      },
      desenhar(ctx, area) {
        if (x == null) return;
        ctx.save();
        ctx.fillStyle = 'rgba(10,25,15,.12)';
        const y = area.y + area.h * 0.42;
        for (const [dx, dy, rx, ry] of [[0, 0, 260, 110], [180, -40, 180, 90], [-170, 30, 170, 80]]) {
          ctx.beginPath(); ctx.ellipse(x + dx, y + dy, rx, ry, 0, 0, TAU); ctx.fill();
        }
        ctx.restore();
      },
    };
  }

  // ── Fundos das telas ─────────────────────────────────────────
  // Cobre a tela sem distorcer. Os largos (`panorama`) vão e voltam:
  // posição = (1 − cos(π·t ÷ panorama)) ÷ 2 do percurso, com t contado a
  // partir de meio percurso — começa pelo meio e freia nas pontas.
  function desenharFundo(ctx, nome, w, h, t) {
    const F = SPRITES.fases;
    const def = F[nome];
    if (R.pronto(def)) {
      const img = def._img;
      const escala = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * escala, dh = img.naturalHeight * escala;
      let pos = 0.5;
      if (def.panorama && !U.movimentoReduzido()) pos = (1 - Math.cos(Math.PI * (t / def.panorama + 0.5))) / 2;
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, -(dw - w) * pos, -(dh - h) / 2, dw, dh);
      return 'pintado';
    }
    const camadas = F.floresta.camadas.filter(c => R.pronto(c));
    if (camadas.length) {
      for (const c of camadas) {
        const img = c._img, escala = h / img.naturalHeight, dw = img.naturalWidth * escala;
        const desloc = U.movimentoReduzido() ? 0 : (t * c.velocidade) % dw;
        for (let x = -desloc; x < w; x += dw) ctx.drawImage(img, x, 0, dw, h);
      }
      return 'camadas';
    }
    return 'degrade';      // o degradê do CSS aparece por trás do canvas
  }

  // ── Cena de uma tela: fundo + efeitos de trás + efeitos da frente ──
  // nomeFundo = chave em SPRITES.fases; nomeEfeitos = chave em CONFIG.efeitos.telas
  function criarCena(nomeFundo, nomeEfeitos) {
    const cfg = CONFIG.efeitos.telas[nomeEfeitos || nomeFundo] || {};
    const alt = CONFIG.efeitos.altura;
    let t0 = S.agora();
    let sistemas = [];
    const frente = { brilhos: sistemaBrilhos({ aCada: [999, 999], maxJuntos: 12 }), luzes: [] };
    let reservaFolhas = null;

    function montar() {
      sistemas = [];
      if (cfg.folhas) sistemas.push(sistemaFolhas({ max: cfg.folhas, tamanho: alt.folhaTela }));
      if (cfg.vagalumes) sistemas.push(sistemaVagalumes({ quantos: cfg.vagalumes, tamanho: alt.vagalumeTela }));
      if (cfg.estrelas) sistemas.push(sistemaEstrelasTopo(cfg.estrelas, alt.estrelaTela));
      if (cfg.confete) sistemas.push(sistemaConfete({ quantos: cfg.confete }));
      // sem fundo pintado e sem camadas: degradê + folhas caindo
      reservaFolhas = cfg.folhas ? null : sistemaFolhas({ max: 5, tamanho: alt.folhaTela });
    }
    montar();

    return {
      iniciar() { t0 = S.agora(); montar(); frente.luzes = []; },
      quadro(dt, fundo, frenteCv) {
        const area = { x: 0, y: 0, w: fundo.w, h: fundo.h };
        fundo.ctx.clearRect(0, 0, fundo.w, fundo.h);
        const tipo = desenharFundo(fundo.ctx, nomeFundo, fundo.w, fundo.h, S.agora() - t0);
        for (const s of sistemas) { s.atualizar(dt, area); s.desenhar(fundo.ctx, area); }
        if (tipo === 'degrade' && reservaFolhas) { reservaFolhas.atualizar(dt, area); reservaFolhas.desenhar(fundo.ctx, area); }
        if (frenteCv) {
          frenteCv.ctx.clearRect(0, 0, frenteCv.w, frenteCv.h);
          frente.brilhos.atualizar(dt, area);
          frente.brilhos.desenhar(frenteCv.ctx);
          desenharLuzes(dt, frenteCv.ctx);
        }
      },
      // 3 a 5 estrelinhas em volta da carta certa
      estrelasEm(ret) {
        const n = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU + U.sortear(-0.3, 0.3);
          frente.brilhos.soltar(ret.x + ret.w / 2 + Math.cos(a) * ret.w * 0.55, ret.y + ret.h / 2 + Math.sin(a) * ret.h * 0.5, alt.estrelaAcerto);
        }
      },
      // A luz sai da carta certa e sobe em arco até a folhinha (0,7 s)
      luzAte(de, para, aoChegar) {
        if (U.movimentoReduzido()) { aoChegar && aoChegar(); return; }
        frente.luzes.push({ de, para, t: 0, aoChegar, rastro: [] });
      },
    };

    function desenharLuzes(dt, ctx) {
      const dur = CONFIG.tempos.luzAcerto / 1000;
      for (const l of frente.luzes) {
        l.t += dt;
        const p = U.limitar(l.t / dur, 0, 1), e = U.suave(p);
        const x = l.de.x + (l.para.x - l.de.x) * e;
        const y = l.de.y + (l.para.y - l.de.y) * e - Math.sin(Math.PI * p) * 120;
        l.rastro.push({ x, y }); if (l.rastro.length > 8) l.rastro.shift();
        luz(ctx, x, y, alt.luzAcerto, l.t, l.rastro);
        if (p >= 1 && !l.chegou) { l.chegou = true; l.aoChegar && l.aoChegar(); }
      }
      frente.luzes = frente.luzes.filter(l => !l.chegou);
    }
  }

  // Estrelas acendendo em pontos sorteados da metade de cima
  function sistemaEstrelasTopo(quantas, tamanho) {
    const b = sistemaBrilhos({ aCada: [0.35, 0.8], tamanho: [tamanho * 0.85, tamanho * 1.15], maxJuntos: quantas });
    return {
      atualizar(dt, area) { b.atualizar(dt, { x: area.x, y: area.y, w: area.w, h: area.h / 2 }); },
      desenhar(ctx) { b.desenhar(ctx); },
    };
  }

  return {
    borboleta, folha, vagalume, vagalumeVoando, brilho, luz, duracaoBrilho,
    sistemaFolhas, sistemaVagalumes, sistemaBrilhos, sistemaConfete, sistemaBorboletas, sistemaNuvem,
    desenharFundo, criarCena,
  };
})();
