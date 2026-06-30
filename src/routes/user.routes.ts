import { Router } from 'express';

import { userController } from '../controllers/UserController';

export const userRouter = Router();

// Rota pública — qualquer um pode se cadastrar
userRouter.post('/', userController.create.bind(userController));
