# Prompt definitivo — Recriar o jogo "Que Bicho É Esse?" do zero (versão 3.0)

**Versão final · 02/11/2026 (rodada 5).** Reúne as cinco rodadas de ajustes:
- **Rodada 1:** mapa e fases animados por sprites, moitas que andam pelo mapa no lugar das cavernas, bichos que se mexem e 4 animais novos (gato, cachorro, mosquito e cascavel).
- **Rodada 2:** mapa novo, com as trilhas refeitas para ele; arte nova da abertura; identidade visual nova (pixel art e placas de madeira). O nome do jogo passa a ser só "Que Bicho É Esse?", como na arte.
- **Rodada 3:** abertura animada — a arara e o tucano pousados piscam e se mexem, o tatu passeia e se enrola, o sapo do tronco coaxa e pula, uma arara cruza o céu, folhas caem, vaga-lumes piscam e voam, o letreiro brilha e a água da cachoeira desce. Os efeitos (borboleta, folhas, vaga-lumes, brilho e luz) também animam o mapa e as etapas; o tatu ganha sprite no jogo inteiro; e o sapo do tronco vira o sapo do mapa até chegar o sapo andando.
- **Rodada 4:** fundos pintados para as telas das etapas, da celebração e do final, e para a abertura no celular em pé.
- **Rodada 5:** conferência com os arquivos do kit e com a 2.1 (seção 6.1). Pelos dados do kit: os brilhos da água passam a acender em pontos medidos sobre a água (as elipses caíam no mato), os brilhos do letreiro usam os 160 pontos da prévia, a malha de trilhas fica reproduzível (pontes e barraca com coordenadas), a placa "Apagar progresso" deixa de cobrir o pé do sapo do tronco e as primeiras animações da abertura vêm logo no começo, como na prévia. Pela 2.1: as coroas de uma moita só entram no placar na celebração, ENTER num botão com foco não entra na moita, foco no título ao trocar de tela e janelas que prendem o foco, texto para leitor de tela na sombra e no painel, sombra só para bicho com desenho de verdade e arrasto no celular sem rolar a página. E mais: limite de piscadas, teste de rolagem na janela real de um notebook e, no Claude Code, teste e commit a cada passo.

**O que ainda falta** (o jogo sai pronto para receber e usa reservas até lá): a moita, o sapo andando de lado, os sprites dos outros 12 bichos, a arte da abertura limpa de verdade (sem bichos, sem letreiro e sem botões) com o letreiro em PNG, e os sons de gato, cachorro, mosquito, cascavel e caranguejo.

**Como usar:** copie tudo a partir da linha `INÍCIO DO PROMPT` até `FIM DO PROMPT` e cole no Claude — de preferência no Claude Code, que cria os arquivos e testa no navegador — junto com o arquivo **kit-arquivos.zip** (ele junta e substitui os kits 1 e 2). No Claude Code, descompacte o kit dentro da pasta onde o jogo vai ser criado antes de colar o prompt. Quando novos sprites e sons ficarem prontos, anexe-os também, ou coloque-os nas pastas do Anexo D e ligue cada um (troca de `false` para `true`, ou de `null` para o caminho). Para ver a abertura animada antes de tudo, abra `ferramentas/previa-abertura.html`, que vem no kit.

**No Claude Code na web** (claude.ai/code), que trabalha dentro de um repositório do GitHub:
1. Crie no GitHub o repositório vazio `que-bicho-e-esse-3.0` e abra uma sessão do Claude Code nele.
2. Na primeira mensagem, anexe o `kit-arquivos.zip` e este arquivo e peça: "descompacte o kit na raiz do repositório, copie da 2.0 o que a seção 6 pede e siga o prompt". Na web não dá para descompactar à mão.
3. Se a sessão não alcançar o repositório da 2.0, ela cria as pastas vazias e diz no fim o que falta copiar (seção 6).
4. Ao terminar, ligue o GitHub Pages na `main` (Settings → Pages) e jogue a versão publicada.

---

`INÍCIO DO PROMPT`

## 1. Sua tarefa

Construa do zero, completa e sem erros, a **versão 3.0** do jogo educativo **Que Bicho É Esse?**. A versão 2.0 (chamada "Animal Quest — Que Bicho É Esse?") está em https://github.com/kevynbizerra37-hue/que-bicho-e-esse-2.0 e serve de referência de comportamento, mas todo o código será novo. Este documento é a especificação completa: onde ele e a 2.0 discordarem, vale este documento.

Junto com este prompt vai o pacote **kit-arquivos.zip**, com tudo o que já existe. Use os arquivos como estão, nos caminhos da seção 6:
- o mapa novo e a malha de trilhas feita para ele;
- a arte da abertura (com e sem os bichos que se mexem) e os sprites da cena animada (arara, tucano e sapo do tronco);
- o tatu, os efeitos (borboleta, folhas, vaga-lumes, brilho e luz) e os fundos pintados das telas;
- três imagens de referência e a prévia da abertura animada (`ferramentas/previa-abertura.html`), que é a referência visual da seção 5.8.

Entregue a pasta inteira do projeto (seção 6), com todos os arquivos completos, pronta para abrir com dois cliques no `index.html` e para publicar no GitHub Pages. Nada de "...", "resto igual", TODO ou função vazia.

Ainda faltam vários sprites e sons. O jogo precisa funcionar do começo ao fim sem eles, usando as reservas da seção 5.1, e passar a usar cada arquivo novo assim que ele for colocado na pasta e ligado com uma única troca nos arquivos de dados (`false` → `true` em `sprites.js`, `null` → caminho em `dados.js`).

Os arquivos e os números do kit já foram conferidos um a um (6.1). Use-os como estão, sem medir de novo, mas rode mesmo assim todos os testes da seção 9.

Algumas regras vêm da **2.1**, a correção da 2.0 que está no Pull Request https://github.com/kevynbizerra37-hue/que-bicho-e-esse-2.0/pull/16 (ainda não mesclado). Não precisa abrir: tudo o que vale dela já está escrito aqui.

## 2. O jogo em poucas linhas

- **Público:** crianças de 4 a 8 anos (foco na Educação Infantil, grupo EI03, 4 e 5 anos) que ainda não leem, incluindo crianças cegas ou com baixa visão. Um educador prepara o jogo e passa a vez entre as crianças. Uso em sala (aula de 20 minutos), laboratório, projetor e celular.
- **Objetivo pedagógico:** reconhecer animais pelo som, pela forma, pelas características e por charadas, e associar cada um ao lugar onde vive. BNCC Computação: EI03CO01 (padrões de repetição em sons e movimentos), EI03CO02 (etapas de uma tarefa em ordem) e EI03CO06 (decisões de dois estados, verdadeiro ou falso).
- **Partida:** o sapo explorador anda pelas trilhas de terra de um mapa da fauna brasileira até 6 moitas que se mexem. Cada moita esconde 3 bichos, um por etapa (som → sombra ou característica → charada). Vencidas as três, a moita se abre numa celebração e libera a próxima. Com as 6 concluídas, a árvore sagrada do centro encerra a expedição.
- **Proibido:** cadastro, login, coleta de qualquer dado da criança, servidor, banco de dados, ranking entre crianças, anúncios e links externos.

## 3. Regras técnicas (valem para todo arquivo)

1. HTML, CSS e JavaScript puros. Sem biblioteca, framework, CDN, npm ou etapa de build. Nenhuma conexão com a internet durante o jogo.
2. Tem que rodar abrindo o `index.html` direto do disco (`file://`) no Chrome, no Edge e no Firefox atuais, e também no GitHub Pages. Por causa do `file://`:
   - nada de `fetch()`, `XMLHttpRequest` ou arquivos `.json`: todos os dados ficam em arquivos `.js` carregados com `<script src>` comum, na ordem da seção 6;
   - nada de `type="module"`, `import`/`export` ou Web Workers;
   - nunca ler pixels de imagem carregada do disco (`getImageData`/`toDataURL` dão erro de segurança no `file://`). Desenhar, recortar, espelhar e pintar silhueta pode.
3. `'use strict'` em todo arquivo. Uma única global de código, `QBE`, onde cada arquivo pendura o seu módulo. Os dados ficam em `CONFIG`, `ANIMAIS`, `PERGUNTAS`, `MAPA`, `SPRITES` e `TRILHAS`.
4. Eventos ligados com `addEventListener` no JavaScript — nada de `onclick="..."` no HTML (assim um nome errado aparece na carga, e não só quando a criança clica).
5. Um único laço `requestAnimationFrame` anima tudo. Todo movimento é por tempo: `dt` em segundos, velocidades em px/s, `dt` limitado a 0,05 s. O jogo tem que andar igual num monitor de 60 Hz e num de 144 Hz (a 2.0 andava por quadro e corria mais nos monitores rápidos). O laço para quando a aba fica oculta.
6. Canvas nítido: tamanho interno = tamanho na tela × `devicePixelRatio` (no máximo 2).
7. Todo acesso ao `localStorage` dentro de `try/catch`; em janela anônima o jogo funciona, só não guarda.
8. Nomes de arquivo e ids sempre em minúsculas, sem acento e sem espaço. O GitHub Pages diferencia `Gato.png` de `gato.png` e o Windows não: o erro só aparece depois de publicar.
9. Textos nos dados em capitalização normal. Caixa alta só por CSS (`text-transform`), porque leitores de tela soletram palavras escritas em maiúsculas.
10. Comentários em português simples, explicando o porquê de cada decisão, como na 2.0. Fonte Fredoka local em `assets/fonts` (licença OFL).
11. Console limpo: nenhum erro de JavaScript em nenhum caminho do jogo. Arquivo ligado que não abrir gera um único `console.warn` com o caminho e a reserva usada.
12. Não acrescente nada que não esteja aqui. Ficam fora desta versão: pontuação de 0 a 100, vídeos de Libras (só o espaço deles), etapa do bioma, painel do professor e ranking.
13. **Pixel art nítida:** a arte nova é pixel art. Ao ampliar um desenho 2× ou mais, desenhe sem suavização (`imageSmoothingEnabled = false` no canvas; `image-rendering: pixelated` no HTML); ao reduzir ou ampliar pouco, com suavização. Assim nada borra ao crescer nem cintila ao diminuir. **Exceção:** os fundos pintados das telas (`pintado: true` no manifesto) não são pixel art e vão sempre com suavização.
14. **Nada pisca rápido:** nenhum efeito pisca mais de 3 vezes por segundo nem acende a tela inteira (WCAG 2.3.1), porque entre as crianças pode haver quem tenha epilepsia fotossensível. O que pisca de propósito (o selo ❓, a moita liberada no minimapa) vai no máximo a 2 vezes por segundo.

## 4. O que continua igual à 2.0

### 4.1 Telas e fluxo
Abertura → Mapa → Etapa 1 (som) → Etapa 2 (sombra **ou** característica) → Etapa 3 (charada) → Celebração → Mapa → … → Final. Configurações, Ajuda e Confirmação são janelas por cima. Toda etapa tem **← Voltar**: volta ao mapa, e a moita continua não concluída e recomeça da etapa 1.

- **Abertura:** arte nova e animada (5.8), com os botões **▶ Jogar**, **↩ Continuar** e **🗑 Apagar progresso** — os dois últimos só aparecem quando existe progresso.
- **Jogar** com progresso salvo abre a confirmação "Começar do zero?", que diz exatamente o que se perde ("as 2 moitas que você já fez e as 150 coroas"). **Apagar progresso** abre "Apagar o progresso?".
- **Confirmação:** o botão que preserva vem primeiro e já com o foco; TAB alterna só entre os dois botões; ESC vale "não"; ao fechar, o foco volta para quem abriu; tudo narrado.
- **Mapa:** placar de coroas (👑), selo "🌿 Fauna Brasileira", 💡 ajuda, ⚙️ configurações, minimapa e painel "Moitas" (1 a 6: pendente mostra só o número; concluída mostra os 3 bichos). Os bichos do painel são `aria-hidden`, então cada item tem texto para o leitor de tela: "Moita 2: concluída — arara, onça e tatu", "Moita 3: liberada", "Moita 4: bloqueada".
- **Ajuda:** como andar, como entrar na moita, a árvore (o total de moitas vem do mapa, nunca escrito à mão), "cada partida sorteia outros animais" e os atalhos de quem joga pelo som.
- **Configurações:** narração em voz alta (desabilitada, com aviso, se não houver voz em português), velocidade da voz (Devagar 0,7 · Normal 0,9 · Rápido 1,1), sons dos animais liga/desliga e botão "Repetir narração (R)".
- **Final:** "🏆 Você conseguiu!", total de coroas da partida (mostrado antes de zerar) e **🎲 Jogar de novo**, que sorteia outros animais.

### 4.2 Sorteio da partida
- Cada uma das 6 moitas recebe 3 animais **diferentes entre si**, um por etapa, tirados de um baralho com o catálogo inteiro embaralhado (quando acaba, embaralha de novo). Isso espalha as aparições por igual.
- O 1º animal de cada moita é o da etapa do som e precisa ter som funcionando (5.6). Se algum dos 3 tiver som, ele passa para a 1ª posição; se nenhum tiver, troque o 1º por um animal com som que ainda não esteja nessa moita.
- Se a composição sair idêntica à da partida anterior, sorteie de novo (até 10 tentativas).
- Cada moita sorteia a variante da etapa 2, `'sombra'` ou `'traco'` (50% cada). Com a narração ligada é sempre `'traco'`, porque a silhueta não é jogável sem enxergar. Também é sempre `'traco'` quando o bicho da etapa não tem desenho de verdade (sprite ou ilustração que abriu): a sombra de um emoji muda de um sistema para outro e às vezes é só uma cara (🐱, 🐶). Com o kit atual, isso vale para caranguejo, gato, cachorro, mosquito e cascavel. É a regra da 2.1.
- As moitas abrem em sequência: a 1ª começa liberada e cada uma só abre depois da anterior.

### 4.3 Etapas e pontuação

| Etapa | Desafio | Acerto de primeira | Acerto depois de errar |
|---|---|---|---|
| 1 · Som | ouvir o som gravado (com a onomatopeia escrita) e escolher | 25 | 13 |
| 2a · Sombra | silhueta preta do bicho | 20 | 10 |
| 2b · Característica | pergunta como "Qual destes animais voa?" | 20 | 10 |
| 3 · Charada | o bicho se descreve em 1ª pessoa: "Quem sou eu?" | 30 | 15 |
| Moita concluída | bônus | 30 | — |

Máximo da partida: 6 × (25 + 20 + 30 + 30) = **630 coroas**.

- **Erro** não tira coroas nem encerra a etapa: marca que errou (o acerto passa a valer a metade, arredondada), pinta a carta de vermelho, faz a célula tremer 0,6 s, mostra "Tente novamente! 🤔" numa faixa de aviso (`role="status"`) e narra "Não é o tatu. Tente de novo. Aperte R para ouvir a pergunta."
- **Acerto** trava todas as opções até a próxima etapa (um segundo clique não soma de novo), pinta a carta de verde, mostra a mensagem da etapa com as coroas ganhas ("Correto! 🎉 +25 👑", "Incrível! 🌟 +20 👑", "Isso mesmo! 🌟 +20 👑", "Você acertou a charada! 🧩 +30 👑"; depois de errar, a metade), faz a revelação (5.4) e avança: com narração, depois de falar "Acertou! Era a arara." (com prazo de segurança de 6 s); sem narração, depois de 1,4 s. Antes de avançar, confira se a criança ainda está na mesma etapa (um contador que muda a cada troca de tela), para não empurrar quem voltou ao mapa.
- **Coroas só no fim da moita:** as coroas de cada etapa ficam guardadas na moita e só entram no placar (e no salvo) na celebração. Quem volta ao mapa no meio perde as coroas daquela moita, que recomeça do zero. Somadas na hora do acerto, dava para ganhar as mesmas coroas várias vezes, saindo e entrando de novo na mesma moita: foi o que a 2.1 corrigiu na 2.0.
- **Celebração:** marca a moita como concluída **antes** de somar as coroas dela (as das etapas + 30 de bônus), grava, mostra os 3 bichos (animação, nome e onomatopeia) com a curiosidade de cada um, o selo com o total que a moita rendeu ("⭐ +‹coroas› coroas! ⭐" e, embaixo, "30 de bônus"; numa moita toda de primeira, +105) e o botão "Próxima moita ▶" — na última, "🏆 Ver o final!".
- **Árvore sagrada:** bloqueada até as 6 moitas; depois brilha no mapa e no minimapa. A menos de 140 px, E/ENTER ou clique abre o final.

