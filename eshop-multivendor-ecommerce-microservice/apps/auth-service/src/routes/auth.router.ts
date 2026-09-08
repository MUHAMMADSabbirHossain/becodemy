import express, { Router } from 'express';
import {
  getUser,
  refreshToken,
  resetUserPassword,
  userForgotPassword,
  userLogin,
  userRegistration,
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

export default router;
