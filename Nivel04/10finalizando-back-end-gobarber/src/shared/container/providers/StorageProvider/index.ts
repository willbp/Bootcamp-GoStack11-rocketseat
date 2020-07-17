import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';

import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

// quando for ethereal roda o ethereal
// quando for SES roda o ses
const providers = {
    disk: DiskStorageProvider,
    s3: S3StorageProvider,
};

// obriga o constructor ser executado com o registerInstance
// e continua sendo lido como um register singleton
// container resolve que faz a injeção de dependência e verifica constructor
// se tem a injeção de dependência
// se for s3 utilizar s3 no lugar do disk
container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    providers[uploadConfig.driver],
);
