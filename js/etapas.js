'use strict';
// ═══════════════════════════════════════════════════════════════
//  ETAPAS — as 3 etapas de cada moita e a celebração
//  Etapa 1: som · Etapa 2: sombra OU característica · Etapa 3: charada.
//  Cada etapa é sobre um animal DIFERENTE da mesma moita. A tela é
//  montada ANTES de o áudio começar: trocar de tela silencia o canal, e
//  quando a troca vinha depois ela cortava a narração na hora.
// ═══════════════════════════════════════════════════════════════
QBE.etapas = (() => {
  const U = QBE.util, R = QBE.recursos, S = QBE.sprite, FX = QBE.efeitos;
  const $ = U.$;
  const P = () => QBE.salvar.partida;
  const est = {
    moita: 0, fase: 0, tipo: 'som', alvo: null, pergunta: null,
    errou: false,      // errou nesta etapa: o acerto passa a valer a metade
    travado: false,    // já acertou: as opções ficam travadas até a próxima etapa
    coroas: 0,         // coroas desta moita, guardadas até a celebração
    cartas: [], visorMoita: null, visorSombra: null, revelacao: null,
  };
  let focoDoJogo = false;     // foco posto pelo próprio jogo não fala

  const TEXTOS = {
    som: { titulo: '🔊 Que bicho é esse?', sub: 'Escute o som e escolha!', acerto: 'Correto! 🎉' },
    sombra: { titulo: '👁️ Sombra misteriosa', sub: 'Olhe a sombra e descubra!', acerto: 'Incrível! 🌟' },
    traco: { titulo: '🔎 Como é este bicho?', sub: 'Pense bem e escolha o animal certo!', acerto: 'Isso mesmo! 🌟' },
    charada: { titulo: '🧩 Charada dos animais', sub: 'Leia com atenção e adivinhe!', acerto: 'Você acertou a charada! 🧩' },
  };
  // Fundos e efeitos de cada tela (5.5)
  const cenas = {
    som: FX.criarCena('som', 'som'),
    sombra: FX.criarCena('sombra', 'sombra'),
    traco: FX.criarCena('caracteristica', 'caracteristica'),
    charada: FX.criarCena('charada', 'charada'),
  };
  const cenaCelebracao = FX.criarCena('celebracao', 'celebracao');
  let cena = cenas.som;

  const total = () => MAPA.moitas.length;
  const ondeEstou = () => `Moita ${est.moita + 1} de ${total()}, etapa ${est.fase + 1} de ${CONFIG.etapasPorMoita}.`;

  // ── Começo de uma moita (vem do mapa) ────────────────────────
  // Sempre da etapa 1, com as coroas zeradas: quem voltou ao mapa no meio
  // perde as coroas daquela moita.
  function comecar(i) {
    est.moita = i;
    est.coroas = 0;
    montar(0);
  }

  function montar(fase) {
    est.fase = fase; est.errou = false; est.travado = false; est.revelacao = null;
    est.visorMoita = null; est.visorSombra = null;
    est.alvo = P().sorteio[est.moita][fase];
    let tipo = fase === 0 ? 'som' : fase === CONFIG.etapasPorMoita - 1 ? 'charada' : QBE.sorteio.varianteEtapa2(est.moita, est.alvo);
    est.pergunta = tipo === 'traco' ? QBE.sorteio.sortearPergunta(est.alvo) : null;
    if (tipo === 'traco' && !est.pergunta) tipo = 'sombra';
    est.tipo = tipo;

    // 1) a tela primeiro
    QBE.telas.mostrar('etapa', { forcar: true });
    $('tela-etapa').dataset.etapa = tipo;
    $('etapa-onde').textContent = `Moita ${est.moita + 1} de ${total()}`;
    $('etapa-titulo').textContent = TEXTOS[tipo].titulo;
    $('etapa-sub').textContent = TEXTOS[tipo].sub;
    [...$('etapa-folhas').children].forEach((f, k) => { f.className = k < fase ? 'ganha' : k === fase ? 'atual' : ''; });
    const a = ANIMAIS[est.alvo];
    const desafio = $('etapa-desafio');
    desafio.textContent = '';
    let charada = null;
    if (tipo === 'som') montarSom(desafio, a);
    else if (tipo === 'sombra') montarSombra(desafio, a);
    else if (tipo === 'traco') montarTraco(desafio, est.pergunta);
    else charada = montarCharada(desafio, a);
    montarCartas(tipo);
    cena = cenas[tipo];
    cena.iniciar();
    QBE.telas.focarTitulo();

    // 2) depois o áudio. Um item de cada vez: cada um só começa quando o
    // anterior termina de verdade. Com a narração desligada as falas e o
    // foco não fazem nada e fica só o som do bicho.
    const opcoes = { fala: listaDeOpcoes(), guardar: false };
    const focar = { acao: focarPrimeira };
    let itens;
    if (tipo === 'som') {
      itens = [{ espera: 400 },
        { fala: `${ondeEstou()} Fase do som. O som deste animal é: ${a.onomatopeia} Agora escute o bicho.` },
        { som: est.alvo, elemento: ganchoMoita() }, opcoes, focar];
    } else if (tipo === 'sombra') {
      itens = [{ fala: `${ondeEstou()} Fase da sombra. A sombra é assim: ${a.audiodescricao} Que bicho é esse?` }, opcoes, focar];
    } else if (tipo === 'traco') {
      itens = [{ fala: `${ondeEstou()} ${U.semAsteriscos(est.pergunta.texto)}` }, opcoes, focar];
    } else {
      // a moita "fala": balança enquanto a voz lê a charada
      itens = [{ acao: () => balancar(true) }, { fala: `${ondeEstou()} Fase da charada. ${charada}` }, { acao: () => balancar(false) }, opcoes, focar];
    }
    QBE.audio.tocarSequencia(itens, { repetivel: true });
  }

  // ── Os desafios ──────────────────────────────────────────────
  function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto != null) e.textContent = texto;
    return e;
  }
  // A moita grande da etapa 1 é o botão de ouvir de novo, e balança
  // enquanto o som toca
  function montarSom(desafio, a) {
    const botao = el('button', 'moita-botao');
    botao.type = 'button';
    botao.setAttribute('aria-label', 'Ouvir o bicho de novo (tecla S)');
    est.visorMoita = S.criarVisor({ tipo: 'moita', estado: 'parada', margem: 0.04 });
    botao.appendChild(est.visorMoita.canvas);
    const selo = el('span', 'moita-selo', '🔊'); selo.setAttribute('aria-hidden', 'true');
    botao.appendChild(selo);
    botao.addEventListener('click', ouvirDeNovo);
    const balao = el('div', 'balao');
    balao.append(el('span', 'balao-rotulo', 'O som deste animal é:'), el('span', 'onomatopeia', a.onomatopeia || '???'));
    desafio.append(botao, balao, areaLibras(a));
  }
  // Libras compacta: o vídeo, se a ficha tiver; senão, o selo de "em breve"
  function areaLibras(a) {
    const box = el('div', 'libras');
    if (a.libras) {
      const v = document.createElement('video');
      v.src = a.libras; v.muted = true; v.autoplay = true; v.loop = true; v.playsInline = true;
      v.setAttribute('playsinline', ''); v.setAttribute('aria-label', `Sinal de ${a.nome} em Libras`);
      box.appendChild(v);
    } else box.textContent = '🤟 Libras em breve';
    return box;
  }
  function ganchoMoita() {
    const v = est.visorMoita;
    return { aoTocar: () => { if (v && !est.travado) v.definir({ estado: 'balancando' }); }, aoParar: () => { if (v && !est.travado) v.definir({ estado: 'parada' }); } };
  }
  function balancar(sim) { if (est.visorMoita && !est.travado) est.visorMoita.definir({ estado: sim ? 'balancando' : 'parada' }); }
  function ouvirDeNovo() {
    if (est.travado || est.tipo !== 'som') return;
    QBE.audio.tocarSom(est.alvo, ganchoMoita());
  }

  // Etapa 2a: um palco com facho de luz e a silhueta andando dentro dele
  function montarSombra(desafio, a) {
    const palco = el('div', 'palco');
    est.visorSombra = S.criarVisor({ tipo: 'bicho', id: a.id, anim: 'andando', silhueta: true, passeio: true, margem: 0.14 });
    palco.appendChild(est.visorSombra.canvas);
    // A silhueta é aria-hidden: o leitor de tela lê a audiodescrição
    desafio.append(palco, el('p', 'sr-only', `A sombra é assim: ${a.audiodescricao}`));
  }
  // Etapa 2b: o ícone e a pergunta com a palavra-chave em destaque. No
  // dado ela vem entre asteriscos; a tela põe em negrito e a voz lê sem eles.
  function montarTraco(desafio, p) {
    const caixa = el('div', 'traco-caixa');
    const icone = el('span', 'traco-icone', p.icone); icone.setAttribute('aria-hidden', 'true');
    const texto = el('p', 'traco-texto');
    texto.innerHTML = U.escapar(p.texto).replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
    caixa.append(icone, texto);
    desafio.appendChild(caixa);
  }
  // Etapa 3: a moita "fala" a charada num balão
  function montarCharada(desafio, a) {
    const texto = QBE.sorteio.charadaPara(a.id);
    const caixa = el('div', 'charada-moita');
    est.visorMoita = S.criarVisor({ tipo: 'moita', estado: 'parada', margem: 0.04 });
    caixa.appendChild(est.visorMoita.canvas);
    desafio.append(caixa, el('p', 'balao balao-charada', texto));
    return texto;
  }

  // ── As quatro cartas ─────────────────────────────────────────
  function montarCartas(tipo) {
    const grade = $('etapa-cartas');
    grade.textContent = '';
    const ids = QBE.sorteio.opcoes(tipo, est.alvo, est.pergunta);
    est.cartas = ids.map((id, i) => {
      const a = ANIMAIS[id];
      const cel = el('div', 'carta-cel');
      // <button> de verdade: recebe foco, aceita ENTER e ESPAÇO e é anunciado
      const carta = el('button', 'carta');
      carta.type = 'button';
      carta.dataset.nome = a.nome;
      carta.setAttribute('aria-label', `Opção ${i + 1} de ${ids.length}: ${a.nome}`);
      const centro = el('span', 'carta-centro');
      if (tipo === 'sombra') centro.style.background = a.cor;   // na sombra, o fundo da cor do bicho
      const visor = S.criarVisor({ tipo: 'bicho', id, anim: 'parado' });
      centro.appendChild(visor.canvas);
      carta.append(centro, el('span', 'carta-nome', a.nome));
      const obj = { id, carta, cel, visor };
      // parado; com foco ou mouse em cima, andando; ao acertar, festa
      const andar = sim => { if (!(est.travado && id === est.alvo)) visor.definir({ anim: sim ? 'andando' : 'parado' }); };
      carta.addEventListener('mouseenter', () => andar(true));
      carta.addEventListener('mouseleave', () => { if (document.activeElement !== carta) andar(false); });
      carta.addEventListener('focus', () => {
        andar(true);
        if (focoDoJogo || est.travado) return;
        QBE.voz.narrar(`Opção ${i + 1} de ${ids.length}: ${a.nome}`, { guardar: false });
      });
      carta.addEventListener('blur', () => andar(false));
      carta.addEventListener('click', () => responder(obj));
      cel.appendChild(carta);
      // O 🔊 é IRMÃO da carta, nunca um botão dentro de outro
      if (tipo === 'som') cel.appendChild(botaoSom(a));
      grade.appendChild(cel);
      return obj;
    });
    ligarSetas(grade);
  }
  function botaoSom(a) {
    const b = el('button', 'carta-som placa placa-icone', '🔊');
    b.type = 'button';
    b.setAttribute('aria-label', `Ouvir o som de ${a.nome}`);
    b.addEventListener('click', e => { e.stopPropagation(); if (!est.travado) QBE.audio.tocarSom(a.id, b); });
    // O TAB passa por aqui entre uma carta e outra: sem esta fala a
    // criança cega caía num ponto mudo e achava que o jogo tinha parado.
    b.addEventListener('focus', () => { if (!focoDoJogo && !est.travado) QBE.voz.narrar(`Ouvir o som de ${a.nome}. Aperte ENTER.`, { guardar: false }); });
    return b;
  }
  // Setas percorrem as cartas em ciclo; o TAB continua normal
  function ligarSetas(grade) {
    if (grade._setas) return;
    grade._setas = true;
    grade.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
      const cels = [...grade.querySelectorAll('.carta-cel')];
      const atual = document.activeElement && document.activeElement.closest ? document.activeElement.closest('.carta-cel') : null;
      const i = cels.indexOf(atual);
      if (i < 0) return;
      e.preventDefault();
      const passo = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      cels[(i + passo + cels.length) % cels.length].querySelector('.carta').focus();
    });
  }
  // "Aperte o número da resposta. 1, Onça. 2, Arara. ..."
  const listaDeOpcoes = () => 'Aperte o número da resposta. ' + est.cartas.map((c, i) => `${i + 1}, ${ANIMAIS[c.id].nome}`).join('. ') + '.';
  // Só com a narração ligada: não rouba o foco de quem joga com o mouse
  function focarPrimeira() {
    if (!QBE.voz.ligada() || !est.cartas.length) return;
    focoDoJogo = true;
    try { est.cartas[0].carta.focus(); } finally { focoDoJogo = false; }
  }

  // ── Resposta ─────────────────────────────────────────────────
  function responder(c) {
    if (est.travado) return;
    if (c.id === est.alvo) {
      // Acertou: trava tudo até a próxima etapa (um segundo clique somava
      // de novo, e um clique errado cortava a passagem de etapa)
      est.travado = true;
      c.carta.classList.add('certa');
      c.visor.definir({ anim: 'festa' });
      const cheio = CONFIG.pontos[est.tipo];
      const ganhou = est.errou ? Math.round(cheio / 2) : cheio;
      est.coroas += ganhou;           // só entram no placar na celebração
      QBE.telas.aviso(`${TEXTOS[est.tipo].acerto} +${ganhou} 👑`, true);
      revelar(c);
      avancarDepoisDoAcerto();
    } else {
      // Erro não tira coroas nem encerra a etapa: o acerto vale a metade
      est.errou = true;
      c.carta.classList.add('errada');
      c.cel.classList.add('treme');
      QBE.telas.aviso('Tente novamente! 🤔', false);
      QBE.voz.narrar(`Não é ${U.comArtigo(ANIMAIS[c.id])}. Tente de novo. Aperte R para ouvir a pergunta.`, { guardar: false });
      setTimeout(() => { c.carta.classList.remove('errada'); c.cel.classList.remove('treme'); }, CONFIG.tempos.tremor);
    }
  }

  // Revelação: a moita se abre e o bicho certo pula para fora num arco
  // de 0,8 s, faz festa e mostra o nome. Na sombra, a silhueta ganha cor.
  // Uma luz sai da carta certa até a folhinha da etapa, que fica dourada.
  function revelar(c) {
    const ret = c.carta.getBoundingClientRect();
    cena.estrelasEm({ x: ret.left, y: ret.top, w: ret.width, h: ret.height });
    const folha = $('etapa-folhas').children[est.fase];
    const rf = folha.getBoundingClientRect();
    cena.luzAte({ x: ret.left + ret.width / 2, y: ret.top + ret.height / 2 }, { x: rf.left + rf.width / 2, y: rf.top + rf.height / 2 }, () => { folha.className = 'ganha'; });
    if (est.tipo === 'sombra' && est.visorSombra) { est.visorSombra.revelar(); est.visorSombra.definir({ anim: 'festa', passeio: false }); return; }
    const origem = est.visorMoita ? est.visorMoita.canvas.getBoundingClientRect() : $('etapa-desafio').querySelector('.traco-caixa, .traco-icone').getBoundingClientRect();
    if (est.visorMoita) est.visorMoita.definir({ estado: 'abrindo' });
    const tam = Math.max(70, Math.min(origem.height * 0.9, 190));
    const de = { x: origem.left + origem.width / 2, y: origem.bottom - origem.height * 0.08 };
    const para = { x: U.limitar(de.x + origem.width * 0.75, tam / 2 + 10, innerWidth - tam / 2 - 10), y: de.y };
    if (!est.visorMoita) { para.x = de.x; de.y = origem.bottom; para.y = origem.top + 10; }
    est.revelacao = { id: est.alvo, t0: S.agora(), de, para, tam };
  }
  function desenharRevelacao(ctx) {
    const r = est.revelacao;
    if (!r) return;
    const t = S.agora() - r.t0, dur = CONFIG.tempos.revelacao / 1000;
    const p = U.movimentoReduzido() ? 1 : U.limitar(t / dur, 0, 1);
    const x = r.de.x + (r.para.x - r.de.x) * p;
    const y = r.de.y + (r.para.y - r.de.y) * p - Math.sin(Math.PI * p) * r.tam * 0.8;
    S.desenharBicho(ctx, r.id, p < 1 ? 'andando' : 'festa', t, x, y, r.tam, { lado: r.para.x >= r.de.x ? 'direita' : 'esquerda' });
    if (p >= 1) {
      // o nome embaixo, numa plaquinha
      const nome = ANIMAIS[r.id].nome.toUpperCase();
      ctx.save();
      ctx.font = '700 22px Fredoka, sans-serif';
      const w = ctx.measureText(nome).width + 24;
      ctx.fillStyle = '#5E2A0E'; ctx.strokeStyle = '#1A1209'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - w / 2, y + 6, w, 32, 7) : ctx.rect(x - w / 2, y + 6, w, 32); ctx.fill(); ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 4;
      ctx.strokeText(nome, x, y + 23); ctx.fillStyle = '#fff'; ctx.fillText(nome, x, y + 23);
      ctx.restore();
    }
  }

  // Com a voz ligada, a próxima etapa entra quando o "acertou" termina de
  // ser dito; o prazo de segurança garante que o jogo siga se a fala for
  // interrompida. O contador de telas impede de empurrar quem já voltou
  // ao mapa e entrou de novo.
  function avancarDepoisDoAcerto() {
    const contador = QBE.telas.contador();
    let foi = false;
    const ir = () => {
      if (foi || contador !== QBE.telas.contador()) return;
      foi = true;
      if (est.fase < CONFIG.etapasPorMoita - 1) montar(est.fase + 1); else celebrar();
    };
    if (QBE.voz.ligada()) {
      QBE.audio.tocarSequencia([{ fala: `Acertou! Era ${U.comArtigo(ANIMAIS[est.alvo])}.`, guardar: false }, { acao: ir }]);
      setTimeout(ir, CONFIG.tempos.avancoComVozMax);
    } else setTimeout(ir, CONFIG.tempos.avancoSemVoz);
  }

  // ── Celebração ───────────────────────────────────────────────
  // Marca a moita como concluída ANTES de somar as coroas (as das etapas
  // + o bônus), grava e mostra os 3 bichos fazendo festa.
  function celebrar() {
    const partida = P(), i = est.moita;
    if (!partida.feitas.includes(i)) { partida.feitas.push(i); partida.feitas.sort((a, b) => a - b); }
    const bonus = CONFIG.pontos.bonusMoita;
    const ganhas = est.coroas + bonus;
    partida.pontos += ganhas;
    est.coroas = 0;
    QBE.salvar.salvarProgresso();

    QBE.telas.mostrar('celebracao');
    const ids = partida.sorteio[i];
    const bichos = $('celebracao-bichos');
    bichos.textContent = '';
    // a moita se abre e os bichos saem um a um, 0,25 s entre eles
    const moita = S.criarVisor({ tipo: 'moita', estado: 'abrindo', margem: 0.02 });
    moita.canvas.className = 'visor celebracao-moita';
    bichos.appendChild(moita.canvas);
    setTimeout(() => moita.canvas.remove(), 650);
    ids.forEach((id, k) => {
      const a = ANIMAIS[id];
      const caixa = el('div', 'celebracao-bicho');
      caixa.style.animationDelay = (0.25 * k + 0.2) + 's';
      caixa.appendChild(S.criarVisor({ tipo: 'bicho', id, anim: 'festa' }).canvas);
      caixa.append(el('span', 'celebracao-nome', a.nome), el('span', 'celebracao-som', a.onomatopeia || ''));
      bichos.appendChild(caixa);
    });
    const fatos = $('celebracao-fatos');
    fatos.textContent = '';
    ids.forEach(id => fatos.appendChild(el('li', null, ANIMAIS[id].curiosidade)));
    const selo = $('celebracao-selo');
    selo.textContent = `⭐ +${ganhas} coroas! ⭐`;
    selo.appendChild(el('small', null, `${bonus} de bônus`));
    const fim = QBE.mapa.tudoFeito();
    const btn = $('btn-seguir');
    btn.textContent = fim ? '🏆 Ver o final!' : 'Próxima moita ▶';
    cenaCelebracao.iniciar();
    QBE.telas.focarTitulo();
    // Sem enxergar, a criança não sabe que o jogo espera um botão: o fim da
    // narração diz o que fazer e já deixa o foco nele, para o ENTER valer.
    QBE.audio.tocarSequencia([
      { fala: `Parabéns! Você descobriu ${ids.length} animais e ganhou ${ganhas} coroas. ` + ids.map(id => `${ANIMAIS[id].nome}. ${ANIMAIS[id].curiosidade}`).join(' ') },
      { fala: `Aperte ENTER para ${fim ? 'ver o final' : 'voltar ao mapa'}.`, guardar: false },
      { acao: () => { if (QBE.voz.ligada() && QBE.telas.atual() === 'celebracao') btn.focus(); } },
    ], { repetivel: true });
  }
  function seguir() {
    if (QBE.mapa.tudoFeito()) QBE.telas.mostrarFinal(); else QBE.telas.irParaMapa();
  }

  // ── Teclado das etapas ───────────────────────────────────────
  // Sem enxergar, tabular até a opção certa é lento: os números escolhem
  // direto, na mesma ordem em que a narração acabou de listá-las.
  function tecla(e) {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9 && est.cartas[n - 1]) { e.preventDefault(); est.cartas[n - 1].carta.click(); return; }
    if ((e.key === 's' || e.key === 'S') && est.tipo === 'som') { e.preventDefault(); ouvirDeNovo(); }
  }

  function quadro(dt) {
    const fundo = U.ajustarCanvas($('etapa-fundo')), frente = U.ajustarCanvas($('etapa-frente'));
    cena.quadro(dt, fundo, frente);
    desenharRevelacao(frente.ctx);
  }
  function quadroCelebracao(dt) {
    cenaCelebracao.quadro(dt, U.ajustarCanvas($('celebracao-fundo')), U.ajustarCanvas($('celebracao-frente')));
  }

  $('btn-seguir').addEventListener('click', seguir);

  return { comecar, tecla, quadro, quadroCelebracao, estado: est };
})();
