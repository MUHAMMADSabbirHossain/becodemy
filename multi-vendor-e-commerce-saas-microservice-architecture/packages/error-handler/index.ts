export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean = true;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any,
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
  constructor(message: string = "Resources not found") {
    super(message, 404);
  }
}

// validation Error (use for Joi/zod/react-hook-form)
export class ValidationError extends AppError {
  constructor(message: string = "Invalid request data", details?: any) {
    super(message, 400, true, details);
  }
}

// Authentication error
export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

// Forbidden error (For Insufficient permission)
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access") {
    super(message, 403);
  }
}

// Database error (for Mongodb/Postgres Errors)
export class DatabaseError extends AppError {
  constructor(message: string = "Database error", details?: any) {
    super(message, 500, true, details);
  }
}

// Rate limit error (if user exceeds the rate limit)
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests, please try again later.") {
    super(message, 429);
  }
}