### 4.4 As quatro opções
- Sempre 4 cartas: o animal da etapa e 3 distratores, em ordem embaralhada. Os distratores vêm do **catálogo inteiro**, não só dos animais da partida, para não dar para acertar por eliminação.
- **Etapa do som:** as 4 cartas precisam ter som funcionando (quando houver pelo menos 4 assim no catálogo). Cada carta tem ao lado um botão 🔊 próprio que toca aquele bicho sem responder. Ele é irmão do botão da carta, nunca um botão dentro de outro.
- **Característica:** sorteie a pergunta entre as que o animal da etapa responde `true` e que tenham pelo menos 3 candidatos a distrator com `false`. Distratores só entre os `false`. Traço `null` quer dizer "depende": aquele bicho nunca é resposta nem distrator daquela pergunta. Se nenhuma pergunta servir, a etapa vira sombra.
- **Sombra e charada:** os bichos listados em `parecidos` do animal da etapa não entram como distratores (a relação vale nos dois sentidos). É o que impede, por exemplo, que gato e onça apareçam juntos numa charada sobre bigodes.
- Faltou candidato: abra mão primeiro da exigência de som, depois de `parecidos` — nunca do filtro de traço.
- **Charada:** sorteada entre as do animal, sem repetir a última usada para ele na sessão. Com uma só, usa ela; sem nenhuma, "Quem sou eu?".
- Na etapa da sombra, cada carta tem o fundo com a `cor` do seu animal.

### 4.5 Áudio e narração
- **Canal único:** voz, som do bicho e bipes de reserva passam por uma única fila. Só um item toca por vez; um item novo interrompe o anterior; dentro de uma sequência, cada item só começa quando o anterior **termina de verdade** (eventos `ended`/`onend`), nunca por tempo estimado. Cada sequência recebe um número; avisos atrasados de uma sequência antiga são ignorados.
- Itens da fila: `{fala}`, `{som, elemento}`, `{espera: ms}` e `{acao: função}`. A sequência de cada etapa fica guardada para o **repetir** (tecla R ou botão 🔁, que só aparece nas etapas com a narração ligada).
- **Som do bicho:** toca no máximo 8 s; aí o volume desce em cerca de 0,4 s e o som para. Se o arquivo falhar ou o navegador recusar o `play()`, toca a assinatura de reserva (bipes da Web Audio API com as frequências do campo `tom`, cerca de 1 s) — **mas não** quando o som foi parado de propósito (o `pause()` faz o `play()` pendente falhar com `AbortError`). Com os sons desligados nas configurações, o som é pulado.
- O que está tocando ganha destaque visual: na 3.0, a moita da etapa balança enquanto o som do bicho toca.
- **Narração (Web Speech API):** voz `pt-BR`; se não houver, qualquer `pt`; se não houver nenhuma, narração desabilitada com aviso. As vozes chegam depois da carga (`voiceschanged`). `lang='pt-BR'`, `rate` = velocidade, `pitch` = 1,05. Guarde uma referência à fala até ela terminar (o Chrome descarta falas sem referência e o `onend` nunca chega) e use um vigia de 4 s + 110 ms por caractere ÷ velocidade, para a fila nunca travar.
- Com a narração desligada, narrar não faz nada — nem silencia o canal (na 2.0 isso cortava o som do bicho).
- O que a narração diz:
  - Etapa 1: espera 0,4 s → "Moita 2 de 6, etapa 1 de 3. Fase do som. O som deste animal é: Aráááá! Aráááá! Agora escute o bicho." → som do bicho → "Aperte o número da resposta. 1, Onça. 2, Arara. 3, Tatu. 4, Capivara." → foco na 1ª carta.
  - Etapa 2, sombra: "… Fase da sombra. A sombra é assim: ‹audiodescrição›. Que bicho é esse?" → opções → foco. Característica: "… ‹pergunta›" → opções → foco. Etapa 3: "… Fase da charada. ‹charada›" → opções → foco.
  - Celebração: "Parabéns! Você descobriu 3 animais e ganhou ‹coroas› coroas. ‹nome›. ‹curiosidade›" (dos três) → "Aperte ENTER para voltar ao mapa" (ou "para ver o final") → foco no botão.
  - Mapa: "Mapa. Você completou 2 de 6 moitas. Aperte ENTER para entrar na moita 3." / "Mapa. Você completou todas as moitas! Aperte ENTER para ver o final."
  - Ao ligar: "Narração ligada. Aperte o número da resposta para escolher, R para repetir a pergunta, e S para ouvir o bicho de novo."
  - Foco do teclado numa carta: "Opção 2 de 4: Onça". Foco no 🔊: "Ouvir o som de Onça. Aperte ENTER." Foco posto pelo próprio jogo não fala.
- Trocar de tela silencia o canal; por isso cada etapa monta a própria tela **antes** de começar o áudio.
- Política de autoplay: áudio e voz só depois do primeiro gesto; retome o `AudioContext` no primeiro clique ou tecla.

### 4.6 Teclado, toque e foco
- **Mapa:** setas ou WASD andam. E ou ENTER entram na moita liberada a menos de 110 px, ou abrem o final perto da árvore liberada. Com a narração ligada, ENTER em qualquer lugar do mapa entra na próxima moita (ou abre o final), porque quem não enxerga não tem como levar o sapo até lá. E/ENTER com o foco num botão visível por cima do mapa (💡, ⚙️, o botão para leitores de tela) é do botão: não entra na moita ao mesmo tempo. Confira se o botão está na tela (`getClientRects().length`): voltando da celebração, o foco pode ter ficado num botão da tela que sumiu, e aí o ENTER continua valendo no mapa.
- **Etapas:** 1 a 4 escolhem, na ordem anunciada; S toca de novo o som (etapa 1); R repete (qualquer tela, com narração); setas percorrem as cartas em ciclo e TAB continua normal; ENTER e ESPAÇO escolhem.
- ESC fecha ajuda e configurações e para a fala; na confirmação, ESC é "não".
- Com qualquer janela aberta, o sapo não anda e nenhuma moita abre.
- Guarde as teclas em minúsculas (apertar A e soltar com Shift chegava como "A" e o sapo andava sozinho para sempre) e limpe todas quando a janela perder o foco. Zere também as teclas e a velocidade do sapo ao entrar na moita e ao voltar ao mapa (na 2.0 ele voltava deslizando com o embalo de antes).
- **Celular:** arrastar o dedo move o sapo (0,45 × o deslocamento do dedo, pela mesma regra da trilha); o aviso da moita diz "▶ Toque aqui" quando a tela não tem mouse (`(hover: none)`) ou depois do primeiro toque; tocar na moita liberada entra. O canvas do mapa tem `touch-action: none` (senão o arrasto rola ou amplia a página), o menu de contexto fica bloqueado (o toque longo abria o menu do navegador) e não há seleção de texto (`user-select: none`).
- **Foco ao trocar de tela:** com a narração do jogo desligada, o foco vai para o título da tela nova (`<h1 tabindex="-1">`, sem contorno), para o leitor de tela (NVDA, TalkBack) anunciar onde a criança está. Com a narração ligada, quem cuida do foco é ela (1ª carta, botão da celebração).
- **Ajuda e configurações** são janelas de verdade (`role="dialog"`, `aria-modal="true"`, com título): ao abrir, o foco entra nelas; TAB e Shift+TAB dão a volta dentro; ao fechar (✕, ESC ou o mesmo botão), o foco volta para quem abriu.
- Tudo que se aciona é `<button>` de verdade, com `aria-label`; foco visível (contorno amarelo grosso).

### 4.7 Progresso salvo
Prefixo **`qbe3_`**: todos os repositórios do GitHub Pages da conta dividem o mesmo endereço (`kevynbizerra37-hue.github.io`) e, portanto, o mesmo `localStorage`. A 2.0 usa `aq_`, e uma versão não pode apagar o progresso da outra.

| Chave | Conteúdo | Validação na leitura |
|---|---|---|
| `qbe3_versao` | `1` | outro valor → descarta o progresso (não as preferências) |
| `qbe3_pontos` | inteiro | não numérico → 0 |
| `qbe3_feitas` | índices das moitas concluídas | sem repetidos e só índices que existem |
| `qbe3_sorteio` | 6 listas de 3 ids | uma lista por moita, 3 ids distintos e todos no catálogo; senão, sorteia de novo e zera as feitas |
| `qbe3_variantes` | 6 × `'sombra'`/`'traco'` | inválido → sorteia só as variantes, sem apagar as feitas |
| `qbe3_voz` | `{ligada, velocidade}` | velocidade só se for número |
| `qbe3_mudo` | `true`/`false` | outro valor → padrão |

Grava a cada moita concluída (é ali que as coroas entram, 4.3), ao sortear uma partida nova e ao trocar as preferências. **Apagar progresso** apaga só o progresso: a narração, a velocidade da voz e os sons continuam como estavam. A posição do sapo e das moitas não é salva: ao continuar, o sapo volta ao início e as moitas às âncoras.

### 4.8 Tamanhos de tela
Notebook 1366×768, projetor 1280×720, Full HD, tablet 768×1024 e celular 360×640 (em pé e deitado). O mapa é ampliado até cobrir a tela inteira (escala = maior valor entre 1, larguraTela ÷ larguraMapa e alturaTela ÷ alturaMapa). A câmera segue o sapo suavemente (fator `1 − 0,82^(dt×60)` por quadro), presa às bordas do mapa, e se reenquadra na hora ao redimensionar ou girar o aparelho.

### 4.9 Movimento do sapo (mesma sensação da 2.0, agora por tempo)
- Velocidade máxima 130 px/s; aceleração 900 px/s²; no eixo sem tecla, a velocidade é multiplicada por `0,78^(dt×60)`; abaixo de 3 px/s vira zero.
- O sapo só pisa na trilha (malha de `js/trilhas.js`, células de 8 × 8 px; o ponto que conta é o **pé**). O deslocamento é feito de pixel em pixel, cada eixo testado separado, para escorregar rente à beirada em vez de travar.
- **Ajuda nas curvas:** se um eixo travou e a criança segura uma direção só, procure a continuação da trilha 4 px à frente, de 2 em 2 px, até 28 px para cada lado, e leve o sapo 1 px para lá a cada quadro.
- Fora da trilha (mapa trocado, jogo antigo), anda livre até voltar a ela. Sem a malha, anda por todo o mapa. Limites: 40 px das laterais, 80 px do topo e 40 px da base.
- Animações: `parado` e `andando` (5.1 e Anexo C).

## 5. O que muda na 3.0

### 5.1 Sistema de sprites (a base de tudo)
- O manifesto `js/sprites.js` (Anexo C) diz onde está cada animação. Aceite os dois formatos: **folha** (uma imagem com os quadros do mesmo tamanho em grade, lidos da esquerda para a direita, linha por linha) ou **lista** de quadros em arquivos separados (`arquivos: [...]`). Os quadros podem ter qualquer tamanho (no kit vão de 96×97 a 339×147), mas numa mesma folha são todos iguais.
- **Ordem dos quadros (`sequencia`, opcional):** a lista dos quadros na ordem em que aparecem; repetir um número segura aquele quadro (`[0,0,0,0,1,0]` = parado, piscando de vez em quando). O `fps` vale para cada posição da lista. Sem `sequencia`, os quadros vão em ordem.
- **Âncora:** o ponto do quadro que fica na posição (x, y) — o pé, para quem anda; o meio do corpo, para quem voa.
- **Para onde olha (`olhaPara`, opcional):** `'direita'` (padrão) ou `'esquerda'`. O jogo espelha conforme o lado para onde o bicho anda.
- Um relógio único. Uma função `desenharSprite(ctx, definição, tempo, x, y, {escala, espelhar, silhueta, alfa, giro})` desenha o quadro certo com a âncora no ponto (x, y), seguindo a regra de nitidez (seção 3, item 13).
- Um componente **VisorDeSprite**: um `<canvas>` pequeno que mostra um bicho, a moita ou outro sprite numa das animações (`parado`, `andando`, `festa`). É ele que aparece nas cartas, na moita das etapas, na sombra, na celebração, no painel e no final. Sempre com `aria-hidden="true"`.
- **Pré-carga:** na abertura, carregue primeiro a arte e os sprites da abertura (a cena começa assim que eles chegam) e depois todo o resto que estiver ligado, com a barra "Preparando a floresta… 40%". O JOGAR libera quando terminar, ou depois de 8 s com o que carregou.
- Se as medidas da imagem não baterem com as do manifesto, avise uma vez no console e use o que der.
- **Reservas (o jogo nunca mostra ícone de imagem quebrada):**
  - **Bicho:** sprite → ilustração estática (`imagem`, PNG 512×512) → emoji. Ilustração e emoji ganham movimento por código: `parado` respira (altura ±3%, 1,2 Hz); `andando` quica (3 px, 3 Hz) e inclina ±4°; `festa` pula (20 px, 2 Hz). Um `parado` de 1 quadro só (como o do tatu) também respira.
  - **Moita:** sprite → moita desenhada por código (5 a 7 círculos em três tons de verde, contorno escuro e brilho). `parada` balança ±2°; `balancando` balança ±7° e solta folhinhas; `abrindo` afasta os círculos e some em 0,5 s.
  - **Fundo do mapa:** sprite do fundo (o mapa novo do kit, já ligado) → mapa desenhado por código (verde, com as células da malha de trilhas em cor de terra). O mapa da 2.0 não serve mais de reserva: as trilhas do mapa novo são outras.
  - **Sapo:** sapo novo andando de lado (quando chegar) → **sapo do tronco** da abertura (kit, já ligado em `SPRITES.sapo.tronco`): parado, a animação dele (pisca, sorri e coaxa); andando, o 1º quadro dela dando pulinhos por código (8 px de altura, 3 por segundo) → folha da 2.0, com 4 direções → 🐸 com o mesmo quique. O sapo de lado olha para a direita: andando para a esquerda, o jogo espelha; para cima ou para baixo, mantém o último lado. Na folha da 2.0, parado mostra o 1º quadro da última direção.
  - **Efeitos** (borboleta, folhas, vaga-lumes, brilho e luz): sprite do kit → formas simples por código (asas de elipse batendo, folha oval girando, círculo com halo amarelo, estrela de 4 pontas, bolinha dourada com rastro de pontinhos).
  - **Abertura:** cena animada (5.8) → arte original parada → modo montado.
  - **Fundos das telas:** fundo pintado da tela (kit, 5.5) → camadas da floresta (opcionais) → degradê próprio de cada tela + folhas caindo.
  - **Árvore:** sprite → 🌳 grande, com anel de brilho quando liberada.
- **Silhueta:** sempre o mesmo visual do bicho pintado de preto (no canvas: desenha e pinta com `globalCompositeOperation = 'source-in'`; no emoji: `filter: brightness(0)`). Por isso as imagens precisam de fundo transparente. A etapa da sombra só sorteia bicho com sprite ou ilustração (4.2): o emoji pintado de preto fica como reserva, para quando o desenho falhar depois que a etapa já foi escolhida.
- **Movimento reduzido** (`prefers-reduced-motion`): moitas e bichos não passeiam, nada treme nem desliza, os fundos ficam parados no meio, a abertura fica parada (a arte original), as animações de quadro rodam na metade do fps e o confete é discreto (um quarto dos pedacinhos, caindo devagar).

### 5.2 Mapa animado
- O mapa passa a ser desenhado num `<canvas>` do tamanho da tela; placar, botões, minimapa e painel continuam em HTML por cima.
- Camadas, de baixo para cima:
  1. **fundo** — o mapa novo (pode virar folha com vários quadros);
  2. **cenário animado:** a lista `SPRITES.mapa.cenario`, cada item com x e y no mapa. Os exemplos do Anexo C já trazem as posições das cachoeiras, da ponte do meio, da barraca e da caverna do mapa novo;
  3. **efeitos**, que já deixam o mapa vivo enquanto o cenário não chega (sprites de `SPRITES.efeitos`, com a reserva por código; quantidades e alturas em `CONFIG.efeitos`): brilhos (`brilho`) acendendo em pontos sorteados da lista `MAPA.brilhosAgua` (66 pontos medidos sobre a água do fundo do kit, longe da margem; as elipses da rodada 4 cobriam pouca água — no trecho de baixo do rio, só 38% da área — e o brilho acendia no mato); 5 borboletas em trajetos suaves; 6 vaga-lumes piscando perto da mata e da água, derivando devagar; e a sombra de uma nuvem atravessando devagar (por código). Cada efeito liga e desliga em `CONFIG.efeitos`;
  4. **personagens** em ordem de y (quem está mais abaixo fica na frente): moitas, bichos descobertos, árvore e sapo;
  5. **avisos** ("▶ Aperte E" / "▶ Toque aqui") e selos.
