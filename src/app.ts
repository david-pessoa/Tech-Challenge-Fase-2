import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { postRoutes } from './routes/post.routes';
import { userRouter } from './routes/user.routes';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler';
import { postViewRoutes } from './routes/post-view.routes';

export const app = express();

const swaggerDocument = YAML.load('./src/docs/openapi.yaml');
const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Rotas da aplicação
app.use('/api/posts', postRoutes);
app.use('/api/post-visto', postViewRoutes);
app.use('/api/user', userRouter); // cadastro de usuários
app.use('/api/auth', authRouter); // login

// Middleware de erros
app.use(errorHandler);
