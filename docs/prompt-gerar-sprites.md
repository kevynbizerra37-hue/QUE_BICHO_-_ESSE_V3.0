# Prompt para gerar os sprites que faltam — Que Bicho É Esse? 3.0

Use num gerador de imagens que aceite imagens de referência e que lembre o que foi feito na conversa, como o ChatGPT ou o Gemini. Gere as imagens e me mande do jeito que saírem: eu tiro o fundo, separo e alinho os quadros, monto cada folha na medida do jogo e ligo no `js/sprites.js`. Ninguém precisa medir nem recortar nada.

São 31 sprites que fazem falta e 21 opcionais (a lista completa está no fim). Vale começar pela moita, que aparece no mapa e em todas as etapas.

## Como usar

1. **Uma conversa por personagem:** cada bicho, o sapo, a moita. Assim o personagem sai igual em todas as animações.
2. **Primeira mensagem:** anexe as referências indicadas na seção do personagem e cole, juntos, o bloco de estilo, a ficha do personagem e o pedido 1.
3. **Depois:** cole os outros pedidos daquela seção, um por mensagem, na ordem.
4. **Confira cada imagem** com a lista "Antes de salvar" e peça a correção na mesma conversa.
5. **Salve** cada imagem com o nome indicado e me mande tudo num `.zip`, como foi feito com o `kit-arquivos.zip`. Pode mandar aos poucos: eu ligo no jogo o que chegar.

As referências estão no repositório, nos caminhos indicados. O fundo transparente funciona de verdade no ChatGPT. No Gemini e em outras ferramentas, use a cor chapada que o bloco de estilo indica.

## Bloco de estilo (cole no começo de toda conversa)

```text
Você vai criar sprites para "Que Bicho É Esse?", um jogo educativo para crianças brasileiras de 4 a 8 anos. Siga estas regras em todas as imagens desta conversa.

ESTILO
- Pixel art detalhada, igual às referências anexadas (a arte da abertura e o tatu): cores vivas e quentes, contorno escuro em volta do personagem, sombreado em 2 ou 3 tons, luz vindo de cima.
- Personagem fofo e simpático, nunca assustador: olhos grandes e brilhantes, jeito de desenho animado.
- Visto de lado, de corpo inteiro, olhando para a DIREITA, a não ser que a ficha diga outra coisa.
- Se eu anexar uma ilustração do bicho, ela serve só para mostrar a espécie e as cores. O estilo é sempre a pixel art das referências.

FORMATO (muito importante)
- Uma folha de sprites: os quadros da animação lado a lado, numa fileira só, da esquerda para a direita, na ordem em que acontecem.
- Exatamente a quantidade de quadros que eu pedir.
- O mesmo personagem em todos os quadros: mesmo desenho, mesmas cores e mesmo tamanho. Só a pose muda.
- O pé sempre na mesma linha do chão, em todos os quadros. O personagem não sai do lugar dentro do quadro.
- Espaço vazio entre um quadro e outro: nada encosta no quadro vizinho, nem uma folha solta.
- Fundo transparente de verdade. Se não conseguir, fundo de uma cor só, magenta puro (#FF00FF), chapado, sem degradê. Nunca o xadrez cinza e branco.
- Só o personagem: sem chão, sem sombra no chão, sem cenário, sem moldura, sem linhas de grade, sem números, sem texto e sem marca-d'água.
- Imagem deitada (paisagem), a mais larga que você puder fazer.
```

## Antes de salvar (confira em toda imagem)

- [ ] O personagem é igual em todos os quadros, do mesmo tamanho.
- [ ] Ele olha para a direita (menos o caranguejo, que fica de frente).
- [ ] O pé está na mesma altura em todos os quadros.
- [ ] O fundo é transparente ou de uma cor só, sem o xadrez.
- [ ] Não tem texto, número, chão nem sombra no chão.
- [ ] Nenhum quadro encosta no outro.
- [ ] A quantidade de quadros é a pedida.

Para corrigir, peça na mesma conversa. Por exemplo: "O bicho mudou de cor no 4º quadro; refaça com ele igual nos 6." Se a ferramenta não conseguir fazer 6 quadros numa fileira, 2 fileiras de 3 também servem: eu leio da esquerda para a direita e de cima para baixo. Se sair um quadro a mais ou a menos e a animação estiver boa, mande assim mesmo: o jogo aceita qualquer quantidade, e eu ajusto o manifesto.

## 1. Moita (3 imagens)

**Anexe:**
- `referencias/folha-de-sprites.png` (os quadros "Arbusto" e "Explosão de folhas");
- `assets/sprites/mapa/fundo.png` (o mapa, para a moita combinar com as plantas dele).