- Coordenadas sempre em pixels do desenho do mapa (`MAPA.largura` × `MAPA.altura`). Fundo de outro tamanho é escalado na mesma proporção, como a malha de trilhas.
- **Minimapa:** miniatura do fundo, moitas na posição **atual** (concluída verde, liberada amarela piscando, bloqueada cinza), árvore (amarela quando liberada), sapo branco e o retângulo da área visível.
- **Modo de conferência** (tecla F9, ou `?conferir=1` no endereço): desenha a malha de trilhas, as âncoras e os raios das moitas, o FPS e a lista de arquivos faltando. Desligado por padrão.

### 5.3 Moitas que andam (no lugar das cavernas)
- São 6, com as âncoras de `MAPA.moitas` (Anexo B), já conferidas sobre a malha do kit. Ao carregar, encaixe cada âncora na célula de trilha mais próxima (até 120 px); se não houver, a moita fica parada e o modo de conferência avisa.
- **Estados:**
  - **bloqueada** — parada na âncora, apagada (pouca saturação), selo 🔒, balanço bem leve;
  - **liberada** — só uma de cada vez, a próxima da sequência: passeia pela trilha e balança, selo ❓ pulsando, folhinhas caindo (`efeitos.folhas`);
  - **concluída** — parada na âncora, selo ⭐, e os 3 bichos dela passeiam em volta (5.4).
- **Passeio da moita liberada:** escolhe um ponto aleatório **sobre a trilha**, a até 90 px da âncora e dentro da margem do mapa (80 px nas laterais, 140 px em cima e 110 px embaixo, para não ficar atrás do placar ou do minimapa). Anda até ele a 30 px/s — o sapo anda a 130 px/s, então a criança alcança fácil —, testando a trilha a cada passo; se travar, escolhe outro ponto; ao chegar, pausa de 1,5 a 3 s.
- Quando o sapo chega a menos de 130 px, a moita **para** e balança mais forte (parece que tem um bicho lá dentro). A menos de 110 px aparece o aviso. Ela volta a passear 1 s depois que o sapo se afasta além de 170 px.
- **Nada revela o bicho antes da etapa:** sem silhueta, sem olhos, sem som do animal na moita.
- **Entrar:** E/ENTER a menos de 110 px, ou clique/toque na moita liberada de qualquer distância (a área de clique acompanha a moita e tem 1,5× o tamanho dela; com o mouse em cima, ela para). Ao entrar, a câmera aproxima em 300 ms, a moita faz `abrindo` e a etapa 1 aparece. Com movimento reduzido, vai direto.
- Na tela do mapa há um botão só para leitores de tela (classe `sr-only`): "Entrar na próxima moita" (ou "Ver o final", com as 6 concluídas).
- Tudo o que dizia "caverna" passa a dizer "moita": narração, ajuda, painel, confirmações e final ("Você descobriu todos os animais das moitas!", "Jogue de novo: as moitas vão esconder outros animais!").

### 5.4 Bichos que se mexem
- Cada bicho tem até 3 animações: `parado` e `andando` (as principais) e `festa` (opcional — sem ela, usa `parado` com o pulo por código). Os desenhos olham para a **direita** (as 8 ilustrações da 2.0 já são assim; quem olhar para a esquerda diz isso com `olhaPara`); o jogo espelha quando o bicho anda para a esquerda.
- **Tamanho:** o bicho cabe, sem distorcer, num quadrado — 64 px no mapa (× `escalaMapa`), o tamanho da carta nas cartas. As animações de um bicho podem ter quadros de tamanhos diferentes (o tatu do kit tem 339×147 andando e 328×169 na festa): calcule **uma escala só por bicho**, a que faz o maior quadro entre as animações dele caber no quadrado, e use-a em todas, para ele não crescer nem encolher ao trocar de animação. A âncora de cada animação mantém o pé no mesmo lugar.
- **O tatu já chegou** (kit): `parado` (1 quadro, respira por código), `andando` (8 quadros) e `festa` (enrola, segura e desenrola, 3,6 s). É o primeiro bicho com sprite; os outros 12 seguem nas reservas até chegarem.
- Bichos que voam (`tracos.voa === true`) flutuam: sobem e descem 6 px a 1 Hz, com uma sombrinha oval no chão.
- **No mapa:** concluída a moita, os 3 bichos dela passeiam a até 70 px dela, a 40 px/s (pela trilha; os voadores podem sair dela), alternando `andando` e `parado` e virando para o lado em que andam. Altura no mapa: 64 px (ajustável por bicho com `escalaMapa`).
- **Nas cartas:** o bicho em `parado`; com foco ou mouse em cima, `andando`; ao acertar, `festa`.
- **Revelação ao acertar:** a moita da etapa faz `abrindo` e o bicho certo pula para fora num arco de 0,8 s, faz `festa` e mostra o nome embaixo. Na sombra, a silhueta ganha cor em 0,6 s.
- **Celebração:** a moita se abre e os 3 bichos saem um a um (0,25 s entre eles) e ficam lado a lado fazendo `festa`.

### 5.5 Fases com visual novo
- **Fundos das telas (kit):** cada tela tem o seu fundo pintado, em `SPRITES.fases`. Ele cobre a tela inteira sem distorcer (como `background-size: cover`). Os fundos largos (`panorama`) vão e voltam devagar: levam `panorama` segundos para ir de uma ponta à outra, começam pelo meio e freiam nas pontas (posição = (1 − cos(π·t ÷ panorama)) ÷ 2 do percurso, com t contado a partir de meio percurso). Os outros ficam parados e centrados. São pinturas, não pixel art: sempre com suavização (`pintado: true`).

| Tela | Fundo (`assets/sprites/fases/`) | Movimento | Efeitos por cima (`CONFIG.efeitos.telas`) |
|---|---|---|---|
| Etapa 1 · Som | `som.jpg` — moldura verde da selva | desliza | 6 folhas caindo |
| Etapa 2a · Sombra | `sombra.jpg` — floresta à noite, com vaga-lumes e cogumelos que brilham | desliza | 8 vaga-lumes |
| Etapa 2b · Característica | `caracteristica.jpg` — painel verde-azulado com cipós | parado | 6 folhas caindo |
| Etapa 3 · Charada | `charada.jpg` — toca de terra com cipós | parado | 4 folhas e 2 vaga-lumes |
| Celebração | `celebracao.jpg` — noite com estrelas e confete | desliza | confete caindo e 6 estrelas acendendo |
| Final | `final.jpg` — Pantanal ao pôr do sol | desliza | 6 vaga-lumes e 4 estrelas |
| Abertura no modo montado | `abertura-montada.jpg` — Cerrado de dia | desliza | os da seção 5.8 |

- **Por que cada um:** a cor de cada fundo acompanha a do desafio na arte da abertura — verde no som, noite roxo-azulada na sombra, terra alaranjada na charada —, e a criança reconhece a etapa pelo cenário. Para trocar, basta mudar o arquivo da tela em `SPRITES.fases` (`referencias/fundos-das-telas.png` mostra todos).
- **Camadas das telas:** cada etapa, a celebração e o final têm um canvas de fundo (atrás do conteúdo, `aria-hidden`, sem receber clique), com o fundo e os efeitos da tabela, e um canvas da frente, também sem receber clique, para a luz e as estrelinhas do acerto. Os dois são desenhados pelo laço único. Folhas = `efeitos.folhas` (32 px); vaga-lumes = `efeitos.vagalumePiscando` (30 px), em pontos sorteados, derivando devagar; estrelas = `efeitos.brilho` (40 px) acendendo em pontos sorteados da metade de cima; confete = 60 pedacinhos por código, nas cores do jogo, caindo e girando.
- Sem o fundo da tela (desligado ou sem abrir): as camadas da floresta (`SPRITES.fases.floresta`, opcionais) — faixas largas que se repetem na horizontal e deslizam devagar, cada uma numa velocidade —; sem elas, o degradê da tela.
- Títulos e subtítulos das etapas, como na 2.0: "🔊 Que bicho é esse?" / "Escute o som e escolha!"; "👁️ Sombra misteriosa" / "Olhe a sombra e descubra!"; "🔎 Como é este bicho?" / "Pense bem e escolha o animal certo!"; "🧩 Charada dos animais" / "Leia com atenção e adivinhe!"; celebração "Parabéns! 🎉" / "Você descobriu 3 animais!".
- **Etapa 1 · Som:** uma moita grande no centro, que é o botão de ouvir de novo (`aria-label` "Ouvir o bicho de novo", selo 🔊) e balança enquanto o som toca; a onomatopeia aparece num balão saindo da moita; ao lado, a área de Libras compacta (vídeo, se `libras` existir; senão, o selo "🤟 Libras em breve").
- **Etapa 2a · Sombra:** um palco com um facho de luz e a silhueta animada andando de um lado para o outro dentro dele. A silhueta é `aria-hidden`; para quem usa leitor de tela sem a narração do jogo, um parágrafo `sr-only` diz "A sombra é assim: ‹audiodescrição›".
- **Etapa 2b · Característica:** ícone grande da pergunta e o texto com a palavra-chave em destaque. No dado ela vem entre asteriscos (`'Qual destes animais tem *penas*?'`); a tela mostra a palavra em negrito e caixa alta (por CSS) e a narração lê sem os asteriscos.
- **Etapa 3 · Charada:** a moita "fala": a charada aparece num balão saindo dela, que balança enquanto a voz lê.
- No topo de toda etapa: "Moita 2 de 6" e 3 folhinhas — as já vencidas douradas, a atual acesa e as próximas apagadas.
- **Luz do acerto:** uma luz (`efeitos.luzRastro`, 64 px) sai da carta certa e sobe em arco até a folhinha da etapa (0,7 s); quando ela chega, a folhinha fica dourada. Sem o sprite: bolinha dourada com rastro de pontinhos. Com movimento reduzido, a folhinha só fica dourada.
- **Sem rolagem:** título, desafio e as 4 cartas cabem inteiros em 1366×768, 1366×650, 1280×720, 1920×1080, 768×1024 e 360×640 (na 2.0 as opções ficavam abaixo da dobra). 1366×650 é o que sobra para a página num notebook 1366×768 com a barra de tarefas do Windows e o Chrome abertos: é a tela real da sala. Tela larga: 4 cartas em linha; estreita ou em pé: 2 × 2. Use `100dvh`, grid e `clamp()`.
- Transições de 300 ms entre as telas; estrelinhas no acerto (3 a 5 `efeitos.brilho` de 56 px em volta da carta certa); tremor no erro.
- Visual de tudo: seção 5.9.

### 5.6 Animais novos e conteúdo
- O catálogo passa a ter **13 animais**: os 8 da 2.0 (arara, onça, flamingo, macaco, mico-leão, tatu, capivara e tartaruga), o caranguejo (que já estava no `dados.js` atual, ainda sem som e sem ilustração) e os **4 novos: gato, cachorro, mosquito e cascavel**. As fichas completas estão no Anexo B — use-as como estão.
- Campos novos na ficha: `parecidos` (lista de ids), traço `null` ("depende") e `escalaMapa` (opcional). Pares de `parecidos` já definidos: onça e gato, macaco e mico, tatu e tartaruga.
- **Som funcionando** = `som` diferente de `null` e o arquivo carregou. Na abertura, teste cada som com `new Audio()` (`canplaythrough` ou `error`, prazo de 4 s; sem resposta conta como funcionando, e a reserva cobre na hora de tocar). Bicho sem som nunca é resposta nem distrator da etapa 1, mas participa das outras.
- Já corrigido nas fichas (apontado na revisão da 2.0): o flamingo não vive na Mata Atlântica (lagoas rasas do litoral), a capivara não é bicho de manguezal (rios e lagoas, como no Pantanal) e "Mata Costeira" não é bioma (o mico-leão-dourado é da Mata Atlântica).
- **Conferência na abertura** (só `console.warn`, nunca trava): ficha sem algum dos 9 traços, `parecidos` com id que não existe, menos de 4 animais no catálogo, menos de 4 com som.

### 5.7 Ferramentas para receber os arquivos (pasta `ferramentas/`, fora do jogo)
- **`conferir-arquivos.html`:** carrega `../js/dados.js` e `../js/sprites.js`, percorre o manifesto inteiro (inclusive `abertura`, `efeitos`, os fundos das telas e cada animação de cada bicho) e lista cada arquivo previsto com um selo: ✅ ligado e encontrado · 🟡 o arquivo já está na pasta, falta ligar (mostra qual linha mudar) · ❌ ligado, mas não encontrado · ⬜ ainda não enviado. Para as folhas, mostra as medidas esperadas × as reais e a animação rodando (na ordem da `sequencia`, se houver); para as imagens simples, as medidas esperadas × as reais; para os sons, a duração, um botão de ouvir e um aviso se passar de 8 s.
- **`gerar-trilhas.html`** (evolução da ferramenta da 2.0): a pessoa escolhe a imagem do fundo do mapa (por `<input type="file">` a leitura de pixels é permitida), a página detecta terra batida e madeira de ponte (célula de 8 px conta como trilha com 40% dos pixels nessas cores), engrossa 1 célula para cada lado e mantém só o maior pedaço ligado. **Novidades:** limiares ajustáveis; retângulos onde a cor de madeira vale (só nas pontes, para troncos e tocos não virarem caminho); pincel para pintar e apagar trilha com o mouse (a barraca laranja, por exemplo, parece terra); marcação do início, da árvore e das âncoras das moitas, com aviso se algum ficar fora da trilha ou se o caminho estiver partido; e o texto pronto do `js/trilhas.js` com botão Copiar. Formato idêntico ao da 2.0. A malha do kit foi feita exatamente assim, nesta ordem: terra; madeira só dentro das pontes; barraca apagada com o pincel; e só então engrossar e ficar com o maior pedaço (o pincel age na base, antes de engrossar). No `fundo.png` do kit, as pontes ficam em x 800–880 × y 432–512 (a do meio) e x 272–368 × y 704–792 (a de baixo), e a barraca em x 1040–1088 × y 120–168. Com essas três marcações, as regras da 2.0 refazem a malha do kit com 1 quadradinho de diferença em 5.564 (conferido). A página também gera, com botão Copiar, a lista `MAPA.brilhosAgua` do mapa escolhido, pelo mesmo critério da do kit (Anexo B).
- **`previa-abertura.html`** (vem pronta no kit): a cena da abertura funcionando sozinha, com os mesmos números do Anexo C. Não faz parte do jogo e não precisa ser refeita: serve de referência e de comparação (critério 19).

### 5.8 Tela de abertura (arte nova e animada)
A arte do kit (`assets/sprites/fases/abertura-pronta.png`, 1779×884) já traz desenhados o letreiro "Que Bicho É Esse?", os três letreiros dos desafios ("Escute e leia os sons dos animais", "Sombras e pistas dos animais", "Resolva as charadas"), o botão JOGAR e a engrenagem. Botão desenhado não recebe foco nem é lido, então a tela tem dois modos.

**Modo arte** — tela deitada (largura ≥ 1,5 × altura):
- A arte inteira, sem cortar, centralizada num `<canvas>` (`aria-hidden`) do tamanho da tela. As sobras (em cima e embaixo, ou dos lados: a arte é 2,01:1, e a janela de um notebook com o Chrome passa de 2:1) mostram a mesma arte ampliada e desfocada, feita por CSS num elemento atrás do canvas (`background-size: cover; filter: blur(16px) brightness(.65)`), pintada uma vez — nunca redesenhada a cada quadro. Esse elemento passa 40 px da tela para cada lado (`inset: -40px`), como na prévia: sem isso, a borda do desfoque aparece clara.
- Por cima das áreas desenhadas, botões HTML transparentes, num `<div>` com o mesmo retângulo da arte, nas posições de `SPRITES.fases.aberturaPronta.areas` (em % da arte): **JOGAR** e **⚙️**. Nesse modo, o ⚙️ fixo do canto fica escondido, para não haver dois. Mouse em cima ou foco do teclado acendem a área (`backdrop-filter: brightness(1.15)`) e desenham o contorno amarelo grosso.
- Os três letreiros só informam: não recebem foco; ao tocar, acendem e, com a narração ligada, o jogo lê o texto.
- **↩ Continuar** e **🗑 Apagar progresso** não existem na arte: são placas de madeira em HTML, à esquerda e à direita do JOGAR (áreas `continuar` e `apagar`), à mesma distância dele. O Apagar termina antes do sapo do tronco: na posição da rodada 4, ele cobria 8 px do pé do sapo.
- Enquanto a pré-carga não termina, o JOGAR fica apagado, com a barra "Preparando a floresta… 40%" por cima.
- Para leitores de tela: um `<h1>` invisível "Que Bicho É Esse?" e a lista dos três desafios.

