// import { isAuthenticated } from './../../../../packages/middleware/src/lib/isAuthenticated';
import { isAuthenticated } from '@eshop-multivendor-ecommerce-microservice/middleware';
import express, { Router } from 'express';
import {
  createDiscountCodes,
  deleteDiscountCodes,
  getCategories,
  getDiscountCodes,
} from '../controllers/product.controller';

const router: Router = express.Router();

router.get('/get-categories', getCategories);
router.post('/create-discount-code', isAuthenticated, createDiscountCodes);
router.get('/get-discount-codes', isAuthenticated, getDiscountCodes);
router.delete(
  '/delete-discount-code/:id',
  isAuthenticated,
  deleteDiscountCodes,
);

export default router;
