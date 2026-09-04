import crypto from 'crypto';
import { NextFunction } from 'express';
import { ValidationError } from '@eshop-multivendor-ecommerce-microservice/error-handler';
import { redis } from '@eshop-multivendor-ecommerce-microservice/database';
import { sendEmail } from './send-mail';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: 'user' | 'seller',
): void => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === 'seller' && (!phone_number || !country))
  ) {
    // console.log(data);
    throw new ValidationError(`Missing required fields!`);
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email format!`);
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction,
): Promise<void> => {
  if (await redis.get(`otp_lock:{email}`)) {
    return next(
      new ValidationError(
        'Account locked due to too many attempts! Try again later 30 minutes',
      ),
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        'Too many requests! Please wait 1 hour before requesting again.',
      ),
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError(
        'Please wait 1 minute before requesting a new OTP again!',
      ),
    );
  }
};

/**
 * otp_lock - Check if the new user has exceeded the maximum number of attempts in the last 1 minute to verify their email - if so, lock the account for 30 minutes.
 *
 * opt_spam_lock - Check if the new user has exceeded the maximum number of requests for each minute to verify their email - if so, lock the account for 1 hour as a spam protection.
 *
 * otp_cooldown - Check if the new user has exceeded the maximum number of requests for each minute to verify their email - if so, lock the account for 1 minute as a spam protection.
 */
/**
 * otp_lock      → Failed OTP too many times  → 30 min lock 🔒
 *
 * otp_spam_lock → Requested OTP too fast     → 1 hour lock 🚫
 *
 * otp_cooldown  → Requested OTP too fast     → 1 min wait ⏱️
 */
export const trackOtpRequests = async (
  email: string,
  next: NextFunction,
): Promise<void> => {
  const otpRequestKey = `otp_requests_count:${email}`;
  const otpRequests: number = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600); // Lock for 1 hour

    return next(
      new ValidationError(
        'Too many requests! Please wait 1 hour before requesting again.',
      ),
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600); // Track requests for 1 hour
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string,
): Promise<void> => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, 'Verify your email', template, { name, otp });

  await redis.set(`otp:${email}`, otp, 'EX', 300);
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // otp_cooldown: How long to wait before allowing sending another otp request
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction,
) => {
  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp) throw new ValidationError(`Invalid or expired OTP!`);

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts: number = parseInt(
    (await redis.get(failedAttemptsKey)) || '0',
  );

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, 'locked', 'EX', 1800); // Lock for 30 min
      await redis.del(`otp:${email}`, failedAttemptsKey);

      throw new ValidationError(
        'Too many attempts! Please wait 30 minutes before requesting again.',
      );
    }

    await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 300);

    throw new ValidationError(
      `Incorrect OTP! ${2 - failedAttempts} attempts left.`,
    );
  }

  await redis.del(`otp:${email}`, failedAttemptsKey);
};
