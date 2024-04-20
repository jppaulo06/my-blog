function cria_bloquinhos() {
  for(let itY = 0; itY < nY; itY++){
    for(let itX = 0; itX < nX; itX++){
      let bloco = new bloquinho(itY, itX);
      posicoes.push(bloco);
    }
  }
}

function define_resultados() {
  perdeu = createP("Voce perdeu =( ");
  perdeu.hide();

  ganhou = createP("Voce ganhou!! =) ");
  ganhou.hide();
}

function revelado_nao_diminuindo(linha, coluna, i, j){
 let pos = linha * nX + coluna;
 return possivel(linha + i, coluna + j) && 
        !posicoes[pos + i * nX + j].bomba &&
        posicoes[pos + i * nX + j].revelado &&
        !posicoes[pos + i * nX + j].fim_revelado;
}

function define_padroes(){
  cor_nao_revelada = color(255, 160, 122); 
  cor_padrao = color("#9932CC"); 
  cor_texto = color(255);
  cor_bandeira = color(100);

  noStroke();
  textSize(delta);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
}

function define_botoes() {
  for(let i = 0; i < botoes.length; i++) {
    botoes[i].onclick = funcao_cor(array_c[i].cor_nao_revelada, array_c[i].cor_fundo);
  }

  alterna = document.getElementById("botao_modo");
  bandeiras = quantidade_bombas;
}

function define_perigosidade_bloquinhos(){
  for(let itY = 0; itY < nY; itY++){
    for(let itX = 0; itX < nX; itX++){

      if(posicoes[itY * nX + itX].bomba) continue;

      contador = 0; 

      for(let i= -1; i <= 1; i++)
        for(let j = -1; j <= 1; j++)
          contador += checa(itY + i, itX + j);
    
      posicoes[itY * nX + itX].perigosidade = contador;
      
    }
  }
}

function coloca_bombas_em_posicoes() {
  let range = ~~(abertura/2);
  let contador = 0;

  for(let i = 0; i < nY; i++)
    for(let j = 0; j < nX; j++)
      if(fora_safe_zone(range, i, j)){
        posicoes[i * nX + j].bomba = array_bombas[contador];
        contador++;
      }
}

function fora_safe_zone(range, i, j) {
 return (i > primeiro.linha + range || i < primeiro.linha - range ||
        j < primeiro.coluna - range || j > primeiro.coluna + range)
}

function cria_array_bombas() {

  for(let i = 0; i < nY * nX - abertura * abertura; i++){
    if(i < quantidade_bombas){
      array_bombas.push(1);
    }
    else
      array_bombas.push(0);
  }

  shuffle(array_bombas, true);

}

function possivel_curvatura (linha, coluna, pos, i) {

  i = Number(i);
  pos = Number(pos);

  let lateral1 = posicoes[cantos[i][0] + pos];
  let lateral2 = posicoes[cantos[i][1] * nX + pos];
  let quina = posicoes[cantos[i][1] * nX + cantos[i][0] + pos];

  let status_revelado, status_revelado1, status_revelado2, status_revelado3;

  if(!possivel(linha, coluna + cantos[i][0]))
    status_revelado1 = true;

  else
    status_revelado1 = (lateral1.diminuindo || lateral1.fim_revelado) && !lateral1.bomba;

  if(!possivel(linha + cantos[i][1], coluna))
    status_revelado2 = true;
  else
    status_revelado2 = (lateral2.diminuindo || lateral2.fim_revelado) && !lateral2.bomba;

  if(!possivel(linha + cantos[i][1], coluna) || !possivel(linha, coluna + cantos[i][0]))
    status_revelado3 = true;
  else
    status_revelado3 = (quina.diminuindo || quina.fim_revelado) && !quina.bomba;

  status_revelado = posicoes[pos].revelado && !posicoes[pos].bomba;

  return checa_status_curvatura(status_revelado, status_revelado1, status_revelado2, status_revelado3);

}

function checa_status_curvatura(status_revelado, status_revelado1, status_revelado2, status_revelado3){
  return !status_revelado && status_revelado1 != status_revelado && status_revelado2 != status_revelado && status_revelado3 != status_revelado || 
      (status_revelado && status_revelado1 != status_revelado && status_revelado2 != status_revelado);
}

function colocar_tirar_bandeira(bloco) {

  if(!bloco.revelado){
    if(bloco.bandeira){
      bloco.bandeira = false;
      bandeiras--;
      bloco.show_estatico();
    }
    else{
      bloco.bandeira = true;
      bandeiras++;
      bloco.show_bandeira();
    }
  }

}

function atualiza_revelados_diminuindo() {
  for(let i = 0; i < revelados.length; i++){
    if(revelados[i].diminuindo){
      revelados[i].anima();
      revelados[i].show_dinamico();
    }
    if(!revelados[i].pegou_proximos && revelados[i].frames == 4) {
      revelados[i].pega_proximos();
    }
    if(!revelados[i].diminuindo)
      revelados.splice(i, 1);
  }
}

function atualiza_bombas_aumentando () {

}

function checa (posicaoY, posicaoX){
  if(posicaoY >= 0 && posicaoY < nY && posicaoX >= 0 && posicaoX < nX) 
    if(posicoes[posicaoY * nX + posicaoX].bomba){
      return 1;
    }
  return 0;
}

function funcao_cor (cor_nao_revelada_nova, cor_padrao_nova) {
  return function () {
    cor_nao_revelada = color(cor_nao_revelada_nova); 
    cor_padrao = color(cor_padrao_nova);
    atualiza();
    document.querySelector("html").style.backgroundColor = cor_padrao_nova;
  };
}

function mouse_dentro_canvas() {
  return mouseX < width && mouseX > 0 && mouseY > 0 && mouseY < height;
}

function primeiro_click(bloco) {

  if(!bloco.bandeira && !bloco.revelado && !primeiro.linha) {
    primeiro.coluna = bloco.coluna;
    primeiro.linha = bloco.linha;
    setup_pos_click();
  }
}
