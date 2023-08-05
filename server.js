// Importação dos módulos necessários
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// Criação da instância do aplicativo Express
const app = express();

// Definição da porta em que o servidor irá escutar
const PORT = 3000;

// Nome do banco de dados SQLite
const DATABASE_NAME = 'database.db';

// Habilita o uso do middleware de CORS para permitir requisições de outros domínios
app.use(cors());

// Função para adicionar o protocolo http:// caso não exista na URL
function adicionarProtocolo(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'http://' + url;
  }
  return url;
}

// Função para criar a tabela 'paginas' no banco de dados
function criarTabela(callback) {
  const db = new sqlite3.Database(DATABASE_NAME);
  db.run(
    `CREATE TABLE IF NOT EXISTS paginas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT,
      tags TEXT
    )`,
    (err) => {
      db.close();
      if (err) {
        console.error('Erro ao criar tabela:', err);
      } else {
        callback();
      }
    }
  );
}

// Chamada para criar a tabela antes de qualquer inserção de dados
criarTabela(() => {
  // Inicia o servidor na porta especificada
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});

// Função assíncrona para processar uma página (URL) e extrair as tags HTML
async function processarPagina(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const tags = {};

    // Percorre todos os elementos HTML da página e conta a ocorrência de cada tag
    $('*').each((index, element) => {
      const tagName = element.name;
      tags[tagName] = (tags[tagName] || 0) + 1;
    });

    return tags;
  } catch (error) {
    throw new Error(`Erro ao processar a URL: ${error.message}`);
  }
}

// Função para inserir os dados coletados no banco de dados
function inserirDados(url, tags) {
  const db = new sqlite3.Database(DATABASE_NAME);
  db.run(
    'INSERT INTO paginas (url, tags) VALUES (?, ?)',
    [url, JSON.stringify(tags)],
    (err) => {
      db.close();
      if (err) {
        console.error('Erro ao inserir dados no banco:', err);
      }
    }
  );
}

// Função para consultar os dados coletados no banco de dados
function consultarDados(callback) {
  const db = new sqlite3.Database(DATABASE_NAME);
  db.all('SELECT url, tags FROM paginas', (err, rows) => {
    db.close();
    if (err) {
      console.error('Erro ao consultar dados no banco:', err);
      callback([]);
    } else {
      callback(rows);
    }
  });
}

// Rota para processar URLs e coletar as tags HTML
app.get('/processar', async (req, res) => {
  let { urls } = req.query;
  if (!urls) {
    return res.json({ error: 'Sem URLs' });
  }

  // Remover espaços em branco antes de dividir as URLs
  urls = urls.replace(/\s/g, '').split(',');

  const resultados = [];

  for (const url of urls) {
    const urlComProtocolo = adicionarProtocolo(url);

    try {
      const tags = await processarPagina(urlComProtocolo);
      resultados.push({ url: urlComProtocolo, tags });

      // Inserir os dados coletados no banco de dados
      inserirDados(urlComProtocolo, tags);
    } catch (error) {
      console.error(error.message);
      resultados.push({ url: urlComProtocolo, error: 'Erro ao acessar a URL' });
    }
  }

  // Responder com os resultados da coleta
  res.json(resultados);
});

// Rota para consultar os dados coletados no banco de dados
app.get('/consultar', (req, res) => {
  // Consultar os dados no banco de dados
  consultarDados((dados) => {
    // Responder com os dados coletados
    res.json(dados);
  });
});