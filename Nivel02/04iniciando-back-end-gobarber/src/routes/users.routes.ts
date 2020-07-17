import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();

// cria car upload pra pegar configuração dada em uploadConfig (upload.ts)
const upload = multer(uploadConfig); // upload é instância do multer (libera comandos)
// upload.sinle (um unico arquivo) - vai ser passado como middleware abaixo
// no ensureAuthenticated async..

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    // criar regra de negócio no 'service'.

    // instancia CreateUserService trazendo os dados do service pa cá
    const createUser = new CreateUserService();

    const user = await createUser.execute({
        name,
        email,
        password,
    });
    // password não é retornado na tela, mas está no BD
    delete user.password;

    return response.json(user);
});

// patch atualiza uma única informação do usuário (avatar)
// verifica se está autenticado (pra fazer alteração do avatar (middleware))
usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const updateUserAvatar = new UpdateUserAvatarService();
        const user = await updateUserAvatar.execute({
            // pego através do middleware.
            user_id: request.user.id,
            avatarFilename: request.file.filename, // pego pelo upload.ts
        });
        delete user.password;
        return response.json(user);
    },
);

export default usersRouter;
