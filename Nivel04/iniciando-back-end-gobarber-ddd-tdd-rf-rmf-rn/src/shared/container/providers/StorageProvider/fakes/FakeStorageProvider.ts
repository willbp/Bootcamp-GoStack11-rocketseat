import IStorageProvider from '../models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
    // cria propriedade chamada storage para armazenar um array de string
    private storage: string[] = [];

    // recebe string file e retorna promise string
    public async saveFile(file: string): Promise<string> {
        this.storage.push(file);
        return file;
    }

    // recebe string file
    public async deleteFile(file: string): Promise<void> {
        // percorre arquivo retirando arquivo
        // procura dentro do meu array de arquivos q foram enviados pra app
        // procurar aquele q tem o msm nome q eu recebi por parametro
        const findIndex = this.storage.findIndex(
            storageFile => storageFile === file,
        );

        // remover informação do array
        this.storage.splice(findIndex, 1);
    }
}
export default FakeStorageProvider;
