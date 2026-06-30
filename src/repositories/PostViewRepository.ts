import { AppDataSource } from '../config/data-source';
import { PostView } from '../entities/PostView';

export const postViewRepository = AppDataSource.getRepository(PostView);