'use client';

import ImagePlaceHolder from '@/shared/image-placeholder';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ColorSelector,
  Input,
} from '@eshop-multivendor-ecommerce-microservice/components';

const Page = () => {
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
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
        <div className="md:m-[65%]">
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
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
