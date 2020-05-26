export default interface ICacheProvider {
    // operações que faremos no cache
    // salvar algo no cache, recebe a chave e o valor
    save(key: string, value: any): Promise<void>;

    // buscar os dados do cache recebe a key
    recover<T>(key: string): Promise<T | null>;

    // invalidar cache que quero invalidar
    invalidate(key: string): Promise<void>;

    // invalita todos caches que começam com provider-list
    invalidatePrefix(prefix: string): Promise<void>;
}
