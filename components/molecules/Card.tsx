// components/molecules/Card.tsx
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;       // Será U_GSP_REFERENCE
  imageSrc: string;    // Será U_GSP_Picture
  bgColor?: string;    // Puede ser opcional
  href?: string;       // Hacemos href opcional
  id?: string | number;
  subtitle?: string;   // Será U_GSP_Desc
}

export default function Card({ title, imageSrc, bgColor, href, id, subtitle }: CardProps) {
  
  const cardContent = (
    <div
      className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform
                 hover:scale-102 hover:shadow-lg hover:-translate-y-2.5
                 flex flex-col cursor-pointer
                 w-[250px] h-[350px] mx-auto flex-shrink-0" // <-- Tamaño fijo de la tarjeta
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


// // components/molecules/Card.tsx
// import Image from 'next/image';
// import Link from 'next/link';

// interface CardProps {
//   title: string;
//   imageSrc: string;
//   bgColor: string;
//   href: string;
//   id?: string | number; // Hacemos id opcional para el dashboard
//   subtitle?: string; // Hacemos subtitle opcional
// }

// export default function Card({ title, imageSrc, bgColor, href, id, subtitle }: CardProps) {
//   // El handleClick puede seguir siendo útil para depuración o futuras interacciones.
//   // const handleClick = () => {
//   //   console.log('¡Clic en la tarjeta!', { title, href, id });
//   // };

//   return (
//     <Link href={href} className="block group">
//       <div
//         className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform
//                    hover:scale-102 hover:shadow-lg hover:-translate-y-2.5
//                    flex flex-col cursor-pointer
//                    w-[250px] h-[350px] mx-auto flex-shrink-0" // <-- Mantener estas clases para tamaño fijo
//         style={{ backgroundColor: bgColor }}
//         // onClick={handleClick}
//       >
//         {/* Contenedor de la imagen */}
//         <div className="relative w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-t-2xl flex-grow">
//           {/* Asegúrate de que @tailwindcss/aspect-ratio esté configurado */}
//           <Image
//             src={imageSrc}
//             alt={title}
//             fill // Ocupa todo el contenedor
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             style={{ objectFit: 'cover' }} // Para que la imagen llene el espacio sin distorsión
//             className="transition-transform duration-300 ease-in-out group-hover:scale-105"
//             priority
//           />
//         </div>

//         {/* Contenedor del título y subtítulo */}
//         <div className="flex flex-col items-center justify-center p-3 text-center flex-shrink-0 min-h-[60px]">
//           <span className="text-gray-800 font-bold text-xl uppercase tracking-wide transition-all duration-300 ease-in-out group-hover:text-2xl">
//             {title}
//           </span>
//           {subtitle && ( // Renderiza el subtítulo solo si existe
//             <span className="text-gray-600 text-sm mt-1">
//               {subtitle}
//             </span>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// }




// // components/molecules/Card.tsx
// import Image from 'next/image';
// import Link from 'next/link';

// interface CardProps {
//   title: string;
//   imageSrc: string;
//   bgColor: string;
//   href: string;
// }

// export default function Card({ title, imageSrc, bgColor, href }: CardProps) {
//   const handleClick = () => {
//     console.log('¡Clic en la tarjeta!', { title, href });
//   };
//   return (
//     <Link href={href} className="block group">
//       <div
//         className="relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 ease-in-out transform
//                    hover:scale-102 hover:shadow-lg hover:-translate-y-2.5
//                    flex flex-col cursor-pointer
//                    w-[250px] h-[350px] mx-auto flex-shrink-0" 
//         style={{ backgroundColor: bgColor }}
//         onClick={handleClick}
//       >        
//         <div className="relative w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-t-2xl flex-grow">
//           {/* aspect-w-3 aspect-h-4 (3:4 vertical) es una buena proporción para imágenes de moda
//               Si tus imágenes son más cuadradas, usa aspect-w-1 aspect-h-1.
//               La clase flex-grow asegura que este div ocupe el espacio disponible
//               antes del título, respetando la altura total de 350px.
//           */}
//           <Image
//             src={imageSrc}
//             alt={title}
//             fill 
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             style={{ objectFit: 'cover' }} // 'cover' para que la imagen llene el espacio sin distorsión
//             className="transition-transform duration-300 ease-in-out group-hover:scale-105"
//             priority
//           />
//         </div>

//         {/* Etiqueta de la tarjeta */}
//         <div className="flex items-center justify-center p-3 text-center flex-shrink-0 min-h-[60px]"> {/* min-h para el título */}
//           <span className="text-gray-800 font-bold text-xl uppercase tracking-wide transition-all duration-300 ease-in-out group-hover:text-2xl">
//             {title}
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// }

