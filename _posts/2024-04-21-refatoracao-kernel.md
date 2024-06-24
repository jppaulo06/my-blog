---
layout: post
background: conway
---

## Refatoracao dos testes - Parte 2

No último blog post sobre o kernel, eu disse que enviei um patch-set para as
listas de e-mail do kernel com pequenas alterações de refatoração.O Tales, um
dos autores do patch-set original que modifiquei, respondeu o meu patch-set e,
então, fiquei responsável por fazer a alteração pedida. Acontece que os testes
do patch-set incluem testes para funções estáticas, que requerem implementações
    especiais para os testes, uma vez que elas apenas podem ser vistas no
    arquivo (ou namespace) onde está declarada.

Anteriormente, a solução para isso (e que estava no meu patch-set) envolvia
importar o arquivo com os testes kunit no final do arquivo com a função
estática a ser testada. Dessa forma, era comum que, no final do arquivo, houvesse:

```
static int funcao_a_ser_testada(void) {
	...
}

...

#include "kunit/teste.c"
```

Neste caso, o Tales recomendou que as funções estáticas testadas fossem um
pouco modificadas.Ele recomendou que o certo - no subsistema - seria definir as
funções como estáticas de maneira condicional, e não importar os testes no fim
do arquivo. Isto é, caso quiséssemos que as funções sejam acessáveis por outros
    arquivos, retiramos o static; caso contrário, ele é deixado lá. wIsso pode
    ser alcançado com a keyword EXPORT_IF_KUNIT, por exemplo:

```
EXPORT_IF_KUNIT int funcao_a_ser_testada(void) {
	...
}
```

Também recomendou que fosse usada a chamada de função
`export_for_tests_only(nome_da_função)`, que exporta uma determinada função
para diferentes módulos usarem. Isso parecia ser interessante, entretanto não é
muito útil para o nosso caso pois o módulo de testes é sempre buildado junto
com o kernel, não sendo loadable. Ainda assim, caso o módulo de testes fosse
loadable, seria obrigatório fazer o export. Dessa forma, para o novo patch-set,
não coloquei esse export.

## Novo patch-set

Com base no que foi dito, fiz as alterações pedidas sobre os testes. Adicionei
a keyword `EXPORT_IF_KUNIT` nas funções estáticas que estavam sendo testadas e
adaptei os testes para isso. Por exemplo, agora, era necessário que a função
a ser testada seja declarada de alguma forma no arquivo de teste para que o
linker não reclame. Isso foi feito escrevendo declarações condicionais na header
do arquivo com a função a ser testada. Por exemplo, testando a função `funcao_a_ser_testada`
do arquivo batata.c, temos que adicionar no batata.h:

```
#ifdef KUNIT
int funcao_a_ser_testada(void);
#endif
```

Daí, o batata.h é incluído no arquivo de teste e a função é declarada. Isso
resolve o problema do linker reclamar que a função não foi declarada.

Também, aproveitei para refatorar um pouco o código, deixando-o mais limpo e
bem arquitetado. Por exemplo, diminui a quantidade de opções usadas para rodar
os testes. Antes, era necessário ativar 4 opções para rodar todos os testes;
com as refatorações que fiz, agora com uma opção é possível roda-se todos os
testes. Isso é legal pois a quantidade de testes é pequena, e não creio que há
a necessidade de ativar/desativar testes específicos.

Com todas essas mudanças, tive que alterar também a documentação para refletir
as alterações feitas.

O patch-set ainda não foi enviado. Devo fazer isso no dia 24 de junho.
