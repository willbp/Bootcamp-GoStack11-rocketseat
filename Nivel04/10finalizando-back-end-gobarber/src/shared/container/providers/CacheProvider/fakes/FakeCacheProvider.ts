import ICacheProvider from '../models/ICacheProvider';
// Objeto chave é string e o valor é uma string 'estilo redis'
interface ICacheData {
    [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
    // crio cache no formato do redis e vai ser um objeto
    private cache: ICacheData = {};

    public async save(key: string, value: any): Promise<void> {
        // método de salvar
        this.cache[key] = JSON.stringify(value);
    }

    public async recover<T>(key: string): Promise<T | null> {
        // acessa o dado e retorna string
        const data = this.cache[key];

        // se n existir dados retorna null
        if (!data) {
            return null;
        }
        // se existir traz no parsedDate convertido para json
        const parsedData = JSON.parse(data) as T;

        return parsedData;
    }

    public async invalidate(key: string): Promise<void> {
        // deleta a entrada do objeto
        delete this.cache[key];
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        // busca todas chaves do cache e filtra as chaves que
        // comecem com prefix
        const keys = Object.keys(this.cache).filter(key =>
            key.startsWith(`${prefix}:`),
        );
        // para cada key q ele encontrar ele passa deletando
        keys.forEach(key => {
            delete this.cache[key];
        });
    }
}
