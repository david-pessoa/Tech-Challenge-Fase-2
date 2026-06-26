import { AppDataSource } from '../config/data-source';
import { Post } from '../entities/Post';

export const postRepository = AppDataSource.getRepository(Post);
