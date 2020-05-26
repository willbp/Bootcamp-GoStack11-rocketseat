import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
    async create(request: Request, response: Response): Promise<Response> {
        // requesita password digitado e o token dele
        const { password, token } = request.body;

        // instancia o service para var authenticateUser
        const resetPassword = container.resolve(ResetPasswordService);

        // executa
        await resetPassword.execute({
            token,
            password,
        });

        return response.status(204).json();
    }
}
