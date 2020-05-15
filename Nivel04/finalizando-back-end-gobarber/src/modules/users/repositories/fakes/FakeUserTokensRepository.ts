import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { uuid } from 'uuidv4';
import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
    // para armazenar as tokens
    private userTokens: UserToken[] = [];

    // recebe id do user em string, e retorna promise com usuário ou undefined
    public async generate(user_id: string): Promise<UserToken> {
        // para gerar o nosso token

        const userToken = new UserToken();

        // preencher com algumas informações
        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            user_id,
            created_at: new Date(),
            updated_at: new Date(),
        });

        // adiciona o objeto criado no array
        this.userTokens.push(userToken);

        // retorna o token gerado
        return userToken;
    }

    // implementar no fake| recebe token em string|devolve UserToken
    public async findByToken(token: string): Promise<UserToken | undefined> {
        // para cada findToken verifico se o token é igual ao q estou recebendo por param
        const userToken = this.userTokens.find(
            findToken => findToken.token === token,
        );

        return userToken;
    }
}
export default FakeUserTokensRepository;
