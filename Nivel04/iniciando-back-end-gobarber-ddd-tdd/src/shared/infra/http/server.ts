import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());

app.use(express.json());

// toda rota q inicia com prefixo files
// oq vem depois serve como uma pasta de forma estática
// (nome do arquivo) + endereço da pasta
app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

// diferença deste middleware é q ele recebe 4 parametros obrigatórios
// e definir o tipo dele ......os parametros sao err, request, response, next
// porém foi trocado next por _ pois não ia ser utilizado e foi reconfigurado isso
// no eslint
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    // verifico se err'o' é uma instancia de AppError
    if (err instanceof AppError) {
        // se for foi um erro originado pela minha app 'um erro q conheço'
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    console.error(err);

    // se for um erro q não conheço retorna algo generico
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

// app.get('/', (request, response) => response.json({ message: 'Teste' }));

app.listen(3333, () => {
    // eslint-disable-next-line no-console
    console.log('Server Started on port 3333!');
});
