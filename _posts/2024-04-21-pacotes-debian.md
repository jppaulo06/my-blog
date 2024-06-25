## Introdução

Joenio é um conhecido contribuidor de Softwares Livres, com foco na distrubuição
Debian. Em aulas de Software Livre na Universidade de São Paulo, ele nos mostrou,
em dois tutoriais, como pacotes Debian funcionam como fazer o empacotamento de
programas.

## Primeiro tutorial

O primeiro tutorial do Joenio foi simples, já que mais serviu para enterdemos o
funcionamento básico de um pacote Debian utilzando Perl.

O ambiente de desenvolvimento para enpacotamento foi mostrado, além de deixar
explícita a estruturação de um pacote debian.

Os tópicos cobertos foram o
- Configurar o ambiente de desenvolvimento
- Criar o pacote para a biblioteca Acme::Helloworld
- Construir o pacote e verificar problemas
- Testar a instalação do pacote

Segui corretamente todo o tutorial, criando uma VM com debian Testing a partir
da distruição Debian Bookworm.

O link para o tutorial é esse aqui: https://joenio.me/tutorial-pacote-debian-parte1/

## Segundo tutorial

O segundo tutorial nos apresentou o workflow das produção de um pacte debian.
No tutorial, foram sugeridos vários projetos não empacotados escritos em perl,
atualmente armazenados no repositório CPAN.

Os projetos sugeridos são:

- Crypt::OpenSSL::CA - Bug RFP #1016950
- Date::Holidays::AW
- Date::Holidays::NL
- DateTime::Format::Atom - Bug RFP #875785
- Devel::AssertOS
- Git::CPAN::Patch - Bug RFP #733922
- Hash::Wrap
- Mail::GPG - Bug RFP #866593
- Module::Generic
- Net::AMQP::RabbitMQ - Bug RFP #1005216
- PDL::Graphics::PLplot - Bug RFP #763203
- Perl::Critic::Plicease
- Prima
- Term::ANSIColor::Concise
- WebService::SSLLabs - Bug RFP #853780

Eu selecionei o Net::AMQP::RabbitMQ, um wrapper da lib rabbitmq, escrita em C,
para perl. Me interessei pelo projeto pois o RabbitMQ é uma ferramenta extremamente
utilizada atualmente para a comunicação entre microsserviços.

No tutorial, o Joenio mostrou o empacotamento da Getopt::EX::Hashed, que aparentou
ter um processo de empacotamente mais simples que o escolhido por mim.

Os tópicos do tutorial foram:
-  Selecionar um dos pacotes candidatos para empacotamento
-  Criar o pacote da biblioteca selecionada
-  Construir o pacote e verificar problemas
-  Executar testes automatizadod do pacote
-  Submeter o pacote aos repositórios oficiais via Debian Perl Group

O repositório Comprehensive Perl Archive Network (CPAN) armazena projetos exclusivamente de Perl.
No momento da escrita, são 217,922 módulos disponíveis publicamente.

Como dito, um detalhe do pacote RabbitMQ é que ele é escrito em C, o que
complica um pouco as coisas.
É um projeto relativamente grande, com muitos arquivos e dependências.
Acabei caindo em muitos erros, o que fez com que eu não conseguisse finalizar e
partisse para outras pendências da disciplina.

Embora não tenha conseguido finalizar o empacotamento como gostaria, consegui
entender o processo necessário para fazê-lo.

