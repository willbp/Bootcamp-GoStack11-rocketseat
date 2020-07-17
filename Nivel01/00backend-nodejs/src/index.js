const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');
const app = express();

app.use(cors());
app.use(express.json());


//enquanto a app estiver sendo executada as informações estarão disponíveis 
//pra todo projeto na memória
//nunca utilizado em produção

const projects = [];

//middleware
function logRequests(request, response, next) {
    //Neste caso vai disparar em todas requisições para mostrar qual rota ta sendo
    //chamada pelo Insomnia

    //vusca do request o método chamado "post,get" e qual rota ta sendo chamada
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    //se não chamar next, ele não vai para a próxima rota
    return next();//chama o próximo
}
app.use(logRequests);

function validateProjectId(request, response, next) {
    //valida o id da rota de alteração e remoção se ele é valido
    const { id } = request.params; //q vem através da rota
    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid project ID.' });
    }
    return next();

}
//utiliza o middleware somente nessas rotas + function do middleware
app.use('/projects/:id', validateProjectId);

//listar projetos
app.get('/projects', (request, response) => {
    //criando filtro para retornar title contendo a palavra React
    const { title } = request.query;

    //verifica se o filtro foi preenchido
    const results = title
        //se foi preenchido vai ser "incrementado com oq ele digitou"
        //verificando se os títulos contêm o q o usuário digitou
        //includes (verifica se um texto está contito em outro)
        ? projects.filter(project => project.title.includes(title))
        //se o title for vazio resultado = projetos que existem
        : projects;

    return response.json(results);
});

//criação projetos
app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    //inserindo um Projeto no array Projetos
    projects.push(project);

    //exibe somente o objeto recem criado
    return response.json(project);
});


//update, recebe o id do projeto para fazer alteração
app.put('/projects/:id', (request, response) => {
    //buscar projeto dentro do array
    const { id } = request.params;
    const { title, owner } = request.body;

    ////buscar projeto dentro do array tendo o Id acima como param
    const projectIndex = projects.findIndex(project => project.id === id);

    //se o projeto não existir pelo "index"
    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' });
    }

    //cria nova info do projeto, pega os dados de dentro do body
    //cria o objeto de projeto novamente

    const project = {
        id,
        title,
        owner,
    };
    //acessa o array, procura na posição o index
    //e substitui o valor armazenado pelo novo projeto acima.
    projects[projectIndex] = project;

    //retorna somente o objeto atualizado
    return response.json(project);
});


//DELETE
app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    ////buscar projeto dentro do array tendo o Id acima como param
    const projectIndex = projects.findIndex(project => project.id === id);

    //se o projeto não existir pelo "index"
    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found.' });
    }
    //retira uma informação de dentro de um array splice
    //indice q quero remover e quantas posições eu quero remover
    projects.splice(projectIndex, 1);

    //retorna em branco porque deletou, utilizando send
    return response.status(204).send();
});





app.listen(3333, () => {
    console.log('🚀Back-end started!🚀');
});












/*
const express = require('express');
const app = express();
app.use(express.json());

app.get('/',(request, response)=>{
//return response.send('Olá');
//para retornar um json:
//return response.json([VetorDeInfo]); ou ({Objeto})
return response.json({message:'Heyyy'});
});



//retornar todos projetos
//chama o backend para listar informações abaixo
app.get('/projects',(request,response)=>{
    //obter valores específicosdo retorno dentro do back-end
    const {title, owner}= request.query;
    //obter todos valores
    const query=request.query;
    console.log(title);
    console.log(owner);
    console.log(query);
    //printa após o send do List-GET (Query)
    return response.json([
        'Projeto 1',
        'Projeto 2',
    ]);
});

//simular que um novo projeto foi cadastrado
//o navegador não consegue testar rotas do tipo
//POST, PUT ou DELETE para isto utiliza-se o insomnia
app.post('/projects',(request,response)=>{
    const body = request.body;
    const {title, owner} = request.body;
    console.log(body);
    console.log(title);
    console.log(owner);

    return response.json([
        'Projeto 1',
        'Projeto 2',
        'Projeto 3',
    ]);
});

//PUT alterar/atualizar/deletar, muda a sintaxe um pouco
app.put('/projects/:id',(request,response)=>{
    //obter id dentro do código caso nome fosse
    // /:teste, retornaria teste
    const params=request.params;
    //ou um unico parâmetro
    const {id}=request.params;
    console.log(id);
    console.log(params);

    return response.json([
        'Projeto 4',
        'Projeto 2',
        'Projeto 3',
    ]);
});

//DELETE, muda a sintaxe um pouco pois deleta algo de alguém específico
app.delete('/projects/:id',(request,response)=>{
    return response.json([
        'Projeto 2',
        'Projeto 3',
    ]);
});


app.listen(3333,() =>{
    console.log('🚀Back-end started!🚀');
});
*/