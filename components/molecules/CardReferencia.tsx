import Image from 'next/image';
import Link from 'next/link';

interface CardReferenciaProps {
  title: string;
  imageSrc: string;
  bgColor?: string;
  href?: string;
  id?: string | number;
  subtitle?: string;
  referencePt?: string;
  collectionId?: string;
  // Ya NO aceptamos collectionName
}

export default function CardReferencia({
  title,
  imageSrc,
  bgColor,
  href,
  id,
  subtitle,
  referencePt,
  collectionId,
  // Ya NO recibimos collectionName
}: CardReferenciaProps) {

  // Construye el href dinámicamente, sin collectionName
  const dynamicHref = (referencePt && collectionId)
    ? `/telas/${referencePt}?collectionId=${collectionId}`
    : href;

  const cardContent = (
    <div
      className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform
                 hover:scale-102 hover:shadow-lg hover:-translate-y-2.5
                 flex flex-col cursor-pointer
                 w-[200px] h-[200px] mx-auto flex-shrink-0"
      style={{ backgroundColor: bgColor || '#f0f0f0' }}
    >
      <div className="relative w-full aspect-w-2 aspect-h-1 overflow-hidden rounded-t-2xl flex-grow">
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

  if (typeof dynamicHref === 'string' && dynamicHref.length > 0) {
    return <Link href={dynamicHref} className="block group">{cardContent}</Link>;
  } else {
    return <div className="block group">{cardContent}</div>;
  }
}
