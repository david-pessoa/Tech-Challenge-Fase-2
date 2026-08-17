import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

export const userRouter = Router();

userRouter.post(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN', 'PROFESSOR'),
  userController.create.bind(userController)
);

userRouter.put(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  userController.update.bind(userController)
);