import { NextFunction, Request, Response } from 'express';
import {
  checkOtpRestrictions,
  handleForgotPassword,
  sendOtp,
  trackOtpRequests,
  validateRegistrationData,
  verifyForgotPasswordOtp,
  verifyOtp,
} from '../utils/auth.helper';
import {
  AuthError,
  ValidationError,
} from '@eshop-multivendor-ecommerce-microservice/error-handler';
import { prisma } from '@eshop-multivendor-ecommerce-microservice/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from '../utils/cookies/setCookie';

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
    console.log(existingUser);

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
): Promise<void | Response> => {
  try {
    const { email, otp, password, name } = req.body;

    if (!email || !otp || !password || !name)
      return next(new ValidationError(`All fields are required!`));

    const existingUser = await prisma.orm.users.where({ email }).first();

    if (existingUser) return next(new ValidationError(`User already exists!`));

    await verifyOtp(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.orm.users.create({
      name,
      email,
      password: hashedPassword,
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

// User login
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(
        new ValidationError(`Email and password fields are required!`),
      );

    const user = await prisma.orm.users.where({ email }).first();

    if (!user) return next(new AuthError(`User not found!`));

    // Verify password
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid)
      return next(new ValidationError(`Invalid email or password!`));

    if (!user) return next(new AuthError(`User not found!`));

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d' },
    );

    // Store the refresh and access token in a httpOnly secure cookie
    setCookie(res, 'refreshToken', refreshToken);
    setCookie(res, 'accessToken', accessToken);

    res.status(200).json({
      message: 'User logged in successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// User forgot password
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  await handleForgotPassword(req, res, next, 'user');
};

// Verify forgot password OTP
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

// Reset user password
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword)
      return next(new ValidationError(`All fields are required!`));

    const user = await prisma.orm.users.where({ email }).first();

    if (!user) return next(new ValidationError(`User not found!`));

    // Compare new password with the existing one
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword)
      return next(
        new ValidationError(
          `New password cannot be the same as the old password!`,
        ),
      );

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.orm.users.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      message: 'Password reset successfully!',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
