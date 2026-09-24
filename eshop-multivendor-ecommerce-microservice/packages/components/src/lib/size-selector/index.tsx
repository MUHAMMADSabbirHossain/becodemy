import React from 'react';
import { Controller } from 'react-hook-form';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const SizeSelector = ({ control, errors }: any): React.JSX.Element => {
  return (
    <div className="mt-2">
      <label className="block font-semibold text-gray-300 mb-1">Sizes</label>
      <Controller
        name="sizes"
        control={control}
        render={({ field }) => (
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => {
              const isSelected = (field.value || []).includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((s: string) => s !== size)
                        : [...(field.value || []), size],
                    )
                  }
                  className={`px-2 py-1 rounded-lg font-Poppins transition-colors ${isSelected ? 'bg-[#0070f3] text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#0070f3] hover:text-white`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      />
      {errors.sizes && (
        <p className="text-red-500 text-sm">{errors.sizes.message}</p>
      )}
    </div>
  );
};

export { SizeSelector };
