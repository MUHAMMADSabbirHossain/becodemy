import swaggerAuthgen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Product Service API',
    description: 'Automentically generated Swagger docs',
    version: '1.0.0',
  },
  host: 'localhost:6002',
  basePath: '/product/api',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles: string[] = ['./routes/product.routes.ts'];

swaggerAuthgen(outputFile, endpointsFiles, doc);
