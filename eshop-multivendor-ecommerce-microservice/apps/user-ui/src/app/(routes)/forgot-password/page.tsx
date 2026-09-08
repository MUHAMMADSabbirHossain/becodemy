'use client';

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JSX, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormData = {
  email: string;
  password: string;
};

const NEXT_PUBLIC_SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI as string;

const ForgotPassword = (): JSX.Element => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = (): void => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setCanResend(true);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const requestOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(
        `${NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        { email },
      );

      return response.data;
    },
    onSuccess: (_, email) => {
      setUserEmail(email);
      setStep('otp');
      setServerError(null);
      setCanResend(false);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid credentials';

      setServerError(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;

      const response = await axios.post(
        `${NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        { email: userEmail, otp: otp.join('') },
      );

      return response.data;
    },
    onSuccess: () => {
      setStep('reset');
      setServerError(null);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid OTP, please try again!';

      setServerError(errorMessage);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;

      const response = await axios.post(
        `${NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        { email: userEmail, newPassword: password },
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success(
        'Password reset successfully! Please login with your new password.',
      );
      setServerError(null);
      router.push('/login');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Invalid OTP, please try again!';

      setServerError(errorMessage);
    },
  });

  const handleOtpChange = (index: number, value: string): void => {
    if (!/^[0-9]+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1].focus();
    }
  };

  const onSubmitEmail = (data: FormData) => {
    requestOtpMutation.mutate(data.email);
  };

  const onSubmitPassword = (data: FormData) => {
    resetPasswordMutation.mutate({ password: data.password });
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Forgot Password
      </h1>

      <p className="text-center text-lg font-medium py-3 text-[00000099]">
        Home . Forgot Password
      </p>

      <div className="w-full flex justify-center">
        <div className="md:w-120 p-8 bg-white shadow-2xl rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Reset Password to Eshop
          </h3>

          <p className="text-center text-gray-500 mb-4">
            Go back to{' '}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>

          {step === 'email' && (
            <form onSubmit={handleSubmit(onSubmitEmail)}>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id=""
                placeholder="example@mail.com"
                className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {String(errors.email.message)}
                </p>
              )}

              <button
                type="submit"
                disabled={requestOtpMutation.isPending}
                className="w-full text-lg bg-black text-white py-2 rounded-lg mt-4"
              >
                {requestOtpMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
              </button>

              {serverError && (
                <p className="text-red-500 text-sm mt-2 text-center font-semibold">
                  {serverError}
                </p>
              )}
            </form>
          )}

          {step === 'otp' && (
            <div className="text-xl fond-semibold  text-center mb-4">
              <h3>Enter OTP</h3>

              <div className="flex justify-center gap-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    value={digit}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 outline-none rounded"
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyPress(index, e)}
                  />
                ))}
              </div>

              <button
                className="w-full mt-4 text-lg bg-blue-500 text-white py-2 rounded-lg"
                disabled={requestOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    onClick={() => {
                      if (userEmail) requestOtpMutation.mutate(userEmail);
                    }}
                    disabled={!userEmail}
                    className="text-blue-500 text-center mt-4 disabled:text-gray-400"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p>{`Resend OTP in ${timer} seconds`}</p>
                )}

                {serverError && (
                  <p className="text-red-500 text-sm mt-2 text-center font-semibold">
                    {serverError}
                  </p>
                )}

                {verifyOtpMutation?.isError &&
                  verifyOtpMutation?.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                      {(
                        verifyOtpMutation.error as AxiosError<{
                          message?: string;
                        }>
                      ).response?.data?.message ||
                        verifyOtpMutation.error.message ||
                        'Something went wrong. Please try again later!'}
                    </p>
                  )}
              </div>
            </div>
          )}

          {step === 'reset' && (
            <>
              <h3 className="text-xl font-semibold text-center mb-4">
                Reset Password
              </h3>

              <form onSubmit={handleSubmit(onSubmitPassword)}>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id=""
                  placeholder="Enter new password"
                  className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {String(errors.password.message)}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full text-lg bg-black text-white py-2 rounded-lg mt-4"
                >
                  {resetPasswordMutation.isPending
                    ? 'Resetting...'
                    : 'Reset Password'}
                </button>

                {serverError && (
                  <p className="text-red-500 text-sm mt-2 text-center font-semibold">
                    {serverError}
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
