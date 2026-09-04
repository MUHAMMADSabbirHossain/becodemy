import { NextFunction, Request, Response } from 'express';
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequests,
  validateRegistrationData,
} from '../utils/auth.helper';
import { ValidationError } from '@eshop-multivendor-ecommerce-microservice/error-handler';
import { prisma } from '@eshop-multivendor-ecommerce-microservice/database';

// Register a new user - user or seller
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    validateRegistrationData(req.body, 'user');
    const { name, email } = req.body;

    // Check if new user email already exists in the database
    const existingUser = await prisma.orm.users.where({ email }).first();

    if (existingUser) {
      return next(new ValidationError(`User already exists with this email!`));
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, 'user-activation-mail');

    return res.status(200).json({
      message: 'OTP sent to email. Please verify your account.',
    });
  } catch (error) {
    return next(error);
  }
};
