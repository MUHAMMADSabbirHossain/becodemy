import express, { Router } from 'express';
import {
  resetUserPassword,
  userForgotPassword,
  userLogin,
  userRegistration,
  verifyUser,
  verifyUserForgotPassword,
} from '../controller/auth.controller';

const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser);
router.post('/login-user', userLogin);
router.post('/forgot-password', userForgotPassword);
router.post('/reset-user-password', resetUserPassword);
router.post('/verify-forgot-password-otp', verifyUserForgotPassword);

export default router;
