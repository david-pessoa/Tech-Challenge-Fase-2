import { Router } from 'express';
import { commentController } from '../controllers/CommentController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/:postId', commentController.create);
router.get('/:commentId', commentController.findById);
router.get('/list/:postId', commentController.list);




export { router as commentRoutes };