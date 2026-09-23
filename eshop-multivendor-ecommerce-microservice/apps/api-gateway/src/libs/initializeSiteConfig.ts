import { prisma } from '@eshop-multivendor-ecommerce-microservice/database';

const initializeSiteConfig = async (): Promise<void> => {
  try {
    const existingConfig = await prisma.orm.site_config.first();

    if (!existingConfig) {
      await prisma.orm.site_config.create({
        categories: [
          'Electronics',
          'Fashion',
          'Home & Kitchen',
          'Sports & Fitness',
        ],
        subCategories: {
          Electronics: [
            'Mobiles',
            'Laptops',
            'Tablets',
            'Accessories',
            'Gaming',
          ],
          Fashion: ['Menswear', 'Womenswear', 'Footwear', 'Accessories'],
          'Home & Kitchen': ['Kitchenware', 'Furniture', 'Decor', 'Appliances'],
          'Sports & Fitness': ['Gym Equipment', 'Outdoor Gear', 'Wearables'],
        },
      });
    }
  } catch (error) {
    console.log('Error initializing site config: ', error);
  }
};

export default initializeSiteConfig;
