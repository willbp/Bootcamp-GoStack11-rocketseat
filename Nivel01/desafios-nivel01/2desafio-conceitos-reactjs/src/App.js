import React, { useState, useEffect } from "react";
import api from "./services/api"

import "./styles.css";

function App() {
  //utilizado para listar

  const [repositories, setRepositories] = useState([]);

  useEffect(() => { api.get('/repositories').then(({ data })=>setRepositories(data)) }, []);

  //adicionar novo item na api através de um botão adicionar, deve ser capaz de exibir o nome após o cadastro
  async function handleAddRepository() {
    const response = await api.post('/repositories',{ "title": `Rocketseat ${Date.now()}` });
    setRepositories([...repositories, response.data]);
  }

  //async function handleRemoveRepository(id) {
    //const { status } = await api.delete(`/repositories/${id}`);
    //if(status === 204) setRepositories([...repositories.filter(repository => repository.id !== id)])
  //}
  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    //após deletar o novo valor será salvo em setRepositories
    //
    //utiliza um filtro dentro do array repositories[]
    //
    //se as listas forem diferentes (se forem deletadas) ele apresenta em tela a nova lista (setRepositories)
    //Se o id do repository atual for diferente do id != do id da função
    setRepositories(repositories.filter(repository => repository.id !== id));
  }
//para cada um dos repositórios (repository 'laranja') vai exibir o q tem dentro do li (repository.title)
//a key serve como parâmetro único de cada repositório que no caso é id então repository.id
  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository=>(
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;

/**
 *  /*OU
   
    */
 