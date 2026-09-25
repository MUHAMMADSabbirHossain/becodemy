'use client';

import ImagePlaceHolder from '@/shared/image-placeholder';
import { ChevronRight } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ColorSelector,
  CustomProperties,
  CustomSpecifications,
  Input,
  RichTextEditor,
  SizeSelector,
} from '@eshop-multivendor-ecommerce-microservice/components';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

const Page = () => {
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(true);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { data, isPending, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/product/api/get-categories');
        // console.log(res.data);

        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const {
    data: discountCodes = [],
    isPending: discountLoading,
    isError: discountError,
  } = useQuery({
    queryKey: ['discountCodes'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-discount-codes');

      return res?.data?.discount_codes || [];
    },
  });

  const categories = data?.categories || [];
  const subcategoriesData = data?.subCategories || {};
  const selectedCategory = watch('category');
  const regularPrice = watch('regular_price');
  // console.log(categories, subcategoriesData);

  const subcategories = useMemo(() => {
    return selectedCategory ? subcategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subcategoriesData]);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = file;

    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    }

    setImages(updatedImages);
    setValue('images', updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];

      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }

      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }

      return updatedImages;
    });

    setValue('images', images);
  };

  const handleSaveDraft = () => {
    //
  };

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white "
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Heading & Breadcrumbs */}
      <h2 className="text-2xl font-semibold py-2 font-poppins text-white">
        Create Product
      </h2>
      <div className="flex items-center">
        <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span className="text-[#80Deea] cursor-pointer">Create Product</span>
      </div>

      {/* Content Layout */}
      <div className="py-4 flex w-full gap-6">
        {/* Left side - Image upload section */}
        <div className="md:w-[35%]">
          {images.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="765 x 850"
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}

          <div className="grid grid-cols-2 gap-3 mt-4">
            {images.slice(1).map((image, index) => (
              <ImagePlaceHolder
                setOpenImageModal={setOpenImageModal}
                size="765 x 850"
                small={true}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>

        {/* Right side - form inputs */}
        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            {/* Product Title Input */}
            <div className="w-2/4">
              <Input
                label="Product Title *"
                placeholder="Enter product title"
                {...register('title', { required: 'This field is required' })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message as string}
                </p>
              )}
              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short Description * (Max 150 words)"
                  placeholder="Enter short description for quick overview"
                  {...register('description', {
                    required: 'Description is required',
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description must be at most 150 words long (Current: ${wordCount} words)`
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Tags *"
                  placeholder="apple, flagship, etc"
                  {...register('tags', {
                    required: 'Seperate related products tags with comma (,) ',
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Warrenty *"
                  placeholder="1 Year / No Warrenty"
                  {...register('warrenty', {
                    required: 'Warrenty is required',
                  })}
                />
                {errors.warrenty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.warrenty.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Slug *"
                  placeholder="product-slug"
                  {...register('slug', {
                    required: 'Slug is required',
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        'Invalid slug format! Use only lowercase letters, numbers, and hyphens.',
                    },
                    minLength: {
                      value: 3,
                      message: 'Slug must be at least 3 characters long.',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Slug must be at most 50 characters long.',
                    },
                  })}
                />
              </div>
              <div className="mt-2">
                <Input
                  label="Brand"
                  placeholder="Apple"
                  {...register('brand')}
                />
                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <ColorSelector control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CustomSpecifications control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <CustomProperties control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Cash On Delivery *
                </label>

                <select
                  {...register('cash_on_delivery', {
                    required: 'Cash on delivery is required',
                  })}
                  defaultValue={'yes'}
                  className="w-full border outline-none border-gray-700 rounded-md p-2 bg-transparent text-white"
                >
                  <option value="yes" className="bg-black">
                    Yes
                  </option>
                  <option value="no" className="bg-black">
                    No
                  </option>
                </select>

                {errors.cash_on_delivery && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cash_on_delivery.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="w-2/4">
              <label className="block font-semibold text-gray-300 mb-1">
                Category *
              </label>

              {isPending ? (
                <p>Loading categories...</p>
              ) : isError ? (
                <p className="text-red-500 text-sm mt-1">
                  Failed to load categories
                </p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent rounded-md p-2 text-white"
                    >
                      <option value="" className="bg-black">
                        Select Category
                      </option>
                      {categories.map((category: any) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-black"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message as string}
                </p>
              )}

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Sub Category *
                </label>
                <Controller
                  name="subcategory"
                  control={control}
                  rules={{ required: 'Sub Category is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent rounded-md p-2 text-white"
                    >
                      <option value="" className="bg-black">
                        Select Sub Category
                      </option>
                      {subcategories.map((subcategory: any) => (
                        <option
                          key={subcategory}
                          value={subcategory}
                          className="bg-black"
                        >
                          {subcategory}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.subcategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subcategory.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Detailed Description * (Min 100 words)
                </label>
                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: 'Detailed description is required!',
                    validate: (value) => {
                      const wordCount = value
                        ?.split(/\s+/)
                        .filter((word: string) => word).length;

                      return (
                        wordCount >= 100 ||
                        'Detailed description must be at least 100 words long.'
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.detailed_description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.detailed_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Video URL"
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  {...(register('video_url'),
                  {
                    pattern: {
                      value:
                        /^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})$/,
                      message:
                        'Invalid YouTube embed video URL! Use formate: https://www.youtube.com/embed/VIDEO_ID',
                    },
                  })}
                />
                {errors.video_url && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Reguler Price *"
                  placeholder="99.99"
                  {...register('regular_price', {
                    required: 'Regular price is required',
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Regular price must be at least 1',
                    },
                    validate: (value) =>
                      !isNaN(value) || 'Only numbers are allowed',
                  })}
                />
                {errors.regular_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Sale Price *"
                  placeholder="100.00"
                  {...register('sale_price', {
                    required: 'Sale price is required',
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Sale price must be at least 1',
                    },
                    validate: (value) => {
                      if (isNaN(value)) return 'Only numbers are allowed';

                      if (regularPrice && value >= regularPrice)
                        return 'Sale price must be less than regular price';
                    },
                  })}
                />
                {errors.sale_price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Stock *"
                  placeholder="100"
                  {...register('stock', {
                    required: 'Stock is required',
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: 'Stock must be at least 1',
                    },
                    max: {
                      value: 1000,
                      message: 'Stock must be at most 1000',
                    },
                    validate: (value) => {
                      if (isNaN(value)) return 'Only numbers are allowed';

                      if (!Number.isInteger(value))
                        return 'Stock must be an integer';
                    },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <SizeSelector control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Select Discount Codes (Optional)
                </label>
                {discountLoading ? (
                  <p className="text-gray-400">Loading discount codes...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {discountCodes.map((code: any) => (
                      <button
                        type="button"
                        key={code._id}
                        className={`px-4 py-1 font-semibold  text-sm text-white rounded-md ${
                          watch('discountCodes')?.includes(code._id)
                            ? 'bg-blue-600 text-white border border-blue-600'
                            : 'bg-gray-600 text-white border border-gray-700 hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          const currentSelections =
                            watch('discountCodes') || [];
                          const updatedSelections = currentSelections.includes(
                            code._id,
                          )
                            ? currentSelections.filter(
                                (_id: string) => _id !== code._id,
                              )
                            : [...currentSelections, code._id];

                          setValue('discountCodes', updatedSelections);
                        }}
                      >
                        {code?.public_name} ({code?.discountValue}{' '}
                        {code.discountType === 'percentage' ? '%' : '$'})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {isChanged && (
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg "
          >
            Save Draft
          </button>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default Page;
