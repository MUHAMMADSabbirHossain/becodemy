import express, { Router } from 'express';
import {
  userLogin,
  userRegistration,
  verifyUser,
} from '../controller/auth.controller';

const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser);
router.post('/login-user', userLogin);

export default router;
