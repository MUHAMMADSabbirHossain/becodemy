import { prisma } from '@eshop-multivendor-ecommerce-microservice/database';
import { NextFunction, Request, Response } from 'express';
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
