// components/molecules/Card.tsx
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  id?: string | number;
  title: string;       // Será U_GSP_REFERENCE
  subtitle?: string;   // Será U_GSP_Desc
  imageSrc: string;    // Será U_GSP_Picture
  bgColor?: string;    // Puede ser opcional
  href?: string;       // Hacemos href opcional
}

export default function Card({ title, imageSrc, bgColor, href, id, subtitle }: CardProps) {
  
  const cardContent = (
    <div
      className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform
                 hover:scale-102 hover:shadow-lg hover:-translate-y-2.5
                 flex flex-col cursor-pointer
                 w-full max-w-[300px] aspect-[3/4]"
      style={{ backgroundColor: bgColor || '#f0f0f0' }} // Color por defecto si no se proporciona
     
    >
      {/* Contenedor de la imagen. Aspecto 1:1 y flex-grow */}
      <div className="relative w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-t-2xl flex-grow">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          priority
        />
      </div>

      {/* Contenedor del título y subtítulo/descripción */}
      <div className="flex flex-col items-center justify-center p-3 text-center flex-shrink-0 min-h-[60px]">
        <span className="text-gray-800 font-bold text-xl uppercase tracking-wide transition-all duration-300 ease-in-out group-hover:text-2xl">
          {title}
        </span>
        {subtitle && (
          <span className="text-gray-600 text-sm mt-1">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  // *** CAMBIO CLAVE AQUÍ: Asegurar que href sea un string no vacío para Link ***
  // También usamos !!href para convertirlo a booleano de forma segura.
  if (typeof href === 'string' && href.length > 0) {
    return <Link href={href} className="block group">{cardContent}</Link>;
  } else {
    return <div className="block group">{cardContent}</div>;
  }
}

