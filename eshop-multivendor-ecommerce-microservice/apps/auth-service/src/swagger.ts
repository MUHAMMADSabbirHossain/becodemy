import swaggerAuthgen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Auth Service API',
    description: 'Automentically generated Swagger docs',
    version: '1.0.0',
  },
  host: 'localhost:6001',
  basePath: '/api',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles: string[] = ['./routes/auth.router.ts'];

swaggerAuthgen(outputFile, endpointsFiles, doc);
