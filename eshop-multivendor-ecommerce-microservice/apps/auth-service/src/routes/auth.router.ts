import express, { Router } from 'express';
import {
  createShop,
  getUser,
  refreshToken,
  registerSeller,
  resetUserPassword,
  userForgotPassword,
  userLogin,
  userRegistration,
  verifySeller,
  verifyUser,
  verifyUserForgotPassword,
} from '../controller/auth.controller';
import { isAuthenticated } from '@eshop-multivendor-ecommerce-microservice/middleware';

const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser);
router.post('/login-user', userLogin);
router.post('/refresh-token-user', refreshToken);
router.get('/logged-in-user', isAuthenticated, getUser);
router.post('/forgot-password-user', userForgotPassword);
router.post('/reset-password-user', resetUserPassword);
router.post('/verify-forgot-password-user', verifyUserForgotPassword);
router.post('/seller-registration', registerSeller);
router.post('/verify-seller', verifySeller);
router.post('/create-shop', createShop);

export default router;
