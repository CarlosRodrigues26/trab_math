# PA, O DESAFIO MATEMÁTICO

## Objetivo do projeto
Este projeto e um jogo educativo em formato de quiz para exercitar **Sequencias Numericas - Progressao Aritmetica (PA)** com estudantes do ensino medio.

## Publico-alvo
- Estudantes do ensino medio.
- Professores e colegas em apresentacoes academicas (AV2).

## Conteudo matematico abordado
- Identificacao de PA.
- Calculo da razao.
- Sequencias crescentes, decrescentes e constantes.
- Determinacao de termos (proximo termo, termo geral e termo em posicao n).
- Identificacao de primeiro termo e quantidade de termos.
- Problemas contextualizados com PA.
- Soma dos primeiros termos de uma PA.

## Tecnologias utilizadas
- Node.js
- Express.js
- JavaScript (frontend e backend)
- HTML5
- CSS3

## Estrutura de pastas

pa-desafio-cartas/
- package.json
- server.js
- README.md
- public/
  - index.html
  - css/
    - style.css
  - js/
    - questions.js
    - game.js
  - assets/

## Requisitos para executar
- Node.js 18+ (ou versao compativel com Express 4)
- npm

## Como instalar as dependencias
1. Abra um terminal na pasta do projeto.
2. Execute:

npm install

## Como iniciar o servidor
Execute:

npm start

O servidor utiliza `process.env.PORT` quando definido e porta local padrao `3000` quando nao definido.

## Como acessar no navegador
Acesse:
- http://localhost:3000

## Publicacao futura (link publico)
A aplicacao esta preparada para publicacao em servicos compativeis com Node.js/Express, como:
- Render
- Railway
- Fly.io
- Cyclic

Passos gerais:
1. Subir o projeto para um repositorio Git.
2. Criar o servico na plataforma escolhida.
3. Configurar comando de build/install (`npm install`) e start (`npm start`).
4. Garantir que a plataforma forneca a variavel `PORT` automaticamente.
5. Publicar e validar o link publico gerado.

> Observacao: este repositorio nao afirma publicacao ativa; ele apenas esta preparado para deploy.
