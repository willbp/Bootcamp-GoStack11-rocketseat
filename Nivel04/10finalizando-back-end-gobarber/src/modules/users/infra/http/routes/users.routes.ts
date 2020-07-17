import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

// cria car upload pra pegar configuração dada em uploadConfig (upload.ts)
const upload = multer(uploadConfig.multer); // upload é instância do multer (libera comandos)
// upload.sinle (um unico arquivo) - vai ser passado como middleware abaixo
// no ensureAuthenticated async..

// rota de criação do usuário
usersRouter.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    usersController.create,
);

// patch atualiza uma única informação do usuário (avatar)
// verifica se está autenticado (pra fazer alteração do avatar (middleware))
usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    userAvatarController.update,
);

export default usersRouter;
