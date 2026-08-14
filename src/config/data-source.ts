import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { env } from './env';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { InitialSchema1781745332530 } from '../migrations/1781745332530-InitialSchema';
import { Post } from '../entities/Post';
import { PostView } from '../entities/PostView';
import { PostEPostView1781746779920 } from '../migrations/1781746779920-PostEPostView';
import { SetNullOnPostUserDelete1786576866089 } from '../migrations/1786576866089-SetNullOnPostUserDelete';
import { Subject } from '../entities/Subject';
import { AddSubjects1786667649646 } from '../migrations/1786667649646-AddSubjects';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,
  synchronize: false,
  logging: false,
  entities: [Role, User, Post, PostView, Subject],
  migrations: [
    InitialSchema1781745332530, 
    PostEPostView1781746779920, 
    SetNullOnPostUserDelete1786576866089,
    AddSubjects1786667649646
  ],
});
