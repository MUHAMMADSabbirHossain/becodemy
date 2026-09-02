/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import {
  errorHandler,
  errorMiddleware,
} from '@eshop-multivendor-ecommerce-microservice/error-handler';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import * as path from 'path';

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

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to auth-service!' + ' ' + errorHandler() });
});

app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`Auth service is listening at http://localhost:${port}/api`);
});
server.on('error', (err) => console.error('Server error', err));
