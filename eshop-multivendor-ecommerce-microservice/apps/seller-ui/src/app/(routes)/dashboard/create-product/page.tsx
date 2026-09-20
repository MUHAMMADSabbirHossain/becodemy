'use client';

import ImagePlaceHolder from '@/shared/image-placeholder';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

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
        </div>

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
      <div className="m-[65%]">
        <div className="w-full flex gap-3">
          {/* Product Title Input */}
          <div className="w-2/4"></div>
        </div>
      </div>
    </form>
  );
};

export default Page;
