import { NextFunction, Request, Response } from 'express';
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequests,
  validateRegistrationData,
  verifyOtp,
} from '../utils/auth.helper';
import { ValidationError } from '@eshop-multivendor-ecommerce-microservice/error-handler';
import { prisma } from '@eshop-multivendor-ecommerce-microservice/database';
import bcrypt from 'bcryptjs';

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

// Verify user through email OTP
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, otp, password, name } = req.body;

    if (!email || !otp || !password || !name)
      return next(new ValidationError(`All fields are required!`));

    const existingUser = await prisma.orm.users.where({ email }).first();

    if (existingUser) return next(new ValidationError(`User already exists!`));

    await verifyOtp(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.orm.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};
