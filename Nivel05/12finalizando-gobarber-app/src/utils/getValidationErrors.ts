// ValidationError habilita as funções do yup para err. ctrl+space
import { ValidationError } from 'yup';

// meus erros
interface Errors {
  // configurado para ser verificado diversos campos e não somente
  // name:string, email:string, password:string
  // então configuro de forma dinamica q na primeira parte da propriedade 'name' pode ser
  // qualquer string
  // diz q o lado esquerdo pode ser qualquer coisa (pode por qualquer nome até bullshit)
  [key: string]: string;
}

// recebe (err) - erro e retorna objeto com erros.... Retorna :Errors
export default function getValidationErrors(err: ValidationError): Errors {
  // validationErrors do tipo Errors
  const validationErrors: Errors = {};

  // percorre o array inner
  err.inner.forEach((error) => {
    // para cada um dos erros encontrados, pega validationErrors, cria propriedade dela com nome path(do inner)
    // e o valor dela vai ser a mensagem
    // error.path="name"   error.message="Nome obrigatório"
    // simulando um name: string;
    // path=error.message
    validationErrors[error.path] = error.message;
  });
  return validationErrors;
}
