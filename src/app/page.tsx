'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    axios.get<Producto[]>('http://127.0.0.1:8000/api/productos/')
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error: unknown) => {
        console.error('Error al obtener productos:', error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de Productos</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}
