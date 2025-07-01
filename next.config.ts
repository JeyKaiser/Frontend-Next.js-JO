// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 
      '127.0.0.1', 
      'johannaortiz.net', 
      'placehold.co'
    ],
  },
};

module.exports = nextConfig;


// // next.config.ts
// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   reactStrictMode: true,

//   // --- Sección de configuración de imágenes ---
//   images: {
//     // Aquí defines los dominios de los cuales Next.js está permitido cargar imágenes externas.
//     // Esto es por seguridad y para que Next.js pueda optimizar las imágenes.
//     domains: [      
//       'localhost',    // Si tu Django sirve imágenes desde localhost (ej. /media/ o /static/)
//       '127.0.0.1',    // Otra posible IP para tu servidor Django local      
//     ],    
//   },
// };

// export default nextConfig;
