// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviders = new ListProvidersService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });

    // seja possivel listar os providers tirando o q está logado
    it('should be able to list the providers', async () => {
        // criar alguns usuários (porque ele deve existir para fazer isso)
        const user1 = await fakeUsersRepository.create({
            name: 'Willa Gosta',
            email: 'willa@gosta.com',
            password: '123456',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'Laureka',
            email: 'lau@reka.com',
            password: '123456',
        });

        // criar usuário logado
        const loggedUser = await fakeUsersRepository.create({
            name: 'Will Logado',
            email: 'will@logado.com',
            password: '123456',
        });

        // executa o listProvider me mostrando como logado
        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        // espero/verifico que meus providers sejam um array
        // contendo meus 2 primeiros users aqui.
        expect(providers).toEqual([user1, user2]);
    });
});
