import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

// Dashboard do formato: React.FC  (function component)
const Dashboard: React.FC = () => {
  // armazena repositório e sobrescreve repositorio
  // 1estado q vai armazenar os repositórios
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    // inves de inicializar array vazio,
    // meus repositórios q estão no localStorage
    // @minhapp:informação q quero gravar no storage
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );

    if (storagedRepositories) {
      return JSON.parse(storagedRepositories); // valor inicial do meu repositories
      // desconvertido de JSON
    } // se n tiver nada no storage
    return [];
  });

  // estado para armazenar valor do input
  const [newRepo, setNewRepo] = useState('');

  const [inputError, setInputError] = useState('');

  // permite disparo da função 1param | sempre q uma var mudar 2param [repositories]
  // e sempre vai salvar ela em localStorage
  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories), // converte numa string JSON
    );
  }, [repositories]);

  // 2
  // adição de um novo repositório
  // Consumir API do Github
  // Salvar novo repositório no estado.
  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    // event para n dar reload
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }
    try {
      // o valor do input está armazenado em newRepo
      const response = await api.get(`repos/${newRepo}`);

      const repository = response.data;

      // trago a cópia de todo array de repositories e adiciono o novo repository
      setRepositories([...repositories, repository]);
      // seta valor em branco no input dps de enviar
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por este repositório.');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github explorer" />
      <Title>Explore repositórios no Github</Title>

      <Form
        hasError={!!inputError}
        /* !!= se tem erro */ onSubmit={handleAddRepository}
      >
        <input
          value={newRepo} // texto do input
          onChange={(e) => setNewRepo(e.target.value)} // altera o valor do input
          placeholder="Digite o nome do repositório" // input estranho
          // se inputError ta preenchido && eu coloco este erro
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};
export default Dashboard;
