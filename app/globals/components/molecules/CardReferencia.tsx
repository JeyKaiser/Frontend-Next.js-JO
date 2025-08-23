// components/molecules/CardReferencia.tsx (Ejemplo)
import Link from 'next/link';
import Image from 'next/image';

interface CardReferenciaProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  href: string; 
}

const CardReferencia: React.FC<CardReferenciaProps> = ({ imageSrc, title, subtitle, href }) => {
  console.log(`[CardReferencia] Recibido href: ${href} collectionId: ${href.includes('collectionId') ? href.split('collectionId=')[1] : 'N/A'}`);
  
   return (
    <Link href={href} className="block group">
      <div className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg hover:-translate-y-2.5 bg-white border border-gray-200">
        <div className="w-full relative overflow-hidden rounded-t-2xl aspect-w-4 aspect-h-3 bg-gray-200">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            priority
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