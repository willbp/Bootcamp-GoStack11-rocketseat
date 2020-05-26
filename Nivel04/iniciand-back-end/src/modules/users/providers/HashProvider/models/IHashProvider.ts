export default interface IHashProvider {
    // falar quais métodos que um provedor de hash tem q ter

    // 1 gera hash a partir de uma string qualquer e retorna uma string
    generateHash(payload: string): Promise<string>;

    // 2 Compara um texto qualquer com algo que já foi hashed anteriormente
    // e retorna true or false
    compareHash(payload: string, hashed: string): Promise<boolean>;
}
