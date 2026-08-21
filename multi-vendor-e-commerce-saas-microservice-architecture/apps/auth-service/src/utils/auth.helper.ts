/// auth.helper.ts
import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { sendEmail } from "./sendMail";
import { NextFunction } from "express";
import redis from "@packages/libs/redis";

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller",
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "user" && !phone_number) ||
    (userType === "seller" && !country)
  ) {
    throw new ValidationError(`Missing required fields!`);
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email format!`);
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction,
) => {
  if (await redis.get(`otp_lock:{email}`)) {
    return next(
      new ValidationError(
        "Account locked due to too many attempts! Try again later 30 minutes",
      ),
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many requests! Please wait 1 hour before requesting again.",
      ),
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError(
        "Please wait 1 minute before requesting a new OTP again!",
      ),
    );
  }
};

export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_requests:${email}`;

  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); // Lock for 1 hour

    return next(
      new ValidationError(
        "Too many requests! Please wait 1 hour before requesting again.",
      ),
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600); // Track requests for 1 hour
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string,
) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, "Verify your email", template, { name, otp });

  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};
