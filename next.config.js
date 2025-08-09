// Archivo de configuración de Next.js para manejar imágenes remotas
// Este archivo reemplaza la configuración de 'images.domains' con 'images.remotePatterns'
// y permite especificar patrones de URL para imágenes remotas.
// Asegúrate de que tu servidor Django esté configurado para servir imágenes correctamente.


/** @type {import('next').NextConfig} */
const nextConfig = { 
  images: {   
    remotePatterns: [
      {
        protocol: 'http',      // O 'https' si tu Django usa HTTPS
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
        // No se especifica 'pathname' si quieres permitir cualquier path desde ese hostname
        // Si solo quieres permitir /media/ImagesJOServer/ desde ese dominio, puedes ser más específico:
        pathname: '/media/ImagesJOServer/**', 
      },
      
    ],
  },
};

module.exports = nextConfig;

