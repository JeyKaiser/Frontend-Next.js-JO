// components/molecules/CardReferencia.tsx
import Image from 'next/image';

interface CardReferenciaProps {
  imageSrc: string;
  title: string;
  description: string;
  // Puedes añadir más props si tu modelo tiene más campos que quieres mostrar
  // href?: string; // Habilita esto si la tarjeta de referencia también es un enlace
}

export default function CardReferencia({ imageSrc, title, description }: CardReferenciaProps) {
  const content = (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      {/* Imagen */}
      <div className="relative w-full pb-[75%] overflow-hidden rounded-lg mb-4 flex justify-center items-center">
        <Image
          src={imageSrc || '/img/placeholder.png'} // Fallback si la URL de la imagen es null/undefined
          alt={title}
          fill // Ocupa todo el contenedor
          style={{ objectFit: 'contain' }} // Para que la imagen se ajuste sin recortarse
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" // Mejora la optimización
        />
      </div>

      {/* Título y Descripción */}
      <h3 className="text-xl font-semibold text-gray-800 text-center mb-2 truncate w-full">
        {title}
      </h3>
      <p className="text-sm text-gray-600 text-center line-clamp-2">
        {description}
      </p>
    </div>
  );

  return (
    <div
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 ease-in-out
                 overflow-hidden w-full h-80 flex flex-col justify-between" // Altura fija y flexbox para contenido
    >
      {/* Si CardReferencia necesita ser un enlace: */}
      {/* {href ? (
        <Link href={href} className="block w-full h-full">
          {content}
        </Link>
      ) : (
        content
      )} */}
      {content}
    </div>
  );
}