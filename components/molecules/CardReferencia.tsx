// components/molecules/CardReferencia.tsx
import Image from 'next/image';
import Link from 'next/link';

interface CardReferenciaProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  href: string; // Nueva prop para la URL de destino
}

const CardReferencia: React.FC<CardReferenciaProps> = ({ imageSrc, title, subtitle, href, }) => {
  return (
    <Link href={href} className="block group"> {/* Usa la prop href aquí */}
      <div className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg hover:-translate-y-2.5 bg-white border border-gray-200">
        <div className="w-full h-48 relative overflow-hidden rounded-t-2xl">
          <Image
            src={imageSrc}
            alt={title}
            fill // Ocupa todo el espacio del contenedor padre
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimización de imágenes
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            priority // Considera si estas imágenes son de alta prioridad
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200 truncate">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CardReferencia;

