## Arquitetura
A arquitetura da aplicação é dividida em módulos desacoplatos, facilitando a mudança de peças quando necessário ou a inclusão de novas. Como o problema a ser resolvido é simples e permite apenas leitura, não foi necessário a inclusão de um domínio de negócio ou a implementação de alguma execução assíncrona utilizando filas, consumers e producers.

## Performance
Para melhora do tempo de resposta foi implementado um cache para guardar os resultados das chamadas da api de cep. Essa estratégia tembém permite que, caso a api de cep esteja indisponível, consigamos ao menos responder os casos cacheados.

## Resiliencia
Poderia ser interessante manter uma base intermediária interna com os resultados atualizados das consultas. Isso aumentaria muito a resiliência a falhas da api, mas adicionaria um banco interno a ser mantido, necessitando um estudo de custo x benefício desse approach, levando em consideração o custo de consumo da api e o custo de manutenção do banco interno.
