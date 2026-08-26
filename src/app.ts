import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';

import { postRoutes } from './routes/post.routes';
import { userRouter } from './routes/user.routes';
import { authRouter } from './routes/auth.routes';
import { commentRoutes } from './routes/comment.routes';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

const swaggerDocument = YAML.load('./src/docs/openapi.yaml');
const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCss: `
    .parameter__empty_value_toggle {
      display: none !important;
    }
  `,
};

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use(cors()); // permite requisições de qualquer origem
app.use(express.json());

// Rotas da aplicação
app.use('/api/posts', postRoutes);
app.use('/api/user', userRouter); // cadastro de usuários
app.use('/api/auth', authRouter); // login
app.use('/api/post/comment', commentRoutes) //Comentários de posts

// Middleware de erros
app.use(errorHandler);
