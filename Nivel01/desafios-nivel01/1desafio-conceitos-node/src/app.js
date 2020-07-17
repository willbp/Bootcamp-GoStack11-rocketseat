const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  //lista todos repositorios (array)
  return response.status(200).json(repositories);

});

//Cria um repositório
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  //buscar repositório dentro do array
  const { id } = request.params;
  const { title, url ,techs } = request.body;

  ////buscar repositório dentro do array tendo o Id acima como param
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  //se o repositório não existir pelo "index"
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  const likes = repositories[repositoryIndex].likes;

  //cria nova info do projeto, pega os dados de dentro do body
  //cria o objeto de projeto novamente

  const repository = {
      id,
      title,
      url,
      techs,
      likes
  };
  //acessa o array, procura na posição o index
  //e substitui o valor armazenado pelo novo projeto acima.
  repositories[repositoryIndex] = repository;

  //retorna somente o objeto atualizado
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  ////buscar repositório dentro do array tendo o Id acima como param
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  //se o repositório não existir pelo "index"
  if (repositoryIndex < 0) {
      return response.status(400).json({ error: 'Repository not found.' });
  }
  //retira uma informação de dentro de um array splice
  //indice q quero remover e quantas posições eu quero remover
  repositories.splice(repositoryIndex, 1);

  //retorna em branco porque deletou, utilizando send
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

   ////buscar repositório dentro do array tendo o Id acima como param
  const repository = repositories.find((repository) => repository.id === id);

    //se repositório não existir (erro)
  if (!repository) {
    return response.status(400).json({ error: 'Repository not found!' });
  }
  //Se não repositório.likes +1
  repository.likes += 1;

  return response.status(200).json(repository);

});

module.exports = app;
