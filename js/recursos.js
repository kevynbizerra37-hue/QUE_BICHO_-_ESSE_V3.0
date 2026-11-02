'use strict';
// ═══════════════════════════════════════════════════════════════
//  RECURSOS — pré-carga, reservas e conferência dos arquivos
//  Lê o manifesto (js/sprites.js) e as fichas (js/dados.js), carrega
//  tudo o que estiver ligado e responde, a qualquer momento, se um
//  arquivo já abriu. Quem desenha pergunta aqui e, sem o arquivo, usa a
//  reserva: o jogo nunca mostra ícone de imagem quebrada.
// ═══════════════════════════════════════════════════════════════
QBE.recursos = (() => {
  const { avisoArquivo } = QBE.util;
  const TRACOS = ['penas', 'pelo', 'casco', 'voa', 'nada', 'sobe', 'comeFrutas', 'comeCarne', 'comeInsetos'];
  const ANIM_BICHO = ['parado', 'andando', 'festa'];

  const arquivos = new Map();   // caminho → { estado: 'carregando'|'ok'|'erro', img, w, h }
  const sons = new Map();       // id do bicho → 'testando'|'ok'|'erro'
  const lista = [];             // tudo o que o manifesto liga (para a conferência e o F9)
  let total = 0, feitos = 0;
  let aberturaPronta = false, tudoPronto = false;
  const filaAbertura = [], filaPronto = [];

  // ── Sprite de bicho: a medida do `padrao`, trocada pelo que a linha do bicho disser ──
  const cacheAnimal = {};
  function defAnimal(id, anim) {
    const chave = id + '.' + anim;
    if (chave in cacheAnimal) return cacheAnimal[chave];
    const linha = SPRITES.animais[id];
    const valor = linha ? linha[anim] : false;
    let def = null;
    if (valor) {
      const base = SPRITES.animais.padrao[anim] || {};
      def = Object.assign({}, base, valor === true ? {} : valor);
      def.ancora = def.ancora || SPRITES.animais.padrao.ancora;
      if (!def.arquivo && !def.arquivos) def.arquivo = `assets/sprites/animais/${id}/${anim}.png`;
      def.ativo = true;
    }
    cacheAnimal[chave] = def;
    return def;
  }

  // ── A lista do que carregar, com o grupo e a reserva de cada um ──
  // A abertura vem primeiro: a cena começa assim que os sprites dela chegam.
  function montarLista() {
    const F = SPRITES.fases, A = SPRITES.abertura, E = SPRITES.efeitos;
    const incluir = (def, grupo, reserva) => {
      if (!def || def.ativo === false || !(def.arquivo || def.arquivos)) return;
      lista.push({ def, grupo, reserva });
    };
    incluir(F.aberturaPronta, 'abertura', 'o modo montado da abertura');
    incluir(A.fundoLimpo, 'abertura', 'a arte original');
    incluir(A.arara, 'abertura', 'a arara desenhada na arte, parada');
    incluir(A.tucano, 'abertura', 'o tucano desenhado na arte, parado');
    incluir(A.araraVoando, 'abertura', 'a abertura sem a arara voando');
    incluir(A.sapo.parado, 'abertura', 'a arte original (e, no mapa, o sapo da 2.0)');
    incluir(A.sapo.pulando, 'abertura', 'o sapo do tronco sem pular');
    for (const anim of ANIM_BICHO) incluir(defAnimal('tatu', anim), 'abertura', 'a ilustração do tatu');
    for (const nome of ['borboleta', 'folhas', 'vagalumePiscando', 'vagalumeVoando', 'brilho']) incluir(E[nome], 'abertura', 'o desenho por código');
    incluir(F.aberturaMontada, 'abertura', 'as camadas da floresta ou o degradê');
    incluir(F.abertura, 'abertura', 'o Cerrado do modo montado');
    incluir(SPRITES.ui.logo, 'abertura', 'o título em texto');

    incluir(SPRITES.mapa.fundo, 'resto', 'o mapa desenhado por código');
    for (const item of SPRITES.mapa.cenario) incluir(item, 'resto', 'o desenho parado do fundo');
    for (const tela of ['som', 'sombra', 'caracteristica', 'charada', 'celebracao', 'final']) incluir(F[tela], 'resto', 'as camadas da floresta ou o degradê');
    for (const camada of F.floresta.camadas) incluir(camada, 'resto', 'o degradê da tela');
    incluir(E.luzRastro, 'resto', 'a bolinha dourada desenhada por código');
    incluir(SPRITES.ui.placa, 'resto', 'a placa desenhada no CSS');
    incluir(SPRITES.sapo.parado, 'resto', 'o sapo do tronco');
    incluir(SPRITES.sapo.andando, 'resto', 'o sapo do tronco');
    incluir(SPRITES.sapo.antigo, 'resto', 'o 🐸');
    for (const nome of ['parada', 'balancando', 'abrindo']) incluir(SPRITES.moita[nome], 'resto', 'a moita desenhada por código');
    for (const nome of ['parada', 'liberada']) incluir(SPRITES.arvore[nome], 'resto', 'o 🌳');
    for (const id of Object.keys(ANIMAIS)) {
      if (id !== 'tatu') for (const anim of ANIM_BICHO) incluir(defAnimal(id, anim), 'resto', 'a ilustração ou o emoji');
      const a = ANIMAIS[id];
      if (a.imagem) lista.push({ def: { arquivo: a.imagem, imagemDe: id }, grupo: 'resto', reserva: `o emoji ${a.emoji}` });
    }
  }

  // Medidas esperadas: largura da folha = quadroL × colunas; altura =
  // quadroA × linhas usadas. Os fundos dizem largura e altura direto.
  function conferirMedidas(def, img) {
    let ew, eh;
    if (def.largura && def.altura) { ew = def.largura; eh = def.altura; }
    else if (def.quadroL && def.quadroA && def.colunas && !def.arquivos) {
      const linhasUsadas = def.linhas
        ? Math.max(...Object.values(def.linhas)) + 1
        : (def.linha || 0) + Math.ceil((def.quadros || 1) / def.colunas);
      ew = def.quadroL * def.colunas; eh = def.quadroA * linhasUsadas;
    } else return;
    if (img.naturalWidth !== ew || img.naturalHeight !== eh) {
      console.warn(`Medidas de ${def.arquivo}: o manifesto diz ${ew}×${eh}, a imagem tem ${img.naturalWidth}×${img.naturalHeight}. Usando o que der.`);
    }
  }

  function carregarImagem(caminho) {
    if (arquivos.has(caminho)) return arquivos.get(caminho).promessa;
    const reg = { estado: 'carregando', img: null };
    reg.promessa = new Promise(ok => {
      const img = new Image();
      img.onload = () => { reg.estado = 'ok'; reg.img = img; ok(reg); };
      img.onerror = () => { reg.estado = 'erro'; ok(reg); };
      img.src = caminho;
    });
    arquivos.set(caminho, reg);
    return reg.promessa;
  }

  // Liga a imagem já carregada à definição: quem desenha só olha `_ok`
  function carregarItem(item) {
    const def = item.def;
    const caminhos = def.arquivos ? def.arquivos : [def.arquivo];
    return Promise.all(caminhos.map(carregarImagem)).then(regs => {
      const falhou = regs.find(r => r.estado !== 'ok');
      if (falhou) {
        avisoArquivo(caminhos[regs.indexOf(falhou)], item.reserva);
        def._ok = false;
      } else {
        if (def.arquivos) def._imgs = regs.map(r => r.img);
        else { def._img = regs[0].img; conferirMedidas(def, def._img); }
        def._ok = true;
      }
      feitos++;
    });
  }

  // ── Sons: "funcionando" = `som` diferente de null e o arquivo abriu ──
  // Sem resposta em 4 s conta como funcionando: o celular só baixa áudio
  // depois de um toque, e a reserva de bipes cobre na hora de tocar.
  function testarSom(id) {
    const a = ANIMAIS[id];
    sons.set(id, 'testando');
    return new Promise(ok => {
      let fim = false;
      const acabar = estado => {
        if (fim) return; fim = true;
        if (estado) sons.set(id, estado);
        if (estado === 'erro') avisoArquivo(a.som, 'os bipes de reserva (e o bicho fica fora da etapa do som)');
        feitos++; ok();
      };
      try {
        const au = new Audio();
        au.preload = 'auto';
        au.addEventListener('canplaythrough', () => acabar('ok'), { once: true });
        au.addEventListener('error', () => acabar('erro'), { once: true });
        au.src = a.som;
        au.load();
      } catch (e) { acabar('erro'); }
      setTimeout(() => acabar(null), CONFIG.tempos.testeSomMax);
    });
  }

  // ── Conferência dos dados (só avisa no console, nunca trava) ──
  function conferirDados() {
    const ids = Object.keys(ANIMAIS);
    for (const id of ids) {
      const a = ANIMAIS[id];
      const faltam = TRACOS.filter(t => !a.tracos || !(t in a.tracos));
      if (faltam.length) console.warn(`Ficha de ${a.nome} sem os traços: ${faltam.join(', ')}.`);
      for (const p of a.parecidos || []) if (!ANIMAIS[p]) console.warn(`Ficha de ${a.nome}: "parecidos" cita "${p}", que não está no catálogo.`);
    }
    if (ids.length < 4) console.warn(`O catálogo tem só ${ids.length} animais: as etapas precisam de 4 opções.`);
    const comSom = ids.filter(id => ANIMAIS[id].som).length;
    if (comSom < 4) console.warn(`Só ${comSom} animais têm som: a etapa do som quer 4 opções com som.`);
  }

  function avisar(fila) { while (fila.length) { try { fila.shift()(); } catch (e) { console.error(e); } } }

  function iniciar() {
    conferirDados();
    montarLista();
    const doGrupo = g => lista.filter(i => i.grupo === g);
    const comSom = Object.keys(ANIMAIS).filter(id => ANIMAIS[id].som);
    total = lista.length + comSom.length + 1;   // +1: a fonte

    // O JOGAR libera quando tudo terminar ou depois de 8 s, com o que carregou
    const prazo = setTimeout(() => { if (!tudoPronto) { tudoPronto = true; avisar(filaPronto); } }, CONFIG.tempos.preCargaMax);

    const fonte = (document.fonts && document.fonts.load)
      ? document.fonts.load('700 32px Fredoka').catch(() => {}).then(() => { feitos++; })
      : Promise.resolve().then(() => { feitos++; });
    Promise.all([fonte, ...doGrupo('abertura').map(carregarItem)]).then(() => {
      aberturaPronta = true; avisar(filaAbertura);
      return Promise.all([...doGrupo('resto').map(carregarItem), ...comSom.map(testarSom)]);
    }).then(() => {
      const funcionando = Object.keys(ANIMAIS).filter(somFunciona).length;
      if (funcionando < 4) console.warn(`Só ${funcionando} sons abriram: a etapa do som vai usar menos opções com som.`);
      clearTimeout(prazo);
      if (!tudoPronto) { tudoPronto = true; avisar(filaPronto); }
    });
  }

  // ── Perguntas de quem desenha ──
  const pronto = def => !!(def && def.ativo !== false && def._ok);
  function animal(id, anim) { const d = defAnimal(id, anim); return pronto(d) ? d : null; }
  function imagemAnimal(id) {
    const caminho = ANIMAIS[id] && ANIMAIS[id].imagem;
    const reg = caminho && arquivos.get(caminho);
    return reg && reg.estado === 'ok' ? reg.img : null;
  }
  function somFunciona(id) {
    const a = ANIMAIS[id];
    return !!(a && a.som) && sons.get(id) !== 'erro';
  }
  // Desenho de verdade = sprite ou ilustração que abriu (a sombra de um
  // emoji muda de sistema para sistema e às vezes é só uma cara)
  const temDesenho = id => !!(animal(id, 'parado') || animal(id, 'andando') || imagemAnimal(id));

  function estadoDe(item) {
    const caminhos = item.def.arquivos || [item.def.arquivo];
    const regs = caminhos.map(c => arquivos.get(c));
    if (regs.some(r => !r || r.estado === 'carregando')) return 'carregando';
    return regs.every(r => r.estado === 'ok') ? 'ok' : 'erro';
  }
  const faltando = () => lista.filter(i => estadoDe(i) === 'erro').map(i => i.def.arquivo || i.def.arquivos.join(', '));

  return {
    iniciar, pronto, animal, defAnimal, imagemAnimal, somFunciona, temDesenho, faltando,
    progresso: () => (total ? Math.min(1, feitos / total) : 0),
    aberturaPronta: () => aberturaPronta,
    tudoPronto: () => tudoPronto,
    quandoAbertura: fn => (aberturaPronta ? fn() : filaAbertura.push(fn)),
    quandoPronto: fn => (tudoPronto ? fn() : filaPronto.push(fn)),
    TRACOS,
  };
})();
