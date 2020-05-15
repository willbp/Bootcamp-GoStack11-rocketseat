import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
    // recebe string file e retorna promise string
    public async saveFile(file: string): Promise<string> {
        // mover arquivo da pasta temp para upload efetivando o upload
        // trabalhar com os métodos fs=filesystem como promises
        // rename forma de mover arquivo de um lado para outro
        await fs.promises.rename(
            path.resolve(uploadConfig.tmpFolder, file), // mover de dentro da tmp
            path.resolve(uploadConfig.uploadsFolder, file), // para a pasta uploads
        );
        // retorna nome do arquivo
        return file;
    }

    // recebe string file
    public async deleteFile(file: string): Promise<void> {
        // caminho completo pro meu arquivo
        const filePath = path.resolve(uploadConfig.uploadsFolder, file);

        // verifico se existe, se existir deleta
        try {
            // stat traz info sobre arquivo,
            // se ele n acha da erro (pega no catch)
            // ou seja deleta dps do do try catch
            await fs.promises.stat(filePath);
        } catch {
            // se ele n acho arquivo, para por aqui
            return;
        }
        // deleta arquivo
        await fs.promises.unlink(filePath);
    }
}
export default DiskStorageProvider;
