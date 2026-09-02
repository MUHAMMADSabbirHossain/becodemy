import { NextFunction, Request, Response } from 'express';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    console.log(`Error [${req.method}] ${req.url} - ${err.message}`);

    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.details !== undefined || null
        ? { details: err.details }
        : { details: null }),
    });
  }

  console.log('Unhandle error: ', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later!',
    details: null,
  });
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean = true;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: unknown,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

// Not found error
export class NotFoundError extends AppError {
  constructor(message = 'Resources not found!') {
    super(message, 404);
  }
}

// validation Error (use for Joi/zod/react-hook-form)
export class ValidationError extends AppError {
  constructor(message = 'Invalid request data!', details?: unknown) {
    super(message, 400, true, details);
  }
}

// Authentication error
export class AuthError extends AppError {
  constructor(message = 'Unauthorized!') {
    super(message, 401);
  }
}

// Forbidden error (For Insufficient permission)
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access!') {
    super(message, 403);
  }
}

// Database error (for Mongodb/Postgres Errors)
export class DatabaseError extends AppError {
  constructor(message = 'Database error!', details?: unknown) {
    super(message, 500, true, details);
  }
}

// Rate limit error (if user exceeds the rate limit)
export class RateLimitError extends AppError {
  constructor(message = 'Too many requests, please try again later.') {
    super(message, 429);
  }
}
