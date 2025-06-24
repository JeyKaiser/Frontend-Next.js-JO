// app/ui-playground/page.tsx
"use client";

import React from "react";

export default function UIPlayground() {
  return (
    <main className="min-h-screen bg-[color:var(--background-color)] text-[color:var(--text-color)] p-10">
      <section className="text-center mb-20">
        <h1 className="text-4xl font-bold mb-4">🎨 UI Playground</h1>
        <p className="text-lg opacity-80 max-w-xl mx-auto">
          Explora la integración de estilos globales de Django y Tailwind en este entorno de pruebas visual.
        </p>
      </section>

      {/* Botones */}
      <section className="mb-20 text-center space-x-4">
        <button className="px-4 py-2 bg-[color:var(--primary-color)] text-white rounded hover:bg-[color:var(--hover-color)] transition">
          Botón Primario
        </button>
        <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
          Botón Secundario
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
          Botón Peligro
        </button>
      </section>

      {/* Tarjeta estilo Django */}
      <section className="max-w-sm mx-auto bg-white shadow-md rounded-[var(--border-radius)] p-6 mb-20 card" style={{ ['--bg' as any]: "#feea4d" }}>
        <img
          src="https://via.placeholder.com/400x250"
          alt="Ejemplo"
          className="rounded-t-[var(--border-radius)]"
        />
        <span>WINTER SUN</span>0
      </section>

      {/* Grilla tipo colección */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {["#feea4d", "#70a7ff", "#81c963", "#ff935f", "#c6b9b1", "#b03c5c"].map((color, idx) => (
          <div
            key={idx}
            className="card"
            style={{ ['--bg' as any]: color }}
          >
            <img src={`https://via.placeholder.com/300x200?text=Card+${idx + 1}`} alt={`Card ${idx + 1}`} />
            <span>COLECCIÓN {idx + 1}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
