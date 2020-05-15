import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

// toda vez q ele tiver uma injeção de dependência com nome
// 'HashProvider' ele retorna uma instância da classe BCryptHashProvider
container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
