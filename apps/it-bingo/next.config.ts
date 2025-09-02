import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@event-games/ui', '@event-games/utils'],
};

export default nextConfig;