**A cena animada** (dados em `SPRITES.abertura`) — desenhada no canvas por cima da arte, no mesmo retângulo e na mesma escala, recortada nele. Posições em pixels da arte; intervalos `[mín, máx]` sorteados a cada vez. A primeira vez de cada evento vem cedo, em `primeiraVez` segundos, como na prévia, para quem abre o jogo ver tudo se mexer logo: o vaga-lume voa aos 4 s, o tatu sai aos 5 s, o sapo pula e a arara cruza o céu aos 6 s. Depois valem os intervalos. Do fundo para a frente:
1. **Água da cachoeira:** fios brancos descendo dentro dos dois contornos de `cachoeira` (1,5 a 3 px de largura, 14 a 30 px de comprimento, transparência de 0,25 a 0,55; cada fio desce a queda inteira em 1 a 1,5 s e renasce no alto, noutra coluna) e 5 bolinhas de espuma subindo 10 px e sumindo na base de cada contorno (ciclo de 1,4 s).
2. **Vaga-lumes piscando** nos 10 pontos de `vagalumes` (38 px), cada um com fase e ritmo próprios (velocidade de 0,7 a 1,2).
3. **Arara e tucano pousados**, exatamente em cima dos desenhados: a `sequencia` deles faz piscar, mexer a cabeça, abrir o bico, balançar o rabo e arrumar as penas. O tucano começa `atraso` segundos adiantado, para os dois não piscarem juntos.
4. **Borboletas** (3) em "oito", pela fórmula do Anexo C, com 46 px, viradas para o lado em que andam.
5. **Tatu** (`SPRITES.animais.tatu`): parado de 5 a 9 s → anda 165 px para a direita a 38 px/s → `festa` uma vez (enrola, segura e desenrola: 3,6 s) → volta andando, espelhado → parado.
6. **Sapo do tronco:** `parado` (pisca, sorri e coaxa); a cada 6 a 11 s, `pulando` uma vez (0,5 s), no mesmo lugar.
7. **Arara voando:** a cada 10 a 16 s atravessa o céu inteiro, entrando e saindo por fora da arte, para um lado sorteado (espelhada indo para a esquerda); voa com y entre 70 e 150, a 230 px/s, com 120 px de altura, ondulando ±10 px.
8. **Vaga-lume voando:** a cada 7 a 12 s, de (150, 600) a (530, 440) em 6 s, ondulando ±20 px e aparecendo e sumindo aos poucos (60 px).
9. **Brilhos no letreiro:** a cada 0,45 a 0,95 s, um `efeitos.brilho` (40 a 58 px) num dos 160 pontos de `brilhos.pontos` (os mesmos da prévia), tocado uma vez.
10. **Folhas** (na frente de tudo): a cada 0,8 a 1,5 s cai uma das 18 folhas de `efeitos.folhas` (sorteada), nascendo nas copas (faixas de x de `copas`, y entre −30 e 40), a 32–52 px/s, balançando ±26 px e girando devagar, com 28 a 40 px; no máximo 10 ao mesmo tempo; somem aos poucos entre y 760 e 860.

- **Qual arte vai embaixo:** com o tatu, o sapo do tronco e a borboleta carregados, a `abertura.fundoLimpo` (a arte sem esses três, que agora se mexem); se algum deles faltar, a arte original, e esses três não são desenhados — nenhum bicho aparece duas vezes. A arara e o tucano cobrem os desenhados nas duas artes. A escolha é feita quando os sprites da abertura terminam de carregar (ou falham); até lá, a arte original parada. Botões e áreas valem para as duas.
- **Movimento reduzido** ou `CONFIG.abertura.animada = false`: a arte original, parada, sem a cena.
- A prévia `ferramentas/previa-abertura.html` mostra esta cena funcionando, com os mesmos números: é a referência visual. Pode reaproveitar a lógica dela; o resto da tela (botões de verdade, pré-carga, narração e reservas) segue este documento.

**Modo montado** — tela em pé ou estreita, ou se a arte não carregar: o fundo `fases.abertura` (quando chegar a arte limpa) ou, até lá, o Cerrado de `fases.aberturaMontada`, deslizando (5.5) — sem eles, as camadas da floresta ou o degradê —; o letreiro `ui.logo` (ou o título em texto, Fredoka 700 em laranja `#FDB30E` e verde `#89EB46` com contorno escuro, como na arte); os três letreiros e os botões em HTML, empilhados e sem rolagem. Da cena, só o que não depende da arte: folhas caindo do alto, vaga-lumes piscando em pontos sorteados perto das bordas, 2 borboletas, a arara voando no alto e brilhos em pontos sorteados sobre o letreiro.

- Quando chegarem o fundo sem bichos, sem letreiro e sem botões (`fases/abertura.png`) e o letreiro em PNG transparente (`ui/logo.png`), basta desligar `aberturaPronta` para o modo montado valer em todos os tamanhos (e então rever as posições da cena).
- O `<title>` da página passa a ser "Que Bicho É Esse?".

### 5.9 Identidade visual nova (pixel art e madeira)
A referência é a arte da abertura e o mapa novo: pixel art colorida de floresta. Toda a interface segue esse estilo (no lugar dos contornos pretos com sombra dura da 2.0):
- **Placas de madeira** em botões, painéis, janelas, placar e cartas: madeira `#8B3E15` com veios mais escuros, contorno quase preto `#1A1209` de 4 px, cantos levemente arredondados e folhinhas nas pontas. Se `SPRITES.ui.placa` estiver ligado, use-o como `border-image` (9 partes).
- **Cores dos desafios, iguais às da arte:** som = verde `#47920F`, sombra e característica = roxo `#771B93`, charada = laranja `#D24D07`, celebração = dourado `#FDB30E`. A cor aparece no título e na moldura de cada etapa e no letreiro da abertura.
- **Texto:** Fredoka 700, branco, em caixa alta (por CSS), com contorno escuro (`text-shadow` nas 4 direções), como o "JOGAR" da arte. O contorno é o que mantém o texto legível sobre qualquer fundo.
- **Cartas das opções:** moldura de madeira, centro claro (pergaminho), o bicho animado no meio e o nome numa plaquinha embaixo.
- Alvos de toque com pelo menos 64 px. Contraste: texto comum ≥ 4,5:1; o texto dos botões é grande, em negrito e com contorno escuro (≥ 3:1). Foco sempre visível (contorno amarelo).

## 6. Estrutura de arquivos

```
que-bicho-e-esse-3.0/
├── index.html
├── README.md
├── CONTRIBUTING.md                               (da 2.0 — o fluxo de Pull Request com aprovação)
├── .gitignore                                    (da 2.0)
├── .github/CODEOWNERS                            (da 2.0 — toda mudança passa pelo dono)
├── css/estilo.css
├── js/
│   ├── config.js      CONFIG — números ajustáveis (Anexo A)
│   ├── dados.js       ANIMAIS, PERGUNTAS e MAPA (Anexo B)
│   ├── sprites.js     SPRITES (Anexo C)
│   ├── trilhas.js     TRILHAS (do kit, feito para o mapa novo)
│   ├── util.js        embaralhar, limitar, distância…
│   ├── recursos.js    pré-carga, reservas, conferência e avisos de arquivo
│   ├── sprite.js      relógio, desenho de quadro, sequência, silhueta, VisorDeSprite
│   ├── efeitos.js     fundos das telas, borboletas, folhas, vaga-lumes, brilhos, luz e confete
│   ├── audio.js       canal único, som do bicho, bipes de reserva
│   ├── voz.js         narração
│   ├── salvar.js      localStorage com prefixo e validação
│   ├── sorteio.js     baralho, variantes, distratores, perguntas, charadas
│   ├── abertura.js    a cena animada da abertura (5.8)
│   ├── mapa.js        canvas, câmera, trilha, sapo, moitas, bichos, efeitos, minimapa
│   ├── etapas.js      etapas 1 a 3 e celebração
│   ├── telas.js       abertura (botões e modos), janelas, final, navegação
│   └── main.js        inicialização e laço único
├── assets/
│   ├── fonts/                                    (da 2.0)
│   ├── images/sapo-sprite.png                    (da 2.0 — reserva do sapo)
│   ├── images/animais/<id>.png                   (8 da 2.0; os novos quando existirem)
│   ├── sounds/<id>.mp3                           (8 da 2.0; os novos quando existirem)
│   ├── sprites/mapa/fundo.png                    (kit — mapa novo, 1536×1024)
│   ├── sprites/fases/abertura-pronta.png         (kit — arte da abertura, 1779×884)
│   ├── sprites/fases/abertura-pronta-limpa.png   (kit — a mesma arte sem os bichos que se mexem)
│   ├── sprites/fases/*.jpg                       (kit — os 7 fundos pintados das telas, 5.5)
│   ├── sprites/abertura/                         (kit — arara, tucano e sapo do tronco)
│   ├── sprites/animais/tatu/                     (kit — parado, andando e festa)
│   ├── sprites/efeitos/                          (kit — borboleta, folhas, vaga-lumes, brilho e luz)
│   ├── sprites/…                                 (os próximos — Anexo D)
│   └── videos/libras/                            (vazia)
├── referencias/                                  (kit — fora do jogo)
│   ├── folha-de-sprites.png
│   ├── trilhas-e-moitas-no-mapa.png
│   └── fundos-das-telas.png
└── ferramentas/
    ├── conferir-arquivos.html
    ├── gerar-trilhas.html
    └── previa-abertura.html                      (kit — referência da abertura animada)
```

- Os `<script>` entram no `index.html` exatamente nesta ordem: config, dados, sprites, trilhas, util, recursos, sprite, efeitos, audio, voz, salvar, sorteio, abertura, mapa, etapas, telas, main.
- **Do kit:** copie `assets/`, `js/`, `ferramentas/` e `referencias/` como estão, nos mesmos caminhos. O `LEIA-ME.txt` do kit lista os arquivos e não vai para o jogo.
- **Da 2.0:** copie `assets/fonts`, `assets/images/sapo-sprite.png`, `assets/images/animais/` e `assets/sounds/`, e também o `.gitignore`, o `.github/CODEOWNERS` e o `CONTRIBUTING.md`. Sem acesso ao repositório, crie as pastas vazias e diga no fim quais arquivos eu preciso copiar.
- **Não copie da 2.0:** o `js/trilhas.js` e o `mapa_20.0.png` (as trilhas do mapa novo são outras) nem o `js/game.js` (a versão que está hoje no GitHub tem um erro de sintaxe na linha 107 — um pedaço do `sortearFases` repetido depois do fim da função — que impede o arquivo inteiro de carregar).

### 6.1 O que já foi conferido no kit (02/11/2026)
Tudo abaixo foi medido nos arquivos, não estimado. Mesmo assim, rode os testes da seção 9: esta conferência só garante que os arquivos e os números batem entre si.

- **Medidas:** as 24 imagens do kit que o jogo usa têm exatamente as medidas do Anexo C (largura da folha = `quadroL × colunas`, altura = `quadroA`, uma linha só), e todo sprite tem fundo transparente. Da 2.0: as 8 ilustrações têm 512×512 com fundo transparente, e o `sapo-sprite.png` tem 720×840 (4 × 4 quadros de 180×210).
- **Malha de trilhas do kit:** 192 × 128 quadradinhos, 5.564 de trilha, numa peça só. O início e as 6 âncoras das moitas ficam sobre a trilha, e a área de passeio de cada moita (até 90 px da âncora, dentro das margens) é contínua. O ponto de trilha mais perto da árvore fica a 41 px. Coincide 58% com a malha da 2.0.
- **Abertura:** os botões transparentes (`areas`) caem sobre os desenhados, e a arara e o tucano cobrem os desenhados. O tatu e o sapo do tronco têm outro desenho e **não** cobrem os da arte original: por isso só aparecem sobre a arte limpa (5.8). O `tatu/parado.png` é igual ao quadro 3 de `andando.png`.
- **Mapa:** as posições do cenário no Anexo C (cachoeiras, ponte, barraca e caverna) caem sobre os desenhos certos, e os 66 pontos de `MAPA.brilhosAgua` caem todos sobre a água.
- **Dados:** os Anexos A, B e C compilam e rodam. As 13 fichas têm os 9 traços, e os `parecidos` valem nos dois sentidos. Toda pergunta tem pelo menos 5 candidatos a distrator. Nenhuma charada diz o nome do próprio bicho; a da onça diz "gato", e por isso onça e gato são `parecidos`.
- **Sons da 2.0:** mico 5,8 s, capivara 6,4 s, arara 7,6 s, onça 9,8 s, tartaruga 30 s, tatu 40 s, flamingo 54 s e macaco 71 s.

## 7. Armadilhas conhecidas (não repita)
1. Bloco duplicado ou chave sobrando quebra o arquivo inteiro → rode `node --check` em todo `.js` antes de entregar.
2. Fala do Chrome sem referência perde o `onend` → guarde a referência e use o vigia (4.5).
3. `pause()` faz o `play()` pendente falhar com `AbortError` → não toque a reserva quando o som foi parado de propósito.
4. Gravações longas (a do macaco tem 70 s) → limite de 8 s com o volume descendo.
5. Trocar de tela depois de começar o áudio corta o áudio → monte a tela antes.
6. Clique duplo depois do acerto somava pontos de novo → trava até a próxima etapa.
7. Aviso de proximidade recriado a cada quadro reinicia a animação → só mexa nele quando o estado mudar.
8. Avanço depois do acerto que depende só do fim da fala trava se a fala for interrompida → prazo de segurança + conferência da etapa.
9. Teclas presas (Shift) e janela que perde o foco → minúsculas e limpeza no `blur`.
10. TAB escapando da confirmação para a tela de trás → prender o foco.
11. Progresso salvo com animal que saiu do catálogo, índice repetido ou moita que não existe → validar tudo na leitura.
12. Movimento por quadro roda mais rápido em monitor de 144 Hz → tudo por `dt`.
13. `localStorage` compartilhado com a 2.0 no mesmo domínio → prefixo `qbe3_`.
14. `fetch`, módulos e leitura de pixel quebram no `file://` → seção 3.
15. Imagem que não abre mostra ícone quebrado → reservas da seção 5.1.
16. Palavras em maiúsculas no HTML são soletradas pelo leitor de tela → caixa alta só por CSS.
17. Botão dentro de botão é HTML inválido e some para o leitor de tela → 🔊 ao lado da carta.
18. Mapa trocado com a malha antiga deixa o sapo andando no mato → `js/trilhas.js` sempre feito a partir do fundo em uso (a malha da 2.0 coincide só 58% com o mapa novo).
19. Troncos, tocos e barraca têm cor parecida com terra e viram "trilha" → madeira só dentro das pontes e limpeza com o pincel (5.7).
20. Botão desenhado dentro de uma imagem não recebe foco nem é lido → botões HTML de verdade por cima (5.8).
21. Pixel art ampliada com suavização fica borrada → regra de nitidez (seção 3, item 13).
22. Bicho desenhado na arte com o mesmo bicho animado por cima aparece em dobro → arte limpa só quando os sprites que se mexem carregaram; os pousados ficam exatamente em cima dos desenhados (5.8).
23. Animações de um bicho com quadros de tamanhos diferentes fazem o bicho crescer e encolher na troca → uma escala por bicho (5.4).
24. Desfoque (`ctx.filter`), sombras e brilhos refeitos a cada quadro derrubam o fps em notebook fraco → o desfoque das sobras da abertura é CSS, feito uma vez.
25. Folha "animada" em que o cenário inteiro muda de um quadro para o outro (a cachoeira enviada junto com os sprites da abertura) faz a tela tremer → anime só o que se mexe; a água da arte ganha movimento por código.
26. Fundo pintado ampliado sem suavização fica serrilhado, e fundo largo parado em `cover` esconde as pontas do desenho → `pintado: true` sempre suave, e os largos deslizam (5.5).
27. Coroas somadas a cada acerto, numa moita que recomeça quando a criança volta ao mapa, deixam ganhar as mesmas coroas várias vezes → as coroas da moita só entram no placar na celebração (4.3).
28. ENTER no 💡 ou no ⚙️ também entrava na moita → ENTER num botão visível com foco é do botão (4.6).
29. Sombra de emoji muda de um sistema para outro e às vezes é só uma cara → sombra só para bicho com desenho de verdade (4.2).
30. Arrastar o dedo no canvas rolava ou ampliava a página → `touch-action: none` (4.6).
31. Placa em HTML por cima da arte cobrindo um bicho desenhado → áreas conferidas na arte (5.8 e 6.1).
32. Elipse de água num rio torto põe o brilho no mato → pontos medidos sobre a água (5.2).

