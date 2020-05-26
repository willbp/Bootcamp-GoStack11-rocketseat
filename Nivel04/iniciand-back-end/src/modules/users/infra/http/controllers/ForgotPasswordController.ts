import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
    async create(request: Request, response: Response): Promise<Response> {
        // requesita email digitado
        const { email } = request.body;

        // instancia o service para var authenticateUser
        const sendForgotPasswordEmail = container.resolve(
            SendForgotPasswordEmailService,
        );

        // executa
        await sendForgotPasswordEmail.execute({
            email,
        });

        return response.status(204).json();
    }
}
