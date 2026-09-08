import { prisma } from '@eshop-multivendor-ecommerce-microservice/database';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/prefer-namespace-keyword */
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        name: string;
        email: string;
        password: string;
        role: 'user' | 'seller';
      };
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace, @typescript-eslint/prefer-namespace-keyword */
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token)
      return res.status(401).json({ message: 'Unauthorized! Token missing.' });

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as { id: string; role: 'user' | 'seller' };

    if (!decoded || !decoded.id || !decoded.role)
      return res
        .status(401)
        .json({ message: 'Unauthorized! Invalid access token.' });

    const account = (await prisma.orm.users
      .where({ _id: decoded.id })
      .first()) as {
      _id: string;
      name: string;
      email: string;
      password: string;
      role: 'user' | 'seller';
    };

    if (!account)
      return res
        .status(401)
        .json({ message: 'Unauthorized! Account not found.' });

    req.user = account;

    return next();
  } catch (error) {
    next(error);
  }
};
