import { container } from 'tsyringe';
import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

// toda vez q minha app precisar de um StorageProvider
// manda utilizar DiskStorageProvider
container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider,
);
