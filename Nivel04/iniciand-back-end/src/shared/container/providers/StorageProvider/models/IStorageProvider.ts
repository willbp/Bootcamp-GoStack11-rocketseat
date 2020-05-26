export default interface IStorageProvider {
    // ações no nosso storage - salvar e deletar

    // saveFile recebe o caminho do arquivo que quero salvar
    // e devolve Promise com string
    saveFile(file: string): Promise<string>;

    // deleteFile recebe o caminho do arquivo e deleta
    deleteFile(file: string): Promise<void>;
}
