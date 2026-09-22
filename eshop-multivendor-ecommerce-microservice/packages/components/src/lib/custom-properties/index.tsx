import { Controller } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    { label: string; values: string[] }[]
  >([]);
  const [newLabel, setNewLabel] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');

  return (
    <div>
      <div className="flex flex-col gap-3">
        <Controller
          name={`customProperties`}
          control={control}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);

            const addProperty = () => {
              if (!newLabel.trim()) return;
              setProperties([...properties, { label: newLabel, values: [] }]);
              setNewLabel('');
            };

            const addValue = (index: number) => {
              if (!newValue.trim()) return;
              const updatedProperties = [...properties];
              updatedProperties[index].values.push(newValue);
              setProperties(updatedProperties);
              setNewValue('');
            };

            const removeProperty = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
            };

            return (
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Custom Properties
                </label>

                <div className="flex flex-col gap-3">
                  {/* Existing properties */}
                  {properties.map((property, index) => (
                    <div
                      key={index}
                      className="border border-gray-700 p-4 rounded-lg bg-gray-900"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">
                          {property.label}
                        </span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeProperty(index)}
                        >
                          <X size={20} className="text-red-500" />
                        </button>
                      </div>

                      {/* Add values to Property */}
                      <div className="flex items-center mt-2 gap-2">
                        <input
                          type="text"
                          className="border outline-none border-gray-700 bg-gray-800 p-2 rounded text-white w-full"
                          placeholder="Enter value..."
                          onChange={(e) => setNewValue(e.target.value)}
                        />

                        <button
                          type="button"
                          className="px-2 py-1 to-blue-500 text-white rounded"
                          onClick={() => addValue(index)}
                        >
                          <Plus size={20} /> Add
                        </button>
                      </div>

                      {/* Show values */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {property.values.map((value, i) => (
                          <span
                            key={i}
                            className="bg-gray-700 text-white px-2 py-1 rounded"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Add new property */}
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      className="border outline-none border-gray-700 bg-gray-800 p-2 rounded text-white w-full"
                      placeholder="Enter property label (e.g. Meterial, Warrent, etc.)"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                    />

                    <button
                      type="button"
                      className="px-2 py-2 bg-blue-500 text-white rounded flex ictems-center gap-2"
                      onClick={addProperty}
                    >
                      <Plus size={20} /> Add
                    </button>
                  </div>
                </div>

                {errors.custom_specifications && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.custom_specifications.message as string}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};
