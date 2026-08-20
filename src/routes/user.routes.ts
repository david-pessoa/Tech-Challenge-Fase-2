import { Router } from 'express';
import { userController } from '../controllers/UserController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

export const userRouter = Router();

userRouter.post(
  '/',
  authMiddleware,                       
  authorizeRoles('ADMIN', 'PROFESSOR'), 
  upload.single('image'),
  userController.create.bind(userController)
);

userRouter.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  userController.delete.bind(userController)
);
