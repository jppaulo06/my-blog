---
layout: post
background: conway
---

## Script do Luan

Conversei com o Luan sobre o script que ele criou há pouco tempo para a identificação de códigos duplicados.
A princípio, ele me explicou o funcionamento do script e como ele foi desenvolvido.

A ideia é que, para todos dois arquivos dentro de um diretório, o script
verifica as similaridades entre todas as funções que estão presentes nos
arquivos. Ele faz isso "recortando" todas as funções de dentro desses arquivos
para arquivos separados e, depois, analisando a similaridade entre esses
arquivos gerados. É de se esperar que a execução do programa demore, já que
estamos fazendo muitas operações de Entrada/Saída.

Ademais, o programa foi feito em C++, mas utilizando também scripts em python
para a biblioteca de análise de código.

O objetivo da criação do script é analisar a similiaridade entre partes do
kernel Linux, uma vez que este é um projeto com muita repetição de código. O
programa, poderia, então, informar para os desenvolvedores as partes a serem
refatoradas.

## Rodando o Script

Encontrei alguns problemas para rodar o script, que devo ou avisá-lo apenas, ou
contribuir para o projeto através de um fork.

Um dos empecilhos é que, por padrão, o script deve ser rodado como root, o que
não é seguro. O ideal seria rodar como usuário comum, afinal comparar textos não deveria precisar
de permissão de root.

Para quem não sabe, se instalamos pacotes de python como root, o python não
consegue encontrar esses pacotes quando rodado como usuário comum. Isso é um
problema pois, na maioria das vezes, queremos rodar scripts como usuário comum.
Logo, caso eu queira rodar outros scripts que usem as dependências desse projeto,
provavelmente terei que instalar elas de forma repetida.

Um outro problema que tive foi que a versão do meu python não era a esperada
pelo projeto. A versão instalada no meu sistema, embora python3, era a python
3.1, enquanto o projeto esperava algo como a 3.9 - descobri isso através de
vários erros. Tive que instalar a versão correta para isso, além de instalar o
pip correto para instalar as dependências do projeto.

Ainda assim, consegui rodar o programa minimamente.

## Removendo uma duplicação

O Siqueira comentou com o Luan sobre uma duplicação do DRM que aparecia no
output do script feito. Logo, o Luan me pediu para remover essa duplicação.
