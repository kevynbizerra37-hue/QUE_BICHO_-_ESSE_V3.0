'use strict';
// ═══════════════════════════════════════════════════════════════
//  TELAS — navegação, abertura (botões), janelas, confirmação e final
//  Uma tela de cada vez. Trocar de tela silencia o canal de áudio e
//  muda o contador que as etapas conferem antes de avançar.
// ═══════════════════════════════════════════════════════════════
QBE.telas = (() => {
  const U = QBE.util, $ = U.$;
  const TELAS = ['abertura', 'mapa', 'etapa', 'celebracao', 'final'];
  let atual = null, contador = 0;
  let focoDoJogo = false;
  const cenaFinal = QBE.efeitos.criarCena('final', 'final');

  // ── Navegação ────────────────────────────────────────────────
  function mostrar(nome, { forcar = false } = {}) {
    if (nome === atual && !forcar) return;
    const anterior = atual;
    atual = nome;
    contador++;
    QBE.audio.silenciarTudo();          // a fala da tela anterior não vaza
    QBE.audio.esquecerRepetir();
    // o "Correto!" da etapa anterior não fica por cima do título da nova
    clearTimeout(avisoT); $('aviso').classList.remove('mostra');
    if (nome !== 'mapa' && QBE.mapa) QBE.mapa.zerarEmbalo();
    for (const t of TELAS) $('tela-' + t).classList.toggle('ativa', t === nome);
    atualizarBotoesFixos();
    if (anterior !== nome && nome !== 'etapa' && nome !== 'celebracao') focarTitulo();
  }
  // Ao trocar de tela o foco ficava no botão da tela anterior, que sumiu,
  // e o leitor de tela se perdia. Com a narração do jogo desligada, o
  // foco vai para o título da tela nova; com ela ligada, a narração cuida
  // do foco (1ª carta, botão da celebração).
  function focarTitulo() {
    if (QBE.voz.ligada()) return;
    const h1 = document.querySelector(`#tela-${atual} h1[tabindex="-1"]`);
    if (!h1) return;
    focoDoJogo = true;
    try { h1.focus({ preventScroll: true }); } finally { focoDoJogo = false; }
  }
  function atualizarBotoesFixos() {
    const naEtapa = atual === 'etapa';
    $('btn-voltar').hidden = !naEtapa;
    $('btn-repetir').hidden = !(naEtapa && QBE.voz.ligada());
    // No modo arte a engrenagem é a da própria arte: não pode haver duas
    $('btn-config').hidden = atual === 'abertura' && QBE.abertura.modo() === 'arte';
  }

  function irParaMapa({ reiniciar = false } = {}) {
    mostrar('mapa');
    QBE.mapa.visitar({ reiniciar });
    QBE.mapa.narrarMapa();
  }

  // ── Abertura ─────────────────────────────────────────────────
  const carregando = b => b.getAttribute('aria-disabled') === 'true';
  function jogar(e) {
    if (carregando(e.currentTarget)) return;
    if (QBE.salvar.temProgresso()) {
      perguntar({
        titulo: 'Começar do zero?',
        texto: `Você vai perder ${QBE.salvar.oQueSePerde()}. Para seguir de onde parou, escolha Continuar.`,
        sim: 'Sim, começar do zero', nao: 'Não, voltar',
        fala: 'Aperte ENTER para voltar, ou TAB e depois ENTER para começar do zero.',
        aoConfirmar: comecarPartida,
      });
      return;
    }
    comecarPartida();
  }
  function comecarPartida() {
    QBE.sorteio.novaPartida();
    irParaMapa({ reiniciar: true });
  }
  function continuar() {
    QBE.sorteio.completarSalvo();
    irParaMapa({ reiniciar: true });
  }
  function apagar() {
    if (!QBE.salvar.temProgresso()) return;
    perguntar({
      titulo: 'Apagar o progresso?',
      texto: `Você vai perder ${QBE.salvar.oQueSePerde()}.`,
      sim: 'Sim, apagar', nao: 'Não, voltar',
      fala: 'Aperte ENTER para voltar sem apagar, ou TAB e depois ENTER para apagar.',
      aoConfirmar: () => {
        QBE.salvar.apagarProgresso();
        QBE.abertura.atualizarBotoes(false);
        aviso('Progresso apagado!', true);
        const j = QBE.abertura.modo() === 'arte' ? $('area-jogar') : $('montada-jogar');
        if (U.visivel(j)) j.focus();
      },
    });
  }

  // ── Final ────────────────────────────────────────────────────
  function mostrarFinal() {
    mostrar('final');
    const pontos = QBE.salvar.partida.pontos;
    $('final-coroas').textContent = pontos;     // mostrado antes de o "jogar de novo" zerar
    cenaFinal.iniciar();
    QBE.audio.tocarSequencia([
      { fala: `Você conseguiu! Parabéns! Você descobriu todos os animais das moitas! Você fez ${pontos} coroas! Jogue de novo: as moitas vão esconder outros animais!` },
      { fala: 'Aperte ENTER para jogar de novo.', guardar: false },
      { acao: () => { if (QBE.voz.ligada() && atual === 'final') $('btn-jogar-de-novo').focus(); } },
    ], { repetivel: true });
  }
  function jogarDeNovo() {
    QBE.sorteio.novaPartida();
    irParaMapa({ reiniciar: true });
    aviso('🎲 Outros animais nas moitas!', true);
  }
  function quadroFinal(dt) { cenaFinal.quadro(dt, U.ajustarCanvas($('final-fundo')), U.ajustarCanvas($('final-frente'))); }

  // ── Aviso (faixa de acerto e erro) ───────────────────────────
  let avisoT = null;
  function aviso(texto, ok) {
    const el = $('aviso');
    el.textContent = texto;
    el.className = 'aviso mostra ' + (ok ? 'ok' : 'erro');
    clearTimeout(avisoT);
    avisoT = setTimeout(() => el.classList.remove('mostra'), 1800);
  }

  // ── Janelas (configurações e ajuda) ──────────────────────────
  // Ao abrir, o foco entra; TAB e Shift+TAB dão a volta dentro; ao fechar,
  // o foco volta para quem abriu.
  const JANELAS = ['janela-config', 'janela-ajuda', 'janela-confirmacao'];
  const janelaAberta = () => JANELAS.some(id => !$(id).hidden);
  const focaveis = j => [...j.querySelectorAll('button, input')].filter(el => !el.disabled && U.visivel(el));
  function abrirJanela(id) {
    const j = $(id);
    if (!j.hidden) { fecharJanela(id); return; }
    j._voltar = document.activeElement;
    j.hidden = false;
    const primeiro = focaveis(j)[0];
    if (primeiro) { focoDoJogo = true; try { primeiro.focus(); } finally { focoDoJogo = false; } }
    if (id === 'janela-config') QBE.voz.narrar('Configurações abertas.', { guardar: false });
    if (id === 'janela-ajuda') QBE.voz.narrar('Como jogar. ' + [...j.querySelectorAll('.ajuda-item')].map(i => i.textContent.replace(/\s+/g, ' ')).join('. '), { guardar: false });
  }
  function fecharJanela(id) {
    const j = $(id);
    if (j.hidden) return;
    j.hidden = true;
    QBE.audio.silenciarTudo();
    const v = j._voltar; j._voltar = null;
    if (v && v.focus && U.visivel(v)) v.focus();
  }
  function prenderFoco(e) {
    if (e.key !== 'Tab') return;
    const itens = focaveis(e.currentTarget);
    if (!itens.length) return;
    const i = itens.indexOf(document.activeElement);
    const prox = e.shiftKey ? (i <= 0 ? itens.length - 1 : i - 1) : (i === itens.length - 1 ? 0 : i + 1);
    e.preventDefault();
    itens[prox].focus();
  }

  // ── Confirmação ──────────────────────────────────────────────
  // "Tem certeza?" no estilo do jogo e narrado. O botão que preserva vem
  // primeiro e já com o foco: um ENTER apressado nunca apaga nada.
  function perguntar({ titulo, texto, sim, nao, fala, aoConfirmar }) {
    const j = $('janela-confirmacao'), bSim = $('conf-sim'), bNao = $('conf-nao');
    $('conf-titulo').textContent = titulo;
    $('conf-texto').textContent = texto;
    bSim.textContent = sim; bNao.textContent = nao;
    j._voltar = document.activeElement;
    j._aoConfirmar = aoConfirmar;
    j.hidden = false;
    focoDoJogo = true;
    try { bNao.focus(); } finally { focoDoJogo = false; }
    QBE.voz.narrar(`${titulo} ${texto} ${fala}`);
  }
  function responderConfirmacao(confirmou) {
    const j = $('janela-confirmacao');
    const fn = j._aoConfirmar; j._aoConfirmar = null;
    fecharJanela('janela-confirmacao');
    if (confirmou && fn) fn();
  }

  // ── Configurações ────────────────────────────────────────────
  function preferencias() {
    return { ligada: QBE.voz.ligada(), velocidade: QBE.voz.velocidade(), mudo: QBE.audio.mudo() };
  }
  function aplicarPreferencias(p) {
    QBE.voz.definirVelocidade(p.velocidade);
    QBE.audio.definirMudo(p.mudo);
    QBE.voz.definirLigada(p.ligada && QBE.voz.temVoz());
    $('cfg-narracao').checked = QBE.voz.ligada();
    $('cfg-sons').checked = !QBE.audio.mudo();
    marcarVelocidade();
  }
  function marcarVelocidade() {
    const v = QBE.voz.velocidade();
    document.querySelectorAll('.cfg-vel').forEach(b => b.setAttribute('aria-pressed', String(CONFIG.vozVelocidades[b.dataset.vel] === v)));
  }
  // Sem voz em português: narração desabilitada, com aviso
  function conferirVozes() {
    const tem = QBE.voz.temVoz();
    $('cfg-narracao').disabled = !tem;
    $('cfg-sem-voz').hidden = tem;
    if (!tem && QBE.voz.ligada()) { QBE.voz.definirLigada(false); $('cfg-narracao').checked = false; }
  }
  function repetir() {
    if (QBE.audio.repetir()) return;
    const ultimo = QBE.voz.ultimo();
    if (ultimo) QBE.voz.narrar(ultimo);
  }

  // ── Teclado ──────────────────────────────────────────────────
  const campoDeTexto = el => !!(el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) && el.type !== 'checkbox');
  function teclaAbaixo(e) {
    if (e.key === 'Escape') {
      // ESC na confirmação é "não": fecha e devolve o foco, sem apagar nada
      if (!$('janela-confirmacao').hidden) { responderConfirmacao(false); return; }
      fecharJanela('janela-ajuda'); fecharJanela('janela-config');
      QBE.audio.silenciarTudo();
      return;
    }
    if ((e.key === 'r' || e.key === 'R') && QBE.voz.ligada() && !campoDeTexto(e.target)) {
      e.preventDefault(); repetir(); return;
    }
    if (janelaAberta()) return;          // com janela aberta, o sapo não anda e nada abre
    if (atual === 'mapa') QBE.mapa.tecla(e);
    else if (atual === 'etapa') QBE.etapas.tecla(e);
  }

  // ── Ligações ─────────────────────────────────────────────────
  function iniciar() {
    ['area-jogar', 'montada-jogar'].forEach(id => $(id).addEventListener('click', jogar));
    ['area-continuar', 'montada-continuar'].forEach(id => $(id).addEventListener('click', continuar));
    ['area-apagar', 'montada-apagar'].forEach(id => $(id).addEventListener('click', apagar));
    $('area-config').addEventListener('click', () => abrirJanela('janela-config'));
    $('btn-config').addEventListener('click', () => abrirJanela('janela-config'));
    $('btn-ajuda').addEventListener('click', () => abrirJanela('janela-ajuda'));
    $('btn-voltar').addEventListener('click', () => irParaMapa());
    $('btn-repetir').addEventListener('click', repetir);
    $('btn-jogar-de-novo').addEventListener('click', jogarDeNovo);
    document.querySelectorAll('[data-fechar]').forEach(b => b.addEventListener('click', () => fecharJanela(b.closest('.janela').id)));
    JANELAS.forEach(id => $(id).addEventListener('keydown', prenderFoco));
    $('conf-nao').addEventListener('click', () => responderConfirmacao(false));
    $('conf-sim').addEventListener('click', () => responderConfirmacao(true));
    // O foco que a criança move com o TAB fala o botão; o que o jogo põe, não
    for (const id of ['conf-nao', 'conf-sim']) $(id).addEventListener('focus', e => { if (!focoDoJogo) QBE.voz.narrar(e.target.textContent, { guardar: false }); });

    $('cfg-narracao').addEventListener('change', e => {
      QBE.voz.definirLigada(e.target.checked);
      QBE.salvar.salvarPreferencias(preferencias());
      atualizarBotoesFixos();
      // O clique na caixa já é o gesto que o navegador exige para falar
      if (QBE.voz.ligada()) QBE.voz.narrar('Narração ligada. Aperte o número da resposta para escolher, R para repetir a pergunta, e S para ouvir o bicho de novo.', { guardar: false });
    });
    document.querySelectorAll('.cfg-vel').forEach(b => b.addEventListener('click', () => {
      QBE.voz.definirVelocidade(CONFIG.vozVelocidades[b.dataset.vel]);
      QBE.salvar.salvarPreferencias(preferencias());
      marcarVelocidade();
      QBE.voz.narrar('Velocidade da voz ajustada.', { guardar: false });
    }));
    $('cfg-sons').addEventListener('change', e => {
      QBE.audio.definirMudo(!e.target.checked);
      QBE.salvar.salvarPreferencias(preferencias());
    });
    $('cfg-repetir').addEventListener('click', repetir);
    $('ajuda-total').textContent = MAPA.moitas.length;     // o total vem do mapa, nunca escrito à mão

    document.addEventListener('keydown', teclaAbaixo);
    document.addEventListener('keyup', e => QBE.mapa.soltar(e));
    // O toque longo no celular abria o menu do navegador por cima do jogo
    document.addEventListener('contextmenu', e => e.preventDefault());

    aplicarPreferencias(QBE.salvar.carregarPreferencias());
    QBE.voz.quandoSouberDasVozes(conferirVozes);
    QBE.abertura.atualizarBotoes(QBE.salvar.carregarProgresso() && QBE.salvar.temProgresso());
  }

  return {
    iniciar, mostrar, focarTitulo, atualizarBotoesFixos, irParaMapa, mostrarFinal, quadroFinal, aviso, janelaAberta,
    contador: () => contador, atual: () => atual,
  };
})();
