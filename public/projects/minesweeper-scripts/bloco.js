class bloquinho {

  revelado = false;
  bandeira = false;
  perigosidade = 0;
  bomba = 0; 
  diagonais = [0, 0, 0, 0];
  plano = true;
  tamanho = delta;
  cor_primaria;
  cor_secundaria;
  diminuindo = false;
  curvatura_diminuindo = raio_margem;
  frames = 0;
  pegou_proximo = false;
  fim_revelado = false;
  animando = false;
  bfs_fim_passou = false;
  fim_animando = false;

  constructor (linha, coluna){ // x e y sao numeros em pixeis

   this.y = linha * delta;
   this.x = coluna * delta; 
   this.linha = linha;
   this.coluna = coluna;
   this.pos = this.linha * nX + this.coluna;

  }
  
  show_estatico () {

    if(this.revelado && !this.fim_revelado) return;

    if(this.bomba && modo == modfim){
      this.revelado = true;
    }

    this.show_curvatura_estatico();

    this.show_conteudo_estatico();

  }

  show_dinamico () {

    if(!this.diminuindo) return;

    this.show_curvatura_estatico();
    this.show_conteudo_dinamico();


    this.frames++;

  }

  show_conteudo_dinamico () {
    if(this.bomba) {

    }
    else {
      fill(cor_texto);
      text(this.perigosidade, this.x + delta/2, this.y + delta/2);

      this.cor_secundaria = cor_nao_revelada;

      fill(this.cor_secundaria);
      square(this.x + delta/2, this.y + delta/2, this.tamanho, 
             this.curvatura_diminuindo, this.curvatura_diminuindo, 
             this.curvatura_diminuindo, this.curvatura_diminuindo);

      this.curvatura_diminuindo += raio_margem/20;
    }

  }
  
  show_bandeira() {

    fill(cor_bandeira);
    circle(this.x + delta/2, this.y + delta/2, 2/3*delta);

  }

  pega_proximos () {
    const direcoes = [[0,1], [0,-1], [1,0], [-1,0]];
    for(let direcao in direcoes){
      let [i,j] = direcoes[direcao];
      if(revelado_nao_diminuindo(this.linha, this.coluna, i, j)){
        posicoes[this.pos + i * nX + j].diminuindo = true;
        revelados.push(posicoes[this.pos + i * nX + j]);
      }
    }
    this.pegou_proximos = true;
  }

  revelar () {

    this.revelado = true;

  }

  anima () {
    if(this.bomba){
      if(this.animando && this.tamanho < delta){
        this.tamanho += delta * 2/(5 * this.tamanho);
      }
      else {
        this.animando= false;
        this.fim_animando = true;
        this.show_estatico();
      }
    }
    else {
      if(this.diminuindo && this.tamanho > minimo){
        this.tamanho -= delta * 2/(5 * this.tamanho);
      }
      else {
        this.diminuindo = false;
        this.fim_revelado = true;
        this.tamanho = delta;
        this.show_estatico();
      }
    }
  }

  reseta_curvaturas () {
    this.diagonais = [0, 0, 0, 0];
  }

  define_curvaturas () {

    for(let i = 0; i < 4; i++){
      if(possivel_curvatura(this.linha, this.coluna, this.linha * nX + this.coluna, i)){
        this.cria_curvatura(cantos[i][2]);
      }
    }

  }

  cria_curvatura(diagonal) {

    this.diagonais[diagonal] = raio_margem;

  }

  define_cor_estatico () {

    if(!this.revelado || this.bomba) {
      this.cor_primaria = cor_padrao;
      this.cor_secundaria = cor_nao_revelada;
    }
    else {
      this.cor_primaria = cor_nao_revelada;
      this.cor_secundaria = cor_padrao;
    }

  }

  show_curvatura_estatico () {

    this.define_cor_estatico();

    fill(this.cor_primaria);
    square(this.x + delta/2, this.y + delta/2, delta);

    fill(this.cor_secundaria);
    square(this.x + delta/2, this.y + delta/2, delta, 
           this.diagonais[sup_esquerdo], this.diagonais[sup_direito], 
           this.diagonais[inf_direito], this.diagonais[inf_esquerdo]);

  }

  show_conteudo_estatico () {


    if(this.revelado){
      if(this.bomba) {
        fill(0);
        circle(this.x + 0.5 * delta, this.y + 0.5 * delta, 2/3*delta);
      }
      else {
        fill(cor_texto);
        text(this.perigosidade, this.x + delta/2, this.y + delta/2);
      }
    }
    else if(this.bandeira){
      fill(cor_bandeira);
      circle(this.x + delta/2, this.y + delta/2, 2/3*delta);
    }


  }
  

}
