import { Router } from 'express';

import { postController } from '../controllers/PostController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/:postId/:userId', authorizeRoles('ALUNO'), postController.markAsViewed);

export { router as postViewRoutes };
