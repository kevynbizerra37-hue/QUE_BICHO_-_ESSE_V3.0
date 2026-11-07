'use strict';
// ═══════════════════════════════════════════════════════════════
//  INÍCIO E LAÇO ÚNICO
//  Um único requestAnimationFrame anima tudo, por tempo: dt em segundos,
//  limitado a 0,05 s (voltando de outra aba, nada dá um pulo enorme).
//  O laço para quando a aba fica oculta.
// ═══════════════════════════════════════════════════════════════
(() => {
  const S = QBE.sprite, T = QBE.telas;
  let antes = null, pedido = null;

  // Um quadro de tempo `dt` para a tela que está aberta
  function passo(dt) {
    S.avancar(dt);
    switch (T.atual()) {
      case 'abertura': QBE.abertura.quadro(dt); break;
      case 'mapa': QBE.mapa.quadro(dt); break;
      case 'etapa': QBE.etapas.quadro(dt); break;
      case 'celebracao': QBE.etapas.quadroCelebracao(dt); break;
      case 'final': T.quadroFinal(dt); break;
    }
    S.desenharVisores();
  }
  function quadro(agora) {
    pedido = null;
    const dt = antes == null ? 0 : Math.min(0.05, Math.max(0, (agora - antes) / 1000));
    antes = agora;
    try { passo(dt); } catch (e) { console.error(e); }
    if (!document.hidden) pedido = requestAnimationFrame(quadro);
  }
  function ligarLaco() { if (pedido == null && !document.hidden) { antes = null; pedido = requestAnimationFrame(quadro); } }
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (pedido != null) cancelAnimationFrame(pedido); pedido = null; } else ligarLaco(); });
  // Reenquadra na hora: com o sapo parado a câmera não andaria, e girar o
  // celular deixava o mapa torto até a criança mexer.
  addEventListener('resize', () => { if (T.atual() === 'mapa') QBE.mapa.redimensionar(); });

  function iniciar() {
    QBE.recursos.iniciar();
    QBE.abertura.iniciar();
    T.iniciar();
    T.mostrar('abertura');
    ligarLaco();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  // ── Gancho de teste ──────────────────────────────────────────
  // Para os testes automáticos levarem o sapo até uma moita e simularem a
  // taxa de quadros. Não muda nada no jogo de quem joga.
  QBE.teste = {
    passo,
    quadros(n, dt) { for (let i = 0; i < n; i++) passo(dt); },
    levarSapoAte(i) {
      const m = QBE.mapa._interno.moitas()[i], s = QBE.mapa._interno.sapo;
      s.x = m.x; s.y = m.y + 20;
    },
  };
})();
