//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js options go here
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js
  images: {
    qualities: [100, 75, 50, 25, 10],
    remotePatterns: [
      {
        hostname: 'ik.imagekit.io',
      },
    ],
  },
};

module.exports = nextConfig;
