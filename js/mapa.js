'use strict';
// ═══════════════════════════════════════════════════════════════
//  MAPA — canvas, câmera, trilha, sapo, moitas, bichos, efeitos e
//  minimapa (seções 4.6, 4.8, 4.9, 5.2, 5.3 e 5.4)
//  Tudo em pixels do desenho do mapa (MAPA.largura × MAPA.altura). O
//  canvas ocupa a tela; placar, botões, minimapa e painel são HTML.
//  Todo movimento é por tempo (dt), para andar igual a 60 e a 144 Hz.
// ═══════════════════════════════════════════════════════════════
QBE.mapa = (() => {
  const U = QBE.util, R = QBE.recursos, S = QBE.sprite, FX = QBE.efeitos;
  const C = CONFIG, CS = C.sapo, CM = C.moita, CB = C.bichoNoMapa, D = C.distancias;
  const $ = U.$;
  const TAU = Math.PI * 2;
  const W = MAPA.largura, H = MAPA.altura;

  // ══ TRILHA ═══════════════════════════════════════════════════
  // A malha de js/trilhas.js diz quais quadradinhos de 8×8 são caminho
  // de terra. Lida uma vez só; sem ela, o sapo anda por todo o mapa.
  let malha;
  function grade() {
    if (malha !== undefined) return malha;
    malha = null;
    try {
      if (typeof TRILHAS !== 'undefined' && TRILHAS.bits) {
        const bruto = atob(TRILHAS.bits);
        const bytes = new Uint8Array(bruto.length);
        for (let i = 0; i < bruto.length; i++) bytes[i] = bruto.charCodeAt(i);
        malha = { bytes, colunas: TRILHAS.colunas, linhas: TRILHAS.linhas, cw: W / TRILHAS.colunas, ch: H / TRILHAS.linhas };
      }
    } catch (e) { malha = null; }
    return malha;
  }
  // (x, y) em pixels do mapa. A malha usa proporção: um fundo de outro
  // tamanho continua batendo com ela.
  function celula(cx, cy) {
    const g = grade();
    if (!g) return true;
    if (cx < 0 || cy < 0 || cx >= g.colunas || cy >= g.linhas) return false;
    const i = cy * g.colunas + cx;
    return ((g.bytes[i >> 3] >> (7 - (i & 7))) & 1) === 1;
  }
  function naTrilha(x, y) {
    const g = grade();
    if (!g) return true;
    return celula(Math.floor(x / g.cw), Math.floor(y / g.ch));
  }
  // Centros das células de trilha (para encaixar âncoras e sortear pontos)
  let centros = null;
  function centrosDaTrilha() {
    if (centros) return centros;
    centros = [];
    const g = grade();
    if (!g) return centros;
    for (let cy = 0; cy < g.linhas; cy++) for (let cx = 0; cx < g.colunas; cx++) if (celula(cx, cy)) centros.push([(cx + 0.5) * g.cw, (cy + 0.5) * g.ch]);
    return centros;
  }
  // Todo o segmento cai na trilha? (testado de 4 em 4 px)
  function segmentoNaTrilha(x0, y0, x1, y1) {
    const n = Math.max(1, Math.ceil(U.distancia(x0, y0, x1, y1) / 4));
    for (let i = 1; i <= n; i++) if (!naTrilha(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n)) return false;
    return true;
  }

  // ══ SAPO ═════════════════════════════════════════════════════
  const sapo = { x: MAPA.inicio.x, y: MAPA.inicio.y, vx: 0, vy: 0, andando: false, lado: 'direita', dir: 'baixo', t: 0, paradoHa: 0, curva: 0 };
  const teclas = {};
  const limitarX = x => U.limitar(x, CS.margem.lados, W - CS.margem.lados);
  const limitarY = y => U.limitar(y, CS.margem.topo, H - CS.margem.base);

  // Anda o quanto pedir, mas só onde dá para pisar. De 1 em 1 pixel, cada
  // eixo por si: indo de uma vez, o sapo parava antes da beirada e
  // engatava em cada dente da grade; assim ele encosta e segue rente.
  function moverNaTrilha(dx, dy, dt) {
    if (!naTrilha(sapo.x, sapo.y)) {
      // Fora da trilha (mapa trocado, jogo antigo): anda livre até voltar
      sapo.x = limitarX(sapo.x + dx); sapo.y = limitarY(sapo.y + dy);
      return;
    }
    const passos = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
    const ux = dx / passos, uy = dy / passos;
    let travouX = false, travouY = false;
    for (let i = 0; i < passos; i++) {
      if (ux && !travouX) { const nx = limitarX(sapo.x + ux); if (naTrilha(nx, sapo.y)) sapo.x = nx; else travouX = true; }
      if (uy && !travouY) { const ny = limitarY(sapo.y + uy); if (naTrilha(sapo.x, ny)) sapo.y = ny; else travouY = true; }
      if ((!ux || travouX) && (!uy || travouY)) break;
    }
    // Bateu de frente segurando uma direção só: a trilha dobrou. Ajuda nas
    // curvas, 1 px por quadro de 60 Hz (60 px/s, para valer em qualquer monitor).
    const soX = travouX && !uy, soY = travouY && !ux;
    if (soX || soY) {
      sapo.curva += 60 * dt;
      while (sapo.curva >= 1) {
        sapo.curva -= 1;
        if (!escorregarNaCurva(soX ? Math.sign(ux) : 0, soY ? Math.sign(uy) : 0)) { sapo.curva = 0; break; }
      }
    } else sapo.curva = 0;
  }
  // Procura a continuação da trilha 4 px à frente, de 2 em 2 px, até
  // `ajudaCurva` px para cada lado, e leva o sapo 1 px para lá.
  function escorregarNaCurva(sx, sy) {
    const FRENTE = 4;
    for (let d = 2; d <= CS.ajudaCurva; d += 2) {
      for (const lado of [-1, 1]) {
        const ax = limitarX(sapo.x + sx * FRENTE + (sx ? 0 : lado * d));
        const ay = limitarY(sapo.y + sy * FRENTE + (sy ? 0 : lado * d));
        if (!naTrilha(ax, ay)) continue;
        const nx = sx ? sapo.x : limitarX(sapo.x + lado);
        const ny = sx ? limitarY(sapo.y + lado) : sapo.y;
        if (naTrilha(nx, ny)) { sapo.x = nx; sapo.y = ny; return true; }
      }
    }
    return false;
  }

  function moverSapo(dt) {
    let ix = 0, iy = 0;
    if (teclas.arrowleft || teclas.a) ix -= 1;
    if (teclas.arrowright || teclas.d) ix += 1;
    if (teclas.arrowup || teclas.w) iy -= 1;
    if (teclas.arrowdown || teclas.s) iy += 1;
    const mag = Math.hypot(ix, iy);
    if (mag > 0) { ix /= mag; iy /= mag; }
    sapo.vx += ix * CS.acel * dt;
    sapo.vy += iy * CS.acel * dt;
    // O freio é por eixo: soltando a seta de descer e segurando a da
    // direita, o sapo não continua caindo de lado para o mato.
    const freio = Math.pow(CS.freioPorQuadro60, dt * 60);
    if (!ix) sapo.vx *= freio;
    if (!iy) sapo.vy *= freio;
    if (Math.abs(sapo.vx) < CS.velMinima) sapo.vx = 0;
    if (Math.abs(sapo.vy) < CS.velMinima) sapo.vy = 0;
    const v = Math.hypot(sapo.vx, sapo.vy);
    if (v > CS.velMax) { sapo.vx *= CS.velMax / v; sapo.vy *= CS.velMax / v; }
    if (Math.hypot(sapo.vx, sapo.vy) < CS.velMinima) {
      sapo.vx = 0; sapo.vy = 0;
      return false;
    }
    moverNaTrilha(sapo.vx * dt, sapo.vy * dt, dt);
    virarSapo(sapo.vx, sapo.vy);
    return true;
  }
  // De lado olha para a direita; para cima ou para baixo, mantém o último lado
  function virarSapo(dx, dy) {
    if (Math.abs(dx) > 0.01) sapo.lado = dx < 0 ? 'esquerda' : 'direita';
    if (Math.abs(dx) > Math.abs(dy)) sapo.dir = dx < 0 ? 'esquerda' : 'direita';
    else if (Math.abs(dy) > 0) sapo.dir = dy < 0 ? 'cima' : 'baixo';
  }
  function zerarEmbalo() {
    for (const k in teclas) delete teclas[k];
    sapo.vx = 0; sapo.vy = 0; sapo.andando = false; sapo.curva = 0;
  }

  // ══ MOITAS ═══════════════════════════════════════════════════
  let moitas = [];
  const partida = () => QBE.salvar.partida;
  const feita = i => partida().feitas.includes(i);
  const aberta = i => i === 0 || feita(i - 1);
  function proximaMoita() {
    for (let i = 0; i < MAPA.moitas.length; i++) if (!feita(i) && aberta(i)) return i;
    return null;
  }
  const tudoFeito = () => partida().feitas.length >= MAPA.moitas.length;

  // Encaixa cada âncora na célula de trilha mais próxima (até 120 px)
  function montarMoitas() {
    const cs = centrosDaTrilha();
    moitas = MAPA.moitas.map((m, i) => {
      let ax = m.x, ay = m.y, encaixou = !grade();
      if (grade()) {
        let melhor = null;
        for (const [x, y] of cs) { const d = U.distancia(x, y, m.x, m.y); if (d <= D.encaixeAncora && (!melhor || d < melhor.d)) melhor = { x, y, d }; }
        if (melhor) { encaixou = true; if (!naTrilha(m.x, m.y)) { ax = melhor.x; ay = melhor.y; } }
      }
      const raio = m.raio || CM.raioPadrao;
      // pontos de passeio: trilha a até `raio` da âncora e dentro da margem
      const pontos = cs.filter(([x, y]) => U.distancia(x, y, ax, ay) <= raio
        && x >= CM.margem.lados && x <= W - CM.margem.lados && y >= CM.margem.topo && y <= H - CM.margem.base);
      return { i, ax, ay, x: ax, y: ay, raio, encaixou, pontos, alvo: null, pausa: U.sortear(0.3, 1.2),
        parada: false, longe: 0, t0: S.agora(), estado: 'bloqueada', anim: 'parada', abrindoEm: null, bichos: [] };
    });
  }
  function estadoDe(i) { return feita(i) ? 'concluida' : aberta(i) ? 'liberada' : 'bloqueada'; }

  function atualizarMoitas(dt) {
    const reduzido = U.movimentoReduzido();
    for (const m of moitas) {
      const estado = estadoDe(m.i);
      if (estado !== m.estado) {
        m.estado = estado;
        if (estado !== 'liberada') { m.x = m.ax; m.y = m.ay; m.alvo = null; }
        if (estado === 'concluida') montarBichos(m);
      }
      if (m.abrindoEm != null) continue;
      if (estado !== 'liberada') { m.anim = 'parada'; if (estado === 'concluida') atualizarBichos(m, dt); continue; }
      // Liberada: o sapo perto faz a moita parar e balançar mais forte
      const d = U.distancia(sapo.x, sapo.y, m.x, m.y);
      if (d < D.pararMoita) { m.parada = true; m.longe = 0; }
      else if (m.parada) {
        if (d > D.soltarMoita) { m.longe += dt; if (m.longe >= CM.voltarDepoisDe) m.parada = false; }
        else m.longe = 0;
      }
      const novaAnim = m.parada ? 'balancando' : 'parada';
      if (novaAnim !== m.anim) { m.anim = novaAnim; m.t0 = S.agora(); }
      if (m.parada || m.mouse || reduzido || !m.encaixou || !m.pontos.length) continue;
      // Passeio: anda até um ponto da trilha a 30 px/s; ao chegar, pausa
      if (m.pausa > 0) { m.pausa -= dt; continue; }
      if (!m.alvo) { m.alvo = escolherAlvo(m); if (!m.alvo) { m.pausa = 0.5; continue; } }
      const passo = CM.vel * dt;
      const dx = m.alvo[0] - m.x, dy = m.alvo[1] - m.y, dist = Math.hypot(dx, dy);
      if (dist <= passo) { m.x = m.alvo[0]; m.y = m.alvo[1]; m.alvo = null; m.pausa = U.sortear(CM.pausaMin, CM.pausaMax); continue; }
      const nx = m.x + dx / dist * passo, ny = m.y + dy / dist * passo;
      // testando a trilha a cada passo: travou, escolhe outro ponto
      if (naTrilha(nx, ny) && U.distancia(nx, ny, m.ax, m.ay) <= m.raio) { m.x = nx; m.y = ny; }
      else m.alvo = null;
    }
  }
  // Um ponto da trilha, dentro do raio, a que se chega em linha reta pela
  // trilha (assim a moita nunca sai do caminho nem do raio)
  function escolherAlvo(m) {
    for (let k = 0; k < 24; k++) {
      const p = U.escolher(m.pontos);
      if (U.distancia(p[0], p[1], m.x, m.y) < 12) continue;
      if (segmentoNaTrilha(m.x, m.y, p[0], p[1])) return p;
    }
    return null;
  }

  // ══ BICHOS DESCOBERTOS ═══════════════════════════════════════
  // Concluída a moita, os 3 bichos dela passeiam a até 70 px dela, a
  // 40 px/s, alternando andar e parar. Os que voam podem sair da trilha.
  function montarBichos(m) {
    const ids = partida().sorteio[m.i] || [];
    const perto = centrosDaTrilha().filter(([x, y]) => U.distancia(x, y, m.ax, m.ay) <= CB.raio);
    m.perto = perto;
    m.bichos = ids.map((id, k) => {
      const voa = ANIMAIS[id] && ANIMAIS[id].tracos.voa === true;
      const ang = (k / 3) * TAU + 0.6;
      let x = m.ax + Math.cos(ang) * 45, y = m.ay + Math.sin(ang) * 30;
      if (!voa && grade() && !naTrilha(x, y) && perto.length) [x, y] = U.escolher(perto);
      return { id, voa, x, y, alvo: null, pausa: U.sortear(0.5, 2.5), anim: 'parado', t0: S.agora() + k, lado: k % 2 ? 'esquerda' : 'direita' };
    });
  }
  function atualizarBichos(m, dt) {
    if (U.movimentoReduzido()) return;
    for (const b of m.bichos) {
      if (b.pausa > 0) {
        b.pausa -= dt;
        if (b.anim !== 'parado') { b.anim = 'parado'; b.t0 = S.agora(); }
        continue;
      }
      if (!b.alvo) {
        if (b.voa) { const a = U.sortear(0, TAU), r = U.sortear(10, CB.raio); b.alvo = [m.ax + Math.cos(a) * r, m.ay - 20 + Math.sin(a) * r * 0.6]; }
        else if (m.perto && m.perto.length) {
          const p = U.escolher(m.perto);
          b.alvo = segmentoNaTrilha(b.x, b.y, p[0], p[1]) ? p : null;
          if (!b.alvo) { b.pausa = 0.6; continue; }
        } else { b.pausa = 2; continue; }
      }
      if (b.anim !== 'andando') { b.anim = 'andando'; b.t0 = S.agora(); }
      const passo = CB.vel * dt, dx = b.alvo[0] - b.x, dy = b.alvo[1] - b.y, dist = Math.hypot(dx, dy);
      if (Math.abs(dx) > 0.5) b.lado = dx < 0 ? 'esquerda' : 'direita';
      if (dist <= passo) { b.x = b.alvo[0]; b.y = b.alvo[1]; b.alvo = null; b.pausa = U.sortear(1, 3); }
      else { b.x += dx / dist * passo; b.y += dy / dist * passo; }
    }
  }

  // ══ EFEITOS DO MAPA ══════════════════════════════════════════
  const efeitos = (() => {
    const E = C.efeitos, A = E.altura;
    const lista = [];
    if (E.sombraNuvem) lista.push(FX.sistemaNuvem());
    if (E.brilhoAgua && MAPA.brilhosAgua && MAPA.brilhosAgua.length) lista.push(FX.sistemaBrilhos({ aCada: [0.25, 0.6], tamanho: [A.brilhoAgua * 0.8, A.brilhoAgua * 1.2], pontos: MAPA.brilhosAgua, maxJuntos: 8 }));
    if (E.vagalumes) {
      // perto da mata e da água: ao lado de pontos de água sorteados
      const pts = Array.from({ length: E.vagalumes }, () => {
        const p = MAPA.brilhosAgua && MAPA.brilhosAgua.length ? U.escolher(MAPA.brilhosAgua) : [U.sortear(100, W - 100), U.sortear(150, H - 120)];
        return [U.limitar(p[0] + U.sortear(-70, 70), 30, W - 30), U.limitar(p[1] + U.sortear(-60, 60), 30, H - 30)];
      });
      lista.push(FX.sistemaVagalumes({ pontos: pts, tamanho: A.vagalumeMapa, deriva: 6 }));
    }
    if (E.borboletas) lista.push(FX.sistemaBorboletas({ quantos: E.borboletas, altura: A.borboletaMapa }));
    return lista;
  })();
  // folhinhas caindo da moita liberada
  const folhinhas = [];
  function soltarFolhinhas(m, dt) {
    if (U.movimentoReduzido()) { folhinhas.length = 0; return; }
    m.proxFolha = (m.proxFolha || 0) - dt;
    if (m.proxFolha <= 0) {
      m.proxFolha = m.anim === 'balancando' ? U.sortear(0.15, 0.35) : U.sortear(0.6, 1.2);
      const alt = SPRITES.moita.alturaNoMapa;
      folhinhas.push({ x: m.x + U.sortear(-alt * 0.45, alt * 0.45), y: m.y - alt * U.sortear(0.5, 0.85), y0: m.y, vy: U.sortear(18, 34),
        giro: U.sortear(0, TAU), vg: U.sortear(-2, 2), q: Math.floor(U.sortear(0, 18)), fase: U.sortear(0, TAU), t: 0 });
    }
  }
  function atualizarFolhinhas(dt) {
    for (const f of folhinhas) { f.t += dt; f.y += f.vy * dt; f.giro += f.vg * dt; }
    for (let i = folhinhas.length - 1; i >= 0; i--) if (folhinhas[i].y > folhinhas[i].y0 + 14) folhinhas.splice(i, 1);
  }

  // ══ CÂMERA ═══════════════════════════════════════════════════
  // O mapa é ampliado até cobrir a tela inteira: escala = maior entre 1,
  // larguraTela ÷ larguraMapa e alturaTela ÷ alturaMapa.
  const cam = { x: 0, y: 0, zoom: 1, zx: 0, zy: 0 };
  const escalaMapa = () => Math.max(1, innerWidth / W, innerHeight / H);
  function alvoCamera() {
    const esc = escalaMapa() * cam.zoom, vw = innerWidth / esc, vh = innerHeight / esc;
    return { x: U.limitar(sapo.x - vw / 2, 0, Math.max(0, W - vw)), y: U.limitar(sapo.y - vh / 2, 0, Math.max(0, H - vh)), vw, vh };
  }
  function seguirCamera(dt, imediato) {
    const a = alvoCamera();
    if (imediato) { cam.x = a.x; cam.y = a.y; return; }
    const k = 1 - Math.pow(1 - C.camera.suavidadePorQuadro60, dt * 60);
    cam.x += (a.x - cam.x) * k; cam.y += (a.y - cam.y) * k;
  }
  // pixel da tela → pixel do mapa
  function telaParaMapa(cx, cy) {
    const esc = escalaMapa() * cam.zoom;
    return { x: cam.x + cx / esc, y: cam.y + cy / esc };
  }

  // ══ ENTRAR NA MOITA ══════════════════════════════════════════
  let entrando = null;
  function entrar(i) {
    if (entrando || estadoDe(i) !== 'liberada') return;
    if (QBE.telas && QBE.telas.janelaAberta()) return;
    zerarEmbalo();
    const m = moitas[i];
    QBE.audio.silenciarTudo();
    // A câmera aproxima em 300 ms e a moita se abre; reduzido, vai direto
    if (U.movimentoReduzido()) { QBE.etapas.comecar(i); return; }
    entrando = { i, t: 0 };
    m.abrindoEm = S.agora();
  }
  function atualizarEntrada(dt) {
    if (!entrando) return;
    entrando.t += dt;
    const dur = C.tempos.transicao / 1000;
    cam.zoom = 1 + 0.6 * U.suave(entrando.t / dur);
    const m = moitas[entrando.i];
    // aproxima em volta da moita
    const esc = escalaMapa() * cam.zoom, vw = innerWidth / esc, vh = innerHeight / esc;
    cam.x = U.limitar(m.x - vw / 2, 0, Math.max(0, W - vw));
    cam.y = U.limitar(m.y - SPRITES.moita.alturaNoMapa / 2 - vh / 2, 0, Math.max(0, H - vh));
    if (entrando.t >= Math.max(dur, 0.5)) {
      const i = entrando.i;
      entrando = null; cam.zoom = 1; m.abrindoEm = null;
      QBE.etapas.comecar(i);
    }
  }
  function abrirFinal() {
    if (!tudoFeito() || entrando) return;
    if (QBE.telas && QBE.telas.janelaAberta()) return;
    zerarEmbalo();
    QBE.telas.mostrarFinal();
  }
  function moitaPerto() {
    const i = proximaMoita();
    if (i == null) return null;
    return U.distancia(sapo.x, sapo.y, moitas[i].x, moitas[i].y) < D.avisoMoita ? i : null;
  }
  const arvorePerto = () => tudoFeito() && U.distancia(sapo.x, sapo.y, MAPA.arvore.x, MAPA.arvore.y) < D.arvore;

  // ══ TECLADO, MOUSE E TOQUE ═══════════════════════════════════
  const nome = e => (e.key && e.key.length === 1 ? e.key.toLowerCase() : String(e.key || '').toLowerCase());
  const MOVE = ['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 'd', 'w', 's'];
  function tecla(e) {
    const k = nome(e);
    if (MOVE.includes(k)) { teclas[k] = true; e.preventDefault(); return; }
    if (k === ' ') e.preventDefault();
    if (k !== 'e' && k !== 'enter') return;
    // E/ENTER num botão visível com foco (💡, ⚙️) é dele, não do mapa
    const alvo = e.target;
    if (alvo && alvo.tagName === 'BUTTON' && U.visivel(alvo)) return;
    if (entrando) return;
    const perto = moitaPerto();
    if (perto != null) { entrar(perto); return; }
    if (arvorePerto()) { abrirFinal(); return; }
    // Com a narração ligada, ENTER vale de qualquer lugar: quem não
    // enxerga não tem como levar o sapo até a moita.
    if (QBE.voz.ligada()) {
      const prox = proximaMoita();
      if (prox != null) entrar(prox); else if (tudoFeito()) abrirFinal();
    }
  }
  function soltar(e) { teclas[nome(e)] = false; }
  addEventListener('blur', () => { for (const k in teclas) delete teclas[k]; });

  // Moita sob o ponteiro (a área de clique acompanha a moita e tem 1,5× o tamanho dela)
  function moitaSob(px, py) {
    const i = proximaMoita();
    if (i == null) return null;
    const m = moitas[i], alt = SPRITES.moita.alturaNoMapa;
    const meiaL = alt * 0.66 * 1.5, meiaA = alt * 0.5 * 1.5;
    const cx = m.x, cy = m.y - alt * 0.42;
    return Math.abs(px - cx) <= meiaL && Math.abs(py - cy) <= meiaA ? i : null;
  }
  const arvoreSob = (px, py) => tudoFeito() && U.distancia(px, py, MAPA.arvore.x, MAPA.arvore.y - 70) < 90;

  let toque = !!(window.matchMedia && matchMedia('(hover: none)').matches);
  let arrasto = null;
  function ligarPonteiro() {
    const cv = $('mapa-canvas');
    cv.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') { toque = true; arrasto = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t0: performance.now(), mexeu: 0 }; }
    });
    cv.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse') {
        const p = telaParaMapa(e.clientX, e.clientY);
        const sob = moitaSob(p.x, p.y);
        moitas.forEach(m => { m.mouse = sob === m.i; });
        cv.style.cursor = sob != null || arvoreSob(p.x, p.y) ? 'pointer' : 'default';
        return;
      }
      if (!arrasto || e.pointerId !== arrasto.id || entrando) return;
      if (QBE.telas && QBE.telas.janelaAberta()) return;
      // o dedo move o sapo: 0,45 × o deslocamento, pela mesma regra da trilha
      const dx = (e.clientX - arrasto.x) * CS.arrastoToque, dy = (e.clientY - arrasto.y) * CS.arrastoToque;
      arrasto.x = e.clientX; arrasto.y = e.clientY;
      arrasto.mexeu += Math.abs(dx) + Math.abs(dy);
      moverNaTrilha(dx, dy, 1 / 60);
      virarSapo(dx, dy);
      sapo.andando = true; sapo.paradoHa = 0;
    });
    const fim = e => {
      if (!arrasto || e.pointerId !== arrasto.id) return;
      const toqueRapido = arrasto.mexeu < 6 && performance.now() - arrasto.t0 < 500;
      arrasto = null;
      if (toqueRapido) clicar(e.clientX, e.clientY);
    };
    cv.addEventListener('pointerup', fim);
    cv.addEventListener('pointercancel', () => { arrasto = null; });
    cv.addEventListener('click', e => { if (e.pointerType !== 'touch') clicar(e.clientX, e.clientY); });
    cv.addEventListener('mouseleave', () => moitas.forEach(m => { m.mouse = false; }));
    $('btn-proxima-moita').addEventListener('click', () => {
      const prox = proximaMoita();
      if (prox != null) entrar(prox); else abrirFinal();
    });
  }
  function clicar(cx, cy) {
    if (QBE.telas && QBE.telas.janelaAberta()) return;
    const p = telaParaMapa(cx, cy);
    const i = moitaSob(p.x, p.y);
    if (i != null) { entrar(i); return; }
    if (arvoreSob(p.x, p.y)) abrirFinal();
  }

  // ══ DESENHO ══════════════════════════════════════════════════
  // Reserva do fundo: verde, com as células da trilha em cor de terra
  let fundoCodigo = null;
  function desenhoDeReserva() {
    if (fundoCodigo) return fundoCodigo;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const c = cv.getContext('2d');
    c.fillStyle = '#2F7D32'; c.fillRect(0, 0, W, H);
    const g = grade();
    if (g) {
      c.fillStyle = '#D8A75E';
      for (const [x, y] of centrosDaTrilha()) c.fillRect(x - g.cw / 2, y - g.ch / 2, g.cw + 0.5, g.ch + 0.5);
    }
    return (fundoCodigo = cv);
  }
  function desenharFundo(ctx) {
    const def = SPRITES.mapa.fundo;
    if (R.pronto(def)) {
      // fundo de outro tamanho é escalado na mesma proporção, como a malha
      S.desenharSprite(ctx, def, S.agora(), 0, 0, { escala: W / def.quadroL });
      return;
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(desenhoDeReserva(), 0, 0);
  }
  function desenharCenario(ctx) {
    for (const item of SPRITES.mapa.cenario) {
      if (!R.pronto(item)) continue;
      S.desenharSprite(ctx, item, S.agora(), item.x, item.y, { escala: (item.alturaNoMapa || item.quadroA) / item.quadroA });
    }
  }
  // selo em cima da moita: 🔒 bloqueada, ❓ liberada (pulsando), ⭐ concluída
  function desenharSelo(ctx, m) {
    const alt = SPRITES.moita.alturaNoMapa;
    const emoji = m.estado === 'bloqueada' ? '🔒' : m.estado === 'liberada' ? '❓' : '⭐';
    let tam = 30;
    if (m.estado === 'liberada' && !U.movimentoReduzido()) tam *= 1 + 0.12 * Math.sin(TAU * 1.6 * S.agora());
    S.desenharEmoji(ctx, emoji, m.x, m.y - alt * 0.86, tam);
  }
  // Aviso "▶ Aperte E" / "▶ Toque aqui": placa de madeira por cima
  function desenharAviso(ctx, x, y, texto) {
    ctx.save();
    ctx.font = '700 18px Fredoka, sans-serif';
    const larg = ctx.measureText(texto).width + 28, alt = 36;
    // sempre inteiro na tela, mesmo com a moita encostada na borda
    const vw = innerWidth / (escalaMapa() * cam.zoom);
    x = U.limitar(x, cam.x + larg / 2 + 6, cam.x + vw - larg / 2 - 6);
    const bx = x - larg / 2, by = y - alt;
    const flutua = U.movimentoReduzido() ? 0 : Math.sin(TAU * 1.2 * S.agora()) * 3;
    ctx.translate(0, flutua);
    ctx.fillStyle = '#8B3E15'; ctx.strokeStyle = '#1A1209'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(bx, by, larg, alt, 8) : ctx.rect(bx, by, larg, alt); ctx.fill(); ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 5; ctx.strokeStyle = '#1A1209'; ctx.strokeText(texto, x, by + alt / 2 + 1);
    ctx.fillStyle = '#fff'; ctx.fillText(texto, x, by + alt / 2 + 1);
    ctx.restore();
  }

  let fps = 60;
  function desenhar() {
    const { ctx, w, h } = U.ajustarCanvas($('mapa-canvas'));
    const esc = escalaMapa() * cam.zoom;
    ctx.fillStyle = '#173b1d'; ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.scale(esc, esc);
    ctx.translate(-cam.x, -cam.y);
    // 1. fundo · 2. cenário animado · 3. efeitos
    desenharFundo(ctx);
    desenharCenario(ctx);
    const area = { x: 0, y: 0, w: W, h: H };
    for (const s of efeitos) s.desenhar(ctx, area);
    // 4. personagens em ordem de y: quem está mais abaixo fica na frente
    const coisas = [];
    for (const m of moitas) {
      coisas.push({ y: m.y, f: () => {
        const alt = SPRITES.moita.alturaNoMapa;
        const anim = m.abrindoEm != null ? 'abrindo' : m.anim;
        const t = m.abrindoEm != null ? S.agora() - m.abrindoEm : S.agora() - m.t0;
        // bloqueada: apagada e com um balanço bem leve
        S.desenharMoita(ctx, anim, t, m.x, m.y, alt, { apagada: m.estado === 'bloqueada', balanco: m.estado === 'bloqueada' ? 0.4 : 1 });
      } });
      for (const b of m.bichos) {
        coisas.push({ y: b.y, f: () => {
          const alt = CB.altura * ((ANIMAIS[b.id] && ANIMAIS[b.id].escalaMapa) || 1);
          S.desenharBicho(ctx, b.id, b.anim, S.agora() - b.t0, b.x, b.y, alt, { lado: b.lado });
        } });
      }
    }
    coisas.push({ y: MAPA.arvore.y, f: () => S.desenharArvore(ctx, tudoFeito(), S.agora(), MAPA.arvore.x, MAPA.arvore.y, SPRITES.arvore.alturaNoMapa) });
    coisas.push({ y: sapo.y, f: () => S.desenharSapo(ctx, { t: sapo.t, andando: sapo.andando, lado: sapo.lado, dir: sapo.dir }, sapo.x, sapo.y) });
    coisas.sort((a, b) => a.y - b.y).forEach(c => c.f());
    for (const f of folhinhas) FX.folha(ctx, f.x + Math.sin(f.t * 2 + f.fase) * 6, f.y, C.efeitos.altura.folhaMoita, f.q, f.giro, U.limitar((f.y0 + 14 - f.y) / 14, 0, 1));
    // 5. selos e avisos
    for (const m of moitas) desenharSelo(ctx, m);
    const texto = toque ? '▶ TOQUE AQUI' : '▶ APERTE E';
    const perto = moitaPerto();
    // Perto do topo da tela o aviso sumiria atrás do placar: vai para baixo da moita
    const alturaHud = 92 / esc;
    const posAviso = (x, yCima, yBaixo) => desenharAviso(ctx, x, yCima - cam.y < alturaHud ? yBaixo : yCima, texto);
    if (perto != null && !entrando) posAviso(moitas[perto].x, moitas[perto].y - SPRITES.moita.alturaNoMapa - 22, moitas[perto].y + 48);
    else if (arvorePerto() && !entrando) posAviso(MAPA.arvore.x, MAPA.arvore.y - SPRITES.arvore.alturaNoMapa - 10, MAPA.arvore.y + 48);
    if (conferindo()) desenharConferencia(ctx);
    ctx.restore();
    if (conferindo()) desenharConferenciaTela(ctx, w);
  }

  // ── Minimapa ─────────────────────────────────────────────────
  let miniFundo = null;
  function desenharMinimapa() {
    const cv = $('minimapa');
    if (!U.visivel(cv)) return;
    const { ctx, w, h } = U.ajustarCanvas(cv);
    const sx = w / W, sy = h / H;
    const def = SPRITES.mapa.fundo;
    if (!miniFundo || miniFundo.w !== w) {
      const fonte = R.pronto(def) ? def._img : desenhoDeReserva();
      if (fonte) {
        const c = document.createElement('canvas'); c.width = Math.round(w * 2); c.height = Math.round(h * 2);
        const cc = c.getContext('2d'); cc.imageSmoothingQuality = 'high'; cc.drawImage(fonte, 0, 0, c.width, c.height);
        miniFundo = { c, w, real: R.pronto(def) };
      }
    }
    if (miniFundo && !miniFundo.real && R.pronto(def)) miniFundo = null;
    ctx.clearRect(0, 0, w, h);
    if (miniFundo) ctx.drawImage(miniFundo.c, 0, 0, w, h);
    const pisca = U.movimentoReduzido() ? 1 : 0.55 + 0.45 * Math.sin(TAU * 1.5 * S.agora());   // menos de 2 vezes por segundo
    for (const m of moitas) {
      ctx.globalAlpha = m.estado === 'liberada' ? pisca : 1;
      ctx.fillStyle = m.estado === 'concluida' ? '#5BEA6E' : m.estado === 'liberada' ? '#FFD700' : '#8A968C';
      ctx.fillRect(m.x * sx - 3, m.y * sy - 3, 6, 6);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = tudoFeito() ? '#FFD700' : '#795548';
    ctx.fillRect(MAPA.arvore.x * sx - 4, MAPA.arvore.y * sy - 4, 8, 8);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1A1209'; ctx.lineWidth = 1.5;
    ctx.fillRect(sapo.x * sx - 3.5, sapo.y * sy - 3.5, 7, 7); ctx.strokeRect(sapo.x * sx - 3.5, sapo.y * sy - 3.5, 7, 7);
    const a = alvoCamera();
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1;
    ctx.strokeRect(cam.x * sx, cam.y * sy, a.vw * sx, a.vh * sy);
  }

  // ── Modo de conferência (F9 ou ?conferir=1) ──────────────────
  let conferir = C.conferir || /[?&]conferir=1/.test(location.search);
  const conferindo = () => conferir;
  function desenharConferencia(ctx) {
    const g = grade();
    if (g) {
      ctx.fillStyle = 'rgba(255,0,255,.28)';
      for (const [x, y] of centrosDaTrilha()) ctx.fillRect(x - g.cw / 2, y - g.ch / 2, g.cw, g.ch);
    }
    ctx.lineWidth = 2;
    for (const m of moitas) {
      ctx.strokeStyle = m.encaixou ? '#00e5ff' : '#ff3d00';
      ctx.beginPath(); ctx.arc(m.ax, m.ay, m.raio, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(m.ax, m.ay, D.avisoMoita, 0, TAU); ctx.setLineDash([6, 6]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#00e5ff'; ctx.fillRect(m.ax - 4, m.ay - 4, 8, 8);
      if (m.alvo) { ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.alvo[0], m.alvo[1]); ctx.stroke(); }
    }
    ctx.strokeStyle = '#ffd700';
    ctx.beginPath(); ctx.arc(MAPA.arvore.x, MAPA.arvore.y, D.arvore, 0, TAU); ctx.stroke();
  }
  function desenharConferenciaTela(ctx, w) {
    const faltando = R.faltando(), problemas = moitas.filter(m => !m.encaixou).map(m => `moita ${m.i + 1} fora da trilha`);
    const linhas = [`FPS ${Math.round(fps)}`, ...problemas, ...faltando.slice(0, 12).map(f => 'falta: ' + f)];
    ctx.save();
    ctx.font = '600 14px monospace';
    ctx.fillStyle = 'rgba(0,0,0,.72)';
    ctx.fillRect(w - 420, 92, 408, 22 + linhas.length * 18);
    ctx.fillStyle = '#fff';
    linhas.forEach((l, i) => ctx.fillText(l, w - 408, 112 + i * 18));
    ctx.restore();
  }
  addEventListener('keydown', e => { if (e.key === 'F9') { conferir = !conferir; e.preventDefault(); } });

  // ══ HUD E PAINEL ═════════════════════════════════════════════
  function atualizarHud() {
    $('mapa-coroas').textContent = partida().pontos;
    $('mapa-placar').setAttribute('aria-label', `${partida().pontos} coroas`);
    $('mapa-selo').textContent = `${MAPA.badge} ${MAPA.nome}`;
    const lista = $('painel-moitas');
    lista.textContent = '';
    MAPA.moitas.forEach((_, i) => {
      const estado = estadoDe(i);
      const li = document.createElement('li');
      li.className = 'painel-item ' + (estado === 'concluida' ? 'feita' : estado === 'liberada' ? 'aberta' : 'fechada');
      const num = document.createElement('span');
      num.className = 'painel-num'; num.textContent = i + 1; num.setAttribute('aria-hidden', 'true');
      li.appendChild(num);
      const ids = partida().sorteio[i] || [];
      // Os bichos desenhados são aria-hidden: o leitor de tela lê este texto
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = estado === 'concluida'
        ? `Moita ${i + 1}: concluída — ${ids.map(id => ANIMAIS[id].nome).join(', ').replace(/, ([^,]*)$/, ' e $1')}`
        : `Moita ${i + 1}: ${estado === 'liberada' ? 'liberada' : 'bloqueada'}`;
      li.appendChild(sr);
      if (estado === 'concluida') {
        const caixa = document.createElement('span');
        caixa.className = 'painel-bichos';
        for (const id of ids) caixa.appendChild(S.criarVisor({ tipo: 'bicho', id, anim: 'parado', margem: 0.04 }).canvas);
        li.appendChild(caixa);
      }
      lista.appendChild(li);
    });
    $('btn-proxima-moita').textContent = tudoFeito() ? 'Ver o final' : 'Entrar na próxima moita';
  }

  // Narração ao chegar no mapa (4.5)
  function narrarMapa() {
    if (!QBE.voz.ligada()) return;
    const total = MAPA.moitas.length, prox = proximaMoita();
    const fala = prox == null
      ? 'Mapa. Você completou todas as moitas! Aperte ENTER para ver o final.'
      : `Mapa. Você completou ${partida().feitas.length} de ${total} moitas. Aperte ENTER para entrar na moita ${prox + 1}.`;
    QBE.audio.tocarSequencia([{ fala }], { repetivel: true });
  }

  // ══ INTERFACE ════════════════════════════════════════════════
  let ligado = false;
  // reiniciar = partida nova ou Continuar: o sapo volta ao início e as
  // moitas às âncoras (a posição não é salva)
  function visitar({ reiniciar = false } = {}) {
    if (!ligado) { ligado = true; ligarPonteiro(); }
    if (reiniciar || !moitas.length) {
      sapo.x = MAPA.inicio.x; sapo.y = MAPA.inicio.y;
      montarMoitas();
    }
    zerarEmbalo();
    entrando = null; cam.zoom = 1;
    for (const m of moitas) { m.abrindoEm = null; m.estado = null; m.parada = false; }
    atualizarMoitas(0);
    atualizarHud();
    seguirCamera(0, true);
  }
  function quadro(dt) {
    fps += ((dt > 0 ? 1 / dt : 60) - fps) * 0.05;
    const bloqueado = (QBE.telas && QBE.telas.janelaAberta()) || entrando;
    let mexeu = false;
    if (!bloqueado) mexeu = moverSapo(dt);
    if (mexeu || arrasto) { sapo.andando = mexeu || sapo.andando; sapo.paradoHa = 0; }
    else { sapo.paradoHa += dt; if (sapo.paradoHa > 0.2) sapo.andando = false; }
    sapo.t += dt;
    atualizarMoitas(dt);
    const prox = proximaMoita();
    if (prox != null && moitas[prox]) soltarFolhinhas(moitas[prox], dt);
    atualizarFolhinhas(dt);
    for (const s of efeitos) s.atualizar(dt, { x: 0, y: 0, w: W, h: H });
    if (entrando) atualizarEntrada(dt); else seguirCamera(dt, false);
    desenhar();
    desenharMinimapa();
  }
  function redimensionar() { seguirCamera(0, true); miniFundo = null; }

  return {
    visitar, quadro, redimensionar, tecla, soltar, atualizarHud, narrarMapa, proximaMoita, tudoFeito, zerarEmbalo,
    // para os testes automáticos (QBE.teste) e o modo de conferência
    _interno: { sapo, moitas: () => moitas, naTrilha, moverNaTrilha, moverSapo, teclas, grade, cam, entrar, estadoDe },
  };
})();
