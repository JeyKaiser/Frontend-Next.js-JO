// app/(dashboard)/dashboard/page.tsx
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
      
      <div className="grid grid-cols-[repeat(auto-fit,_250px)] justify-center gap-6 px-4 py-8 items-start">        
        <Card
          title="Winter Sun"
          imageSrc="/img/winter-sun.jpg"
          bgColor="#feea4d"
          href="/colecciones/winter-sun"
        />
        <Card
          title="Resort RTW"
          imageSrc="/img/resort-rtw.jpg"
          bgColor="#70a7ff"
          href="/colecciones/resort-rtw"
        />
        <Card
          title="Spring Summer"
          imageSrc="/img/spring-summer.jpg"
          bgColor="#81c963"
          href="/colecciones/spring-summer"
        />
        <Card
          title="Summer Vacation"
          imageSrc="/img/summer-vacation.jpg"
          bgColor="#ff935f"
          href="/colecciones/summer-vacation"
        />
        <Card
          title="Pre - Fall"
          imageSrc="/img/pre-fall.jpg"
          bgColor="#c6b9b1"
          href="/colecciones/pre-fall"
        />
        <Card
          title="Fall Winter"
          imageSrc="/img/fall-winter.jpg"
          bgColor="#b03c5c"
          href="/colecciones/fall-winter"
        />
        <Card
          title="Prueba API Django"
          imageSrc="/img/fall-winter.jpg"
          bgColor="#A0D9EF"
          href="/test/mi-prueba-id"
        />
      </div>
    </div>
  );
}