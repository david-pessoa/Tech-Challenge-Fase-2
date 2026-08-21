import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

export const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.post(
  '/',
  authorizeRoles('ADMIN', 'PROFESSOR'),
  userController.create.bind(userController)
);

userRouter.put(
  '/:id',
  authorizeRoles('ADMIN'),
  userController.update.bind(userController)
);

userRouter.delete('/:id', authorizeRoles('ADMIN'), userController.delete.bind(userController));

userRouter.get('/me', userController.getMe.bind(userController));
