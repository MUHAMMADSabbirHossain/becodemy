'use client';

import axios, { AxiosError } from 'axios';

import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { JSX, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { countries } from '@/utils/countries';
import CreateShop from '@/shared/modules/auth/CreateShop';
import StripLogo from '@/assets/svgs/strip-logo';

type FormData = {
  name: string;
  email: string;
  phone_number: string;
  country_code: string;
  password: string;
};

const NEXT_PUBLIC_SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI as string;

const Signup = (): JSX.Element => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [passwrodVisible, setPasswordVisible] = useState<boolean>(false);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [sellerData, setSellerData] = useState<FormData | null>(null);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);

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

  const signupMutation = useMutation({
    mutationFn: async (data: FormData): Promise<any> => {
      const countryName = countries.find(
        (country) => country.code === data.country_code,
      );

      const response = await axios.post(
        `${NEXT_PUBLIC_SERVER_URI}/api/seller-registration`,
        {
          ...data,
          country: countryName?.name,
        },
      );
      // console.log(response);
      return response.data;
    },
    onSuccess: (_, formData) => {
      setSellerData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      if (!sellerData) return;
      // console.log(sellerData);

      const countryName = countries.find(
        (country) => country.code === sellerData.country_code,
      );

      const response = await axios.post(
        `${NEXT_PUBLIC_SERVER_URI}/api/verify-seller`,
        { ...sellerData, country: countryName?.name, otp: otp.join('') },
      );
      console.log({ response });

      return response.data;
    },
    onSuccess: (data) => {
      setSellerId(data?.data?._id);
      setActiveStep(2);
    },
  });

  const onSubmit = (data: FormData): void => {
    signupMutation.mutate(data);
  };

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

  const resendOtp = () => {
    if (sellerData) signupMutation.mutate(sellerData);
  };

  const connectStripe = () => {
    try {
      const response = axios.post(
        `${NEXT_PUBLIC_SERVER_URI}/api/create-stripe-link`,
        { sellerId },
      );

      if (response.data.url) window.location.href = response.data.url;
    } catch (error) {
      console.log('Stripe Connect error: ', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      {/* Stepper */}
      <div className="relative flex items-center justify-between md:w-[50%] mb-8">
        <div className="absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10" />

        {[1, 2, 3].map((step) => (
          <div key={step}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${step <= activeStep ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              {step}
            </div>

            <span className="-ml-3.75">
              {step === 1
                ? 'Create Account'
                : step === 2
                  ? 'Setup Shop'
                  : 'Connect Bank'}
            </span>
          </div>
        ))}
      </div>

      {/* Steps content */}
      <div className="md:w-122.25 p-8 bg-white shadow rounded-lg">
        {activeStep === 1 && (
          <>
            {' '}
            {!showOtp ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className="text-2xl font-semibold text-center mb-4">
                  Create Account
                </h3>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id=""
                  placeholder="John Doe"
                  className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 3,
                      message: 'Name must be at least 3 characters long',
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    {String(errors.name.message)}
                  </p>
                )}

                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id=""
                  placeholder="example@mail.com"
                  className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {String(errors.email.message)}
                  </p>
                )}

                <label htmlFor="phone" className="block text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id=""
                  placeholder="880123456****"
                  className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
                  {...register('phone_number', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/, // Follows E.164 format
                      message: 'Invalid phone number',
                    },
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 digits long',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Phone number must be at most 15 digits long',
                    },
                  })}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">
                    {String(errors.phone_number.message)}
                  </p>
                )}

                <label htmlFor="" className="block text-gray-700 mb-1">
                  Country
                </label>
                <select
                  className="w-full p-2 border border-gray-300 outline-0 rounded-sm"
                  {...register('country_code', {
                    required: 'Country is required',
                  })}
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country_code && (
                  <p className="text-red-500 text-sm">
                    {String(errors.country_code.message)}
                  </p>
                )}

                <label className="block text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={passwrodVisible ? 'text' : 'password'}
                    id=""
                    placeholder="Minimum 6 characters"
                    className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwrodVisible)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  >
                    {passwrodVisible ? <Eye /> : <EyeOff />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {String(errors.password.message)}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full text-lg bg-black mt-4 text-white py-2 rounded-lg"
                >
                  {signupMutation.isPending ? 'Signing up...' : 'Sign up'}
                </button>

                {signupMutation.isError &&
                  signupMutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                      {signupMutation.error.response?.data.message ||
                        signupMutation.error.message}
                    </p>
                  )}

                <p className="pt-3 text-center">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-500">
                    Login
                  </Link>
                </p>
              </form>
            ) : (
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
                  disabled={verifyOtpMutation.isPending}
                  onClick={() => verifyOtpMutation.mutate()}
                >
                  {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="text-center text-sm mt-4">
                  {canResend ? (
                    <button onClick={resendOtp} className="text-blue-500">
                      Resend OTP
                    </button>
                  ) : (
                    <p>{`Resend OTP in ${timer} seconds`}</p>
                  )}

                  {verifyOtpMutation?.isError &&
                    verifyOtpMutation?.error instanceof AxiosError && (
                      <p className="text-red-500 text-sm mt-2">
                        {verifyOtpMutation.error.response?.data?.message ||
                          verifyOtpMutation.error.message ||
                          'Something went wrong. Please try again later!'}
                      </p>
                    )}
                </div>
              </div>
            )}
          </>
        )}

        {activeStep === 2 && (
          <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
        )}

        {activeStep === 3 && (
          <div className="text-center">
            <h3 className="text-2xl font-semibold">Withdraw Method </h3>

            <button
              className="w-full mt-4 text-lg bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              onClick={connectStripe}
            >
              Connect Stripe <StripLogo width={30} height={30} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
