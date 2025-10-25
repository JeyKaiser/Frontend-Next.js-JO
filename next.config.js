// Archivo de configuración de Next.js para manejar imágenes remotas y reescrituras de API
// Este archivo reemplaza la configuración de 'images.domains' con 'images.remotePatterns'
// y permite especificar patrones de URL para imágenes remotas.
// También configura 'rewrites' para redirigir las solicitudes de API al backend de Django.

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.0.40:8000/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',      // Backend en red local
        hostname: '192.168.0.40',
        port: '8000',
        pathname: '/media/**', // Permite cualquier path bajo /media/
      },
      {
        protocol: 'http',      // Backend localhost para desarrollo
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
      {
        protocol: 'https',     // Las URLs que proporcionaste usan HTTPS
        hostname: 'johannaortiz.net',
        // No se especifica 'port' si usa el puerto estándar (80 para HTTP, 443 para HTTPS)
        // Si solo quieres permitir /media/ImagesJOServer/ desde ese dominio, puedes ser más específico:
        pathname: '/media/ImagesJOServer/**', 
      },
      
    ],
  },
};

module.exports = nextConfig;

