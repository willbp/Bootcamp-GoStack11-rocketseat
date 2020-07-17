// path passa o caminho para funcionar em qualquer SO
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
    // criada esta opção para ser acessivel para ver local onde arquivos ficam
    // crio os 2 caminhos
    tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, 'uploads'),

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
};
