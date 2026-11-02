'use strict';
// ═══════════════════════════════════════════════════════════════
//  ÁUDIO — o canal único
//  TODO som do jogo passa por aqui: voz, som do bicho e bipes de
//  reserva. Só um item toca por vez; um item novo interrompe o anterior;
//  dentro de uma sequência, cada item só começa quando o anterior
//  terminou DE VERDADE (pelos eventos de fim, nunca por tempo chutado).
//  Cada sequência ganha um número: avisos atrasados de uma sequência
//  antiga são ignorados.
// ═══════════════════════════════════════════════════════════════
QBE.audio = (() => {
  const R = QBE.recursos;
  const canal = { fila: [], token: 0, repetir: null };
  let mudo = false;
  let atual = null;                 // o <audio> do bicho tocando
  let somId = 0;                    // muda a cada som novo ou parado
  let marcado = null;               // quem mostra "tocando agora"
  let actx = null, bipes = [];

  // ── Política de autoplay: o AudioContext nasce e retoma no 1º gesto ──
  function contexto() {
    if (!actx) {
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; }
    }
    if (actx && actx.state === 'suspended') actx.resume().catch(() => {});
    return actx;
  }
  function primeiroGesto() { contexto(); }
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, primeiroGesto, { capture: true, passive: true }));

  // ── Destaque visual do que está tocando ──
  // `elemento` é um botão (ganha a classe "tocando") ou um objeto com
  // aoTocar()/aoParar() (a moita da etapa, que balança enquanto toca).
  function marcar(el) {
    if (marcado && marcado !== el) desmarcar(marcado);
    marcado = el || null;
    if (!el) return;
    if (el.classList) el.classList.add('tocando');
    else if (el.aoTocar) el.aoTocar();
  }
  function desmarcar(el) {
    if (!el) return;
    if (el.classList) el.classList.remove('tocando');
    else if (el.aoParar) el.aoParar();
    if (marcado === el) marcado = null;
  }

  // ── Bipes de reserva (Web Audio) com as frequências do campo `tom` ──
  function pararBipes() {
    bipes.forEach(n => { try { n.stop(); } catch (e) {} });
    bipes = [];
  }
  function tocarBipes(tons) {
    const c = contexto(); if (!c) return 0;
    const lista = tons && tons.length ? tons : [440, 660, 440];
    let t = c.currentTime;
    const passo = Math.min(0.22, 1 / lista.length);          // ~1 s no total
    for (const f of lista) {
      const osc = c.createOscillator(), g = c.createGain();
      osc.type = 'square'; osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.05, passo - 0.03));
      osc.connect(g).connect(c.destination);
      osc.start(t); osc.stop(t + passo);
      bipes.push(osc);
      t += passo + 0.02;
    }
    return (t - c.currentTime) * 1000;
  }

  function pararSom() {
    somId++;
    if (atual) { try { atual.pause(); atual.currentTime = 0; } catch (e) {} atual = null; }
    pararBipes();
    desmarcar(marcado);
  }

  // ── Toca UM som de bicho e avisa quando ele terminou de verdade ──
  // No máximo 8 s; depois o volume desce em ~0,4 s e o som para. Se o
  // arquivo falhar ou o navegador recusar o play(), toca a reserva —
  // mas não quando o som foi parado de propósito: o pause() faz o
  // play() pendente falhar com AbortError, e aí os bipes saíam por cima
  // do som seguinte.
  function tocarSomAgora(id, el, aoFim) {
    const a = ANIMAIS[id];
    if (mudo || !a) { aoFim(); return; }
    const meu = ++somId;
    const vale = () => meu === somId;
    marcar(el);
    let acabou = false, limite = null, reservaUsada = false;
    const fim = () => {
      if (acabou) return; acabou = true;
      clearTimeout(limite);
      if (vale()) {
        if (atual) { try { atual.pause(); } catch (e) {} atual = null; }
        desmarcar(el);
      }
      aoFim();
    };
    const reserva = () => {
      if (acabou || reservaUsada || !vale()) return;
      reservaUsada = true;
      if (atual) { try { atual.pause(); } catch (e) {} atual = null; }
      const ms = tocarBipes(a.tom);
      setTimeout(fim, Math.max(400, ms + 80));
    };
    if (!R.somFunciona(id)) { reserva(); return; }
    limite = setTimeout(() => {
      const au = atual;
      if (!vale() || !au) { fim(); return; }
      let vol = 1;
      const desce = setInterval(() => {
        vol -= 0.1;
        if (vol <= 0 || !vale()) { clearInterval(desce); fim(); }
        else { try { au.volume = vol; } catch (e) {} }
      }, 40);
    }, CONFIG.limiteSomMs);
    try {
      const au = new Audio(a.som);
      atual = au;
      au.addEventListener('ended', fim);
      au.addEventListener('error', reserva);
      // reserva() já ignora o som parado de propósito (vale() fica falso)
      const p = au.play();
      if (p && p.catch) p.catch(reserva);
    } catch (e) { reserva(); }
  }

  // ── A fila ───────────────────────────────────────────────────
  function silenciarTudo() {
    canal.token++;                     // invalida os avisos da sequência anterior
    canal.fila = [];
    if (QBE.voz) QBE.voz.parar();
    pararSom();
  }
  // itens: {fala, guardar}, {som: id, elemento}, {espera: ms}, {acao: fn}
  // `repetivel` guarda a sequência para o R e o 🔁 tocarem tudo de novo
  function tocarSequencia(itens, { repetivel = false } = {}) {
    silenciarTudo();
    const lista = (itens || []).filter(Boolean);
    if (repetivel) canal.repetir = lista.slice();
    canal.fila = lista.slice();
    seguir(canal.token);
  }
  function seguir(meu) {
    if (meu !== canal.token) return;   // outra sequência assumiu o canal
    const item = canal.fila.shift();
    if (!item) return;
    const proximo = () => { if (meu === canal.token) seguir(meu); };
    if (item.fala !== undefined) QBE.voz.falarAgora(item.fala, item, proximo);
    else if (item.som) tocarSomAgora(item.som, item.elemento, proximo);
    else if (item.espera) setTimeout(proximo, item.espera);
    else if (item.acao) { try { item.acao(); } catch (e) { console.error(e); } proximo(); }
    else proximo();
  }
  function repetir() {
    if (canal.repetir && canal.repetir.length) { tocarSequencia(canal.repetir.slice(), { repetivel: true }); return true; }
    return false;
  }
  // Ao trocar de tela, a sequência guardada da tela anterior não vale mais
  const esquecerRepetir = () => { canal.repetir = null; };

  // Toca o som de um bicho sozinho (o 🔊 de uma carta, a moita da etapa 1)
  function tocarSom(id, el) { tocarSequencia([{ som: id, elemento: el }]); }

  return {
    tocarSequencia, silenciarTudo, repetir, esquecerRepetir, tocarSom, pararSom, tocarBipes,
    definirMudo(v) { mudo = !!v; if (mudo) pararSom(); },
    mudo: () => mudo,
  };
})();
