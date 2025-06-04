'use client';

import { useRouter } from 'next/navigation';

const colecciones = [
    { nombre: 'WINTER SUN', color: 'bg-yellow-200' },
    { nombre: 'RESORT', color: 'bg-blue-200' },
    { nombre: 'SPRING SUMMER', color: 'bg-green-200' },
    { nombre: 'SUMMER VACATION', color: 'bg-teal-200' },
    { nombre: 'PRE-FALL', color: 'bg-purple-200' },
    { nombre: 'FALL WINTER', color: 'bg-red-100' },
];

export default function ColeccionesPage() {
    const router = useRouter();

    const handleClick = (nombre: string) => {
        router.push(`/colecciones/${encodeURIComponent(nombre.toLowerCase().replace(/ /g, '-'))}`);
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-16 border-r border-gray-300 flex flex-col items-center pt-4">
                <div className="w-6 h-6 mb-4 bg-white border rounded" />
                <div className="w-6 h-6 mb-4 bg-white border rounded" />
                <div className="w-6 h-6 mb-4 bg-white border rounded" />
                <div className="w-6 h-6 mb-4 bg-white border rounded" />
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 flex flex-wrap justify-center items-center gap-6 p-6">
                {colecciones.map((c) => (
                    <button
                        key={c.nombre}
                        onClick={() => handleClick(c.nombre)}
                        className={`${c.color} w-56 h-32 text-xl font-semibold rounded-3xl shadow border`}
                    >
                        {c.nombre}
                    </button>
                ))}
            </main>
        </div>
    );
}
