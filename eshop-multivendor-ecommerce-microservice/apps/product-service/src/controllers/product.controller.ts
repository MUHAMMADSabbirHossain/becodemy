import {
  imageKit,
  prisma,
} from '@eshop-multivendor-ecommerce-microservice/database';
import { NextFunction, Request, Response } from 'express';
import {
  AuthError,
  NotFoundError,
  ValidationError,
} from '@eshop-multivendor-ecommerce-microservice/error-handler';
import { toFile } from '@imagekit/nodejs';
import {
  MongoFieldFilter,
  MongoOrExpr,
} from '@prisma/orm-mongo/query-ast/execution';

// Get product categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const config = await prisma.orm.site_config.first();

    if (!config)
      return res.status(404).json({ message: 'Categories not found!' });

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next(error);
  }
};

// Create discount codes
export const createDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;

    const isDiscountCodeExists = await prisma.orm.discount_codes
      .where({ discountCode })
      .first();

    if (isDiscountCodeExists)
      return next(
        new ValidationError(
          'Discount code already exists! Please use a different discount code.',
        ),
      );

    const discount_code = await prisma.orm.discount_codes.create({
      public_name,
      discountType,
      discountValue: parseFloat(discountValue),
      discountCode,
      sellerId: req.seller._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Discount code created successfully!',
      discount_code,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Get discount codes
export const getDiscountCodes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const discount_codes = await prisma.orm.discount_codes
      .where({
        sellerId: req.seller._id,
      })
      .all();

    return res.status(200).json({
      success: true,
      message: 'Discount codes fetched successfully!',
      discount_codes,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete discount codes
export const deleteDiscountCodes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?._id;

    const discount_code = await prisma.orm.discount_codes
      .where({ _id: id, sellerId })
      .first();

    if (!discount_code)
      return next(new NotFoundError('Discount code not found!'));

    if (discount_code.sellerId !== sellerId)
      return next(new ValidationError('Unauthorized!'));

    await prisma.orm.discount_codes.where({ _id: id }).delete();

    return res.status(200).json({
      success: true,
      message: 'Discount code deleted successfully!',
    });
  } catch (error) {
    return next(error);
  }
};

// Upload product image
export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fileName } = req.body;

    if (!fileName) return next(new ValidationError('File name is required!'));

    const response = await imageKit.files.upload({
      file: await toFile(
        Buffer.from(fileName.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
      ),
      fileName: `product-${Date.now()}.jpg`,
      folder: '/products',
    });

    return res.status(201).json({
      success: true,
      message: 'Product image uploaded successfully!',
      file_url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Delete product image
export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fileId } = req.body;

    const response = await imageKit.files.delete(fileId);
    // console.log(response); // { fileId: 'fileId' }

    return res.status(204).json({
      success: true,
      message: 'Product image deleted successfully!',
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Create product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      short_description,
      detailed_description,
      warranty,
      custom_specifications,
      slug,
      tags,
      cash_on_delivery,
      brand,
      video_url,
      category,
      colors = [],
      sizes = [],
      discountCodes,
      stock,
      sale_price,
      regular_price,
      subcategory,
      customProperties = {},
      images = [],
    } = req.body;

    if (
      !title ||
      !slug ||
      !short_description ||
      !category ||
      !subcategory ||
      !sale_price ||
      !images ||
      !tags ||
      !stock ||
      !regular_price
    )
      return next(new ValidationError('Missing required fields!'));

    if (!req.seller._id)
      return next(
        new AuthError('Unauthorized! Only seller can create a product.'),
      );

    const slugChecking = await prisma.orm.products.where({ slug }).first();

    if (slugChecking) return next(new ValidationError('Slug already exists!'));

    const newProduct = await prisma.orm.products.create({
      title,
      short_description,
      detailed_description,
      warranty,
      cashOnDelivery: cash_on_delivery,
      slug,
      shopId: req.seller?.shop?._id,
      sellerId: req.seller._id,
      tags: Array.isArray(tags) ? tags : tags.split(','),
      brand,
      video_url,
      category,
      subcategory,
      colors: colors || [],
      discount_codes: discountCodes.map((codeId: string) => codeId),
      sizes: sizes || [],
      stock: parseInt(stock),
      sale_price: parseFloat(sale_price),
      regular_price: parseFloat(regular_price),
      customProperties: customProperties || {},
      images: images
        .filter((img: any) => img && img.fileId && img.file_url)
        .map((img: any) => ({
          fileId: img.fileId,
          file_url: img.file_url,
        })),
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Get logged in seller products
export const getShopProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await prisma.orm.products
      .where(
        MongoOrExpr.of([
          MongoFieldFilter.eq('shopId', req.seller?.shop?._id),
          MongoFieldFilter.eq('sellerId', req.seller._id),
        ]),
      )
      .all();

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully!',
      products,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Delete product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller._id;

    const product = await prisma.orm.products
      .where({ _id: productId, sellerId })
      .first();

    if (!product) return next(new ValidationError('Product not found!'));

    if (product.isDeleted)
      return next(new ValidationError('Product already deleted!'));

    const deletedProduct = await prisma.orm.products
      .where({ _id: productId, sellerId })
      .update({
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Delete after 24 hours from database
      });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
      product: deletedProduct,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Restore product
export const restoreProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller._id;

    const product = await prisma.orm.products.where({ _id: productId }).first();

    if (!product) return next(new ValidationError('Product not found!'));

    if (!product.isDeleted)
      return next(new ValidationError('Product not deleted!'));

    if (product.sellerId !== sellerId)
      return next(new ValidationError('Unauthorized!'));

    const restoredProduct = await prisma.orm.products
      .where({ _id: productId })
      .update({
        isDeleted: false,
        deletedAt: null,
      });

    return res.status(200).json({
      success: true,
      message: 'Product restored successfully!',
      product: restoredProduct,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
