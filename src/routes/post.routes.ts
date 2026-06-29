import { Router } from 'express';
import { postController } from '../controllers/PostController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Rotas públicas — qualquer um pode acessar
router.get('/', postController.list);
router.get('/:id', postController.findById);

// Rotas protegidas — apenas PROFESSOR e ADMIN autenticados
router.post('/', authMiddleware, authorizeRoles('PROFESSOR', 'ADMIN'), postController.create);
router.put('/:id', authMiddleware, authorizeRoles('PROFESSOR', 'ADMIN'), postController.update);
router.delete('/:id', authMiddleware, authorizeRoles('PROFESSOR', 'ADMIN'), postController.delete);

export { router as postRoutes };