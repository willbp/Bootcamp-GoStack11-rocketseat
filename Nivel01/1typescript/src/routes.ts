import { Request, Response } from 'express';
import createUser from './services/CreateUser';

//rota para criar usuário
export function helloWorld(request: Request, response: Response) {
    const user = createUser({
        email: 'will@teste.br',
        password: '123456',
        techs: [
            'Node',
             'React',
            {title: 'Javascript', experience:100 }
        ],
    });

    console.log(user.email);

    return response.json({ message: 'Oi' });

}