// src/components/molecules/CardAnio.tsx
import Image from 'next/image';
import Link from 'next/link';

// Definimos la interfaz para las props del componente CardAnio
interface CardAnioProps {
  id: string; // Es bueno desestructurarlo para que se sepa que está disponible, aunque no lo uses directamente en el JSX
  title: string; // Esto será el año (ej. '2024')
  subtitle: string; // Esto será el nombre de la colección (ej. 'WINTER SUN')
  imageSrc: string; // La ruta de la imagen (ej. /img/...)
  bgColor: string; // El color de fondo de la tarjeta
  href: string; // La URL a la que la tarjeta debe enlazar (ej. /referencias/id)
}

// Desestructura 'id' y 'subtitle' también, y úsalos en el JSX
export default function CardAnio({ id, title, subtitle, imageSrc, bgColor, href }: CardAnioProps) {
  return (
    <Link href={href} className="block group">
      <div
        className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform
                   hover:scale-102 hover:shadow-lg hover:-translate-y-2.5
                   flex flex-col h-auto cursor-pointer"
        style={{ backgroundColor: bgColor }} // Aplicamos el color de fondo dinámicamente
      >
        {/* Contenedor de la imagen */}
        <div className="relative w-full pb-[75%] overflow-hidden rounded-t-2xl">
          <Image
            src={imageSrc}
            alt={title}
            fill // Ocupa todo el contenedor
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Para optimización de imágenes
            style={{ objectFit: 'cover' }} // Escala la imagen para cubrir el área
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
            priority // Carga la imagen de inmediato
          />
        </div>

        {/* Texto de la tarjeta */}
        <div className="flex flex-col items-center justify-center p-3 text-center flex-grow">
          {/* Muestra el Año (title) */}
          <span className="text-gray-800 font-bold text-xl uppercase tracking-wide transition-all duration-300 ease-in-out group-hover:text-2xl">
            {title}
          </span>
          {/* Muestra el Nombre de la Colección (subtitle) */}
          <span className="text-gray-700 text-sm mt-1 uppercase opacity-80">
            {subtitle}
          </span>
        </div>
      </div>
    </Link>
  );
}