// definição de tipos do express
// sobrescrever uma tipagem de dentro do express
declare namespace Express {
    // sobrescrevendo a exportação do request q já existe dentro do express
    // ele não substitui, ele faz um anexo
    export interface Request {
        user: {
            id: string;
            // adiciona informação nova dentro do request
            // para fazer request.user funcionar dentro de
            // ensureAuthenticated.ts
            // informação: usuário e dentro do usuário tem 1 id
        };
    }
}
