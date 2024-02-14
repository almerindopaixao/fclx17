/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/products',
        permanent: true
      }
    ]
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'cdn-cosmos.bluesoft.com.br'
    }, {
      protocol: 'http',
      hostname: 'localhost'
    }]
  }
};

export default nextConfig;
