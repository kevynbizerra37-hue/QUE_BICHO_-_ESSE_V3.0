# 🐸 Que Bicho É Esse? — versão 3.0

Jogo educativo para crianças pequenas descobrirem animais brasileiros pelo **som**, pela **sombra**, pelas **características** e por **charadas**. Dá para jogar só com o teclado e com narração em voz alta, então crianças cegas também conseguem jogar.

**Versões anteriores:** [2.0](https://github.com/kevynbizerra37-hue/que-bicho-e-esse-2.0) · [versão inicial](https://github.com/kevynbizerra37-hue/projeto-que-bicho-e-esse)

A especificação completa da 3.0 está em [`docs/prompt-recriar-jogo-v3.md`](docs/prompt-recriar-jogo-v3.md). Onde este README e ela discordarem, vale a especificação.

## Como jogar

- O sapo explorador anda pelas trilhas de terra do mapa: setas ou WASD no teclado, ou arrastando o dedo no celular.
- Seis moitas se mexem pelo mapa. Elas abrem uma de cada vez, e a que está liberada passeia pela trilha e balança. Chegue perto e aperte **E** ou **ENTER**, ou toque nela.
- Cada moita esconde 3 bichos, um por etapa:
  1. **Som:** escute o bicho e escolha quem é.
  2. **Sombra** ou **característica:** descubra pela silhueta, ou responda a perguntas como "qual destes animais voa?".
  3. **Charada:** a moita fala uma pista e você adivinha.
- Acertar de primeira vale 25, 20 e 30 coroas. Depois de errar, o acerto vale a metade. Cada moita concluída dá mais 30 de bônus, e as coroas da moita só entram no placar na celebração. A partida perfeita fecha em 630 coroas.
- Com as 6 moitas concluídas, vá até a árvore sagrada do centro para ver o final. Cada partida sorteia outros animais.

**Jogando pelo som:** em ⚙️, ligue a *Narração em voz alta*.

| Tecla | O que faz |
|---|---|
| **1 a 4** | escolhe a resposta |
| **R** | repete a pergunta |
| **S** | toca o som do bicho de novo |
| **ENTER** no mapa | entra na próxima moita, de qualquer lugar |

## Rodar no computador

Baixe o projeto (**Code → Download ZIP**), descompacte e abra o `index.html` no Chrome, no Edge ou no Firefox. Não precisa instalar nada nem ter internet: a fonte e todos os desenhos vão junto.

**Para publicar no GitHub Pages:** vá em Settings → Pages, escolha a branch `main` e salve. O endereço fica assim: `https://kevynbizerra37-hue.github.io/<nome-do-repositório>/`.

## O que há de novo na 3.0

- **Mapa:** mapa novo desenhado num canvas, com moitas que andam pela trilha no lugar das cavernas e os bichos descobertos passeando em volta delas.
- **Visual:** identidade nova, com pixel art e placas de madeira, abertura animada e fundos pintados em cada etapa, na celebração e no final.
- **Sprites:** sistema de sprites com reserva para tudo. Sem um desenho, o jogo usa a ilustração. Sem a ilustração, usa o emoji, que se mexe por código. Sem o som, usa bipes.
- **Movimento:** todo movimento é por tempo, então o sapo anda igual num monitor de 60 Hz e num de 144 Hz.
- **Catálogo:** 13 animais. Entraram caranguejo, gato, cachorro, mosquito e cascavel, e as curiosidades de bioma foram corrigidas.
- **Correções da 2.1:**
  - as coroas só entram no fim da moita;
  - ENTER num botão com foco não entra na moita;
  - o foco vai para o título ao trocar de tela;
  - as janelas prendem o foco;
  - a sombra e o painel têm texto para leitor de tela.

## Para quem for mexer no jogo

| O quê | Onde |
|---|---|
| Números ajustáveis (velocidades, distâncias, tempos, efeitos) | `js/config.js` |
| Animais, perguntas de característica e mapa | `js/dados.js` |
| Onde está cada sprite e cada fundo | `js/sprites.js` |
| Trilhas por onde o sapo e as moitas andam | `js/trilhas.js`, gerado por `ferramentas/gerar-trilhas.html` |
| Pré-carga, reservas e conferência dos arquivos | `js/recursos.js` |
| Quadros, silhueta, bicho, moita, sapo e VisorDeSprite | `js/sprite.js` |
| Fundos das telas e efeitos (folhas, vaga-lumes, brilhos, confete) | `js/efeitos.js` |
| Canal único de áudio e narração | `js/audio.js` e `js/voz.js` |
| Progresso salvo (prefixo `qbe3_`) | `js/salvar.js` |
| Sorteio das moitas, distratores, perguntas e charadas | `js/sorteio.js` |
| Abertura animada | `js/abertura.js` |
| Mapa, sapo, moitas, minimapa | `js/mapa.js` |
| Etapas e celebração | `js/etapas.js` |
| Navegação, janelas, final e teclado | `js/telas.js` |
| Inicialização e o laço único | `js/main.js` |

Os scripts entram no `index.html` nesta ordem: config, dados, sprites, trilhas, util, recursos, sprite, efeitos, audio, voz, salvar, sorteio, abertura, mapa, etapas, telas e main. Não use `fetch`, módulos ou arquivos `.json`: o jogo precisa abrir pelo `file://`.

### Ligar um sprite ou um som novo

1. Confira o nome e a medida no **Anexo D** da especificação. Os nomes vão em minúsculas, sem acento e sem espaço, porque o GitHub Pages diferencia `Gato.png` de `gato.png`.
2. Coloque o arquivo na pasta indicada:
   - `assets/sprites/...` para os sprites;
   - `assets/images/animais/<id>.png` para as ilustrações;
   - `assets/sounds/<id>.mp3` para os sons.
3. Abra `ferramentas/conferir-arquivos.html`. O arquivo novo aparece com 🟡, e a linha diz exatamente o que mudar:
   - em `js/sprites.js`, `ativo:false` → `ativo:true`, ou `false` → `true` para os bichos;
   - em `js/dados.js`, `null` → o caminho do arquivo.
4. Faça a troca e recarregue a página. O selo deve virar ✅, com as medidas esperadas e as reais iguais e a animação rodando na prévia.

Folha de sprite precisa ter fundo transparente, os quadros do mesmo tamanho e o pé do bicho no mesmo ponto em todos os quadros. Para sons, use o bicho já no primeiro segundo e no máximo 8 s úteis.

### Trocar o fundo de uma tela

Os fundos ficam em `SPRITES.fases` (`js/sprites.js`). Basta trocar o arquivo da tela, com o mesmo nome, e as medidas `largura` e `altura`. Use `panorama` (em segundos) para fundos largos que vão e voltam, ou `0` para um fundo parado. Use `pintado: true` para pintura, que sempre vai com suavização.

### Acrescentar um animal

1. Copie uma ficha em `js/dados.js` e preencha todos os campos:
   - os 9 traços (`null` = "depende");
   - as charadas em 1ª pessoa, terminando em "Quem sou eu?";
   - `parecidos`, nos dois sentidos.
2. Acrescente a linha do bicho em `SPRITES.animais` (`js/sprites.js`), com `false` nas animações que ainda não existem.
3. Abra o jogo com o console aberto. A conferência da abertura avisa se faltar algum traço ou se um `parecidos` citar um id que não existe.

### Trocar o mapa e refazer as trilhas

1. Troque `assets/sprites/mapa/fundo.png` e as medidas em `SPRITES.mapa.fundo` e em `MAPA.largura`/`MAPA.altura`.
2. Abra `ferramentas/gerar-trilhas.html` e escolha a imagem nova. Faça as marcações:
   - marque as pontes com retângulos;
   - com o pincel, apague o que parece terra e não é, e pinte o que faltou.
3. Confira os avisos do início, da árvore e das moitas. Depois copie os dois textos:
   - o primeiro substitui todo o `js/trilhas.js`;
   - o segundo vai no `brilhosAgua` do `MAPA`.
4. Reveja as posições de `MAPA` (início, árvore e moitas). No jogo, abra o modo de conferência com **F9** (ou `?conferir=1` no endereço) para ver a malha, as âncoras, os raios das moitas e os arquivos faltando.

Com o mapa do kit, o botão **Usar as marcações do mapa do kit** marca as duas pontes e apaga a barraca, e a ferramenta refaz a malha atual com 1 quadradinho de diferença.

## Decisões

Escolhas feitas onde a especificação deixava espaço:

- **Ajuda nas curvas:** anda 60 px por segundo, o mesmo que "1 px por quadro" a 60 Hz. Assim o sapo faz as curvas igual em qualquer monitor (critério 10).
- **Passeio pela trilha:** a moita liberada e os bichos que não voam só escolhem destinos aonde se chega em linha reta pela trilha. Por isso nunca saem do caminho nem do raio.
- **"▶ Aperte E":** desce para baixo da moita quando ficaria atrás do placar e fica sempre inteiro na tela. Também aparece perto da árvore liberada.
- **Narração sem emojis:** os emojis saem só da fala. A voz lia "🌳" como "árvore de folhas caducas". O texto na tela fica igual.
- **Abertura carregando:** enquanto a arte não chega, a abertura mostra "Preparando a floresta… %" no meio da tela.
- **Carta errada:** volta ao normal depois do tremor de 0,6 s, como na 2.0, para a criança tentar de novo.
- **Celebração:** cabe na tela em todos os tamanhos testados. Numa tela ainda mais baixa, ela rola em vez de cortar o botão.
- **Gancho de teste:** `QBE.teste` (em `js/main.js`) existe só para os testes automáticos levarem o sapo até uma moita e simularem a taxa de quadros. Não muda nada para quem joga.

## Testes

Os critérios da seção 9 da especificação foram conferidos no Chromium sem interface (Playwright), pelo `file://` e por um servidor local:

- **Partidas pelo teclado:**
  - partida perfeita fecha em **630** coroas e partida com um erro em cada etapa, em **408**;
  - sem rolagem nas etapas em 360×640, 1366×650, 1366×768, 1280×720, 768×1024 e 1920×1080.
- **Narração ligada:** jogando só com ENTER e números, a sombra nunca aparece.
- **Sem arquivos:** sem nenhum sprite, ilustração ou som, o jogo vai do começo ao fim com um único aviso por arquivo.
- **Sorteio e movimento:**
  - 200 sorteios sem falha (1º bicho com som, perguntas sem duas respostas e `parecidos` separados);
  - 10 minutos de moita sem sair da trilha nem do raio;
  - o mesmo caminho a 30, 60 e 144 quadros por segundo.
- **Progresso salvo:** continuar restaura o progresso, lixo nas chaves não quebra nada e o progresso da 2.0 fica intacto.
- **Telas e acessibilidade:**
  - confirmação, foco, janelas e textos para leitor de tela;
  - movimento reduzido;
  - abertura nos dois modos;
  - sprites e fundos desligados;
  - celular emulado.

## Créditos

- Fonte [Fredoka](https://fonts.google.com/specimen/Fredoka), licença SIL Open Font License (`assets/fonts/OFL.txt`).
- Ilustrações, sprites, mapa e fundos das telas gerados com inteligência artificial.