Primeira mensagem: o bloco de estilo e mais este texto.

```text
FICHA — MOITA: uma moita redonda, cheia e fofa, um pouco mais larga que alta, de folhas em três tons de verde, com contorno escuro e brilhinhos nas folhas de cima. Mesmo estilo das plantas do mapa anexado, vista de frente e um pouco de cima. Ela esconde um bicho, mas nada do bicho aparece: sem olhos, sem silhueta, sem patas e sem rabo.

PEDIDO 1 — moita parada: 4 quadros. A moita quietinha, balançando de leve com a brisa: só as folhas de cima mexem, a base fica parada. O 4º quadro emenda no 1º.
```

Salve como `moita-parada.png`.

```text
PEDIDO 2 — moita balançando: a mesma moita, 6 quadros. Ela sacode forte para um lado e para o outro, como se um bicho estivesse mexendo lá dentro, e solta 2 ou 3 folhinhas. A base fica no mesmo lugar. O 6º quadro emenda no 1º.
```

Salve como `moita-balancando.png`.

```text
PEDIDO 3 — moita abrindo: a mesma moita, 6 quadros que tocam uma vez só. Quadro 1: a moita inteira. Quadros 2 a 5: as folhas se abrem para os lados e para cima, como uma explosão de folhas, e a moita vai sumindo. Quadro 6: só umas poucas folhas soltas no ar. Nenhum bicho aparece: o jogo desenha o bicho saindo.
```

Salve como `moita-abrindo.png`.

## 2. Sapo explorador (2 imagens)

**Anexe:**
- `assets/sprites/abertura/sapo-parado.png` (o sapo do tronco, que é este personagem);
- `assets/sprites/animais/tatu/andando.png` (um bicho de lado, no estilo certo).

Primeira mensagem: o bloco de estilo e mais este texto.

```text
FICHA — SAPO EXPLORADOR: é o sapo do tronco da imagem anexada, o mascote do jogo: verde-claro com pintinhas verde-escuras, barriga creme, olhos grandes no alto da cabeça e sorriso largo. Sem mochila e sem chapéu. Agora ele aparece de lado, olhando para a direita, com o mesmo desenho.

PEDIDO 1 — sapo parado: 4 quadros. Sentado de lado, respirando (o papo enche e esvazia um pouco) e piscando no 3º quadro. O 4º quadro emenda no 1º.
```

Salve como `sapo-parado.png`.

```text
PEDIDO 2 — sapo andando: o mesmo sapo, 6 quadros, andando para a direita com pulinhos BAIXOS (sobe no máximo um quarto da altura dele). Quadro 1 agachado, 2 tomando impulso, 3 e 4 no ar e esticado, 5 chegando ao chão, 6 agachado de novo. O 6º quadro emenda no 1º.
```

Salve como `sapo-andando.png`.

Na folha de referência, o sapo explorador tem mochila. Aqui ele fica igual ao sapo do tronco, para o mapa combinar com a abertura. Se a equipe preferir com mochila, tire a frase "Sem mochila e sem chapéu".

## 3. Bichos (12 bichos, 3 imagens cada)

Só o tatu já chegou. Para os outros 12, o `parado` e o `andando` fazem falta. A `festa` é opcional: sem ela, o bicho pula por código.

**Anexe, em toda conversa de bicho:**
- `assets/sprites/animais/tatu/andando.png` (o estilo de todos os bichos);
- a ilustração do bicho, quando houver: `assets/images/animais/<id>.png`. Existe para arara, onça, flamingo, macaco, mico, capivara e tartaruga;
- para o caranguejo e a cascavel, a `referencias/folha-de-sprites.png`: o caranguejo e a cobra do quadro "Inimigos" servem de base.

Primeira mensagem: o bloco de estilo, a ficha do bicho e o pedido 1. Depois, o pedido 2 e o pedido 3. Os pedidos são iguais para todos os bichos:

```text
PEDIDO 1 — parado: o bicho da ficha, 4 quadros, fazendo o "parado" da ficha, bem de leve. O 4º quadro emenda no 1º.
```

```text
PEDIDO 2 — andando: o MESMO bicho (mesmo desenho, mesmas cores e mesmo tamanho), 6 quadros, fazendo o "andando" da ficha, para a direita. É um ciclo: o 6º quadro emenda no 1º. Ele não sai do lugar dentro do quadro.
```

```text
PEDIDO 3 — festa: o MESMO bicho, 6 quadros, fazendo a "festa" da ficha. Começa e termina na pose do parado, para a animação repetir sem pulo.
```

