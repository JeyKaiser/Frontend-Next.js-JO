'use client';
import * as React from "react";
import Link from 'next/link';


interface Modelo {
  id: number;
  nombre: string;
  // Agrega más propiedades según sea necesario
}

export default function Home() {
  const modelos : Modelo[] = []; // Aquí podrías traer datos dinámicos más adelante

  return (
    <>
      <header className="colecciones-header">
        <h2>COLECCIONES</h2>
      </header>

      <div className="coleccion-grid">
        <Link href="/colecciones/winterSun">
          <div className="card" style={{ '--bg': '#feea4d' } as React.CSSProperties}>
            <img src="/img/winter-sun.jpg" alt="Winter Sun" />
            <span>WINTER SUN</span>
          </div>
        </Link>

        <Link href="/colecciones/resortRtw">
          <div className="card" style={{ '--bg': '#70a7ff' } as React.CSSProperties}>
            <img src="/img/resort-rtw.jpg" alt="Resort RTW" />
            <span>RESORT RTW</span>
          </div>
        </Link>

        <Link href="/colecciones/springSummer">
          <div className="card" style={{ '--bg': '#81c963' } as React.CSSProperties}>
            <img src="/img/spring-summer.jpg" alt="Spring Summer" />
            <span>SPRING SUMMER</span>
          </div>
        </Link>

        <Link href="/colecciones/summerVacation">
          <div className="card" style={{ '--bg': '#ff935f' } as React.CSSProperties}>
            <img src="/img/summer-vacation.jpg" alt="Summer Vacation" />
            <span>SUMMER VACATION</span>
          </div>
        </Link>

        <Link href="/colecciones/preFall">
          <div className="card" style={{ '--bg': '#c6b9b1' } as React.CSSProperties}>
            <img src="/img/pre-fall.jpg" alt="Pre Fall" />
            <span>PRE - FALL</span>
          </div>
        </Link>

        <Link href="/colecciones/fallWinter">
          <div className="card" style={{ '--bg': '#b03c5c' } as React.CSSProperties}>
            <img src="/img/fall-winter.jpg" alt="Fall Winter" />
            <span>FALL WINTER</span>
          </div>
        </Link>

        <Link href="/colecciones/capsules">
          <div className="card" style={{ '--bg': '#939a24' } as React.CSSProperties}>
            <img src="/img/capsule.jpg" alt="Capsule" />
            <span>CAPSULES</span>
          </div>
        </Link>

        {/* Bucle de modelos (dinámico, simulado aquí) */}
        {modelos.map((modelo, index) => (
          <a href="#" key={index}>
            <div className="card" style={{ '--bg': '#939a24' } as React.CSSProperties}>
              <img src={modelo.U_GSP_Picture} alt="Modelo" />
              <span>{modelo.U_GSP_REFERENCE}</span>
              <span>{modelo.U_GSP_Desc}</span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
