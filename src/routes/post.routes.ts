import { Router } from "express";
import { postController } from "../controllers/PostController";

const router = Router();

router.post("/", postController.create);
router.get("/:id", postController.findById);

export { router as postRoutes };