Salve como `<id>-parado.png`, `<id>-andando.png` e `<id>-festa.png`, com o id da ficha. Por exemplo: `onca-andando.png`.

### Fichas dos bichos

```text
FICHA — ARARA (id: arara): a arara-canindé, a arara AZUL E AMARELA da ilustração anexada, não a arara-vermelha da abertura. Costas, asas e cauda comprida azuis, peito e barriga amarelos, testa verde, rosto branco com listrinhas pretas e bico preto e curvo.
- parado: pousada em pé, mexendo a cabeça e piscando;
- andando: voando para a direita, batendo as asas;
- festa: abre as asas, dá um pulinho e balança a cauda.
```

```text
FICHA — ONÇA (id: onca): a onça-pintada, um felino grande e forte, mas fofo e simpático: nada de cara brava nem dentes à mostra. Pelo amarelo-dourado coberto de manchas pretas em forma de anel, barriga clara e rabo comprido.
- parado: em pé, respirando, piscando e mexendo a ponta do rabo;
- andando: caminhando com passos macios;
- festa: dá um pulinho com as patas da frente para cima.
```

```text
FICHA — FLAMINGO (id: flamingo): ave toda cor-de-rosa, de pescoço comprido e curvado como um S, pernas bem compridas e fininhas e bico curvado para baixo, com a ponta preta. Como ele é rosa, se não der para fazer o fundo transparente, use verde puro (#00FF00) no lugar do magenta.
- parado: em pé numa perna só, com a outra dobrada, piscando e mexendo de leve o pescoço;
- andando: andando devagar, levantando bem as pernas compridas;
- festa: abre as asas, mostrando as penas pretas das pontas, e dá um pulinho.
```

```text
FICHA — MACACO (id: macaco): o macaco-prego. Pelo marrom, rosto pequeno e mais claro, mãos parecidas com as nossas e um rabo comprido.
- parado: sentado, piscando e coçando a cabeça, com o rabo se mexendo;
- andando: andando de quatro, com o rabo comprido erguido;
- festa: pula batendo palmas acima da cabeça.
```

```text
FICHA — MICO-LEÃO (id: mico): o mico-leão-dourado, um macaquinho pequeno de pelo laranja-dourado brilhante, com uma juba de pelo em volta da cara escura e um rabo comprido.
- parado: sentado, piscando e virando a cabeça;
- andando: andando de quatro, com pulinhos rápidos;
- festa: pula com os bracinhos para cima.
```

```text
FICHA — CAPIVARA (id: capivara): roedor grande e gordinho, de pelo marrom curto, focinho quadrado, orelhas pequenas e cara tranquila.
- parado: em pé, mastigando devagar e piscando;
- andando: andando devagar, tranquila;
- festa: dá um pulinho feliz, mexendo as orelhinhas.
```

```text
FICHA — TARTARUGA (id: tartaruga): a tartaruga-marinha. Casco verde e arredondado, com placas, quatro nadadeiras abertas como remos e cabeça com olhos grandes e simpáticos.
- parado: parada, piscando e esticando a cabeça;
- andando: remando com as nadadeiras, como se nadasse para a direita;
- festa: bate as nadadeiras de alegria e balança o casco.
```

```text
FICHA — CARANGUEJO (id: caranguejo): corpo redondo e achatado, laranja-avermelhado, coberto por uma casca dura, com duas pinças grandes na frente, olhos em cima de hastinhas e patas finas dos dois lados. É o único bicho visto de FRENTE, porque caranguejo anda de lado.
- parado: abrindo e fechando as pinças devagar e piscando;
- andando: andando de lado para a direita, mexendo as patinhas;
- festa: levanta as duas pinças e bate uma na outra, pulando.
```

```text
FICHA — GATO (id: gato): gato de casa, laranja e rajado, com barriga e patinhas claras, orelhas pontudas, bigodes compridos, olhos verdes e rabo levantado.
- parado: sentado, mexendo o rabo e piscando devagar;
- andando: andando com o rabo levantado;
- festa: dá um pulo brincalhão, com as patinhas da frente para cima.
```

```text
FICHA — CACHORRO (id: cachorro): o vira-lata caramelo. Pelo caramelo, focinho preto, orelhas caídas, coleira vermelha e rabo enrolado para cima.
- parado: sentado, com a língua para fora, abanando o rabo;
- andando: trotando, com o rabo abanando;
- festa: pula feliz, abanando o rabo bem rápido.
```

