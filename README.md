# Contador de Tags HTML - Desafio

Este projeto consiste em uma aplicação web que recebe URLs, processa as páginas correspondentes e conta a ocorrência de cada tag HTML. Os resultados são exibidos em uma tabela para o usuário. A aplicação é composta por um arquivo `index.html` que contém a interface do usuário e um servidor `server.js` que realiza o processamento das URLs e armazena os resultados em um banco de dados SQLite.

## Tecnologias utilizadas

As seguintes tecnologias foram utilizadas no projeto:

- **Axios**: Uma biblioteca JavaScript para fazer requisições HTTP, utilizada no servidor para obter o conteúdo das páginas.
- **Cheerio**: Uma biblioteca rápida e flexível para fazer análise e manipulação de documentos HTML, utilizada no servidor para contar as tags HTML nas páginas.
- **Cors**: Um middleware para o Express que permite que o servidor receba requisições de outros domínios, permitindo a comunicação com o front-end.
- **Express**: Um framework web para Node.js que facilita a criação de rotas e manipulação de requisições HTTP.
- **SQLite3**: Um módulo do Node.js que permite interagir com bancos de dados SQLite.

## Como usar

1. Certifique-se de ter o Node.js instalado em seu computador.
2. Clone este repositório em sua máquina.
3. No terminal, navegue para a pasta do projeto e instale as dependências com o comando `npm install`.
4. Inicie o servidor com o comando `node server.js`.
5. O servidor será iniciado e estará escutando na porta 3000.

## Interface do usuário

A interface do usuário está contida no arquivo `index.html`. Ela apresenta as seguintes características:

1. Título principal "Contador de Tags HTML".
2. Instrução para informar as URLs.
3. Campo de texto onde você pode digitar as URLs, separadas por vírgula.
4. Botão "Processar Páginas" para acionar o processamento das URLs.
5. Resultados apresentados em forma de tabela.

## Servidor - `server.js`

O servidor é responsável por receber as URLs, processar as páginas correspondentes, contar as tags HTML e armazenar os resultados em um banco de dados SQLite. Algumas informações importantes sobre o servidor:

- O servidor está configurado para escutar na porta 3000.
- É utilizada a biblioteca `cors` para permitir que o front-end faça requisições ao servidor a partir de um domínio diferente.
- O servidor cria a tabela `paginas` no banco de dados SQLite antes de realizar qualquer inserção de dados.
- O processamento das páginas é realizado de forma assíncrona, utilizando as bibliotecas `axios` e `cheerio`.
- Os resultados são retornados em formato JSON e exibidos na interface do usuário em uma tabela.

## Funcionamento

1. O usuário insere as URLs desejadas no campo de texto, separadas por vírgula.
2. Ao clicar no botão "Processar Páginas", o front-end faz uma requisição GET ao servidor, enviando as URLs digitadas.
3. O servidor recebe a requisição, processa as páginas e retorna os resultados ao front-end em formato JSON.
4. O front-end recebe os resultados e utiliza a função `mostrarResultado` para exibir os dados em uma tabela na página.

## Considerações finais

Este projeto apresenta uma solução didática e simples para contar as tags HTML em páginas web a partir de URLs fornecidas pelo usuário. Ele combina o uso do Axios para realizar as requisições HTTP, o Cheerio para fazer a análise das páginas, o Express para criar o servidor e o SQLite para armazenar os resultados. Esta é apenas uma implementação básica, e é possível expandir o projeto com mais recursos, tratamento de erros mais robusto, uma interface de usuário mais aprimorada e muito mais.