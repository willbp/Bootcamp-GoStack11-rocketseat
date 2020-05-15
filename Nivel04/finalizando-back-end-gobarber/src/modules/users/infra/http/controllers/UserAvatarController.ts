import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
    async update(request: Request, response: Response): Promise<Response> {
        const updateUserAvatar = container.resolve(UpdateUserAvatarService);
        const user = await updateUserAvatar.execute({
            // pego através do middleware.
            user_id: request.user.id,
            avatarFilename: request.file.filename, // pego pelo upload.ts
        });

        return response.json(classToClass(user));
    }
}
