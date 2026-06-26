import { Router } from "express";
import { postController } from "../controllers/PostController";

const router = Router();

router.post("/", postController.create);

export { router as postRoutes };