## 8. Como trabalhar e entregar
- Trabalhe nesta ordem e entregue cada arquivo inteiro: (1) `config`, `dados`, `sprites`, `index.html` e o CSS-base; (2) `recursos`, `sprite` e `efeitos`, com todas as reservas; (3) `audio`, `voz` e `salvar`; (4) `abertura` — compare com a prévia do kit; (5) `mapa`; (6) `etapas`; (7) `telas` e `main`; (8) as duas ferramentas; (9) README; (10) testes.
- **Ao fim de cada passo**, e não só no último: rode `node --check` em todo `.js`, abra o jogo no Chromium sem interface (Playwright) e confira que a parte nova funciona, sem erro no console. Depois faça um commit pequeno, em português, dizendo o que mudou (no Claude Code, mande também a branch para o GitHub). Assim cada erro aparece no passo em que nasceu, e não no fim, misturado com os outros.
- Se algo for ambíguo, escolha a opção mais simples que cumpra o texto e registre no README, na seção "Decisões".
- Se eu anexar sprites ou sons junto com este prompt: meça cada folha (largura, altura, quadros), coloque cada arquivo no caminho do Anexo D, ligue-o em `sprites.js`/`dados.js` e diga o que ligou. Folha fora do padrão (JPG, fundo pintado, quadros de tamanhos diferentes, texto por cima) precisa ser limpa antes, como as do kit: fundo transparente, quadros iguais e o pé no mesmo ponto em todos; se não der, não ligue e diga o que falta. Se não anexar, deixe tudo desligado e pronto.
- README: como jogar, como rodar no computador, como ligar sprites e sons (passo a passo com o Anexo D e a ferramenta de conferência), como trocar o fundo de uma tela, como acrescentar um animal, como trocar o mapa e refazer as trilhas, decisões e créditos.
- Se puder executar código (no Claude Code, por exemplo), teste no Chromium sem interface (Playwright), abrindo pelo `file://` e por um servidor local, e mostre o resultado de cada critério da seção 9. Pode criar um gancho de teste (`QBE.teste`) para levar o sapo até uma moita e simular a taxa de quadros.

## 9. Critérios de aceite
1. `node --check` passa em todos os `.js`, e nenhuma das partidas abaixo deixa erro de JavaScript no console.
2. Partida completa só com o teclado e sem narração, todas as etapas de primeira → o final mostra **630** coroas.
3. Partida com um erro em cada etapa → cada acerto vale a metade arredondada (13, 10, 15), nada é descontado e o final mostra **408** coroas.
4. Partida inteira com a narração ligada, só com ENTER e números: a sombra nunca aparece e ENTER no mapa entra direto na próxima moita.
5. Sem nenhum sprite, ilustração ou som: o jogo vai do começo ao fim sem ícone quebrado (mapa desenhado por código, moitas desenhadas, bichos em emoji se mexendo, bipes de reserva) e com um único aviso por arquivo (o aviso de rede que o próprio navegador mostra para arquivo inexistente é esperado aqui).
6. Com o kit e os arquivos da 2.0 no lugar: aparecem o mapa novo, a abertura animada, os fundos das telas, o sapo do tronco andando pelo mapa, o tatu do kit, os efeitos, as 8 ilustrações e os 8 sons.
7. Gato, cachorro, mosquito, cascavel e caranguejo, ainda sem som e sem ilustração, nunca aparecem na etapa do som e nunca são a sombra (a etapa 2 deles é sempre a característica), mas aparecem nas outras etapas e como opções.
8. Em 200 sorteios simulados: cada moita tem 3 ids distintos com o 1º sempre com som; nenhuma pergunta de característica tem duas respostas certas; os pares de `parecidos` nunca aparecem juntos numa sombra ou charada.
9. Em 10 minutos simulados na malha do kit, a moita liberada nunca sai da trilha nem do seu raio, sempre para quando o sapo chega perto e sempre pode ser alcançada.
10. A 30, 60 e 144 quadros por segundo simulados, o sapo, as moitas e os fundos que deslizam percorrem a mesma distância no mesmo tempo (diferença menor que 5%).
11. Sem rolagem nas etapas: `scrollHeight <= innerHeight` em 1366×768, 1366×650, 1280×720, 1920×1080, 768×1024 e 360×640.
12. Fechar a página no meio e reabrir → Continuar restaura pontos, moitas feitas e sorteio; texto inválido gravado de propósito em cada chave não quebra o jogo; o progresso da 2.0 (`aq_`) continua intacto.
13. Voltar ao mapa durante a revelação não empurra a criança para a etapa seguinte.
14. Confirmação: o foco começa no botão que preserva, o TAB não sai da janela e o ESC não apaga nada.
15. Com `prefers-reduced-motion`, nada passeia nem treme, os fundos ficam parados no meio, a abertura fica parada (a arte original) e o jogo continua jogável.
16. `conferir-arquivos.html` mostra corretamente os 4 estados. `gerar-trilhas.html`, com o `fundo.png` do kit, as duas pontes marcadas e a barraca apagada (coordenadas em 5.7), gera uma malha conectada com no máximo 5 quadradinhos de diferença da do kit, e todos os pontos da lista de brilhos da água que ela gera caem sobre a água.
17. Abertura em modo arte: em 1366×768 e 1920×1080, cada botão transparente cai sobre a área desenhada correspondente (diferença menor que 1% da largura da arte) e o ⚙️ fixo fica escondido; em 768×1024 e 360×640 aparece o modo montado, com o Cerrado deslizando ao fundo e sem rolagem.
18. Pela malha do kit, a partir do início, o sapo alcança as 6 moitas e chega a menos de 140 px da árvore (teste por busca de caminho na grade).
19. Abertura animada, com o kit, em 1366×768 e 1920×1080: a arara e o tucano cobrem exatamente os desenhados (nenhum contorno em dobro); o tatu anda, enrola, desenrola e volta; o sapo pisca e pula no tronco; a arara cruza o céu; as folhas caem; os vaga-lumes piscam e voam; o letreiro brilha; a água da cachoeira desce; e nenhum bicho aparece duas vezes. Compare capturas com as da prévia `ferramentas/previa-abertura.html` nos mesmos tamanhos.
20. Com todos os sprites da abertura, do tatu e dos efeitos desligados (`ativo:false`): a abertura mostra a arte original parada e os botões funcionam; o mapa e as etapas usam os efeitos por código; o tatu volta à ilustração e o sapo à folha da 2.0 — sem erro no console. Com só o tatu desligado, a abertura volta à arte original e não desenha o tatu, o sapo do tronco nem as borboletas.
21. Com o tatu do kit: cartas, sombra (a silhueta é o sprite pintado de preto), revelação, celebração e mapa mostram o sprite, do mesmo tamanho em `parado`, `andando` e `festa`. O sapo do tronco anda pelo mapa dando pulinhos e vira para o lado em que anda; parado, pisca e coaxa.
22. Fundos das telas: cada etapa, a celebração e o final mostram o fundo da tabela da 5.5, cobrindo a tela inteira sem distorcer e sem serrilhado em 1366×768, 1920×1080 e 360×640, com os efeitos da tabela por cima; os largos vão e voltam devagar e os outros ficam parados; o texto e as cartas continuam legíveis sobre todos eles. Com um fundo desligado, a tela usa o degradê, sem erro.
23. Acertar a etapa 1, voltar ao mapa e entrar de novo na mesma moita não soma nada: o placar só muda na celebração, com o total que a moita rendeu, e a partida perfeita continua dando 630.
24. Com o foco no 💡 ou no ⚙️ do mapa, ENTER abre a janela e não entra na moita, com a narração ligada ou desligada.
25. Com a narração do jogo desligada, ao trocar de tela o foco está no `<h1>` da tela nova. Ajuda e configurações prendem o TAB e devolvem o foco ao fechar. Na sombra, o leitor de tela encontra a audiodescrição; no painel, o estado de cada moita.
26. Arrastando o dedo no mapa do celular (emulado), a página não rola nem amplia, e o toque longo não abre menu.

## Anexo A — `js/config.js`

```js
'use strict';
// ═══════════════════════════════════════════════════════════════
//  NÚMEROS AJUSTÁVEIS DO JOGO
//  Mexa aqui, nunca no meio do código. Distâncias em pixels do
//  desenho do mapa, velocidades em pixels por segundo.
// ═══════════════════════════════════════════════════════════════
const CONFIG = {
  prefixoSalvo: 'qbe3_',          // a 2.0 usa 'aq_' no mesmo domínio
  versaoSalvo: 1,
  etapasPorMoita: 3,
  pontos: { som: 25, sombra: 20, traco: 20, charada: 30, bonusMoita: 30 },

  limiteSomMs: 8000,              // o som do bicho para depois disto
  vozVelocidades: { devagar: 0.7, normal: 0.9, rapido: 1.1 },
  vozVelocidadePadrao: 0.9,

  sapo: {
    velMax: 130, acel: 900, freioPorQuadro60: 0.78, velMinima: 3,
    ajudaCurva: 28, arrastoToque: 0.45,
    margem: { lados: 40, topo: 80, base: 40 },
  },
  camera: { suavidadePorQuadro60: 0.18 },

  distancias: { avisoMoita: 110, pararMoita: 130, soltarMoita: 170, arvore: 140, encaixeAncora: 120 },
  moita: {
    raioPadrao: 90, vel: 30, pausaMin: 1.5, pausaMax: 3, voltarDepoisDe: 1,
    margem: { lados: 80, topo: 140, base: 110 },   // longe do placar e do minimapa
  },
  bichoNoMapa: { raio: 70, vel: 40, altura: 64, flutuar: 6 },

  tempos: {            // milissegundos
    avancoSemVoz: 1400, avancoComVozMax: 6000, tremor: 600,
    transicao: 300, revelacao: 800, luzAcerto: 700, preCargaMax: 8000, testeSomMax: 4000,
  },

  canvasDprMax: 2,
  efeitos: {           // cada efeito liga e desliga aqui (5.2 e 5.5)
    // no mapa
    brilhoAgua: true, sombraNuvem: true, borboletas: 5, vagalumes: 6,
    // nas telas, por cima do fundo e atrás do conteúdo (0 ou ausente = nenhum)
    telas: {
      som:            { folhas: 6 },
      sombra:         { vagalumes: 8 },
      caracteristica: { folhas: 6 },
      charada:        { folhas: 4, vagalumes: 2 },
      celebracao:     { confete: 60, estrelas: 6 },
      final:          { vagalumes: 6, estrelas: 4 },
    },
    // alturas: no mapa, em pixels do mapa; nas telas, em pixels da tela
    altura: { borboletaMapa: 26, vagalumeMapa: 22, brilhoAgua: 22, folhaMoita: 16,
              folhaTela: 32, vagalumeTela: 30, estrelaTela: 40, estrelaAcerto: 56, luzAcerto: 64 },
  },
  abertura: { animada: true },    // false = a arte da abertura parada, sem a cena (5.8)
  conferir: false,     // modo de conferência (também F9 ou ?conferir=1)
};
```

## Anexo B — `js/dados.js` (use exatamente estes dados)

