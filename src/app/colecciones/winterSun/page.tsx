'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DetalleColeccion() {
    const { nombre } = useParams();
    const [datos, setDatos] = useState<any[]>([]);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/colecciones/?nombre=${nombre}`)
            .then((res) => res.json())
            .then((data) => setDatos(data));
    }, [nombre]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Colección: {nombre}</h1>
            <ul className="space-y-2">
                {datos.length === 0 ? (
                    <li>No hay datos disponibles.</li>
                ) : (
                    datos.map((item, idx) => (
                        <li key={idx} className="bg-gray-100 p-3 rounded shadow">
                            {JSON.stringify(item)}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
