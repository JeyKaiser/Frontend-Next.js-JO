import Image from "next/image";

interface CardProps {
  title: string;
  imageSrc: string;
  bgColor: string;
  href: string;
  // subtitle?: string;
}

export default function Card({ title, imageSrc, bgColor, href }: CardProps) {
  return (
    <a href={href}>
      <div
        className="card rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-105 hover:-translate-y-1"
        style={{ backgroundColor: bgColor }}
      >
        <Image
          src={imageSrc}
          alt={title}
          className="w-full h-60 object-cover"
          width={400}
          height={240}
        />
        <span className="block text-center text-primary font-bold text-lg py-3 uppercase tracking-wide">
          {title}
        </span>
      </div>
    </a> 
    
    // <a href={href}>
    //   <div
    //     className="rounded-xl overflow-hidden shadow-md transition transform hover:scale-105 duration-300"
    //     style={{ backgroundColor: bgColor, maxWidth: '280px', maxHeight: '360px', width: '100%' }}
    //   >
    //     <Image 
    //       src={imageSrc} 
    //       alt={title} 
    //       className="w-full h-48 object-cover" />
    //       <div className="p-4">
    //         <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>
    //         { {subtitle && <p className="text-sm text-gray-600 text-center mt-1">{subtitle}</p>}       }
    //       </div>
    //   </div>
    // </a>
  );
}
