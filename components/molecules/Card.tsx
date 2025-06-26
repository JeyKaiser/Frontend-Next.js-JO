// /components/molecules/Card.tsx
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;
  imageSrc: string;
  bgColor: string;
  href: string;          // La ruta a la que navegar (ej. /colecciones/winter_sun)
}

export default function Card({ title, imageSrc, bgColor, href }: CardProps) {
   const handleClick = () => {
    console.log('¡Clic en la tarjeta!', { title, href });
  };
  return (
    <Link href={href} className="block group">
      <div
        className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform
                   hover:scale-102 hover:shadow-lg hover:-translate-y-2.5
                   flex flex-col h-auto cursor-pointer"
        style={{ backgroundColor: bgColor }}
        onClick={handleClick}
      >
        {/* Contenedor de la imagen (aproximadamente 75% de la altura de la tarjeta) */}
        <div className="relative w-full pb-[75%] overflow-hidden rounded-t-2xl">
          <Image
            src={imageSrc}
            alt={title}
            fill // Ocupa todo el contenedor
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
            priority
          />
        </div>

        {/* Etiqueta de la tarjeta */}
        <div className="flex items-center justify-center p-3 text-center flex-grow">
          <span className="text-gray-800 font-bold text-xl uppercase tracking-wide transition-all duration-300 ease-in-out group-hover:text-2xl">
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
}