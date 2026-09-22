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
        subcategories: [
          {
            category: 'Electronics',
            items: ['Mobiles', 'Laptops', 'Tablets', 'Accessories', 'Gaming'],
          },
          {
            category: 'Fashion',
            items: ['Menswear', 'Womenswear', 'Footwear', 'Accessories'],
          },
          {
            category: 'Home & Kitchen',
            items: ['Kitchenware', 'Furniture', 'Decor', 'Appliances'],
          },
          {
            category: 'Sports & Fitness',
            items: ['Gym Equipment', 'Outdoor Gear', 'Wearables'],
          },
        ],
      });
    }
  } catch (error) {
    console.log('Error initializing site config: ', error);
  }
};

export default initializeSiteConfig;
