// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {  
  images: {
    remotePatterns: [
      {
        protocol: 'http', // O 'https' si tu Django usa HTTPS
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**', // Permite cualquier path bajo /media/

      },    
      {
        protocol: 'https',
        hostname: 'johannaortiz.net',
        pathname: '/media/**', // Permite cualquier path bajo /media/
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**', 
      },
    ],
  },
};

module.exports = nextConfig;
