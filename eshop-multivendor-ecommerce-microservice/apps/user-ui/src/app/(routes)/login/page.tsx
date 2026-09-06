'use client';

import GoogleButton from '@/shared/components/google-button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};

const Login = (): JSX.Element => {
  const [passwrodVisible, setPasswordVisible] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    //
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1">
      <h1 className="text-4xl font-poppins font-semibold text-black text-center">
        Login
      </h1>

      <p className="text-center text-lg font-medium py-3 text-[00000099]">
        Home . Login
      </p>

      <div className="w-full flex justify-center">
        <div className="md:w-120 p-8 bg-white shadow-2xl rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to Eshop
          </h3>

          <p className="text-center text-gray-500 mb-4">
            Dont't have an account?{' '}
            <Link href="/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>

          <GoogleButton />

          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-2">Or Sign in with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
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

            <div className="flex justify-between items-center my-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-blue-500 text-sm">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full text-lg bg-black text-white py-2 rounded-lg"
            >
              Login
            </button>

            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
