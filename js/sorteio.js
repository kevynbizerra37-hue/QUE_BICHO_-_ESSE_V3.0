'use strict';
// ═══════════════════════════════════════════════════════════════
//  SORTEIO — baralho das moitas, variantes, distratores, perguntas e
//  charadas (seções 4.2 e 4.4)
//  Nada aqui conhece um animal pelo nome: tudo sai do catálogo em
//  dados.js, então acrescentar um bicho não muda este arquivo.
// ═══════════════════════════════════════════════════════════════
QBE.sorteio = (() => {
  const U = QBE.util, R = QBE.recursos;
  const ids = () => Object.keys(ANIMAIS);
  const totalMoitas = () => MAPA.moitas.length;
  const porMoita = () => Math.min(CONFIG.etapasPorMoita, ids().length);
  const temSom = id => R.somFunciona(id);

  // ── As moitas da partida ─────────────────────────────────────
  // Cada moita recebe 3 animais DIFERENTES entre si, tirados de um
  // baralho com o catálogo inteiro embaralhado (quando acaba, embaralha
  // de novo): as aparições se espalham por igual.
  function sortearMoitas(anterior) {
    const catalogo = ids();
    const chaveAnterior = JSON.stringify(anterior || []);
    let sorteio = [];
    for (let tentativa = 0; tentativa < 10; tentativa++) {
      let baralho = [];
      sorteio = [];
      for (let m = 0; m < totalMoitas(); m++) {
        const daMoita = [];
        while (daMoita.length < porMoita()) {
          if (!baralho.length) baralho = U.embaralhar(catalogo);
          // o primeiro do baralho que ainda não saiu NESTA moita
          const k = baralho.findIndex(id => !daMoita.includes(id));
          if (k === -1) { baralho = U.embaralhar(catalogo); continue; }
          daMoita.push(baralho.splice(k, 1)[0]);
        }
        // O 1º animal é o da etapa do som e precisa ter som funcionando:
        // um dos 3 com som passa para a frente; se nenhum tiver, o 1º é
        // trocado por um bicho com som que ainda não esteja nesta moita.
        const k0 = daMoita.findIndex(temSom);
        if (k0 > 0) [daMoita[0], daMoita[k0]] = [daMoita[k0], daMoita[0]];
        else if (k0 === -1) {
          const troca = U.embaralhar(catalogo.filter(id => temSom(id) && !daMoita.includes(id)))[0];
          if (troca) daMoita[0] = troca;
        }
        sorteio.push(daMoita);
      }
      // composição idêntica à da partida anterior: sorteia de novo
      if (JSON.stringify(sorteio) !== chaveAnterior) break;
    }
    return sorteio;
  }
  // Cada moita sorteia a etapa 2: 'sombra' ou 'traco', meio a meio
  const sortearVariantes = () => MAPA.moitas.map(() => (Math.random() < 0.5 ? 'sombra' : 'traco'));

  // Partida nova: outro sorteio de animais e o placar zerado
  function novaPartida() {
    const P = QBE.salvar.partida;
    const anterior = P.sorteio;
    P.pontos = 0; P.feitas = [];
    P.sorteio = sortearMoitas(anterior);
    P.variantes = sortearVariantes();
    QBE.salvar.salvarProgresso();
  }
  // Continuar: completa o que faltar no salvo, sem apagar o que a criança fez
  function completarSalvo() {
    const P = QBE.salvar.partida;
    if (P.sorteio.length !== totalMoitas()) { P.sorteio = sortearMoitas([]); P.feitas = []; }
    if (P.variantes.length !== totalMoitas()) P.variantes = sortearVariantes();
    // Partida salva com um bicho sem som na etapa do som (o arquivo sumiu
    // da pasta): troca com outro da mesma moita que tenha
    P.sorteio.forEach(l => {
      if (temSom(l[0])) return;
      const k = l.findIndex(temSom);
      if (k > 0) [l[0], l[k]] = [l[k], l[0]];
    });
    QBE.salvar.salvarProgresso();
  }

  // ── Perguntas de característica ──────────────────────────────
  // Traço null = "depende": o bicho nunca é resposta nem distrator dela.
  const tem = (id, traco) => ANIMAIS[id].tracos[traco] === true;
  const naoTem = (id, traco) => ANIMAIS[id].tracos[traco] === false;
  // As que o animal responde SIM e que têm pelo menos 3 distratores com NÃO
  function perguntasPara(alvo) {
    return PERGUNTAS.filter(p => tem(alvo, p.traco) && ids().filter(id => id !== alvo && naoTem(id, p.traco)).length >= 3);
  }
  const sortearPergunta = alvo => U.escolher(perguntasPara(alvo)) || null;

  // A etapa 2 desta moita: com a narração ligada é sempre a característica
  // (a silhueta não é jogável sem enxergar), e também quando o bicho não
  // tem desenho de verdade (a sombra de um emoji muda de sistema para
  // sistema e às vezes é só uma cara). Sem pergunta que sirva: sombra.
  function varianteEtapa2(moita, alvo) {
    let v = QBE.salvar.partida.variantes[moita] === 'traco' ? 'traco' : 'sombra';
    if (QBE.voz.ligada() || !R.temDesenho(alvo)) v = 'traco';
    if (v === 'traco' && !perguntasPara(alvo).length) v = 'sombra';
    return v;
  }

  // ── As quatro opções ─────────────────────────────────────────
  // O animal da etapa e 3 distratores do catálogo INTEIRO (não só da
  // partida, para não dar para acertar por eliminação).
  // Faltou candidato: abre mão primeiro do som, depois de `parecidos` —
  // nunca do filtro de traço.
  const parecido = (a, b) => (ANIMAIS[a].parecidos || []).includes(b) || (ANIMAIS[b].parecidos || []).includes(a);
  function opcoes(etapa, alvo, pergunta) {
    const outros = ids().filter(id => id !== alvo);
    // Em ordem de quem é aberta por último: a de traço (nunca), parecidos, som
    const regras = [];
    if (etapa === 'traco' && pergunta) regras.push({ fixa: true, ok: id => naoTem(id, pergunta.traco) });
    if (etapa === 'sombra' || etapa === 'charada') regras.push({ ok: id => !parecido(alvo, id) });
    if (etapa === 'som' && ids().filter(temSom).length >= 4) regras.push({ ok: temSom });
    let candidatos = [];
    for (let solta = 0; solta <= regras.length; solta++) {
      // solta = quantas regras, do fim da lista para o começo, já foram abertas (a fixa nunca)
      const valem = regras.filter((r, i) => r.fixa || i < regras.length - solta);
      candidatos = outros.filter(id => valem.every(r => r.ok(id)));
      if (candidatos.length >= 3) break;
    }
    return U.embaralhar([alvo, ...U.embaralhar(candidatos).slice(0, 3)]);
  }

  // ── Charadas ─────────────────────────────────────────────────
  // Sorteada entre as do animal, sem repetir a última usada para ele
  // nesta sessão (a aula tem 20 minutos e as crianças repetem as fases)
  const ultima = {};
  function charadaPara(alvo) {
    const lista = ANIMAIS[alvo].charadas || [];
    if (!lista.length) return 'Quem sou eu?';
    if (lista.length === 1) return lista[0];
    let i;
    do { i = Math.floor(Math.random() * lista.length); } while (i === ultima[alvo]);
    ultima[alvo] = i;
    return lista[i];
  }

  return { sortearMoitas, sortearVariantes, novaPartida, completarSalvo, perguntasPara, sortearPergunta, varianteEtapa2, opcoes, charadaPara, parecido };
})();
