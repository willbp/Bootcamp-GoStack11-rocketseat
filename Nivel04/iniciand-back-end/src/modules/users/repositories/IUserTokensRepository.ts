import UserToken from '../infra/typeorm/entities/UserToken';
// definimos o macro de uma maneira geral o que devemos fazer para gerar um token
export default interface IUserTokensRepository {
    // gerar um token para um usuário específico
    // recebo o user_id e retorna o token gerado 'UserToken'.
    generate(user_id: string): Promise<UserToken>;

    // método para encontrar usuário por um token, recebe token por string
    // retorna token como um todo (com usuário)
    findByToken(token: string): Promise<UserToken | undefined>;
}
