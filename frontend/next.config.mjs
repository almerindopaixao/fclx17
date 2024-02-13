/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'cdn-cosmos.bluesoft.com.br'
    }]
  }
};

export default nextConfig;
