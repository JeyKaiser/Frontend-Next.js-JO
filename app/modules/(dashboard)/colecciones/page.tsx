// app/(dashboard)/colecciones/page.tsx
'use client';

import Card from '@/app/globals/components/molecules/Card'; // Asegúrate de que la ruta sea correcta

export default function ColeccionesPage() {
  const colecciones = [
    {
      id: 'winter-sun',           // Usamos el slug como ID para la URL
      label: 'Winter Sun',
      img: '/img/winter-sun.jpg', 
      bg: '#feea4d',
    },
    {
      id: 'resort-rtw',
      label: 'Resort RTW',
      img: '/img/resort-rtw.jpg',
      bg: '#70a7ff',
    },
    {
      id: 'spring-summer',
      label: 'Spring Summer',
      img: '/img/spring-summer.jpg',
      bg: '#81c963',
    },
    {
      id: 'summer-vacation',
      label: 'Summer Vacation',
      img: '/img/summer-vacation.jpg',
      bg: '#ff935f', 
    },
    {
      id: 'pre-fall',
      label: 'Pre - Fall',
      img: '/img/pre-fall.jpg',
      bg: '#c6b9b1',
    },
    {
      id: 'fall-winter',
      label: 'Fall Winter',
      img: '/img/fall-winter.jpg',
      bg: '#b03c5c',
    },
    // {
    //   id: 'prueba-api-django', // Un ID descriptivo para la URL
    //   label: 'Prueba API Django',
    //   img: '/img/fall-winter.jpg', // Usa una imagen existente o crea una para esto
    //   bg: '#A0D9EF',
    // },
  ];

  return (
    <div>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          COLECCIONES
        </h2>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,_250px)] justify-center gap-10 px-4 py-8 items-start">
        {colecciones.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">No hay colecciones disponibles.</p>
        ) : (
          colecciones.map((anios) => (
            <Card
              key={anios.id}
              title={anios.label}
              imageSrc={anios.img}
              bgColor={anios.bg}
              // El href ahora apunta a la página de años de la colección, usando el ID/slug
              href={`/modules/colecciones/${anios.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

