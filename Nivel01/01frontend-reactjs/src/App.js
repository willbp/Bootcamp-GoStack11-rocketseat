//import backgroundImage from './assets/background.jpg';
//<img width={100} src={backgroundImage}/>
import React, { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';
import Header from './components/Header';


function App() {
    //useState transforma a variável em um estado, e retorna array
    //posição 1 array vazio ou pré alimentado
    //posição 2 = função para atualizarmos esse valor
    const [projects, setProjects] = useState([]);

    //Primeiro parametro=qual função eu quero disparar
    //Segunda função =quando eu quero disparar
    //quando retornar a resposta ela fica armazenada em response
    useEffect(() => {
        api.get('projects').then(response => {
            setProjects(response.data);
        });
    }, []);


    //handle ação do usuário
   async function handleAddProject() {
        // projects.push(`Novo projeto ${Date.now()}`); (o push altera o project sendo mutável (errado))
        //pra fazer certo crio um novo array copio tudo q tem em projects ...projects
        //setProjects([...projects, `Novo projeto ${Date.now()}`]);
        //console.log(projects);
        const response = await api.post('projects', {
            title: `Novo projeto ${Date.now()}`,
            owner: "William"
        });
        const project = response.data;

        setProjects([...projects, project]);
    }

    return (
        <>
            <Header title="Projects" />
            <ul>
                {projects.map(project => <li key={project.id}>{project.title}</li>)}
            </ul>
            <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
        </>
    );
}

/*
function App() {
    return (
        <>
            <Header title="Homepage">
                <ul>
                    <li>Home</li>
                    <li>Page</li>
                </ul>
            </Header>
            <Header title="Projects">
                <ul>
                    <li>Sepa</li>
                    <li>Rando</li>
                    <li>Hehe</li>
                </ul>
            </Header>
        </>
    );
}

function App(){
    return(
    <>
     <Header title="Homepage"/>
     <Header title="Projects"/>
    </>
    );
}


function App(){
    return(
    <div>
     <Header title="Homepage"/>
     <Header title="Projects"/>
    </div>
    );
}
*/
export default App;