```text
FICHA — MOSQUITO (id: mosquito): inseto bem pequeno, mas desenhado grande e fofo, nada nojento. Corpo fino cinza-escuro com listrinhas brancas, asas transparentes azuladas, seis patinhas longas e finas, olhos grandes e a boca comprida e fininha como um canudinho.
- parado: voando parado no ar, batendo as asas bem rápido;
- andando: voando para a direita, batendo as asas;
- festa: dá uma cambalhota no ar, feliz.
```

```text
FICHA — CASCAVEL (id: cascavel): cobra comprida e simpática, de olhos grandes e sem presas à mostra. Escamas marrom-claras com losangos marrom-escuros nas costas, barriga bege e um chocalho em gomos bege na ponta do rabo. A linguinha pode aparecer.
- parado: com a cabeça erguida, a linguinha entrando e saindo e o chocalho tremendo;
- andando: rastejando em S para a direita;
- festa: ergue a cabeça e balança o chocalho de alegria.
```

## 4. Abertura (2 imagens)

**Anexe:** `assets/sprites/fases/abertura-pronta.png`.

Aqui não vai o bloco de estilo: os dois pedidos são edições da arte que já existe.

```text
Edite esta imagem. Tire o letreiro "Que Bicho É Esse?" (com a placa de madeira e o sapo em cima dela), as três placas coloridas, o botão JOGAR, a engrenagem e todos os bichos: a arara-vermelha, o tucano, o tatu, o sapo do tronco, o veado e as borboletas. Preencha esses lugares com a mesma floresta, a mesma trilha e o mesmo céu, como se nada tivesse estado ali. Mantenha todo o resto exatamente igual: a caverna, a cachoeira, o rio, a ponte, as árvores, as pedras e as flores. Depois estenda a imagem para o formato 16:9, com mais céu e copas em cima e mais chão e plantas embaixo, no mesmo estilo.
```

Salve como `abertura-limpa.png`.

```text
Desta mesma imagem, recorte só o letreiro "QUE BICHO É ESSE?": a placa de madeira com cipós, folhas e a florzinha rosa, as letras laranja e verdes com contorno escuro e o sapinho em cima. Coloque-o sozinho, inteiro e centralizado, numa imagem duas vezes mais larga que alta, com fundo transparente. Se não der, use fundo azul puro (#0000FF), chapado. Não mude o desenho nem as letras: o texto é exatamente QUE BICHO É ESSE?, com acento no É.
```

Salve como `logo.png`. Confira as letras e o acento antes de salvar.

## 5. Ilustrações dos 5 bichos novos (5 imagens)

São a reserva do sprite. Se os sprites de caranguejo, gato, cachorro, mosquito e cascavel chegarem, elas viram opcionais.

**Anexe:** `assets/images/animais/arara.png` e `assets/images/animais/onca.png` (o estilo das ilustrações da 2.0).

Aqui não vai o bloco de estilo, porque o estilo é o das ilustrações da 2.0. Use a mesma conversa para os 5 bichos, trocando a ficha a cada pedido.

```text
Crie uma ilustração no mesmo estilo das anexadas: desenho animado, contorno preto grosso, cores chapadas e pouco sombreado. O bicho aparece de corpo inteiro, de lado, olhando para a direita (o caranguejo, de frente), centralizado numa imagem quadrada e ocupando quase toda ela. Fundo transparente; se não der, magenta puro (#FF00FF), chapado. Sem texto. O bicho é: [cole aqui a ficha do bicho da seção 3, sem as linhas de parado, andando e festa]
```

Salve como `ilustracao-<id>.png`. Por exemplo: `ilustracao-gato.png`.

## 6. Opcionais

### Árvore sagrada (2 imagens)

**Anexe:** `assets/sprites/mapa/fundo.png` e `assets/sprites/animais/tatu/andando.png`.

Primeira mensagem: o bloco de estilo e mais este texto.

```text
FICHA — ÁRVORE SAGRADA: a árvore especial do centro do mapa, onde a expedição termina. É maior e mais bonita que as árvores do mapa anexado: copa redonda e bem cheia, tronco grosso com raízes aparecendo e alguns frutinhos dourados. Vista de frente e um pouco de cima, como as árvores do mapa.

PEDIDO 1 — árvore parada: 4 quadros. A copa balança de leve. As cores ficam um pouco apagadas, porque ela ainda está esperando as 6 moitas. O 4º quadro emenda no 1º.
```

Salve como `arvore-parada.png`.

```text
PEDIDO 2 — árvore liberada: a mesma árvore, 6 quadros, com as cores vivas, uma luz dourada suave em volta, que pulsa devagar, e brilhinhos dourados subindo. Nada pisca forte nem rápido. O 6º quadro emenda no 1º.
```

Salve como `arvore-liberada.png`.

### Placa de madeira (1 imagem)

