import { shopCategories } from '@/utils/categories';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { JSX } from 'react';
import { useForm } from 'react-hook-form';

const NEXT_PUBLIC_SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

type FormData = {
  name: string;
  bio: string;
  address: string;
  opening_hours: string;
  website: string;
  category: string;
};

const CreateShop = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string | null;
  setActiveStep: (step: number) => void;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const shopCreateMutaion = useMutation({
    mutationFn: async (data: FormData): Promise<void | Response> => {
      const response = await axios.post(
        `${NEXT_PUBLIC_SERVER_URI}/api/create-shop`,
        data,
      );
      console.log(response);

      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3);
    },
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    const shopData = { ...data, sellerId };
    shopCreateMutaion.mutate(shopData);
  };

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center">Setup new shop</h3>

        <label className="block text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          id=""
          placeholder="Shop name"
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
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}

        <label className="block text-gray-700 mb-1">
          Bio (Max 100 words) *
        </label>
        <input
          type="text"
          id=""
          placeholder="Shop bio..."
          className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
          {...register('bio', {
            required: 'Bio is required',
            validate: (value) =>
              countWords(value) <= 100 || 'Bio must be at most 100 words long',
            minLength: {
              value: 3,
              message: 'Bio must be at least 3 characters long',
            },
          })}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
        )}

        <label className="block text-gray-700 mb-1">Address *</label>
        <input
          type="text"
          id=""
          placeholder="Shop address"
          className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
          {...register('address', {
            required: 'Address is required',
            minLength: {
              value: 3,
              message: 'Address must be at least 3 characters long',
            },
          })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">
            {String(errors.address.message)}
          </p>
        )}

        <label className="block text-gray-700 mb-1">Opening hours *</label>
        <input
          type="text"
          id=""
          placeholder="e.g. Mon-Fri: 9am-6pm"
          className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
          {...register('opening_hours', {
            required: 'Opening hours is required',
            minLength: {
              value: 3,
              message: 'Opening hours must be at least 3 characters long',
            },
          })}
        />
        {errors.opening_hours && (
          <p className="text-red-500 text-sm">
            {String(errors.opening_hours.message)}
          </p>
        )}

        <label className="block text-gray-700 mb-1">Website</label>
        <input
          type="text"
          id=""
          placeholder="https://www.example.com"
          className="w-full p-2 border border-gray-300 outline-none rounded mb-1"
          {...register('website', {
            pattern: {
              value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/\.*)?$/,
              message: 'Invalid website URL',
            },
          })}
        />
        {errors.website && (
          <p className="text-red-500 text-sm">
            {String(errors.website.message)}
          </p>
        )}

        <label className="block text-gray-700 mb-1">Categories *</label>
        <select
          id=""
          className="w-full p-2 border border-gray-300 outline-0 rounded-sm mb-1 "
          {...register('category', { required: 'Category is required' })}
        >
          <option value="">Select a category</option>
          {shopCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">
            {String(errors.category.message)}
          </p>
        )}

        <button
          type="submit"
          className="w-full text-lg bg-blue-600 text-white py-2 rounded-lg mt-4"
        >
          Create shop
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
