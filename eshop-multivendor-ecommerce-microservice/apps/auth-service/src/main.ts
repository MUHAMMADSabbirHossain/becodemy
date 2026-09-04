/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { errorMiddleware } from '@eshop-multivendor-ecommerce-microservice/error-handler';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import * as path from 'path';
import router from './routes/auth.router';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 6001;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(
  cors({
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API!' });
});

app.get('/health-check', (req, res) => {
  res.send({
    message: `Welcome to auth-service! Health check - ${Date.now()}`,
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs-json', (req, res) => {
  res.send(swaggerDocument);
});

// Routes
app.use('/api', router);

app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`Auth service is listening at http://localhost:${port}/api`);
  console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});
server.on('error', (err) => console.error('Server error', err));
