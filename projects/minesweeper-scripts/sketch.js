let modo = 0; // 0 => escolha, 1 => bandeira, 2 => perdeu

let nX = 20; // quantidade de posicoes horizonta x vertical
let nY = 30;

const delta = 20; // lado em pixel de cada bloquinho
let quantidade_bombas = 100; // preciso desordenar um vetor de 80 posicoes.
let bandeiras = 0;

const revelados = []; 
const bombas_reveladas = [];

const modrevela = 0;
const modbandeira = 1;
const modfim = 2;

// curvaturas: 
const sup_esquerdo = 0;
const sup_direito = 1;
const inf_direito = 2;
const inf_esquerdo = 3;

const raio_margem = 5;

// Dificuldades:

// Facil: 
const nXFacil = 20;
const nYFacil = 30;
const quantBombasFacil = 20;

// Médio: 
const nXMedio= 20;
const nYMedio = 30;
const quantBombasMedio = 20;

// Difícil: 
const nXDificil = 20;
const nYDificil = 30;
const quantBombasDificil = 20;

// crio um vetor de posicoes em que cada vetor vai ser renderizado como um bloquinho individual

let alterna;

let posicoes = [];
let array_bombas = [];
let primeiro = {
                    linha : undefined, 
                    coluna: undefined
                  };
let abertura = 3; // lado do quadrado minimo que irá se abrir em volta da primeira casa selecionada

let cor_nao_revelada;
let cor_padrao;
let cor_texto;
let cor_bandeira; 

let ganhou;
let perdeu;

let botoes = document.querySelectorAll("#cores > button");

const minimo = delta/6;


// proximos passos:
// - fazer o esquema de dificuldade do jogo.
// - fazer esquema de mostrar as bombas clicar em alguma delas
// - apenas atualizar esquema inteiro se fizer a bfs
// - uma ideia para deixar mais organizado seria criar um classe chamada "jogo", que eu colocaria
// as características gerais de um mine sweeper.
//


function setup() {

	let canvas = createCanvas(nX * delta, nY * delta);
  canvas.parent("canvas-container");

  define_padroes();

  define_botoes();

  define_resultados();

  cria_bloquinhos();

  atualiza();

}

function setup_pos_click() {

  cria_array_bombas();

  coloca_bombas_em_posicoes();

  define_perigosidade_bloquinhos();

}

function draw() {

  atualiza_revelados_diminuindo();

  atualiza();

}

function revela_bloco_selecionado(bloco, linha, coluna){

  if(!bloco.bandeira && !bloco.bomba){

    bloco.revelar();

    revelados.push(bloco); 

    bloco.diminuindo = true;

    if(!bloco.bomba && bloco.perigosidade == 0)
      abre_bfs(linha, coluna);

  }

  else if (bloco.bomba) { // mostra todas as bombas

    bloco.revelar();

    perdeu.show();

    modo = modfim;       

  }
}

function mousePressed() {

  if(mouse_dentro_canvas()){

    let linha = ~~(mouseY/delta);
    let coluna = ~~(mouseX/delta); 
    let bloco = posicoes[linha * nX + coluna];

    if(modo == modrevela && !bloco.revelado){

      primeiro_click(bloco);

      revela_bloco_selecionado(bloco, linha, coluna);

    }

    else if(modo == modbandeira) {

      colocar_tirar_bandeira(bloco);

    }
  }
}

let cantos = {
               0: [-1, -1, sup_esquerdo], 
               1: [1, -1, sup_direito], 
               2: [1, 1, inf_direito], 
               3: [-1, 1, inf_esquerdo]
             };

function atualiza() {

  for(let linha = 0; linha < nY; linha++){ 
    for(let coluna = 0; coluna < nX; coluna++){

      let bloco = posicoes[linha * nX + coluna];

      bloco.reseta_curvaturas();

      bloco.define_curvaturas();

      bloco.show_estatico();

    }
  }
}

function possivel (linha, coluna) {
  if(linha < nY && linha >= 0 && coluna >= 0 && coluna < nX)
    return true;
  return false;
}

function abre_bfs(y, x){

  let fila = [];

  fila.push([y, x]);

  let i, j;

  let posicao;

  const direcoes = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1, 1], [-1, -1]];

  do {

    [y, x] = fila.shift();

    for([i,j] of direcoes) {
      if(x + j < nX && x + j >= 0 && y + i < nY && y + i >= 0){
        pos = posicoes[(y + i) * nX + x + j];
        if(!pos.revelado && !pos.bomba) {
          if (pos.perigosidade == 0)
              fila.push([y + i, x + j]);
          pos.revelar();
        }
      }
    }
  } while(fila.length > 0);
}

function alterna_modo() {
  if(modo != modbandeira){
    modo = modbandeira;
    alterna.innerText= "REVELA";
  }
  else{ 
    alterna.innerText= "BANDEIRAS";
    modo = modrevela;
  }
}

function muda_cor(cor) { // cor eh uma string
  cor_nao_revelada = color(cor);
}

