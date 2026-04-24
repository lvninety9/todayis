/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('next-bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'jiesomglvobttxujsakz.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
