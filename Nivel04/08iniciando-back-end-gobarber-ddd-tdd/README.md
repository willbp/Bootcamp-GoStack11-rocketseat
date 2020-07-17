# Aula 08 - Arquitetura e testes no Node.js


Nessa aula, reestruturamos a arquitetura do nosso backend criado na aula 04 ([Iniciando back-end do app](https://github.com/willbp/Bootcamp-GoStack11-rocketseat/tree/master/Nivel02/04iniciando-back-end-gobarber)).

Utilizamos o conceito DDD - Domain Driven Design.

* Para rodar esse projeto seguimos com a mesma especificação da aula 04. Você vai precisar estar rodando um banco de dados Postgres com nome "gostack_gobarber", instalar as libs com o comando **yarn** e rodar o projeto com o comando **yarn dev:server**.

**ATENÇÃO** para as requisições de criar e listar agendamentos e atualizar avatar é necessário estar autenticado através da rota 'Sessions" e enviar o token criado junto à requisição!


As requisições aceitas são:

- Para agendamentos:


+ **GET** (/appointments) para **listar** todos os agendamentos salvos.

  + A resposta é dada em uma lista de projetos. Como abaixo:
```JSON
[
  {
    "id": "355ddda2-67d8-4088-868b-cffbedf11b29",
    "provider_id": "fa25a010-016c-4c99-bc2c-b465999ab8e4",
    "date": "2020-04-28T11:00:00.000Z",
    "created_at": "2020-04-28T14:58:52.269Z",
    "updated_at": "2020-04-28T14:58:52.269Z"
  },
  {
    "id": "90e1fdac-b3a7-4481-80d4-725e402bb5e0",
    "provider_id": "fa25a010-016c-4c99-bc2c-b465999ab8e4",
    "date": "2020-04-28T12:00:00.000Z",
    "created_at": "2020-04-28T15:04:22.717Z",
    "updated_at": "2020-04-28T15:04:22.717Z"
  }
]
```


+ **POST** (/appointments) para **criar** um novo agendamento.

  + O provider_id deve existir para conseguir ter sucesso na requisição. Deve-se enviar os dados no corpo da requisição. Como abaixo:

```JSON
{
	"provider_id": "fa25a010-016c-4c99-bc2c-b465999ab8e4",
	"date": "{% now 'iso-8601', '' %}"
}
```


- Para usuários:

+ **POST** (/users) para **criar** um novo usuário.

  + Deve-se enviar os dados no corpo da requisição. Como abaixo:

```JSON
{
	"name": "William",
	"email": "william@gmail.com",
	"password": "123456"
}
```

+ **PATCH** (/users/avatar) para **criar** ou **modificar** o avatar do usuário.

  + O provider_id deve existir para conseguir ter sucesso na requisição. Deve-se enviar os dados no corpo da requisição. Como abaixo:

* Essa rota precisa ser enviada junto com o arquivo do avatar no corpo da requisição e o token de autenticação junto aos parâmetros*


- Para Sessions:



+ **POST** (/sessions) para **criar** uma nova sessão de usuário.

  + Deve-se enviar os dados para realizar a sessão. Como abaixo:

```JSON
{
	"email": "william@gmail.com",
	"password": "123456"
}
```
