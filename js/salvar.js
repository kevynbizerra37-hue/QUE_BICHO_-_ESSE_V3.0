'use strict';
// ═══════════════════════════════════════════════════════════════
//  SALVAR — o progresso e as preferências no localStorage
//  Prefixo qbe3_: todos os repositórios do GitHub Pages da conta dividem
//  o mesmo endereço e, portanto, o mesmo localStorage. A 2.0 usa aq_, e
//  uma versão não pode apagar o progresso da outra.
//  Tudo dentro de try/catch: em janela anônima o jogo funciona, só não
//  guarda. Tudo validado na leitura: texto estranho numa chave nunca
//  quebra o jogo.
// ═══════════════════════════════════════════════════════════════
QBE.salvar = (() => {
  const chave = k => CONFIG.prefixoSalvo + k;
  const ler = k => { try { return localStorage.getItem(chave(k)); } catch (e) { return null; } };
  const gravar = (k, v) => { try { localStorage.setItem(chave(k), v); } catch (e) {} };
  const tirar = k => { try { localStorage.removeItem(chave(k)); } catch (e) {} };
  const json = t => { if (t == null) return undefined; try { return JSON.parse(t); } catch (e) { return undefined; } };
  const totalMoitas = () => MAPA.moitas.length;

  // A partida em memória. As coroas da moita em curso NÃO entram aqui:
  // elas só somam (e só são gravadas) na celebração (4.3).
  const partida = { pontos: 0, feitas: [], sorteio: [], variantes: [] };

  // Lê e confere cada chave (tabela da seção 4.7). Devolve se havia algo salvo.
  function carregarProgresso() {
    partida.pontos = 0; partida.feitas = []; partida.sorteio = []; partida.variantes = [];
    const versao = ler('versao');
    if (versao === null) return false;
    if (Number(versao) !== CONFIG.versaoSalvo) {
      // outra versão do salvo: descarta o progresso, não as preferências
      apagarProgresso();
      return false;
    }
    const pts = Number(ler('pontos'));
    partida.pontos = Number.isInteger(pts) && pts >= 0 ? pts : 0;

    // Só moitas que existem e sem repetir: um índice a mais liberava a
    // árvore antes da hora.
    const feitas = json(ler('feitas'));
    partida.feitas = Array.isArray(feitas)
      ? [...new Set(feitas)].filter(i => Number.isInteger(i) && i >= 0 && i < totalMoitas()).sort((a, b) => a - b)
      : [];

    // Uma lista por moita, ids distintos e todos ainda no catálogo — senão
    // o jogo quebraria depois de trocar os animais em dados.js.
    const s = json(ler('sorteio'));
    const sorteioOk = Array.isArray(s) && s.length === totalMoitas() && s.every(l =>
      Array.isArray(l) && l.length === CONFIG.etapasPorMoita && new Set(l).size === l.length &&
      l.every(id => typeof id === 'string' && Object.prototype.hasOwnProperty.call(ANIMAIS, id)));
    if (sorteioOk) partida.sorteio = s.map(l => l.slice());
    else partida.feitas = [];       // sorteio novo: as moitas feitas eram de outros bichos

    const v = json(ler('variantes'));
    if (Array.isArray(v) && v.length === totalMoitas() && v.every(x => x === 'sombra' || x === 'traco')) partida.variantes = v.slice();
    return true;
  }

  function salvarProgresso() {
    gravar('versao', String(CONFIG.versaoSalvo));
    gravar('pontos', String(partida.pontos));
    gravar('feitas', JSON.stringify(partida.feitas));
    gravar('sorteio', JSON.stringify(partida.sorteio));
    gravar('variantes', JSON.stringify(partida.variantes));
  }

  // Apagar progresso apaga só o progresso: narração, velocidade e sons ficam
  function apagarProgresso() {
    ['versao', 'pontos', 'feitas', 'sorteio', 'variantes'].forEach(tirar);
    partida.pontos = 0; partida.feitas = []; partida.sorteio = []; partida.variantes = [];
  }

  const temProgresso = () => partida.feitas.length > 0 || partida.pontos > 0;
  // "as 2 moitas que você já fez e as 150 coroas"
  function oQueSePerde() {
    const n = partida.feitas.length, partes = [];
    if (n) partes.push(n === 1 ? 'a moita que você já fez' : `as ${n} moitas que você já fez`);
    if (partida.pontos) partes.push(`as ${partida.pontos} coroas`);
    return partes.join(' e ');
  }

  // ── Preferências ──
  function carregarPreferencias() {
    const pref = { ligada: false, velocidade: CONFIG.vozVelocidadePadrao, mudo: false };
    const v = json(ler('voz'));
    if (v && typeof v === 'object') {
      pref.ligada = v.ligada === true;
      if (typeof v.velocidade === 'number' && Number.isFinite(v.velocidade)) pref.velocidade = Math.max(0.5, Math.min(1.5, v.velocidade));
    }
    const m = json(ler('mudo'));
    if (typeof m === 'boolean') pref.mudo = m;
    return pref;
  }
  function salvarPreferencias({ ligada, velocidade, mudo }) {
    gravar('voz', JSON.stringify({ ligada: !!ligada, velocidade }));
    gravar('mudo', JSON.stringify(!!mudo));
  }

  return { partida, carregarProgresso, salvarProgresso, apagarProgresso, temProgresso, oQueSePerde, carregarPreferencias, salvarPreferencias };
})();
