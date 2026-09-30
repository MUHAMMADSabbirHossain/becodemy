'use client';

import React, { useMemo } from 'react';
import {
  useTable,
  Table,
  flexRender,
  tableFeatures,
} from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import {
  BarChart,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Star,
  Trash,
} from 'lucide-react';
import axiosInstance from '@/utils/axiosInstance';
import DeleteConfirmationModal from '@/shared/components/modals/delete.confirmation.modal';

const fetchProducts = async () => {
  const res = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_SERVER_URI}/product/api/get-shop-products`,
  );
  // console.log(res.data);

  return res?.data?.products || [];
};

const ProductList = () => {
  const [globalFilter, setGlobalFilter] = React.useState<string>('');
  const [analyticsData, setAnalyticsData] = React.useState<'' | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>('');
  const queryClient = useQueryClient();

  const { data: products = [], isPending } = useQuery({
    queryKey: ['shop-products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }: any) => (
          <Image
            src={row.original.images[0]?.file_url}
            width={200}
            height={200}
            alt={row.original.images[0]?.file_url}
            className="w-12 h-12 rounded-md object-cover"
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Product Name',
        cell: ({ row }: any) => {
          const truncatedTitle =
            row.original.title.length > 25
              ? `${row.original.title.substring(0, 25)}...`
              : row.original.title;

          return (
            <Link
              href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
              className="text-blue-400 hover:underline"
              title={row.original.name}
            >
              {truncatedTitle}
            </Link>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }: any) => <span>${row.original.sale_price}</span>,
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }: any) => (
          <span
            className={row.original.stock < 10 ? 'text-red-500' : 'text-white'}
          >
            {' '}
            {row.original.stock}
          </span>
        ),
      },
      { accessorKey: 'category', header: 'Category' },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }: any) => (
          <div className="flex items-center gap-1">
            <Star fill="#fde047" size={20} />
            <span className="text-white">{row.original.ratings || 0}</span>
          </div>
        ),
      },
      {
        header: 'Actions',
        cell: ({ row }: any) => (
          <div className="flex gap-3">
            <Link
              href={`/product/${row.original.slug}`}
              className="text-blue-400 hover:text-blue-300 transition"
            >
              <Eye size={20} />
            </Link>

            <Link
              href={`/product/edit/${row.original.slug}`}
              className="text-yellow-400 hover:text-yellow-300 transition"
            >
              <Pencil size={20} />
            </Link>

            <button
              className="text-green-400 hover:text-green-300 transition"
              // onClick={() => openAnalytics(row.original)}
            >
              <BarChart size={20} />
            </button>

            <button
              className="text-red-400 hover:text-red-300 transition"
              // onClick={() => openDeleteModal(row.original)}
            >
              <Trash size={20} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useTable({
    data: products,
    columns,
    // getCoreRowModel: getFilteredRowModel(),
    // globalFilterFn: 'includesString',
    // state: { globalFilter },
    // onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full min-h-screen p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">All Products</h2>
        <Link
          href="/dashboard/create-product"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
        >
          <Plus size={20} /> Add Product
        </Link>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center mb-4">
        <Link href={'/dashboard'} className="text-blue-400 cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={20} className="text-gray-200" />
        <span className="text-white"> All Products</span>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center bg-gray-900 p-2 rounded-md flex-1">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search products"
          className="w-full bg-transparent text-white outline-none"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg p-4">
        {isPending ? (
          <p className="text-white text-center">Loading products...</p>
        ) : (
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-800">
                  {headerGroup.headers.map((header: any) => (
                    <th key={header.id} className="p-3 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-800 hover:bg-gray-900 transition"
                >
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            product={selectedProduct}
            onClose={setShowDeleteModal(false)}
            onConfirm={deleteMutation.mutate(selectedProduct?._id)}
            onRestore={restoreMutation.mutate(selectedProduct?._id)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
