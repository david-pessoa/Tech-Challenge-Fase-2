import { Router } from 'express';
import { postController } from '../controllers/PostController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', postController.list);
router.get('/search', postController.search);
router.get('/:id', postController.findById);

router.post('/', authorizeRoles('PROFESSOR', 'ADMIN'), postController.create);
router.put('/:id', authorizeRoles('PROFESSOR', 'ADMIN'), postController.update);
router.delete('/:id', authorizeRoles('PROFESSOR', 'ADMIN'), postController.delete);

export { router as postRoutes };
