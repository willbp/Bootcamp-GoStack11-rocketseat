// path passa o caminho para funcionar em qualquer SO
import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
interface IUploadConfig {
    driver: 's3' | 'disk';

    tmpFolder: string;
    uploadsFolder: string;

    multer: {
        storage: StorageEngine;
    };

    config: {
        disk: {};
        aws: {
            bucket: string;
        };
    };
}
export default {
    driver: process.env.STORAGE_DRIVER,
    // criada esta opção para ser acessivel para ver local onde arquivos ficam
    // crio os 2 caminhos
    tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, 'uploads'),

    multer: {
        storage: multer.diskStorage({
            // armazenamento local no disco da máquina
            destination: tmpFolder,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('HEX');
                const fileName = `${fileHash}-${file.originalname}`;

                // recebe parametros 1-erro caso exista,   2-nome do arquivo
                return callback(null, fileName);
            },
        }),
    },

    config: {
        disk: {},
        aws: {
            bucket: 'app-gobarber',
        },
    },
} as IUploadConfig;
