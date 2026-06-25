import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { postRoutes } from "./routes/post.routes";

export const app = express();

const swaggerDocument = YAML.load('./src/docs/openapi.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/posts", postRoutes);

app.use(express.json());
