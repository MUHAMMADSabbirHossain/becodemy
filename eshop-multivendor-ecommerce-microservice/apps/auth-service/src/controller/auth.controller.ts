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
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { setCookie } from '../utils/cookies/setCookie';
import Stripe from 'stripe';

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
    // console.log(existingUser);

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

    // console.log({ user });

    // Generate access and refresh tokens
    const accessToken = jwt.sign(
      { id: user._id.toString(), role: 'user' },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      { id: user._id.toString(), role: 'user' },
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

// Refresh token user
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    // console.log(refreshToken);

    if (!refreshToken)
      throw new AuthError(`Unauthorized! Refresh token not found.`);

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { id: string; role: string };
    // console.log({ decoded });

    if (!decoded || !decoded.id || !decoded.role)
      throw new JsonWebTokenError('Forbidden! Invalid refresh token.');

    // let account;
    // if(decoded.role === 'user')
    const user = await prisma.orm.users.where({ id: decoded.id }).first();
    // console.log(user);

    if (!user) throw new AuthError(`User not found!`);

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    );

    setCookie(res, 'accessToken', newAccessToken);

    res
      .status(200)
      .json({ success: true, message: 'Access token refreshed successfully!' });
  } catch (error) {
    next(error);
  }
};

// get logged in user
export const getUser = async (
  req: Request & { user?: unknown },
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { _id, email, name, password } = req.user as {
      _id: string;
      email: string;
      name: string;
      password: string;
    };
    res.status(200).json({ success: true, user: { id: _id, email, name } });
  } catch (error) {
    next(error);
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

    const updatedUser = await prisma.orm.users
      .where({ _id: user._id.toString() })
      .update({ password: hashedPassword });

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

// Register a new seller
export const registerSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    validateRegistrationData(req.body, 'seller');

    const { name, email } = req.body;
    console.log(req.body);

    // const existingSeller = await prisma.orm.sellers.where({ email }).first();

    const existingSeller = await prisma.orm.sellers.where({ email }).first();
    console.log({ existingSeller });

    if (existingSeller) throw new ValidationError(`Seller already exists!`);

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, 'seller-activation');

    return res.status(200).json({
      message: 'OTP sent to email. Please verify your account.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Verify seller with OTP
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;

    if (!email || !otp || !password || !name || !phone_number || !country)
      return next(new ValidationError(`All fields are required!`));

    const existingSeller = await prisma.orm.sellers.where({ email }).first();

    if (existingSeller)
      return next(new ValidationError(`Seller already exists!`));

    await verifyOtp(email, otp, next);

    const hashedPassword = await bcrypt.hash(password, 10);

    const { password: _, ...seller } = await prisma.orm.sellers.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      country,
    });

    res.status(201).json({
      success: true,
      message: 'Seller registered successfully!',
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};

// Create new shop
export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { name, bio, address, opening_hours, website, category, sellerId } =
      req.body;

    if (
      !name ||
      !bio ||
      !address ||
      !opening_hours ||
      !website ||
      !category ||
      !sellerId
    )
      return next(new ValidationError(`All fields are required!`));

    const shopData = {
      name,
      bio,
      address,
      opening_hours,
      website,
      category,
      sellerId,
    };

    if (website && website.trim() !== '') shopData.website = website;

    const shop = await prisma.orm.shops.create(shopData);

    res.status(201).json({
      success: true,
      message: 'Shop created successfully!',
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

// Create stripe connect account link
export const createStripeConnectLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { sellerId } = req.body;

    if (!sellerId) return next(new ValidationError(`Seller ID is required!`));

    const seller = await prisma.orm.sellers.where({ _id: sellerId }).first();

    if (!seller)
      return next(new ValidationError(`Seller is not available with this ID!`));

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2026-08-26.dahlia',
    });

    // TODO: $500 needed to open stripe altas, then connect stripe account
    const account = await stripe.accounts.create({
      type: 'express',
      email: seller.email,
      country: 'US',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    // Update seller stripe id
    await prisma.orm.sellers
      .where({ _id: sellerId })
      .update({ stripeId: account.id });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3000/pending',
      return_url: 'http://localhost:3000/success',
      type: 'account_onboarding',
    });

    res.status(201).json({
      success: true,
      message: 'Stripe connect link created successfully!',
      data: accountLink,
      url: accountLink.url,
    });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ValidationError(`All fields are required!`));

    const seller = await prisma.orm.sellers.where({ email }).first();

    if (!seller) return next(new ValidationError(`Seller not found!`));

    const isMatch = await bcrypt.compare(password, seller.password);

    // Verify password
    if (!isMatch)
      return next(new ValidationError(`Invalid email or password!`));

    // Generate access token
    const accessToken = jwt.sign(
      { id: seller._id, role: 'seller' },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: seller._id, role: 'seller' },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d' },
    );

    // Store access and refresh in cookie
    setCookie(res, 'seller-refresh-token', refreshToken);
    setCookie(res, 'seller-access-token', accessToken);

    res.status(200).json({
      success: true,
      message: 'Seller logged in successfully!',
      data: { id: seller._id, email, name: seller.name },
    });
  } catch (error) {
    next(error);
  }
};

// get logged in seller
export const getSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const { id } = req.params;

    const seller = await prisma.orm.sellers.where({ _id: id }).first();

    res.status(200).json({
      success: true,
      message: 'Seller fetched successfully!',
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};
