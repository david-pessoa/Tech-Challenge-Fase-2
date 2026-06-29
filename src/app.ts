import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { postRoutes } from './routes/post.routes';
import { userRouter } from './routes/user.routes';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

const swaggerDocument = YAML.load('./src/docs/openapi.yaml');

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas da aplicação
app.use('/api/posts', postRoutes);
app.use('/api/users', userRouter); // cadastro de usuários
app.use('/api/auth', authRouter); // login

// Middleware de erros
app.use(errorHandler);
