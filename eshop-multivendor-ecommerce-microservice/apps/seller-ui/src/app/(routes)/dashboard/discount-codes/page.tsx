'use client';

import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Plus, PlusIcon, Trash, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
// import { Input } from '../../../../../../../packages/components/src/lib/input';
import { Input } from '@eshop-multivendor-ecommerce-microservice/components';
import { AxiosError } from 'axios';
import DeleteDiscountCodeModal from '@/shared/modals/delete.discount-codes';

const Page = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: discountCodes = [], isPending } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-discount-codes');
      console.log(res.data);

      return res?.data?.discount_codes || [];
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      public_name: '',
      discountType: 'percentage',
      discountValue: '',
      discountCode: '',
    },
  });

  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post(
        '/product/api/create-discount-code',
        data,
      );
      console.log(res.data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });

      reset();
      setShowModal(false);
    },
  });

  const deleteDiscountCodeMutation = useMutation({
    mutationFn: async (discountId: any) => {
      await axiosInstance.delete(
        `/product/api/delete-discount-code/${discountId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });

      setShowDeleteModal(false);
    },
  });

  const handleDeleteClick = async (discount: any) => {
    setShowDeleteModal(true);
    setSelectedDiscount(discount);
  };

  const onSubmit = async (data: any) => {
    if (discountCodes.length >= 8) {
      toast.error('You can only create 8 discount codes!');

      return;
    }

    createDiscountCodeMutation.mutate(data);
  };

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Discount Codes</h2>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} /> Create Discount
        </button>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items center text-white">
        <Link href={'/dashboard'} className="text-[#80Deea] cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={20} className="opacity- [.8]" />
        <span>Discount Codes</span>
      </div>

      <div className="mt-8 bg-gray-900 p-6 rounded">
        <h3 className="text-lg font-semibold text-white mb-4">
          Your Discount Codes
        </h3>

        {isPending ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : (
          <>
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="p-3">Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discountCodes.map((discount: any) => (
                  <tr
                    key={discount._id}
                    className="border-b border-gray-800 hover:bg-gray-900 transition"
                  >
                    <td className="p-3">{discount?.public_name}</td>
                    <td className="p-3 capitalize">
                      {discount.discountType === 'percentage'
                        ? 'Percentage (%)'
                        : 'Flat ($)'}{' '}
                    </td>
                    <td className="p-3">
                      {discount.discountType === 'percentage'
                        ? discount.discountValue + '%'
                        : '$' + discount.discountValue}
                    </td>
                    <td className="p-3">{discount.discountCode}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteClick(discount)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isPending && discountCodes.length === 0 && (
              <p className="text-gray-400 w-full pt-4 text-center">
                No discount codes available!
              </p>
            )}
          </>
        )}
      </div>

      {/* Create discount modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-112.5 shadow-lg">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <h3 className="text-xl text-white">Create Discount Code</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 Thover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              {/* Title */}
              <Input
                label="Title (Public Name)"
                {...register('public_name', { required: 'Title is required' })}
              />
              {errors.public_name && (
                <p className="text-red-500">{errors.public_name.message}</p>
              )}

              {/* Discount Type */}
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Discount Type
                </label>
                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none  p-2 bg-gray-700 text-white rounded"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount ($)</option>
                    </select>
                  )}
                />
                {errors.discountType && (
                  <p className="text-red-500">{errors.discountType.message}</p>
                )}
              </div>

              {/* Discount Value */}
              <div className="mt-2">
                <Input
                  label="Discount Value"
                  type="number"
                  min={1}
                  {...register('discountValue', {
                    required: 'Discount value is required',
                  })}
                />
                {errors.discountValue && (
                  <p className="text-red-500">{errors.discountValue.message}</p>
                )}
              </div>

              {/* Discount Code */}
              <div className="mt-2">
                <Input
                  label="Discount Code"
                  {...register('discountCode', {
                    required: 'Discount code is required',
                  })}
                />
                {errors.discountCode && (
                  <p className="text-red-500">{errors.discountCode.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={createDiscountCodeMutation.isPending}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 px-4 rounded-md font-semibold flex items-center justify-center gap-2"
              >
                <PlusIcon size={18} />
                <span>
                  {createDiscountCodeMutation.isPending
                    ? 'Creating...'
                    : 'Create Discount Code'}
                </span>
              </button>
              {createDiscountCodeMutation.isError && (
                <p className="text-red-500 mt-2">
                  {(
                    createDiscountCodeMutation.error as AxiosError<{
                      message: string;
                    }>
                  )?.response?.data.message ||
                    'Something went wrong to create discount code! Please try again.'}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && selectedDiscount && (
        <DeleteDiscountCodeModal
          discount={selectedDiscount}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() =>
            deleteDiscountCodeMutation.mutate(selectedDiscount?._id)
          }
        />
      )}
    </div>
  );
};

export default Page;
