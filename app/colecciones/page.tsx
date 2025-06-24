// import CollectionCard from '@/components/molecules/Card';
import Link from 'next/link';
import Image from 'next/image';

const cards = [
  {
    href: '/colecciones/WINTER_SUN',
    img: '/img/winter-sun.jpg',
    label: 'WINTER SUN',
    bg: '#feea4d',
  },
  {
    href: '/colecciones/RESORT_RTW',
    img: '/img/resort-rtw.jpg',
    label: 'RESORT RTW',
    bg: '#70a7ff',
  },
  {
    href: '/colecciones/SPRING_SUMMER',
    img: '/img/spring-summer.jpg',
    label: 'SPRING SUMMER',
    bg: '#81c963',
  },
  {
    href: '/colecciones/SUMMER_VACATION',
    img: '/img/summer-vacation.jpg',
    label: 'SUMMER VACATION',
    bg: '#ff935f',
  },
  {
    href: '/colecciones/PRE_FALL',
    img: '/img/pre-fall.jpg',
    label: 'PRE - FALL',
    bg: '#c6b9b1',
  },
  {
    href: '/colecciones/FALL_WINTER',
    img: '/img/fall-winter.jpg',
    label: 'FALL WINTER',
    bg: '#b03c5c',
  },
];

export default function ColeccionesPage() {
  return (
    <div className="p-8">
      <header className="text-center mb-10">
        <h2 className="text-4xl font-semibold text-gray-800 uppercase tracking-widest relative inline-block">
          COLECCIONES
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-gray-700 via-yellow-500 to-gray-700 mx-auto mt-2 rounded-full" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link href={card.href} key={card.label}>
            <div
              className="rounded-2xl shadow-lg cursor-pointer transform hover:scale-105 transition duration-300 overflow-hidden"
              style={{ backgroundColor: card.bg }}
            >
              <Image
                src={card.img}
                alt={card.label}
                width={500}
                height={300}
                className="w-full h-56 object-cover"
                />
              <div className="p-4 text-center font-bold text-gray-800 uppercase">
                {card.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}



// export default function ColeccionesPage() {
//   return (
//     <div className="p-8">
//       <header className="text-center mb-8 relative">
//         <h2 className="text-3xl font-semibold text-gray-800 uppercase tracking-wider">COLECCIONES</h2>
//         <div className="w-24 h-1 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 mx-auto mt-2 rounded"></div>
//       </header>

//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
//         {cards.map((card) => (
//           <CollectionCard key={card.label} {...card} />
//         ))}
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useRouter } from 'next/navigation';

// const colecciones = [
//     { nombre: 'WINTER SUN', color: 'bg-yellow-200' },
//     { nombre: 'RESORT', color: 'bg-blue-200' },
//     { nombre: 'SPRING SUMMER', color: 'bg-green-200' },
//     { nombre: 'SUMMER VACATION', color: 'bg-teal-200' },
//     { nombre: 'PRE-FALL', color: 'bg-purple-200' },
//     { nombre: 'FALL WINTER', color: 'bg-red-100' },
// ];

// export default function ColeccionesPage() {
//     const router = useRouter();

//     const handleClick = (nombre: string) => {
//         router.push(`/colecciones/${encodeURIComponent(nombre.toLowerCase().replace(/ /g, '-'))}`);
//     };

//     return (
//         <div className="flex">
//             {/* Sidebar */}
//             <aside className="w-16 border-r border-gray-300 flex flex-col items-center pt-4">
//                 <div className="w-6 h-6 mb-4 bg-white border rounded" />
//                 <div className="w-6 h-6 mb-4 bg-white border rounded" />
//                 <div className="w-6 h-6 mb-4 bg-white border rounded" />
//                 <div className="w-6 h-6 mb-4 bg-white border rounded" />
//             </aside>

//             {/* Contenido principal */}
//             <main className="flex-1 flex flex-wrap justify-center items-center gap-6 p-6">
//                 {colecciones.map((c) => (
//                     <button
//                         key={c.nombre}
//                         onClick={() => handleClick(c.nombre)}
//                         className={`${c.color} w-56 h-32 text-xl font-semibold rounded-3xl shadow border`}
//                     >
//                         {c.nombre}
//                     </button>
//                 ))}
//             </main>
//         </div>
//     );
// }
