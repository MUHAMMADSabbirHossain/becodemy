import cron from 'node-cron';
import { prisma } from '@eshop-multivendor-ecommerce-microservice/database';

cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    // Delete products where `deletedAt` older than 24 hours
    await prisma.orm.products
      .where({
        deletedAt: { lte: now },
      })
      .all();
  } catch (error) {
    console.log(error);
  }
});
