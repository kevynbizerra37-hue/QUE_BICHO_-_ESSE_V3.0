'use strict';
// ═══════════════════════════════════════════════════════════════
//  ABERTURA — a arte nova e a cena animada (seção 5.8)
//  A arte do kit já traz desenhados o letreiro, os três desafios, o
//  JOGAR e a engrenagem. Botão desenhado não recebe foco nem é lido, por
//  isso a tela tem dois modos:
//   · arte    — tela deitada: a arte inteira, com botões HTML
//               transparentes por cima do que está desenhado;
//   · montado — tela em pé ou estreita (ou arte que não abriu): fundo,
//               letreiro e botões em HTML, empilhados.
//  Os números da cena (posições, tempos, tamanhos) vêm todos de
//  SPRITES.abertura; a prévia ferramentas/previa-abertura.html é a
//  referência visual.
// ═══════════════════════════════════════════════════════════════
QBE.abertura = (() => {
  const U = QBE.util, R = QBE.recursos, S = QBE.sprite, FX = QBE.efeitos;
  const A = SPRITES.abertura, F = SPRITES.fases, ARTE = F.aberturaPronta;
  const $ = U.$;
  const TAU = Math.PI * 2;

  let modoAtual = null;           // 'arte' | 'montado' | 'esperando'
  let caixa = { x: 0, y: 0, s: 1, w: 0, h: 0 };
  let artePintada = null;         // qual arte está no desfocado de trás
  let usarLimpa = null;           // decidido quando os sprites da abertura terminam
  let T = 0;                      // relógio da cena
  let montadoT0 = 0;
  let cena = null, cenaMontada = null;

  // ── Estado da cena (arte) ────────────────────────────────────
  function novaCena() {
    const lumes = A.vagalumes.map(([x, y]) => ({ x, y, fase: U.sortear(0, 3), vel: U.sortear(0.7, 1.2) }));
    const agua = A.cachoeira.map(c => ({
      poli: c.contorno,
      fios: Array.from({ length: c.fios }, () => novoFio(true)),
    }));
    return {
      tatu: { estado: 'parado', t: 0, x: 0, dir: 1, ate: A.tatu.primeiraVez },
      sapo: { pulando: false, t: 0, prox: A.sapo.primeiraVez },
      voo: { ativo: false, t: 0, prox: A.araraVoando.primeiraVez, x: 0, y: 0, dir: 1 },
      lume: { ativo: false, t: 0, prox: A.vooVagalume.primeiraVez },
      folhas: [], proxFolha: 0.5,
      brilhos: [], proxBrilho: 0.3,
      lumes, agua,
    };
  }
  // Fio de água: (u, v) dentro do contorno; desce a queda inteira em 1 a 1,5 s
  function novoFio(espalhado) {
    return { u: Math.random(), v: espalhado ? U.sortear(-0.15, 1.15) : -0.15, len: U.sortear(14, 30),
      vel: 1.3 / U.sortear(1, 1.5), w: U.sortear(1.5, 3), al: U.sortear(0.25, 0.55) };
  }

  // A arte limpa só vale com o tatu, o sapo do tronco e a borboleta
  // carregados: senão um bicho apareceria duas vezes (o desenhado e o
  // animado) ou um buraco ficaria no lugar dele.
  function decidirArte() {
    if (usarLimpa !== null || !R.aberturaPronta()) return;
    usarLimpa = R.pronto(A.fundoLimpo) && R.pronto(A.sapo.parado) && R.pronto(SPRITES.efeitos.borboleta)
      && !!R.animal('tatu', 'andando') && !!R.animal('tatu', 'festa');
  }
  const animada = () => CONFIG.abertura.animada !== false && !U.movimentoReduzido();
  function arteDeBaixo() {
    if (usarLimpa && animada()) return A.fundoLimpo._img;
    return R.pronto(ARTE) ? ARTE._img : null;
  }

  function atualizarCena(dt) {
    const c = cena;
    T += dt;
    // tatu: parado → anda `caminho` px para a direita → festa uma vez → volta → parado
    const tt = c.tatu;
    tt.t += dt;
    const festa = R.animal('tatu', 'festa');
    const durFesta = festa ? S.duracao(festa) : 3.6;
    if (tt.estado === 'parado' && tt.t > tt.ate) { tt.estado = 'andando'; tt.t = 0; }
    else if (tt.estado === 'andando') {
      tt.x += tt.dir * A.tatu.vel * dt;
      if (tt.dir > 0 && tt.x >= A.tatu.caminho) { tt.x = A.tatu.caminho; tt.estado = 'festa'; tt.t = 0; }
      if (tt.dir < 0 && tt.x <= 0) { tt.x = 0; tt.dir = 1; tt.estado = 'parado'; tt.t = 0; tt.ate = U.sortearDe(A.tatu.paradoPor); }
    } else if (tt.estado === 'festa' && tt.t > durFesta) { tt.estado = 'andando'; tt.dir = -1; tt.t = 0; }

    // sapo do tronco: de tempos em tempos pula no lugar
    const sp = c.sapo;
    sp.t += dt;
    const durPulo = S.duracao(A.sapo.pulando) || 0.5;
    if (!sp.pulando && sp.t > sp.prox) { sp.pulando = true; sp.t = 0; }
    if (sp.pulando && sp.t > durPulo) { sp.pulando = false; sp.t = 0; sp.prox = U.sortearDe(A.sapo.pulaACada); }

    // arara voando: atravessa o céu inteiro, entrando e saindo por fora da arte
    const v = c.voo, AV = A.araraVoando;
    v.t += dt;
    if (!v.ativo && v.t > v.prox) {
      v.ativo = true; v.t = 0; v.dir = Math.random() < 0.5 ? 1 : -1;
      v.x = v.dir > 0 ? -AV.altura * 1.3 : ARTE.largura + AV.altura * 1.3;
      v.y = U.sortearDe(AV.faixaY);
    }
    if (v.ativo) {
      v.x += v.dir * AV.vel * dt;
      if (v.x < -AV.altura * 1.5 || v.x > ARTE.largura + AV.altura * 1.5) { v.ativo = false; v.t = 0; v.prox = U.sortearDe(AV.aCada); }
    }

    // vaga-lume voando da caverna para o meio, aparecendo e sumindo
    const l = c.lume, VL = A.vooVagalume;
    l.t += dt;
    if (!l.ativo && l.t > l.prox) { l.ativo = true; l.t = 0; }
    if (l.ativo && l.t > VL.duracao) { l.ativo = false; l.t = 0; l.prox = U.sortearDe(VL.aCada); }

    // folhas caindo das copas (no máximo `max` ao mesmo tempo)
    const FO = A.folhas;
    c.proxFolha -= dt;
    if (c.proxFolha <= 0 && c.folhas.length < FO.max) {
      const copa = U.escolher(FO.copas);
      c.folhas.push({ x: U.sortear(copa[0], copa[1]), y: U.sortear(-30, 40), vy: U.sortearDe(FO.vel), fase: U.sortear(0, TAU),
        giro: U.sortear(0, TAU), vg: U.sortear(-1.1, 1.1), q: Math.floor(U.sortear(0, 18)), tam: U.sortearDe(FO.tamanho), t: 0 });
      c.proxFolha = U.sortearDe(FO.aCada);
    }
    for (const f of c.folhas) { f.t += dt; f.y += f.vy * dt; f.giro += f.vg * dt; }
    c.folhas = c.folhas.filter(f => f.y <= FO.somemEntre[1] && f.t < 30);

    // brilhos no letreiro: cada um toca uma vez
    const BR = A.brilhos;
    c.proxBrilho -= dt;
    if (c.proxBrilho <= 0) {
      const p = U.escolher(BR.pontos);
      c.brilhos.push({ x: p[0], y: p[1], t: 0, tam: U.sortearDe(BR.tamanho) });
      c.proxBrilho = U.sortearDe(BR.aCada);
    }
    const durBrilho = FX.duracaoBrilho();
    for (const b of c.brilhos) b.t += dt;
    c.brilhos = c.brilhos.filter(b => b.t <= durBrilho);

    // água: cada fio desce e renasce no alto, noutra coluna
    for (const a of c.agua) for (const f of a.fios) {
      f.v += f.vel * dt;
      if (f.v > 1.15) Object.assign(f, novoFio(false));
    }
  }

  // Ponto (u, v) dentro do quadrilátero da água (u: largura, v: altura)
  function pontoNaAgua(p, u, v) {
    const [a, b, c, d] = p;
    const topo = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    const baixo = [d[0] + (c[0] - d[0]) * u, d[1] + (c[1] - d[1]) * u];
    return [topo[0] + (baixo[0] - topo[0]) * v, topo[1] + (baixo[1] - topo[1]) * v];
  }

  // ── Desenho da cena, do fundo para a frente ──────────────────
  function desenharCena(ctx) {
    const c = cena, completa = usarLimpa === true;
    // 1. água da cachoeira: fios brancos e espuma na base de cada contorno
    for (const a of c.agua) {
      ctx.save();
      ctx.beginPath(); a.poli.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip();
      ctx.fillStyle = '#ffffff';
      for (const f of a.fios) {
        const [x, y] = pontoNaAgua(a.poli, f.u, f.v);
        ctx.globalAlpha = f.al;
        ctx.fillRect(x - f.w / 2, y, f.w, f.len);
      }
      ctx.restore();
      const base = Math.max(a.poli[2][1], a.poli[3][1]);
      for (let i = 0; i < 5; i++) {
        const k = (T / 1.4 + i / 5) % 1;
        const x = a.poli[3][0] + (a.poli[2][0] - a.poli[3][0]) * (((i * 37) % 10) / 10 + 0.05);
        ctx.save();
        ctx.globalAlpha = 0.5 * (1 - k);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(x, base - 2 - k * 10, 3 + k * 5, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }
    // 2. vaga-lumes piscando, cada um no seu ritmo
    for (const l of c.lumes) FX.vagalume(ctx, l.x, l.y, A.alturaVagalume, T * l.vel + l.fase);
    // 3. arara e tucano pousados, exatamente em cima dos desenhados
    if (R.pronto(A.arara)) S.desenharSprite(ctx, A.arara, T, A.arara.x, A.arara.y, { escala: A.arara.escala });
    if (R.pronto(A.tucano)) S.desenharSprite(ctx, A.tucano, T + (A.tucano.atraso || 0), A.tucano.x, A.tucano.y, { escala: A.tucano.escala });
    if (completa) {
      // 4. borboletas em "oito": x = cx + ax·sen(t·fx + fase); y = cy + ay·sen(t·fy + 1,7·fase)
      for (const b of A.borboletas) {
        const x = b.cx + b.ax * Math.sin(T * b.fx + b.fase), y = b.cy + b.ay * Math.sin(T * b.fy + 1.7 * b.fase);
        const lado = Math.cos(T * b.fx + b.fase) < 0 ? 'esquerda' : 'direita';
        FX.borboleta(ctx, x, y, A.alturaBorboleta, T + b.fase, lado);
      }
      // 5. tatu
      const tt = c.tatu, xt = A.tatu.x + tt.x;
      const anim = tt.estado === 'festa' ? 'festa' : tt.estado === 'andando' ? 'andando' : 'parado';
      const def = R.animal('tatu', anim);
      if (def) {
        const respira = anim === 'parado' ? 1 + 0.03 * Math.sin(TAU * 1.2 * T) : 1;
        S.desenharSprite(ctx, def, tt.t, xt, A.tatu.y, { escala: A.tatu.escala, espelhar: tt.dir < 0 && anim === 'andando', escalaY: respira });
      }
      // 6. sapo do tronco
      const sp = c.sapo;
      if (sp.pulando && R.pronto(A.sapo.pulando)) S.desenharSprite(ctx, A.sapo.pulando, sp.t, A.sapo.x, A.sapo.y, { escala: A.sapo.escala });
      else S.desenharSprite(ctx, A.sapo.parado, T, A.sapo.x, A.sapo.y, { escala: A.sapo.escala });
    }
    // 7. arara voando
    const v = c.voo, AV = A.araraVoando;
    if (v.ativo && R.pronto(AV)) {
      S.desenharSprite(ctx, AV, v.t, v.x, v.y + Math.sin(v.t * 3) * AV.ondula, { escala: AV.altura / AV.quadroA, espelhar: v.dir < 0 });
    }
    // 8. vaga-lume voando, aparecendo e sumindo aos poucos
    const l = c.lume, VL = A.vooVagalume;
    if (l.ativo) {
      const k = l.t / VL.duracao;
      const x = VL.de[0] + (VL.ate[0] - VL.de[0]) * k;
      const y = VL.de[1] + (VL.ate[1] - VL.de[1]) * k + Math.sin(k * 9) * VL.ondula;
      FX.vagalumeVoando(ctx, x, y, VL.altura, l.t, Math.min(1, 3 * (1 - k), 3 * k), VL.ate[0] < VL.de[0] ? 'esquerda' : 'direita');
    }
    // 9. brilhos no letreiro
    for (const b of c.brilhos) FX.brilho(ctx, b.x, b.y, b.tam, b.t);
    // 10. folhas, na frente de tudo
    const [ini, fim] = A.folhas.somemEntre;
    for (const f of c.folhas) {
      const alfa = f.y > ini ? U.limitar((fim - f.y) / (fim - ini), 0, 1) : 1;
      FX.folha(ctx, f.x + Math.sin(f.t * 1.6 + f.fase) * A.folhas.balanco, f.y, f.tam, f.q, f.giro, alfa);
    }
  }

  // ── Modo e medidas ───────────────────────────────────────────
  // Tela deitada (largura ≥ 1,5 × altura) e arte que não falhou = modo arte
  function escolherModo() {
    const deitada = innerWidth >= (ARTE.proporcaoMinima || 1.5) * innerHeight;
    if (!ARTE.ativo || !deitada) return 'montado';
    if (R.pronto(ARTE)) return 'arte';
    // ainda carregando: espera; falhou: monta
    return R.aberturaPronta() ? 'montado' : 'esperando';
  }

  function posicionarArte() {
    const s = Math.min(innerWidth / ARTE.largura, innerHeight / ARTE.altura);
    const w = ARTE.largura * s, h = ARTE.altura * s;
    const nova = { x: (innerWidth - w) / 2, y: (innerHeight - h) / 2, s, w, h };
    if (nova.x === caixa.x && nova.y === caixa.y && nova.s === caixa.s) return;
    caixa = nova;
    Object.assign($('abertura-arte').style, { left: caixa.x + 'px', top: caixa.y + 'px', width: w + 'px', height: h + 'px' });
  }
  function posicionarAreas() {
    const ar = ARTE.areas;
    const colocar = (el, nome) => {
      const [x, y, w, h] = ar[nome];
      Object.assign(el.style, { left: x + '%', top: y + '%', width: w + '%', height: h + '%' });
    };
    colocar($('area-jogar'), 'jogar');
    colocar($('area-config'), 'config');
    document.querySelectorAll('#abertura-arte .area-info').forEach(el => colocar(el, el.dataset.area));
    colocar($('area-continuar'), 'continuar');
    colocar($('area-apagar'), 'apagar');
  }

  function aplicarModo(modo) {
    if (modo === modoAtual) return;
    modoAtual = modo;
    $('abertura-arte').hidden = modo !== 'arte';
    $('abertura-montada').hidden = modo !== 'montado';
    $('abertura-borrado').hidden = modo !== 'arte';
    if (modo === 'montado') montadoT0 = S.agora();
    if (QBE.telas) QBE.telas.atualizarBotoesFixos();
  }

  // As sobras da tela mostram a mesma arte, desfocada por CSS: pintada
  // uma vez, nunca redesenhada a cada quadro (desfoque no canvas derruba o
  // fps de notebook fraco).
  function pintarBorrado(img) {
    if (!img || artePintada === img) return;
    artePintada = img;
    $('abertura-borrado').style.backgroundImage = `url("${img.src}")`;
  }

  // ── Modo montado ─────────────────────────────────────────────
  function novaCenaMontada() {
    return {
      folhas: FX.sistemaFolhas({ max: 8, tamanho: [28, 40], vel: A.folhas.vel, balanco: A.folhas.balanco, aCada: A.folhas.aCada }),
      lumes: null,
      borboletas: FX.sistemaBorboletas({ quantos: 2, altura: A.alturaBorboleta }),
      brilhos: null,
      voo: { ativo: false, t: 0, prox: A.araraVoando.primeiraVez, x: 0, y: 0, dir: 1 },
    };
  }
  function quadroMontado(dt, ctx, w, h) {
    const c = cenaMontada;
    const t = S.agora() - montadoT0;
    FX.desenharFundo(ctx, R.pronto(F.abertura) ? 'abertura' : 'aberturaMontada', w, h, t);
    if (!animada()) return;
    const area = { x: 0, y: 0, w, h };
    // vaga-lumes piscando perto das bordas
    if (!c.lumes) {
      const pontos = Array.from({ length: 8 }, (_, i) => [i % 2 ? U.sortear(w * 0.84, w * 0.97) : U.sortear(w * 0.03, w * 0.16), U.sortear(h * 0.15, h * 0.9)]);
      c.lumes = FX.sistemaVagalumes({ pontos, tamanho: A.alturaVagalume * 0.8, deriva: 0 });
    }
    // brilhos sobre o letreiro
    if (!c.brilhos) {
      const logo = document.querySelector('.montada-logo').getBoundingClientRect();
      const pontos = Array.from({ length: 30 }, () => [U.sortear(logo.left + logo.width * 0.15, logo.right - logo.width * 0.15), U.sortear(logo.top + 8, logo.bottom - 8)]);
      c.brilhos = FX.sistemaBrilhos({ aCada: A.brilhos.aCada, tamanho: [30, 44], pontos, maxJuntos: 4 });
    }
    for (const s of [c.lumes, c.borboletas, c.brilhos, c.folhas]) { s.atualizar(dt, area); s.desenhar(ctx, area); }
    // a arara voando no alto
    const v = c.voo, AV = A.araraVoando;
    v.t += dt;
    if (!v.ativo && v.t > v.prox) { v.ativo = true; v.t = 0; v.dir = Math.random() < 0.5 ? 1 : -1; v.x = v.dir > 0 ? -90 : w + 90; v.y = U.sortear(h * 0.06, h * 0.14); }
    if (v.ativo) {
      v.x += v.dir * AV.vel * 0.8 * dt;
      if (R.pronto(AV)) S.desenharSprite(ctx, AV, v.t, v.x, v.y + Math.sin(v.t * 3) * AV.ondula, { escala: 70 / AV.quadroA, espelhar: v.dir < 0 });
      if (v.x < -120 || v.x > w + 120) { v.ativo = false; v.t = 0; v.prox = U.sortearDe(AV.aCada); }
    }
  }

  // ── Pré-carga: JOGAR apagado com a barra por cima ────────────
  let avisouPronto = false;
  function atualizarPrecarga() {
    const pronto = R.tudoPronto();
    const pct = Math.round(R.progresso() * 100);
    for (const id of ['area-jogar', 'montada-jogar']) {
      const b = $(id);
      b.classList.toggle('carregando', !pronto);
      if (pronto) b.removeAttribute('aria-disabled'); else b.setAttribute('aria-disabled', 'true');
      const cheio = b.querySelector('.precarga-cheio'), texto = b.querySelector('.precarga-texto');
      if (!pronto && cheio) { cheio.style.width = pct + '%'; texto.textContent = `Preparando a floresta… ${pct}%`; }
    }
    if (pronto && !avisouPronto) { avisouPronto = true; $('precarga-status').textContent = 'Pronto para jogar.'; }
  }

  // ── Os três letreiros só informam: tocar acende e, com a narração, lê ──
  function ligarLetreiros() {
    document.querySelectorAll('#tela-abertura [data-texto]').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.add('acesa');
        clearTimeout(el._apaga);
        el._apaga = setTimeout(() => el.classList.remove('acesa'), 1200);
        QBE.voz.narrar(el.dataset.texto, { guardar: false });
      });
    });
  }

  // ── Interface para telas.js e main.js ────────────────────────
  function iniciar() {
    if (!cena) { cena = novaCena(); cenaMontada = novaCenaMontada(); posicionarAreas(); ligarLetreiros(); $('precarga-status').textContent = 'Preparando a floresta…'; }
    modoAtual = null;
  }
  function quadro(dt) {
    atualizarPrecarga();
    decidirArte();
    const modo = escolherModo();
    aplicarModo(modo);
    const { ctx, w, h } = U.ajustarCanvas($('abertura-canvas'));
    ctx.clearRect(0, 0, w, h);
    if (modo === 'montado') {
      const logo = SPRITES.ui.logo, img = $('montada-logo-img');
      if (R.pronto(logo) && img.hidden) { img.src = logo.arquivo; img.alt = ''; img.hidden = false; $('montada-logo-texto').hidden = true; }
      quadroMontado(dt, ctx, w, h);
      return;
    }
    if (modo === 'esperando') {
      // a arte ainda está chegando: só o recado, no meio da tela
      ctx.fillStyle = '#fff';
      ctx.font = '700 22px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`PREPARANDO A FLORESTA… ${Math.round(R.progresso() * 100)}%`, w / 2, h / 2);
      return;
    }
    posicionarArte();
    const arte = arteDeBaixo();
    pintarBorrado(arte);
    ctx.save();
    ctx.translate(caixa.x, caixa.y);
    ctx.scale(caixa.s, caixa.s);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    if (arte) ctx.drawImage(arte, 0, 0, ARTE.largura, ARTE.altura);
    // Até a decisão (os sprites da abertura carregando), a arte parada
    if (usarLimpa !== null && animada()) {
      atualizarCena(dt);
      ctx.beginPath(); ctx.rect(0, 0, ARTE.largura, ARTE.altura); ctx.clip();
      desenharCena(ctx);
    }
    ctx.restore();
  }
  function atualizarBotoes(temProgresso) {
    for (const id of ['area-continuar', 'area-apagar', 'montada-continuar', 'montada-apagar']) $(id).hidden = !temProgresso;
  }

  return { iniciar, quadro, atualizarBotoes, modo: () => modoAtual };
})();
