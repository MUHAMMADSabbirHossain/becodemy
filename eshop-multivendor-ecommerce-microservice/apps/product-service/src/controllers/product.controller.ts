import { prisma } from '@eshop-multivendor-ecommerce-microservice/database';
import { NextFunction, Request, Response } from 'express';
import {
  NotFoundError,
  ValidationError,
} from '@eshop-multivendor-ecommerce-microservice/error-handler';
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
    const { public_name, discountType, discountCode } = req.body;

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
      discountValue: parseFloat(discountCode),
      discountCode,
      sellerId: req.seller.id,
    });

    return res.status(201).json({
      success: true,
      discount_code,
    });
  } catch (error) {
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
    const discount_codes = await prisma.orm.discount_codes.where({
      sellerId: req.seller.id,
    });

    return res.status(200).json({
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
    const sellerId = req.seller?.id;

    const discount_code = await prisma.orm.discount_codes
      .where({ id, sellerId })
      .first();

    if (!discount_code)
      return next(new NotFoundError('Discount code not found!'));

    if (discount_code.sellerId !== sellerId)
      return next(new ValidationError('Unauthorized!'));

    await prisma.orm.discount_codes.where({ id }).delete();

    return res.status(200).json({
      success: true,
      message: 'Discount code deleted successfully!',
    });
  } catch (error) {
    return next(error);
  }
};
