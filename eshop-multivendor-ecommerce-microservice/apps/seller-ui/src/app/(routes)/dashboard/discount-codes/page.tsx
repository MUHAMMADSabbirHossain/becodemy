'use client';

import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const discountCodes = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: discountCodes = [], isPending } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-discount-codes');
      console.log(res.data);

      return res?.data?.discount_codes || [];
    },
  });

  const handleDeleteClick = async (discount: any) => {
    //
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
                    key={discount.id}
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
    </div>
  );
};

export default discountCodes;
