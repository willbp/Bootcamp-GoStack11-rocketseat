import { getRepository, Repository } from 'typeorm';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
    // crio variável private do tipo Repository e como parâmetro UserToken
    private ormRepository: Repository<UserToken>;

    // constructor executa alguma coisa assim que o repositório for carregado
    constructor() {
        // quero buscar nosso repositório de UserToken
        this.ormRepository = getRepository(UserToken);
    }

    // recebe token em string, e retorna promise UserToken ou undefined
    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.ormRepository.findOne({
            where: { token },
        });
        return userToken;
    }

    // recebe user_id e retorna UserToken
    public async generate(user_id: string): Promise<UserToken> {
        // todo restante será gerado de forma automática
        // sem await pq aqui cria a instância da classe
        // ' const userToken = this.ormRepository.create({user_id,
        const userToken = this.ormRepository.create({
            user_id,
        });
        // salva no banco e depois retorna
        await this.ormRepository.save(userToken);

        return userToken;
    }
}
export default UserTokensRepository;
