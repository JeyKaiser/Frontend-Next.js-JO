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
      {
        protocol: 'https', // Las URLs que proporcionaste usan HTTPS
        hostname: 'johannaortiz.net',
        // No se especifica 'port' si usa el puerto estándar (80 para HTTP, 443 para HTTPS)
        // No se especifica 'pathname' si quieres permitir cualquier path desde ese hostname
        // Si solo quieres permitir /media/ImagesJOServer/ desde ese dominio, puedes ser más específico:
        pathname: '/media/ImagesJOServer/**', 
      },
      
    ],
  },
};

module.exports = nextConfig;