```js
'use strict';
// ═══════════════════════════════════════════════════════════════
//  DADOS DO JOGO — ANIMAIS, PERGUNTAS E MAPA
// ═══════════════════════════════════════════════════════════════
//  PARA ACRESCENTAR UM ANIMAL: copie uma ficha e preencha tudo.
//  id        minúsculo, sem acento e sem espaço. É também o nome dos
//            arquivos: assets/images/animais/<id>.png,
//            assets/sounds/<id>.mp3 e assets/sprites/animais/<id>/
//  artigo    'o' ou 'a' (a narração diz "era a arara", "era o tatu")
//  som, imagem, libras
//            null enquanto o arquivo não existir; quando existir,
//            troque o null pelo caminho
//  tom       frequências dos bipes de reserva, se o som falhar
//  charadas  em 1ª pessoa, sem dizer o nome, terminando em "Quem sou eu?"
//  tracos    os 9 são obrigatórios: true = tem, false = não tem,
//            null = depende (o bicho fica fora daquela pergunta)
//  parecidos bichos fáceis de confundir com este: não aparecem juntos
//            como opções na sombra nem na charada
//  escalaMapa (opcional) tamanho do bicho passeando no mapa (1 = 64 px)
//
//  Textos em capitalização normal: a caixa alta vem do CSS, porque
//  leitores de tela soletram palavras escritas em maiúsculas.
// ═══════════════════════════════════════════════════════════════

const ANIMAIS = {

  // A arara do jogo é a arara-canindé, azul e amarela. A da abertura
  // (no kit) é outra, a arara-vermelha: não serve de sprite para esta.
  arara: {
    id: 'arara', nome: 'Arara', artigo: 'a', emoji: '🦜',
    som: 'assets/sounds/arara.mp3',
    tom: [880, 660, 990, 660, 880],
    onomatopeia: 'Aráááá! Aráááá!',
    charadas: [
      'Tenho penas azuis e amarelas bem coloridas, um bico grande e curvo, e voo bem alto entre as árvores. Quem sou eu?',
      'Sou uma ave bem colorida, adoro comer frutas e castanhas, e faço meu ninho no buraco dos troncos. Quem sou eu?',
      'Grito bem alto na floresta, tenho asas grandes e uma cauda comprida cheia de penas. Quem sou eu?',
    ],
    audiodescricao: 'Um pássaro grande de penas azuis nas costas e amarelas na barriga, com bico preto curvo.',
    libras: null,
    imagem: 'assets/images/animais/arara.png',
    cor: 'linear-gradient(135deg,#1565C0,#FFD700)',
    habitat: 'Floresta Amazônica',
    tracos: { penas:true, pelo:false, casco:false, voa:true, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:false },
    parecidos: [],
    curiosidade: 'A arara vive na Floresta Amazônica! 🌳 Ela ama árvores altíssimas e frutas tropicais.',
  },

  onca: {
    id: 'onca', nome: 'Onça', artigo: 'a', emoji: '🐆',
    som: 'assets/sounds/onca.mp3',
    tom: [220, 220, 196, 174, 220],
    onomatopeia: 'Rrroooar! Grrrr!',
    charadas: [
      'Meu pelo é amarelo cheio de pintinhas pretas, tenho garras bem fortes e ando sempre bem quietinha. Quem sou eu?',
      'Sou o maior gato selvagem das Américas, sei nadar muito bem e caço sozinha. Quem sou eu?',
      'Tenho bigodes compridos, dentes bem afiados, e minhas patas não fazem nenhum barulho no chão. Quem sou eu?',
    ],
    audiodescricao: 'Um felino grande de pelo amarelo coberto de manchas pretas arredondadas.',
    libras: null,
    imagem: 'assets/images/animais/onca.png',
    cor: 'linear-gradient(135deg,#FFD700,#FF8F00)',
    habitat: 'Pantanal',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:true, sobe:true, comeFrutas:false, comeCarne:true, comeInsetos:false },
    parecidos: ['gato'],
    curiosidade: 'A onça-pintada caça no Pantanal! 💧 É o maior felino das Américas.',
  },

  flamingo: {
    id: 'flamingo', nome: 'Flamingo', artigo: 'o', emoji: '🦩',
    som: 'assets/sounds/flamingo.mp3',
    tom: [523, 659, 784, 659, 523],
    onomatopeia: 'Gá-gá-gá!',
    charadas: [
      'Sou todo cor-de-rosa, tenho pernas bem compridas e fininhas, e durmo em pé numa perna só. Quem sou eu?',
      'Meu pescoço é comprido e curvado como um S, e eu procuro comida com a cabeça dentro da água. Quem sou eu?',
      'Vivo em bando perto da água rasa e fiquei todo rosa por causa daquilo que eu como. Quem sou eu?',
    ],
    audiodescricao: 'Uma ave rosa de pescoço comprido e curvo, em pé sobre pernas finas e altas.',
    libras: null,
    imagem: 'assets/images/animais/flamingo.png',
    cor: 'linear-gradient(135deg,#FF8F00,#E53935)',
    habitat: 'Lagoas rasas do litoral',
    tracos: { penas:true, pelo:false, casco:false, voa:true, nada:true, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:false },
    parecidos: [],
    curiosidade: 'O flamingo vive em lagoas de água rasa perto do mar! 🌊 Sua cor rosa vem dos alimentos que ele come.',
  },

  macaco: {
    id: 'macaco', nome: 'Macaco', artigo: 'o', emoji: '🐵',
    som: 'assets/sounds/macaco.mp3',
    tom: [392, 440, 494, 440, 392],
    onomatopeia: 'Uh-uh! Ah-ah!',
    charadas: [
      'Tenho pelo marrom, mãos parecidas com as suas e um rabo comprido para me pendurar nos galhos. Quem sou eu?',
      'Pulo de árvore em árvore, adoro frutas e sei usar pedrinhas para quebrar comida dura. Quem sou eu?',
      'Tenho cinco dedos em cada mão igual a você, e vivo em grupo lá no alto das árvores. Quem sou eu?',
    ],
    audiodescricao: 'Um animal peludo marrom, de rosto pequeno e cauda longa, sentado num galho.',
    libras: null,
    imagem: 'assets/images/animais/macaco.png',
    cor: 'linear-gradient(135deg,#FF8F00,#6D4C41)',
    habitat: 'Floresta Amazônica',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:true },
    parecidos: ['mico'],
    curiosidade: 'O macaco-prego vive na Floresta Amazônica! 🌳 Ele usa pedras para quebrar cocos.',
  },

  mico: {
    id: 'mico', nome: 'Mico-Leão', artigo: 'o', emoji: '🦁',
    som: 'assets/sounds/mico.mp3',
    tom: [660, 784, 988, 784, 660],
    onomatopeia: 'Piu-piu-piiii!',
    charadas: [
      'Sou pequenininho e todo dourado, com uma juba ao redor do rosto igualzinha à de um leão. Quem sou eu?',
      'Caibo quase na palma da mão, meu pelo brilha alaranjado no sol e eu moro na mata perto do mar. Quem sou eu?',
      'Sou um macaquinho bem raro, tenho rabo comprido e o pelo cor de ouro. Quem sou eu?',
    ],
    audiodescricao: 'Um macaquinho pequeno de pelo dourado brilhante, com muito pelo em volta da cara.',
    libras: null,
    imagem: 'assets/images/animais/mico.png',
    cor: 'linear-gradient(135deg,#FFD700,#FF8F00)',
    habitat: 'Mata Atlântica',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:false, sobe:true, comeFrutas:true, comeCarne:false, comeInsetos:true },
    parecidos: ['macaco'],
    curiosidade: 'O mico-leão-dourado vive na Mata Atlântica! 🌿 É um dos animais mais ameaçados do Brasil.',
  },

  tatu: {
    id: 'tatu', nome: 'Tatu', artigo: 'o', emoji: '🦔',
    som: 'assets/sounds/tatu.mp3',
    tom: [196, 220, 247, 220, 196],
    onomatopeia: 'Funf! Funf!',
    charadas: [
      'Carrego uma casquinha dura nas costas, tenho unhas fortes para cavar e me enrolo como uma bolinha. Quem sou eu?',
      'Faço buracos no chão para morar, minha armadura me protege e meu focinho é bem pontudo. Quem sou eu?',
      'Ando devagar pertinho do chão, uso minha carapaça de escudo e procuro formiguinhas para comer. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho baixo coberto por uma carapaça marrom de placas duras, com focinho pontudo.',
    libras: null,
    imagem: 'assets/images/animais/tatu.png',
    cor: 'linear-gradient(135deg,#8D6E63,#5D4037)',
    habitat: 'Caatinga',
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:false, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:true },
    parecidos: ['tartaruga'],
    curiosidade: 'O tatu vive na Caatinga! 🌵 Sua armadura de osso o protege dos predadores.',
  },

  capivara: {
    id: 'capivara', nome: 'Capivara', artigo: 'a', emoji: '🦫',
    som: 'assets/sounds/capivara.mp3',
    tom: [262, 330, 392, 330, 262],
    onomatopeia: 'Uíc-uíc!',
    charadas: [
      'Sou o maior roedor do mundo, tenho pelo marrom meio durinho e adoro tomar banho no rio. Quem sou eu?',
      'Pareço um porquinho-da-índia gigante, meus dentes da frente nunca param de crescer e eu nado muito bem. Quem sou eu?',
      'Vivo em grupo perto da água, como capim e fico horas dentro do rio só com o nariz de fora. Quem sou eu?',
    ],
    audiodescricao: 'Um roedor grande e gordinho, de pelo marrom curto, focinho quadrado e orelhas pequenas.',
    libras: null,
    imagem: 'assets/images/animais/capivara.png',
    cor: 'linear-gradient(135deg,#795548,#4E342E)',
    habitat: 'Pantanal',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:true, sobe:false, comeFrutas:true, comeCarne:false, comeInsetos:false },
    parecidos: [],
    curiosidade: 'A capivara vive perto de rios e lagoas, como no Pantanal! 💦 É o maior roedor do mundo!',
  },

  tartaruga: {
    id: 'tartaruga', nome: 'Tartaruga', artigo: 'a', emoji: '🐢',
    som: 'assets/sounds/tartaruga.mp3',
    tom: [330, 294, 262, 294, 330],
    onomatopeia: 'Pfff... (sopro)',
    charadas: [
      'Levo a minha casa nas costas, tenho nadadeiras no lugar das patas e nado bem devagarinho no mar. Quem sou eu?',
      'Meu casco é duro e arredondado, eu ponho meus ovos na areia da praia e volto sempre ao mesmo lugar. Quem sou eu?',
      'Nado no fundo do mar usando quatro remos, e posso viver muitos e muitos anos. Quem sou eu?',
    ],
    audiodescricao: 'Um animal de casco verde arredondado, com quatro nadadeiras abertas como remos.',
    libras: null,
    imagem: 'assets/images/animais/tartaruga.png',
    cor: 'linear-gradient(135deg,#006064,#0277BD)',
    habitat: 'Oceano Atlântico',
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:true, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:false },
    parecidos: ['tatu'],
    curiosidade: 'A tartaruga-marinha nada no Oceano Atlântico! 🌊 Ela volta à mesma praia onde nasceu para desovar.',
  },

  caranguejo: {
    id: 'caranguejo', nome: 'Caranguejo', artigo: 'o', emoji: '🦀',
    som: null,      // quando tiver: 'assets/sounds/caranguejo.mp3'
    tom: [700, 520, 700, 520, 700],
    onomatopeia: 'Clac! Clac!',
    charadas: [
      'Ando de lado, tenho duas pinças bem fortes e uma casca dura que me protege. Quem sou eu?',
      'Moro em buracos na lama do manguezal, tenho dez patas e meus olhos ficam em cima de hastinhas. Quem sou eu?',
      'Meu esqueleto fica do lado de fora do corpo e eu troco de casca quando fico grande. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho de corpo redondo e achatado, coberto por uma casca dura, com duas pinças grandes na frente, olhos em cima de hastes e várias patas finas nas laterais.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/caranguejo.png'
    cor: 'linear-gradient(135deg,#FF7043,#BF360C)',
    habitat: 'Manguezal',
    tracos: { penas:false, pelo:false, casco:true, voa:false, nada:false, sobe:false, comeFrutas:false, comeCarne:false, comeInsetos:false },
    parecidos: [],
    curiosidade: 'O caranguejo vive no Manguezal! 🦀 Ele tem o esqueleto por fora do corpo e troca de casca quando cresce.',
  },

  // ── NOVOS NA 3.0 ──────────────────────────────────────────────

  gato: {
    id: 'gato', nome: 'Gato', artigo: 'o', emoji: '🐱',
    som: null,      // quando tiver: 'assets/sounds/gato.mp3'
    tom: [740, 880, 660],
    onomatopeia: 'Miau! Miau!',
    charadas: [
      'Tenho bigodes, pelo macio e faço ronrom quando ganho carinho. Quem sou eu?',
      'Tomo banho me lambendo, adoro brincar com bolinha de lã e quase sempre caio de pé quando pulo. Quem sou eu?',
      'Escondo as unhas dentro das patinhas, meus olhos brilham no escuro e adoro caçar ratinhos. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho de estimação de pelo macio, orelhas pontudas, bigodes compridos e rabo levantado.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/gato.png'
    cor: 'linear-gradient(135deg,#FFB74D,#E65100)',
    habitat: 'Casa (animal doméstico)',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:null, sobe:true, comeFrutas:false, comeCarne:true, comeInsetos:null },
    parecidos: ['onca'],
    curiosidade: 'O gato é um animal doméstico: mora com a gente em casa! 🏠 Ele dorme boa parte do dia.',
  },

  cachorro: {
    id: 'cachorro', nome: 'Cachorro', artigo: 'o', emoji: '🐶',
    som: null,      // quando tiver: 'assets/sounds/cachorro.mp3'
    tom: [392, 392, 330, 392, 392],
    onomatopeia: 'Au au! Au au!',
    charadas: [
      'Sou o melhor amigo das pessoas, abano o rabo quando fico feliz e adoro buscar a bolinha. Quem sou eu?',
      'Meu focinho sente cheiro de longe, eu tomo conta da casa e lato quando chega alguém. Quem sou eu?',
      'Adoro passear de coleira, roer um ossinho e ganhar carinho na barriga. Quem sou eu?',
    ],
    audiodescricao: 'Um bichinho de estimação peludo, de orelhas caídas, focinho preto e rabo abanando.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/cachorro.png'
    cor: 'linear-gradient(135deg,#BCAAA4,#5D4037)',
    habitat: 'Casa (animal doméstico)',
    tracos: { penas:false, pelo:true, casco:false, voa:false, nada:true, sobe:false, comeFrutas:null, comeCarne:true, comeInsetos:false },
    parecidos: [],
    curiosidade: 'O cachorro é um animal doméstico: mora com a gente em casa! 🏠 O focinho dele sente cheiros muito melhor que o nosso nariz.',
  },

  mosquito: {
    id: 'mosquito', nome: 'Mosquito', artigo: 'o', emoji: '🦟',
    som: null,      // quando tiver: 'assets/sounds/mosquito.mp3'
    tom: [880, 920, 880, 920, 880, 920],
    onomatopeia: 'Zum-zum-zum! Zuuuum!',
    charadas: [
      'Sou bem pequenininho, tenho asas fininhas e faço zum-zum no seu ouvido de noite. Quem sou eu?',
      'Nasço na água parada e, quando cresço, saio voando e dou picadas que coçam. Quem sou eu?',
      'Tenho seis patinhas bem finas e uma boca comprida e fininha, igual a um canudinho. Quem sou eu?',
    ],
    audiodescricao: 'Um inseto bem pequeno, de corpo fino, asas transparentes e patas longas e finas.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/mosquito.png'
    cor: 'linear-gradient(135deg,#B0BEC5,#37474F)',
    habitat: 'Água parada, em todo o Brasil',
    tracos: { penas:false, pelo:false, casco:false, voa:true, nada:null, sobe:false, comeFrutas:null, comeCarne:null, comeInsetos:false },
    parecidos: [],
    curiosidade: 'O mosquito nasce na água parada! 💧 Por isso não podemos deixar água acumulada em pneus, vasos e garrafas.',
  },

  cascavel: {
    id: 'cascavel', nome: 'Cascavel', artigo: 'a', emoji: '🐍',
    som: null,      // quando tiver: 'assets/sounds/cascavel.mp3'
    tom: [1200, 1000, 1200, 1000, 1200, 1000],
    onomatopeia: 'Tchic-tchic-tchic! Sssss!',
    charadas: [
      'Não tenho patas, ando arrastando a barriga no chão e tenho um chocalho na ponta do rabo. Quem sou eu?',
      'Meu corpo é comprido e coberto de escamas, e eu balanço o rabo fazendo barulho para dizer: fique longe! Quem sou eu?',
      'Ponho a língua para fora para sentir os cheiros e troco de pele quando cresço. Quem sou eu?',
    ],
    audiodescricao: 'Uma cobra comprida, de escamas marrons com desenhos de losango nas costas e um chocalho na ponta do rabo.',
    libras: null,
    imagem: null,   // quando tiver: 'assets/images/animais/cascavel.png'
    cor: 'linear-gradient(135deg,#D4E157,#827717)',
    habitat: 'Cerrado',
    tracos: { penas:false, pelo:false, casco:false, voa:false, nada:null, sobe:null, comeFrutas:false, comeCarne:true, comeInsetos:false },
    parecidos: [],
    curiosidade: 'A cascavel vive no Cerrado! 🌾 Quando ela balança o chocalho, está avisando: fique longe! Se ouvir esse barulho, afaste-se e chame um adulto.',
  },
};

// ═══════════════════════════════════════════════════════════════
//  PERGUNTAS DE CARACTERÍSTICA (uma das versões da 2ª etapa)
//  Cada pergunta olha UM traço. A palavra-chave vai entre asteriscos:
//  a tela destaca, a narração lê sem eles.
//  Pergunta nova = traço novo em TODAS as fichas + uma linha aqui.
// ═══════════════════════════════════════════════════════════════
const PERGUNTAS = [
  // Corpo — o mais concreto para a idade
  { traco:'penas',       icone:'🪶', texto:'Qual destes animais tem *penas*?' },
  { traco:'pelo',        icone:'🧸', texto:'Qual destes animais tem *pelo*?' },
  { traco:'casco',       icone:'🛡️', texto:'Qual destes animais tem uma *casca dura*?' },
  // Movimento — fácil de imitar na sala
  { traco:'voa',         icone:'🕊️', texto:'Qual destes animais *voa*?' },
  { traco:'nada',        icone:'🌊', texto:'Qual destes animais *nada*?' },
  { traco:'sobe',        icone:'🌳', texto:'Qual destes animais *sobe* nas árvores?' },
  // Alimentação
  { traco:'comeFrutas',  icone:'🍌', texto:'Qual destes animais come *frutas*?' },
  { traco:'comeCarne',   icone:'🥩', texto:'Qual destes animais come *carne*?' },
  { traco:'comeInsetos', icone:'🐜', texto:'Qual destes animais come *insetos*?' },
];

// ═══════════════════════════════════════════════════════════════
//  O MAPA — mapa novo (do kit)
//  As moitas guardam só a posição: quais bichos cada uma esconde é
//  sorteado a cada partida. Coordenadas em pixels do desenho do mapa.
//  Trocou o desenho? Reveja estes números e refaça js/trilhas.js com
//  ferramentas/gerar-trilhas.html.
// ═══════════════════════════════════════════════════════════════
const MAPA = {
  nome: 'Fauna Brasileira',
  badge: '🌿',
  largura: 1536,
  altura: 1024,
  // A árvore do final fica ao lado do lago do centro, perto da trilha
  arvore: { x: 655, y: 495 },
  // O sapo nasce EM CIMA da trilha, logo abaixo da árvore
  inicio: { x: 676, y: 556 },
  // Âncoras das 6 moitas, na ordem em que abrem (sentido horário).
  // Já estão sobre a trilha do js/trilhas.js do kit; cada uma passeia
  // até `raio` px daqui (ver referencias/trilhas-e-moitas-no-mapa.png).
  moitas: [
    { x: 100,  y: 204, raio: 90 },   // clareira de areia, canto de cima à esquerda
    { x: 740,  y: 252, raio: 90 },   // curva da trilha no meio de cima
    { x: 1388, y: 252, raio: 90 },   // à direita do lago, canto de cima à direita
    { x: 1196, y: 852, raio: 90 },   // perto da cachoeira, canto de baixo à direita
    { x: 668,  y: 876, raio: 90 },   // trilha do meio de baixo
    { x: 156,  y: 820, raio: 90 },   // à beira do lago, canto de baixo à esquerda
  ],
  // Pontos sobre a água do mapa novo, onde acendem os brilhos (5.2).
  // Medidos no fundo.png: pixel azul (matiz 175–220°, saturação e
  // brilho de pelo menos 45%), em pedaços de água de pelo menos 400 px,
  // a 6 px ou mais da margem e 12 px da borda do mapa, um ponto a cada
  // 30 px. As elipses da rodada 4 cobriam pouca água e o brilho
  // acendia no mato. Trocou o mapa? Refaça a lista com
  // ferramentas/gerar-trilhas.html.
  brilhosAgua: [
    [481,38], [503,59], [513,30], [463,104], [509,119], [542,96], [575,107], [521,150],
    [560,154], [564,184], [597,164], [597,130], [1205,245], [1240,232], [1294,247], [1204,278],
    [1206,308], [1235,266], [1242,301], [1266,267], [1290,298], [1309,274], [502,440], [546,428],
    [812,392], [844,413], [459,456], [478,505], [484,473], [508,500], [530,454], [539,508],
    [561,454], [577,497], [854,509], [1328,476], [1344,507], [1366,485], [1371,454], [1396,494],
    [1402,458], [499,529], [865,546], [1376,517], [881,577], [908,592], [930,615], [927,655],
    [954,676], [964,725], [326,811], [211,888], [241,868], [275,863], [307,865], [309,895],
    [1347,862], [228,913], [256,900], [1299,955], [1333,923], [1360,908], [1327,972], [1350,992],
    [1379,982], [1430,995],
  ],
};
```

## Anexo C — `js/sprites.js` (valores padrão)

