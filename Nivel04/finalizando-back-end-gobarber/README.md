# Recuperação de Senha:

**Requisitos Funcionais:** Funcionalidades que vamos ter dentro da recuperação de senha.

- O usuário deve poder recuperar sua senha informando o seu e-mail.
- O usuário deve receber um e-mail com instruções de recuperação de senha.
- O usuário deve poder resetar sua senha.

**Requisitos Não Funcionais:** Não ligadas diretamente com a regra de negócio da app.

- Utilizar Mailtrap para testar envios em ambiente de dev. (ferramenta de serviço de e-mail fake)-(armadilha de e-mail);
- Utilizar Amazon Simple E-mail Service para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (Background job), além da app rodando vai ter outro serviço rodando no server -chamado de fila- mandando ações pra essa fila e ela vai processando como vai dando conta.    **Exemplo**: envio para troca de senha de diversos usuários ao mesmo tempo, caindo nessa fila e sendo processada em segundo plano.

**Regras de Negócio:**

- O link enviado por e-mail para resetar senha, deve expirar em 2 horas;
- O usuário precisa confirmar a nova senha ao resetar sua senha.



# Atualização do perfil:

**Requisitos Funcionais:** Funcionalidades que vamos ter dentro da atualização do perfil.

- Usuário deve poder atualizar seu perfil (nome, email e senha).

**Requisitos Não Funcionais:** Não ligadas diretamente com a regra de negócio da app.

- -

**Regras de Negócio:**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha.



# Painel do prestador de serviço: (app desktop)

**Requisitos Funcionais:** Funcionalidades que vamos ter dentro do painel do prestador de serviço.

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas.

**Requisitos Não Funcionais:** Não ligadas diretamente com a regra de negócio da app.

- Os agendamentos do prestador no dia devem ser armazenados em cache (colocando nossa listagem em cache, e sempre que tiver novo agendamento naquele dia ele reseta o cache para trazer as informações atualizas do banco);
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando [Socket.io](http://socket.io) (bib q lida com protocol web socket (como http) porém ele permite transitar mensagens em tempo real. Comunicando front-end e back-end em tempo real, um manda msg e sem precisar atualizar a tela ele recebe a mensagem de volta).

**Regras de Negócio:**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;



# Agendamento de serviços:

**Requisitos Funcionais:** Funcionalidades que vamos ter dentro do agendamento de serviços. (do usuário, não prestador de serviços) q usa o app mobile.

- O usuário deve poder listar todos prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador em específico;
- O usuário deve poder listar os horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador.

**Requisitos Não Funcionais:** Não ligadas diretamente com a regra de negócio da app.

- A listagem de prestadores deve ser armazenada em cache. (forma de guardar o resultado da listagem de prestadores de forma mais rápida que buscar no banco sempre - caso já tenha sido salva, se não busca no BD. E a cada cadastro de prestador de serviço ele limpa o cache e recarrega a listagem do zero) .

**Regras de Negócio:**

- Cada agendamento deve durar 1h exatamente;
- os agendamentos devem estar disponíveis entre 8h as 18 horas (primeiro horário as 8, último horário as 17h);
- O usuário não pode agendar num horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo
