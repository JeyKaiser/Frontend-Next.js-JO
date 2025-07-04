// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Elimina 'images.domains' si existe y reemplázalo con 'images.remotePatterns'
  images: {
    // domains: ['localhost'], // <--- ELIMINA ESTO si existe
    remotePatterns: [
      {
        protocol: 'http', // O 'https' si tu Django usa HTTPS
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**', // Permite cualquier path bajo /media/
      },
      // Si tienes otros dominios para imágenes, agrégalos aquí:
      // {
      //   protocol: 'https',
      //   hostname: 'otro-dominio.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
};

module.exports = nextConfig;

// // next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['localhost', 
//       '127.0.0.1', 
//       'johannaortiz.net', 
//       'placehold.co'
//     ],
//   },
// };

// module.exports = nextConfig;

