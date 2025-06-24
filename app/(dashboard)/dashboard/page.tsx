'use client';

import Card from '@/components/molecules/Card';

export default function DashboardPage() {
  return (
    <div>
      <header className="text-center mb-10 relative">
        <h2 className="text-3xl font-semibold uppercase tracking-wider text-gray-800">
          COLECCIONES
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-gray-700 via-yellow-400 to-gray-700 mx-auto mt-2 rounded-full" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        <Card
          title="Winter Sun"
          imageSrc="/img/winter-sun.jpg"
          bgColor="#feea4d"
          href="/colecciones/winter_sun"
        />
        <Card
          title="Resort RTW"
          imageSrc="/img/resort-rtw.jpg"
          bgColor="#70a7ff"
          href="/colecciones/resort_rtw"
        />
        <Card
          title="Spring Summer"
          imageSrc="/img/spring-summer.jpg"
          bgColor="#81c963"
          href="/colecciones/spring_summer"
        />
        <Card
          title="Summer Vacation"
          imageSrc="/img/summer-vacation.jpg"
          bgColor="#ff935f"
          href="/colecciones/summer_vacation"
        />
        <Card
          title="Pre - Fall"
          imageSrc="/img/pre-fall.jpg"
          bgColor="#c6b9b1"
          href="/colecciones/pre_fall"
        />
        <Card
          title="Fall Winter"
          imageSrc="/img/fall-winter.jpg"
          bgColor="#b03c5c"
          href="/colecciones/fall_winter"
        />
      </div>
    </div>
  );
}



// export default function DashboardPage() {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Panel principal</h2>      
//       <p className="mt-4">Aquí irá el contenido dinámico del dashboard.</p>
//     </div>
//   );
// }

