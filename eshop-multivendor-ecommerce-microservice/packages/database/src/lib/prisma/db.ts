import 'dotenv/config';
import mongo from '@prisma/orm-mongo/runtime';
import type { Contract } from './contract.d';
// import contractJson from './contract.json' with { type: 'json' }; // WARNING - Import attributes are not allowed on statements that compile to CommonJS 'require' calls.
const contractJson = require('./contract.json');

const DATABASE_URL = process.env['DATABASE_URL'] as string;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const prisma = mongo<Contract>({
  contractJson,
  url: DATABASE_URL,
});
