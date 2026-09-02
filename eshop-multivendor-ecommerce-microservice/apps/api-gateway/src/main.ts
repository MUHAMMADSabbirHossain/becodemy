/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import cors from 'cors';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
// import swaggerUi from 'swagger-ui-express';
// import axios from 'axios';
import cookieParser from 'cookie-parser';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 8080;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(
  cors({
    origin: 'http://localhost:3000', // Origin of the frontend application
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true, // Allow cookies
  }),
);
app.use(morgan('dev'));
app.use(
  express.json({
    limit: '100mb', // Limit request body json size
  }),
);
app.use(
  express.urlencoded({
    limit: '100mb', // Limit request field size
    extended: true,
  }),
);
app.use(cookieParser());
app.set('trust proxy', 1); // trust first proxy for IP address

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100), // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later!',
  standardHeaders: true,
  legacyHeaders: true,
  // keyGenerator: (req: any) => req.ip, // ValidationError: Custom keyGenerator appears to use request IP without calling the ipKeyGenerator helper function for IPv6 addresses. This could allow IPv6 users to bypass limits. See https://express-rate-limit.github.io/ERR_ERL_KEY_GEN_IPV6/ for more information.
  keyGenerator: (req: any) => {
    return ipKeyGenerator(req.ip);
  },
});
app.use(limiter);

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use('/', proxy('http://localhost:6001'));

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
