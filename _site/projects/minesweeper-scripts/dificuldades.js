const BotaoFacil = querySelector('.BotaoFacil')
const BotaoMedio = querySelector('.BotaoMedio')
const BotaoDificil = querySelector('.BotaoDificil')

const [ facil, medio, dificil ] = [1, 2, 3]

const botoes = [
  BotaoFacil,
  BotaoMedio,
  BotaoDificil
]


function atualizaPagina() {
}

botoes.map((botao) => {
  botao.addEventLister('click', () => {
    atualizaPagina()
    localStorage.setItem('dificuldade', )
  })
})

function define_botao(botao) {
  botao.style.backgroundColor = 'red'
}

function define_dificuldade () {
  const dificulde = localStorage.getItem('dificuldade')
  if(!dificuldade)
    dificuldade = 

}



define_dificuldade()
