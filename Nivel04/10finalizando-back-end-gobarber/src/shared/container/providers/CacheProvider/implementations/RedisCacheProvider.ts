import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
    // variável client do tipo RedisClient
    private client: RedisClient;
    // com isso consigo habilitar os métodos do redis

    constructor() {
        // cria instancia para o redis e passa a config do redis (import)
        this.client = new Redis(cacheConfig.config.redis);
    }

    // save recebe key e um valor
    public async save(key: string, value: any): Promise<void> {
        // para salvar info no redis
        await this.client.set(key, JSON.stringify(value));
    }

    // recebe key
    public async recover<T>(key: string): Promise<T | null> {
        // busca informação
        const data = await this.client.get(key);

        if (!data) {
            return null;
        }
        // desconverte e atribui parsedData do tipo T
        const parsedData = JSON.parse(data) as T;

        return parsedData;
    }

    // recebe key
    public async invalidate(key: string): Promise<void> {
        // deletar chave do banco de dados
        await this.client.del(key);
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        // busco todos caches q iniciam com este prefixo+algo q no caso é id
        const keys = await this.client.keys(`${prefix}:*`);

        // habilita multiplas operações
        const pipeline = this.client.pipeline();

        // para cada chave encontrada ele deleta
        keys.forEach(key => {
            pipeline.del(key);
        });
        // executa a pipeline deletando
        await pipeline.exec();
    }
}
