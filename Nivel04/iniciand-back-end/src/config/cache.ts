import { RedisOptions } from 'ioredis';

// configurações do cache

interface ICacheConfig {
    driver: 'redis';

    config: {
        redis: RedisOptions; // tipo da variável redis
    };
}

export default {
    driver: 'redis',

    config: {
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASS || undefined,
        },
    },
} as ICacheConfig;
