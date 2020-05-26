import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
    // retorno do token (console.log do node)
    iat: number;
    exp: number;
    sub: string;
}

// atua como um middlaware do express função q recebe "request, response e next"
export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    // validação do token JWT
    // pegar token da requisição - vem pelo Header

    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT token is missing', 401);
    }
    // Bearer asdhi27hdsiauhd   , indica q n quero pegar 'Bearer'
    const [, token] = authHeader.split(' ');

    try {
        // volta o token decodificado caso funcione.. token+secret md5
        // se retornou user válido, então teremos dados do nosso usuário "payload" do JWT
        const decoded = verify(token, authConfig.jwt.secret);

        // desestruturar decoded: E Forçar um formato para ela 'as'
        const { sub } = decoded as ITokenPayload;

        // falando qual usuário que está realizando a requisição
        request.user = {
            id: sub,
        };

        // permite q o user continue usando nosso app
        console.log(decoded);
        return next();
    } catch (err) {
        throw new AppError('Invalid JWT token', 401);
    }
}
