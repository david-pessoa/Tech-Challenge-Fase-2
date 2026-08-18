import { Router } from 'express';
import { postController } from '../controllers/PostController';
import { authMiddleware, authorizeRoles } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Rota pública para exibir imagem anexada ao post
router.get('/:id/image', postController.getPostImage);

router.use(authMiddleware);

router.get('/', postController.list);
router.get('/search', postController.search);
router.get('/:id', postController.findById);

router.post(
  '/',
  authorizeRoles('PROFESSOR', 'ADMIN'),
  upload.single('image'),
  postController.create
);
router.put(
  '/:id',
  authorizeRoles('PROFESSOR', 'ADMIN'),
  upload.single('image'),
  postController.update
);
router.delete('/:id', authorizeRoles('PROFESSOR', 'ADMIN'), postController.delete);

export { router as postRoutes };