```js
'use strict';
// ═══════════════════════════════════════════════════════════════
//  SPRITES — ONDE ENTRAM AS ANIMAÇÕES E OS FUNDOS
// ═══════════════════════════════════════════════════════════════
//  Cada animação é uma FOLHA: um PNG com vários quadros do mesmo
//  tamanho em grade, lidos da esquerda para a direita, linha por linha.
//    arquivo      caminho da folha (ou arquivos: [...], um PNG por quadro)
//    quadroL      largura de UM quadro, em pixels
//    quadroA      altura de UM quadro, em pixels
//    colunas      quantos quadros cabem numa linha da folha
//    quadros      quantos quadros a animação usa
//    linha        (opcional) linha da folha em que a animação começa; padrão 0
//    fps          quadros por segundo (0 = imagem parada)
//    loop         true repete; false para no último quadro
//    sequencia    (opcional) ordem dos quadros; repetir um número segura
//                 aquele quadro: [0,0,0,1,0] = parado, pisca de vez em quando
//    ancora       ponto do quadro que fica na posição: {x:.5, y:1} = meio
//                 do pé (para quem voa, o meio do corpo)
//    olhaPara     (opcional) 'direita' (padrão) ou 'esquerda'
//    alturaNoMapa (opcional) altura desenhada no mapa, em pixels do mapa
//
//  ativo:false = o arquivo ainda não existe e o jogo usa a reserva.
//  Pôs o arquivo na pasta? Troque para ativo:true e abra
//  ferramentas/conferir-arquivos.html para ver se as medidas batem.
//  Pixel art: o ideal são quadros de 64 ou 128 px, mas qualquer
//  tamanho serve, desde que o manifesto diga qual.
// ═══════════════════════════════════════════════════════════════

const SPRITES = {

  // ── SAPO EXPLORADOR ──────────────────────────────────────────
  sapo: {
    alturaNoMapa: 90,
    // Sapo novo (estilo da folha de referência): visto de lado, olhando
    // para a direita. Para a esquerda, o jogo espelha; para cima ou para
    // baixo, mantém o último lado. Entra quando os dois estiverem ligados.
    parado:  { ativo:false, arquivo:'assets/sprites/sapo/parado.png',  quadroL:128, quadroA:128, colunas:4, quadros:4, fps:6,  loop:true, ancora:{x:.5, y:.95} },
    andando: { ativo:false, arquivo:'assets/sprites/sapo/andando.png', quadroL:128, quadroA:128, colunas:6, quadros:6, fps:10, loop:true, ancora:{x:.5, y:.95} },
    // Enquanto o sapo novo não chega: o sapo do tronco da abertura (kit),
    // já no estilo novo. Parado, usa SPRITES.abertura.sapo.parado (pisca,
    // sorri e coaxa); andando, o 1º quadro dela dando pulinhos por código.
    // O pulo da abertura NÃO serve para andar: sobe mais que o dobro da
    // altura do sapo.
    tronco: { ativo:true, alturaNoMapa:72, pulinho:{ altura:8, porSegundo:3 } },
    // Reserva final: a folha da 2.0, com 4 linhas (baixo, cima, esquerda,
    // direita) × 4 quadros de 180×210 e ciclo de 0,92 s.
    antigo: {
      ativo: true, arquivo: 'assets/images/sapo-sprite.png',
      quadroL: 180, quadroA: 210, colunas: 4, quadros: 4, fps: 4.35, loop: true,
      linhas: { baixo: 0, cima: 1, esquerda: 2, direita: 3 },
      ancora: { x: 0.5, y: 1 },
    },
  },

  // ── MOITA ────────────────────────────────────────────────────
  // Na folha de referência: "Arbusto" (Tiles Animados) e "Explosão de folhas".
  moita: {
    alturaNoMapa: 110,
    parada:     { ativo:false, arquivo:'assets/sprites/moita/parada.png',     quadroL:128, quadroA:128, colunas:4, quadros:4, fps:4,  loop:true,  ancora:{x:.5, y:.95} },
    balancando: { ativo:false, arquivo:'assets/sprites/moita/balancando.png', quadroL:128, quadroA:128, colunas:6, quadros:6, fps:10, loop:true,  ancora:{x:.5, y:.95} },
    abrindo:    { ativo:false, arquivo:'assets/sprites/moita/abrindo.png',    quadroL:128, quadroA:128, colunas:6, quadros:6, fps:12, loop:false, ancora:{x:.5, y:.95} },
  },

  // ── ÁRVORE SAGRADA ───────────────────────────────────────────
  arvore: {
    alturaNoMapa: 180,
    parada:   { ativo:false, arquivo:'assets/sprites/arvore/parada.png',   quadroL:128, quadroA:128, colunas:4, quadros:4, fps:4, loop:true, ancora:{x:.5, y:.95} },
    liberada: { ativo:false, arquivo:'assets/sprites/arvore/liberada.png', quadroL:128, quadroA:128, colunas:6, quadros:6, fps:8, loop:true, ancora:{x:.5, y:.95} },
  },

  // ── MAPA ─────────────────────────────────────────────────────
  mapa: {
    // Mapa novo (kit). 1 quadro; pode virar folha de até 4.
    // ATENÇÃO: se o desenho das trilhas mudar, refaça js/trilhas.js.
    fundo: { ativo:true, arquivo:'assets/sprites/mapa/fundo.png', quadroL:1536, quadroA:1024, colunas:1, quadros:1, fps:0, loop:true, ancora:{x:0, y:0} },
    // Pedaços animados por cima do fundo; x e y em pixels do mapa (onde
    // fica a âncora). Posições já conferidas no mapa novo:
    cenario: [
      // { ativo:false, arquivo:'assets/sprites/mapa/cachoeira.png', quadroL:64, quadroA:96, colunas:4, quadros:4, fps:10, loop:true, ancora:{x:.5, y:0}, x:503,  y:0,   alturaNoMapa:90 },   // cachoeira de cima
      // { ativo:false, arquivo:'assets/sprites/mapa/cachoeira.png', quadroL:64, quadroA:96, colunas:4, quadros:4, fps:10, loop:true, ancora:{x:.5, y:0}, x:1345, y:835, alturaNoMapa:95 },   // cachoeira de baixo, à direita
      // { ativo:false, arquivo:'assets/sprites/mapa/ponte.png',     quadroL:64, quadroA:80, colunas:4, quadros:4, fps:4,  loop:true, ancora:{x:.5, y:.5}, x:852,  y:468, alturaNoMapa:84 },   // ponte do meio
      // { ativo:false, arquivo:'assets/sprites/mapa/barraca.png',   quadroL:64, quadroA:64, colunas:4, quadros:4, fps:6,  loop:true, ancora:{x:.5, y:1},  x:1055, y:166, alturaNoMapa:50 },   // barraca com bandeira
      // { ativo:false, arquivo:'assets/sprites/mapa/caverna.png',   quadroL:64, quadroA:64, colunas:4, quadros:4, fps:6,  loop:true, ancora:{x:.5, y:1},  x:85,   y:585, alturaNoMapa:80 },   // luz da caverna
    ],
  },

  // ── FUNDOS DAS TELAS ─────────────────────────────────────────
  // Cada tela usa o seu fundo; sem ele, as camadas da floresta; sem elas,
  // um degradê. Os fundos cobrem a tela inteira sem distorcer, como
  // background-size: cover.
  //   largura, altura  medidas da imagem, em pixels
  //   panorama         segundos para ir de uma ponta à outra: o fundo vai
  //                    e volta devagar, começando pelo meio e freando nas
  //                    pontas (5.5). 0 = parado e centrado.
  //   pintado          true = pintura, não pixel art: sempre com suavização
  fases: {
    // Fundos pintados do kit (referencias/fundos-das-telas.png mostra todos)
    som:             { ativo:true, arquivo:'assets/sprites/fases/som.jpg',              largura:2576, altura:475, panorama:180, pintado:true },   // moldura verde da selva
    sombra:          { ativo:true, arquivo:'assets/sprites/fases/sombra.jpg',           largura:2576, altura:475, panorama:180, pintado:true },   // floresta à noite
    caracteristica:  { ativo:true, arquivo:'assets/sprites/fases/caracteristica.jpg',   largura:1286, altura:478, panorama:0,   pintado:true },   // painel verde-azulado
    charada:         { ativo:true, arquivo:'assets/sprites/fases/charada.jpg',          largura:1286, altura:478, panorama:0,   pintado:true },   // toca de terra
    celebracao:      { ativo:true, arquivo:'assets/sprites/fases/celebracao.jpg',       largura:2576, altura:475, panorama:180, pintado:true },   // noite com estrelas e confete
    final:           { ativo:true, arquivo:'assets/sprites/fases/final.jpg',            largura:2576, altura:477, panorama:180, pintado:true },   // Pantanal ao pôr do sol
    aberturaMontada: { ativo:true, arquivo:'assets/sprites/fases/abertura-montada.jpg', largura:2576, altura:476, panorama:180, pintado:true },   // Cerrado de dia (modo montado)
    // A arte da abertura SEM bichos, SEM letreiro e SEM botões (falta).
    abertura:        { ativo:false, arquivo:'assets/sprites/fases/abertura.png',        largura:1920, altura:1080, panorama:0 },

    // Camadas em parallax (opcionais, reserva dos fundos; folha de
    // referência: "Cenários Extras"). PNGs de 1920×1080 que se repetem na
    // horizontal e deslizam devagar (velocidade em px/s; as de trás, mais
    // devagar). Só o céu é opaco; as outras têm fundo transparente.
    floresta: {
      camadas: [
        { ativo:false, arquivo:'assets/sprites/fases/floresta-1-ceu.png',           velocidade:0  },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-2-montanhas.png',     velocidade:3  },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-3-arvores-longe.png', velocidade:6  },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-4-arvores-meio.png',  velocidade:10 },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-5-arvores-perto.png', velocidade:16 },
        { ativo:false, arquivo:'assets/sprites/fases/floresta-6-plantas.png',       velocidade:24 },
      ],
    },

    // Arte pronta da abertura (kit): já traz o letreiro, os três letreiros
    // dos desafios, o JOGAR e a engrenagem desenhados (ver 5.8).
    // Áreas em % da arte: [esquerda, topo, largura, altura].
    aberturaPronta: {
      ativo: true, arquivo: 'assets/sprites/fases/abertura-pronta.png', largura: 1779, altura: 884,
      proporcaoMinima: 1.5,      // tela mais estreita que isto usa o modo montado
      areas: {
        jogar:     [39.3, 80.9, 22.2, 12.4],
        config:    [93.8,  2.5,  5.2, 10.0],
        som:       [35.4, 48.5, 29.5,  8.6],
        sombra:    [35.4, 58.5, 29.2,  8.5],
        charada:   [35.4, 68.4, 29.2,  9.0],
        // Continuar e Apagar: vazios na arte, placas em HTML, as duas a
        // 19 px do JOGAR; o Apagar termina antes do sapo do tronco.
        continuar: [23.2, 82.5, 15.0, 10.0],
        apagar:    [62.6, 82.5, 15.0, 10.0],
      },
    },
  },

  // ── ABERTURA ANIMADA (kit) ───────────────────────────────────
  // Posições (x, y) em pixels da ARTE da abertura (1779×884), como se
  // ela estivesse no tamanho original: a cena acompanha a arte na tela.
  // escala = tamanho do sprite na arte (0.52 = cada pixel do sprite vira
  // 0,52 px da arte). Intervalos [mín, máx] são sorteados a cada vez;
  // primeiraVez = segundos até a 1ª vez (cedo, como na prévia).
  // A prévia ferramentas/previa-abertura.html mostra tudo funcionando.
  abertura: {
    // A arte SEM o tatu, o sapo do tronco e as borboletas, que agora se
    // mexem por cima. Provisória (tirados por programa). Só vale se o tatu,
    // o sapo e a borboleta carregarem; senão, volta a arte original (5.8).
    fundoLimpo: { ativo:true, arquivo:'assets/sprites/fases/abertura-pronta-limpa.png', largura:1779, altura:884 },

    // Pousados: ficam exatamente em cima dos que estão desenhados na arte.
    arara: { ativo:true, arquivo:'assets/sprites/abertura/arara-pousada.png', quadroL:199, quadroA:315, colunas:4, quadros:4, fps:6, loop:true,
             ancora:{x:.603, y:.987}, sequencia:[0,0,0,0,0,1,0,0,0,0,3,3,0,0,0,0,2,2,2,0],
             x:202.1, y:211.9, escala:0.52 },
    tucano: { ativo:true, arquivo:'assets/sprites/abertura/tucano-pousado.png', quadroL:230, quadroA:255, colunas:4, quadros:4, fps:6, loop:true,
              ancora:{x:.426, y:.701}, sequencia:[0,0,0,0,0,1,0,0,0,3,3,0,0,0,0,2,2,0], olhaPara:'esquerda',
              x:1690.8, y:318, escala:0.54, atraso:1.3 },

    // Sapo do tronco: pisca, sorri e coaxa; de tempos em tempos pula no lugar.
    sapo: {
      x:1428.2, y:745.8, escala:0.553, pulaACada:[6, 11], primeiraVez:6,
      parado:  { ativo:true, arquivo:'assets/sprites/abertura/sapo-parado.png',  quadroL:166, quadroA:130, colunas:5, quadros:5, fps:6,  loop:true,
                 ancora:{x:.456, y:.965}, sequencia:[0,0,0,1,1,0,0,2,0,0,0,1,1,0,0,3,3,0,4,4] },
      pulando: { ativo:true, arquivo:'assets/sprites/abertura/sapo-pulando.png', quadroL:154, quadroA:355, colunas:6, quadros:6, fps:12, loop:false,
                 ancora:{x:.516, y:.99} },
    },

    // Tatu: usa SPRITES.animais.tatu. Parado → anda `caminho` px para a
    // direita → festa uma vez (enrola, segura, desenrola) → volta → parado.
    tatu: { x:374.1, y:695.5, escala:0.458, caminho:165, vel:38, paradoPor:[5, 9], primeiraVez:5 },

    // Arara voando: atravessa o céu, para um lado ou para o outro.
    araraVoando: { ativo:true, arquivo:'assets/sprites/abertura/arara-voando.png', quadroL:275, quadroA:318, colunas:5, quadros:5, fps:10, loop:true,
                   ancora:{x:.554, y:.445}, sequencia:[0,1,2,3,4,3,2,1],
                   altura:120, vel:230, faixaY:[70, 150], ondula:10, aCada:[10, 16], primeiraVez:6 },

    // Daqui para baixo, os desenhos vêm de SPRITES.efeitos.
    // Borboletas em "oito": x = cx + ax·sen(t·fx + fase)
    //                       y = cy + ay·sen(t·fy + 1,7·fase)
    borboletas: [
      { cx:470,  cy:362, ax:95,  ay:40, fx:0.55, fy:0.9, fase:0 },
      { cx:1600, cy:470, ax:80,  ay:50, fx:0.45, fy:0.8, fase:2 },
      { cx:260,  cy:560, ax:110, ay:45, fx:0.5,  fy:1.0, fase:4 },
    ],
    alturaBorboleta: 46,
    // Vaga-lumes piscando, cada um no seu ritmo (velocidade 0,7 a 1,2)
    vagalumes: [[160,320], [96,388], [52,662], [95,752], [240,470], [1345,826], [1565,420], [1712,610], [1228,522], [600,600]],
    alturaVagalume: 38,
    // Vaga-lume voando da caverna para o meio, aparecendo e sumindo
    vooVagalume: { de:[150, 600], ate:[530, 440], duracao:6, ondula:20, altura:60, aCada:[7, 12], primeiraVez:4 },
    // Folhas caindo das copas (faixas de x)
    folhas: { copas:[[20, 560], [1230, 1760]], aCada:[0.8, 1.5], max:10, vel:[32, 52], balanco:26, tamanho:[28, 40], somemEntre:[760, 860] },
    // Brilhos sobre as letras do letreiro (160 pontos medidos na arte,
    // os mesmos da prévia)
    brilhos: {
      aCada:[0.45, 0.95], tamanho:[40, 58],
      pontos: [
        [766,145], [771,140], [861,144], [876,134], [881,133], [884,129], [889,130], [906,155], [911,141], [940,131],
        [978,151], [987,157], [994,143], [1024,141], [1053,156], [1054,152], [1089,152], [1096,151], [613,195], [630,191],
        [637,181], [645,190], [683,183], [684,179], [685,165], [686,169], [686,174], [728,195], [731,160], [734,164],
        [734,192], [770,174], [775,192], [777,193], [783,180], [863,160], [887,199], [903,176], [936,199], [940,199],
        [946,163], [974,185], [976,177], [978,192], [980,187], [985,163], [993,187], [998,195], [1056,189], [1059,180],
        [1077,176], [1088,182], [1094,162], [1119,199], [1120,199], [1130,175], [1133,172], [1151,169], [1154,172], [1161,178],
        [1167,161], [1167,193], [1176,182], [1207,170], [618,225], [618,203], [620,223], [625,233], [649,227], [650,226],
        [655,229], [664,200], [667,204], [709,221], [717,221], [726,202], [731,202], [735,212], [740,216], [775,206],
        [789,202], [789,215], [806,207], [868,203], [884,207], [890,205], [998,205], [999,204], [1003,211], [1011,210],
        [1017,209], [1022,205], [1041,206], [1048,209], [1084,217], [1085,206], [1086,219], [1093,216], [1134,224], [1137,223],
        [1141,233], [1142,227], [1147,235], [1167,206], [1173,213], [650,245], [650,246], [653,246], [725,251], [796,252],
        [804,255], [821,249], [830,248], [833,250], [863,279], [879,257], [896,253], [942,279], [966,258], [1003,276],
        [1030,256], [1054,261], [1075,270], [1080,275], [710,305], [715,283], [717,285], [719,297], [727,301], [800,294],
        [800,284], [805,294], [811,288], [819,281], [819,311], [824,319], [824,288], [826,282], [828,288], [863,306],
        [877,315], [886,312], [892,295], [895,290], [925,314], [934,311], [935,313], [935,316], [956,284], [957,287],
        [989,316], [990,281], [992,316], [995,296], [1000,315], [1055,303], [814,322], [1018,325], [1058,322], [1060,324],
      ],
    },
    // Cachoeira da arte: fios brancos descendo dentro destes contornos e
    // espuma na base (por código: a folha de cachoeira não serve — Anexo D)
    cachoeira: [
      { contorno:[[1447,252], [1488,252], [1482,398], [1431,398]], fios:12 },
      { contorno:[[1394,402], [1460,402], [1438,496], [1381,496]], fios:14 },
    ],
  },

  // ── EFEITOS (kit) ────────────────────────────────────────────
  // Usados na abertura, no mapa e nas telas. Sem o arquivo, cada efeito
  // é desenhado por código, com formas simples (5.1).
  efeitos: {
    borboleta:        { ativo:true, arquivo:'assets/sprites/efeitos/borboleta.png',         quadroL:133, quadroA:118, colunas:3,  quadros:3,  fps:14, loop:true,  ancora:{x:.498, y:.459}, sequencia:[0,1,2,1] },
    // 18 folhas diferentes, uma por quadro: cada folha que cai sorteia a sua
    folhas:           { ativo:true, arquivo:'assets/sprites/efeitos/folhas.png',            quadroL:96,  quadroA:97,  colunas:18, quadros:18, fps:0,  loop:true,  ancora:{x:.513, y:.487} },
    vagalumePiscando: { ativo:true, arquivo:'assets/sprites/efeitos/vagalume-piscando.png', quadroL:99,  quadroA:104, colunas:8,  quadros:8,  fps:10, loop:true,  ancora:{x:.494, y:.503}, sequencia:[0,1,2,3,4,5,6,7,6,5,4,3,2,1] },
    vagalumeVoando:   { ativo:true, arquivo:'assets/sprites/efeitos/vagalume-voando.png',   quadroL:149, quadroA:111, colunas:8,  quadros:8,  fps:12, loop:true,  ancora:{x:.6,   y:.582} },
    // Estrela que acende e some (toca uma vez)
    brilho:           { ativo:true, arquivo:'assets/sprites/efeitos/brilho-estrela.png',    quadroL:120, quadroA:120, colunas:8,  quadros:8,  fps:14, loop:false, ancora:{x:.498, y:.499} },
    // Bola de luz subindo, com rastro de faíscas (a luz do acerto)
    luzRastro:        { ativo:true, arquivo:'assets/sprites/efeitos/luz-rastro.png',        quadroL:136, quadroA:134, colunas:8,  quadros:8,  fps:12, loop:true,  ancora:{x:.316, y:.331} },
  },

  // ── INTERFACE ────────────────────────────────────────────────
  ui: {
    // Letreiro "Que Bicho É Esse?" com fundo transparente (modo montado).
    logo:  { ativo:false, arquivo:'assets/sprites/ui/logo.png', quadroL:1024, quadroA:512, colunas:1, quadros:1, fps:0, loop:true },
    // Placa de madeira vazia para os botões, usada como border-image
    // (9 partes). `corte` = largura da borda, em pixels da imagem.
    placa: { ativo:false, arquivo:'assets/sprites/ui/placa.png', corte:24 },
  },

  // ── BICHOS ───────────────────────────────────────────────────
  animais: {
    // Medidas de todo bicho. Os arquivos ficam em
    // assets/sprites/animais/<id>/parado.png, andando.png e festa.png
    padrao: {
      parado:  { quadroL:128, quadroA:128, colunas:4, quadros:4, fps:6,  loop:true },
      andando: { quadroL:128, quadroA:128, colunas:6, quadros:6, fps:10, loop:true },
      festa:   { quadroL:128, quadroA:128, colunas:6, quadros:6, fps:10, loop:true },
      ancora:  { x:0.5, y:0.95 },
    },
    // false = ainda não tenho · true = tenho, com as medidas do padrão
    // { ... } = tenho, com estas medidas no lugar das do padrão (a âncora
    //   também pode vir em cada animação)
    //   ex.: gato: { parado:true, andando:{ colunas:8, quadros:8 }, festa:false },
    arara:      { parado:false, andando:false, festa:false },   // a azul e amarela (Anexo B)
    onca:       { parado:false, andando:false, festa:false },
    flamingo:   { parado:false, andando:false, festa:false },
    macaco:     { parado:false, andando:false, festa:false },
    mico:       { parado:false, andando:false, festa:false },
    // Tatu do kit (também anda na abertura). Quadros maiores que o padrão
    // e de tamanhos diferentes: o jogo usa UMA escala para o bicho inteiro
    // (5.4). O parado tem 1 quadro só e respira por código.
    tatu: {
      parado:  { quadroL:339, quadroA:147, colunas:1,  quadros:1,  fps:0,  ancora:{x:.556, y:.963} },
      andando: { quadroL:339, quadroA:147, colunas:8,  quadros:8,  fps:10, ancora:{x:.556, y:.963} },
      festa:   { quadroL:328, quadroA:169, colunas:11, quadros:11, fps:10, ancora:{x:.554, y:.968},
                 // enrola (0 → 10), segura e desenrola (10 → 0): 3,6 s
                 sequencia:[0,1,2,3,4,5,6,7,8,9,10, 10,10,10,10,10,10,10,10,10,10,10,10,10,10, 10,9,8,7,6,5,4,3,2,1,0] },
    },
    capivara:   { parado:false, andando:false, festa:false },
    tartaruga:  { parado:false, andando:false, festa:false },
    caranguejo: { parado:false, andando:false, festa:false },
    gato:       { parado:false, andando:false, festa:false },
    cachorro:   { parado:false, andando:false, festa:false },
    mosquito:   { parado:false, andando:false, festa:false },
    cascavel:   { parado:false, andando:false, festa:false },
  },
};
```

