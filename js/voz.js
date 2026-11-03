'use strict';
// ═══════════════════════════════════════════════════════════════
//  NARRAÇÃO — a voz do jogo, para a criança que não enxerga
//  Web Speech API, voz pt-BR (senão qualquer pt; sem nenhuma, a
//  narração fica desligada, com aviso nas configurações). O texto de
//  cada bicho vem do campo `audiodescricao` em dados.js.
// ═══════════════════════════════════════════════════════════════
QBE.voz = (() => {
  const estado = {
    ligada: false,
    velocidade: CONFIG.vozVelocidadePadrao,   // o padrão 1,0 é rápido demais para os pequenos
    voz: null,
    ultimo: '',                                // última fala guardada, para o repetir
    procurou: false,                           // as vozes já chegaram (ou desistimos de esperar)
  };
  let falando = null;
  const avisos = [];

  const disponivel = () => typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined';

  // As vozes chegam depois da carga no Chrome e no Edge (voiceschanged).
  // Entre as de português, prefere a instalada no aparelho (localService):
  // as vozes "Google" do Chrome são de rede, não falam sem internet (e o
  // jogo roda sem ela, na sala) e podem cortar as falas longas no meio.
  function escolherVoz() {
    if (!disponivel()) return;
    let vs = [];
    try { vs = speechSynthesis.getVoices() || []; } catch (e) { return; }
    if (!vs.length) return;
    const br = vs.filter(v => /^pt[-_]br/i.test(v.lang));
    const pt = vs.filter(v => /^pt/i.test(v.lang));
    const doAparelho = lista => lista.find(v => v.localService);
    estado.voz = doAparelho(br) || br[0] || doAparelho(pt) || pt[0] || null;
    estado.procurou = true;
    avisos.forEach(fn => fn());
  }
  if (disponivel()) {
    escolherVoz();
    if (typeof speechSynthesis.addEventListener === 'function') speechSynthesis.addEventListener('voiceschanged', escolherVoz);
    // Sem nenhuma voz depois de 2 s: o navegador não tem mesmo
    setTimeout(() => { if (!estado.procurou) { estado.procurou = true; avisos.forEach(fn => fn()); } }, 2000);
  }
  // Tem como narrar em português? (enquanto as vozes não chegaram, conta que sim)
  const temVoz = () => disponivel() && (!estado.procurou || !!estado.voz);

  // ── Fala UM texto e avisa quando terminou. Só o canal de áudio chama. ──
  // Os emojis das curiosidades (🌳, 💧) viravam "árvore de folhas
  // caducas" na boca da voz: saem só da fala, o texto na tela fica igual.
  const semEmoji = t => String(t).replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s{2,}/g, ' ').trim();
  function falarAgora(texto, item, aoFim) {
    texto = semEmoji(texto || '');
    if (!estado.ligada || !temVoz() || !texto) { aoFim(); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = 'pt-BR';
      u.rate = estado.velocidade;
      u.pitch = 1.05;
      if (estado.voz) u.voice = estado.voz;
      let acabou = false, vigia = null;
      const fim = () => {
        if (acabou) return; acabou = true;
        clearTimeout(vigia);
        if (falando === u) falando = null;
        aoFim();
      };
      u.onend = fim; u.onerror = fim;
      // O Chrome joga fora a fala que ninguém referencia, e aí o onend
      // nunca chega: guardando aqui, ela vive até terminar.
      falando = u;
      // Vigia: se mesmo assim o fim não vier (falas longas às vezes param
      // sozinhas), a fila segue em vez de travar a criança na fase.
      vigia = setTimeout(fim, 4000 + texto.length * 110 / estado.velocidade);
      speechSynthesis.speak(u);
      if (!item || item.guardar !== false) estado.ultimo = texto;
    } catch (e) { aoFim(); }
  }
  function parar() {
    if (!disponivel()) return;
    try { speechSynthesis.cancel(); } catch (e) {}
  }

  // Com a narração desligada, narrar não faz nada — nem silencia o canal:
  // na 2.0 um TAB ou um clique errado cortava o som do bicho.
  // `guardar:false` para falas passageiras (foco, acerto, erro), que não
  // viram o alvo do repetir.
  function narrar(texto, { guardar = true, aoTerminar = null } = {}) {
    if (!estado.ligada) { if (aoTerminar) aoTerminar(); return; }
    QBE.audio.tocarSequencia([{ fala: texto, guardar }, aoTerminar ? { acao: aoTerminar } : null]);
  }

  return {
    falarAgora, parar, narrar, disponivel, temVoz,
    ligada: () => estado.ligada,
    definirLigada(v) { estado.ligada = !!v; if (!estado.ligada) QBE.audio.silenciarTudo(); },
    velocidade: () => estado.velocidade,
    definirVelocidade(v) { if (typeof v === 'number' && v > 0) estado.velocidade = v; },
    ultimo: () => estado.ultimo,
    quandoSouberDasVozes: fn => (estado.procurou ? fn() : avisos.push(fn)),
  };
})();
