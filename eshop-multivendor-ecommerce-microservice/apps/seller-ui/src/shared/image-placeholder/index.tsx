'use client';

import { Pencil, WandSparkles, X } from 'lucide-react';
import Image from 'next/image';
import React, { JSX, useState } from 'react';

type Props = {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove?: (index: number) => void;
  defaultImage?: string | null;
  setOpenImageModal?: (openImageModal: boolean) => void;
  index?: any;
};

const ImagePlaceHolder = ({
  size,
  small,
  onImageChange,
  onRemove,
  defaultImage = null,
  index = null,
  setOpenImageModal,
}: Props): JSX.Element => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file, index);
    }
  };

  return (
    <div
      className={`relative ${small ? 'h-45' : 'h-112.5'} w-full cursor-pointer bg-[#1e1e1e] border border-gray-600 rounded-lg flex flex-col justify-center items-center`}
    >
      <input
        type="file"
        name=""
        id={`image-upload-${index}`}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {imagePreview ? (
        <>
          <button
            type="button"
            className="absolute top-3 right-3 p-2 rounded bg-red-600 shadow-lg"
          >
            <X size={16} />
          </button>
          <button
            className="absolute top-3 right-3 p-2 rounded bg-red-600 shadow-lg cursor-pointer"
            onClick={() => setOpenImageModal && setOpenImageModal(true)}
          >
            <WandSparkles size={16} />
          </button>
        </>
      ) : (
        <>
          <label
            htmlFor={`image-upload-${index}`}
            className="absolute top-3 right-3 p-2 rounded bg-slate-700 shadow-lg cursor-pointer"
          >
            <Pencil size={16} />
          </label>
        </>
      )}

      {imagePreview ? (
        <Image
          width={400}
          height={300}
          src={imagePreview}
          alt="Product"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <>
          <p
            className={`text-gray-400 ${small ? 'text-xl' : 'text-4xl'} font-semibold`}
          >
            {size}
          </p>
          <p
            className={`text-gray-500 ${small ? 'text-sm' : 'text-lg'} pt-2 text-center`}
          >
            Please choose image according to the expected ration.
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePlaceHolder;