## Anexo D — Ficha dos arquivos (o que já chegou e o que falta)

Regras para todos os arquivos:
- PNG com fundo transparente. Exceções: os fundos do mapa e das telas e a camada do céu, que são opacos e podem ser JPG. GIF animado não serve: converta em folha de quadros.
- Mesmo estilo da arte da abertura e do mapa novo: pixel art colorida, com contorno escuro (os fundos das telas são pinturas no mesmo clima).
- Numa folha, quadros do mesmo tamanho, lado a lado, sem espaço entre eles (o ideal é 64 ou 128 px, mas qualquer tamanho serve: o manifesto diz qual). O bicho no mesmo lugar em todos os quadros, com o pé no mesmo ponto, olhando para a direita (ou com `olhaPara: 'esquerda'` no manifesto). Todas as animações de um mesmo bicho na mesma escala de desenho.
- Nomes em minúsculas, sem acento e sem espaço, exatamente como na tabela.
- Sons em MP3, com o bicho já no primeiro segundo, até 8 s úteis e volume parecido entre todos. Dos sons da 2.0, cinco passam disso: onça (9,8 s), tartaruga (30 s), tatu (40 s), flamingo (54 s) e macaco (71 s). O jogo corta em 8 s, com o volume descendo; se der, corte os próprios arquivos em 8 s (o bicho já está no começo): ficam mais leves no GitHub Pages e a ferramenta de conferência para de avisar.
- ids: `arara`, `onca`, `flamingo`, `macaco`, `mico`, `tatu`, `capivara`, `tartaruga`, `caranguejo`, `gato`, `cachorro`, `mosquito`, `cascavel`.

| Arquivo | O que é | Quadro × quantidade (sugestão) | Como ligar | Situação |
|---|---|---|---|---|
| `assets/sprites/mapa/fundo.png` | mapa novo | 1536×1024 × 1 | `SPRITES.mapa.fundo` | ✅ kit |
| `assets/sprites/fases/abertura-pronta.png` | arte da abertura, com letreiro e botões desenhados | 1779×884 × 1 | `SPRITES.fases.aberturaPronta` | ✅ kit |
| `assets/sprites/fases/abertura-pronta-limpa.png` | a mesma arte sem o tatu, o sapo do tronco e as borboletas | 1779×884 × 1 | `SPRITES.abertura.fundoLimpo` | ✅ kit (provisória) |
| `assets/sprites/abertura/arara-pousada.png`, `arara-voando.png`, `tucano-pousado.png`, `sapo-parado.png` e `sapo-pulando.png` | bichos da abertura | medidas no Anexo C | `SPRITES.abertura.*` | ✅ kit |
| `assets/sprites/efeitos/borboleta.png`, `folhas.png`, `vagalume-piscando.png`, `vagalume-voando.png`, `brilho-estrela.png` e `luz-rastro.png` | efeitos da abertura, do mapa e das telas | medidas no Anexo C | `SPRITES.efeitos.*` | ✅ kit |
| `assets/sprites/fases/som.jpg`, `sombra.jpg`, `caracteristica.jpg`, `charada.jpg`, `celebracao.jpg` e `final.jpg` | fundos pintados das etapas, da celebração e do final | 2576×475 (os largos) e 1286×478 | `SPRITES.fases.<tela>` | ✅ kit |
| `assets/sprites/fases/abertura-montada.jpg` | Cerrado de dia: fundo da abertura no modo montado | 2576×476 | `SPRITES.fases.aberturaMontada` | ✅ kit |
| `assets/sprites/fases/abertura.png` | a arte da abertura **sem** bichos, **sem** letreiro e **sem** botões | 1920×1080 × 1 | `SPRITES.fases.abertura` | falta |
| `assets/sprites/ui/logo.png` | letreiro "Que Bicho É Esse?" com fundo transparente | 1024×512 × 1 | `SPRITES.ui.logo` | falta |
| `assets/sprites/ui/placa.png` | placa de madeira vazia, para os botões | 192×96 × 1 | `SPRITES.ui.placa` | opcional |
| `assets/sprites/moita/parada.png` | moita quieta | 128×128 × 4 | `SPRITES.moita.parada` | falta |
| `assets/sprites/moita/balancando.png` | moita sacudindo (tem bicho!) | 128×128 × 6 | `SPRITES.moita.balancando` | falta |
| `assets/sprites/moita/abrindo.png` | moita se abrindo em folhas (não repete) | 128×128 × 6 | `SPRITES.moita.abrindo` | falta |
| `assets/sprites/sapo/parado.png` | sapo novo parado, de lado | 128×128 × 4 | `SPRITES.sapo.parado` | falta (o sapo do tronco cobre) |
| `assets/sprites/sapo/andando.png` | sapo novo andando de lado, com pulinhos baixos | 128×128 × 6 | `SPRITES.sapo.andando` | falta (o sapo do tronco cobre) |
| `assets/sprites/animais/<id>/parado.png` | bicho parado (respira, pisca) | 128×128 × 4 | `SPRITES.animais.<id>.parado` | ✅ tatu (kit) · falta (12) |
| `assets/sprites/animais/<id>/andando.png` | bicho andando | 128×128 × 6 | `SPRITES.animais.<id>.andando` | ✅ tatu (kit) · falta (12) |
| `assets/sprites/animais/<id>/festa.png` | bicho comemorando | 128×128 × 6 | `SPRITES.animais.<id>.festa` | ✅ tatu (kit) · opcional |
| `assets/sprites/fases/floresta-1-ceu.png` a `floresta-6-plantas.png` | camadas de reserva dos fundos das telas | 1920×1080, repetindo na horizontal | `SPRITES.fases.floresta.camadas` | opcional |
| `assets/sprites/arvore/parada.png` e `liberada.png` | árvore sagrada | 128×128 × 4 e × 6 | `SPRITES.arvore.*` | opcional |
| `assets/sprites/mapa/<nome>.png` | pedaços animados do mapa (cachoeiras, ponte, barraca, caverna) | 64 a 128 px × 4 a 8 | item em `SPRITES.mapa.cenario` | opcional |
| `assets/images/animais/<id>.png` | ilustração parada (reserva do sprite) | 512×512 × 1 | `imagem` em `dados.js` | ✅ 8 da 2.0 · falta gato, cachorro, mosquito, cascavel e caranguejo |
| `assets/sounds/<id>.mp3` | som do bicho | até 8 s | `som` em `dados.js` | ✅ 8 da 2.0 · falta gato, cachorro, mosquito, cascavel e caranguejo |
| `assets/images/sapo-sprite.png` | sapo da 2.0 (reserva final) | 180×210, 4 direções × 4 | já ligado (`SPRITES.sapo.antigo`) | ✅ da 2.0 |

**Sobre os arquivos do kit:**
- **Não usada:** a folha da cachoeira enviada junto com os sprites da abertura. É uma cena inteira, de outra cachoeira, e as pedras mudam de um quadro para o outro (o fundo tremeria). A água da cachoeira da arte ganha movimento por código (5.8).
- **Arara:** a da abertura é a arara-vermelha; a do jogo (Anexo B) é a azul e amarela. Não ligue o sprite da abertura como o bicho `arara` enquanto a ficha falar em penas azuis e amarelas.
- **Tucano:** não está no catálogo; aparece só na abertura.
- **Sapo do tronco:** cobre o sapo do mapa enquanto o sapo andando não chega. O pulo dele, alto demais para andar, fica só na abertura.
- **Arte limpa:** provisória. O tatu, o sapo e as borboletas foram tirados por programa e os buracos foram cobertos com pedaços da própria arte: de longe não se nota, de perto sim. A versão definitiva é a `fases/abertura.png` da tabela.
- **Fundos das telas:** vieram em duas pranchas (três paisagens e quatro painéis) e foram separados um a um. Têm cerca de 475 px de altura: em telas Full HD aparecem um pouco macios, o que até ajuda o conteúdo a se destacar. Se houver versões com 1080 px de altura, basta trocar os arquivos (mesmos nomes) e as medidas em `SPRITES.fases`.

**O que aproveitar da folha de referência (`referencias/folha-de-sprites.png`):**
- É uma prancha de estilo — ótima como guia, mas não dá para recortar em quadros: os desenhos têm tamanhos e espaçamentos diferentes, o fundo é escuro (não transparente), há texto por cima e a quantidade de quadros nem sempre bate com a legenda ("Veado (4)" mostra 3, "Arbusto (4)" mostra 2). Cada animação precisa ser exportada sozinha, como na tabela.
- **Usa:** "Sapo Explorador" (parado e andando) → `sapo`; "Animais da Floresta" (capivara, tatu, macaco, mico, onça, arara) e, do quadro "Inimigos", o caranguejo e a cobra (base para a cascavel) → `animais`; "Arbusto" e "Explosão de folhas" → `moita`; "Água e Ambiente", "Vegetação e Natureza" e "Elementos do Cenário" → `mapa.cenario` e efeitos do mapa; "Brilho/Partículas" → estrelinhas do acerto; "Cenários Extras" (camadas de parallax) → `fases.floresta`.
- **Faltam na folha:** flamingo, tartaruga, gato, cachorro e mosquito.
- **Não entram nesta versão:** inimigos e obstáculos, corações de vida e moedas (no jogo, errar não tira nada e a pontuação é em coroas), personagens (guarda, explorador, canoeiro), expressões do sapo e ciclo de dia e noite.

**Ordem sugerida para produzir:** 1) moita (parada, balançando e abrindo), que aparece no mapa e em todas as etapas; 2) sapo andando de lado, com pulinhos baixos (o parado pode ser o do tronco); 3) bichos parado e andando, começando pelos que já estão na folha (o tatu já chegou); 4) arte da abertura limpa de verdade e o letreiro em PNG; 5) sons de gato, cachorro, mosquito, cascavel e caranguejo; 6) se sobrar tempo: pedaços animados do mapa, a árvore e versões maiores dos fundos das telas.

`FIM DO PROMPT`