**Anexe:** `assets/sprites/fases/abertura-pronta.png`.

```text
Crie uma placa de madeira vazia, no estilo do botão JOGAR da imagem anexada. Ela é retangular e deitada (duas vezes mais larga que alta), de madeira marrom-avermelhada com veios, contorno quase preto e grosso, cantos levemente arredondados e folhinhas verdes nas duas pontas de cima. Sem texto e sem ícone. A borda tem a mesma largura nos quatro lados e o meio é liso, porque o jogo estica a placa para caber o texto de cada botão. Uma placa só, centralizada e ocupando quase toda a imagem, com fundo transparente; se não der, magenta puro (#FF00FF), chapado.
```

Salve como `placa.png`.

### Camadas da floresta (6 imagens)

Só servem de reserva para os fundos das telas, que já vieram todos no kit.

**Anexe:** `assets/sprites/fases/abertura-pronta.png`.

```text
Vou pedir, uma de cada vez, 6 camadas de um fundo de floresta brasileira de dia, que se movem em velocidades diferentes, no estilo da imagem anexada. Cada camada é uma imagem 16:9 que emenda na horizontal: a borda da esquerda continua exatamente na da direita. Menos a 1ª, todas têm fundo transparente acima do desenho (se não der, magenta puro, #FF00FF, chapado). Sem bichos e sem texto.
Camada 1 (floresta-1-ceu): céu azul com nuvens brancas fofas, ocupando a imagem inteira.
Camada 2 (floresta-2-montanhas): morros azulados ao longe, na metade de baixo.
Camada 3 (floresta-3-arvores-longe): copas de árvores azul-esverdeadas, distantes.
Camada 4 (floresta-4-arvores-meio): árvores verdes de tamanho médio.
Camada 5 (floresta-5-arvores-perto): troncos e copas grandes e verde-escuros, bem perto.
Camada 6 (floresta-6-plantas): samambaias, folhas e flores, só na faixa de baixo.
Comece pela camada 1.
```

Depois peça "Agora a camada 2", e assim por diante. Salve como `floresta-1-ceu.png` a `floresta-6-plantas.png`.

### Pedaços animados do mapa

As cachoeiras, a ponte, a barraca e a caverna precisam casar pixel a pixel com o mapa. Senão, a tela treme, como aconteceu com a folha de cachoeira do kit. Deixe para o fim e me avise: eu preparo o recorte do mapa de cada um para servir de base.

## Sons dos 5 bichos novos

Gerador de imagem não faz som: grave os sons ou pegue de um banco de sons livres, como o Freesound com licença CC0. Também serve um gerador de efeitos sonoros por IA.

Cada som é um MP3, com o bicho já no primeiro segundo, até 8 s e volume parecido com o dos outros:

| Arquivo | Som |
|---|---|
| `gato.mp3` | miado ("Miau! Miau!") |
| `cachorro.mp3` | latido ("Au au! Au au!") |
| `mosquito.mp3` | zumbido ("Zum-zum-zum! Zuuuum!") |
| `cascavel.mp3` | chocalho ("Tchic-tchic-tchic! Sssss!") |
| `caranguejo.mp3` | estalos das pinças ("Clac! Clac!") |

## O que me mandar

**Fazem falta (31):**
- [ ] `moita-parada.png`, `moita-balancando.png` e `moita-abrindo.png`
- [ ] `sapo-parado.png` e `sapo-andando.png`
- [ ] `<id>-parado.png` e `<id>-andando.png` dos 12 bichos (24 imagens): arara, onca, flamingo, macaco, mico, capivara, tartaruga, caranguejo, gato, cachorro, mosquito e cascavel
- [ ] `abertura-limpa.png` e `logo.png`

**Opcionais (21):**
- [ ] `<id>-festa.png` dos 12 bichos
- [ ] `arvore-parada.png` e `arvore-liberada.png`
- [ ] `placa.png`
- [ ] `floresta-1-ceu.png` a `floresta-6-plantas.png`

**Também faltam:**
- [ ] `ilustracao-<id>.png` de caranguejo, gato, cachorro, mosquito e cascavel (opcionais se os sprites deles chegarem)
- [ ] `<id>.mp3` dos mesmos 5 bichos

**O que eu faço quando chegar:**
1. Tiro o fundo e separo os quadros.
2. Alinho o pé na mesma linha e uso uma escala só para cada bicho.
3. Monto cada folha na medida do manifesto e salvo no caminho do Anexo D da especificação.
4. Ligo em `js/sprites.js` e `js/dados.js`.
5. Confiro na `ferramentas/conferir-arquivos.html` e no jogo.
