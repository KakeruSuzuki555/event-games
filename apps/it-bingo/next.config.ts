import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@event-games/ui', '@event-games/utils', '@event-games/tailwind-config'],
};

export default nextConfig;
