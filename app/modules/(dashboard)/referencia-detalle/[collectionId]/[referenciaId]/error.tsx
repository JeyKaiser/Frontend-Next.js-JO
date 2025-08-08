// app/(dashboard)/referencia-detalle/[referenciaId]/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-96 bg-red-50 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-red-700 mb-4">¡Algo salió mal al cargar la referencia!</h2>
      <p className="text-gray-600 mb-6">
        Lo sentimos, no pudimos cargar los detalles de esta referencia.
      </p>
      <button
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => reset()}
      >
        Intentar de nuevo
      </button>
      <p className="mt-4 text-sm text-gray-500">
        Mensaje de error: {error.message}
      </p>
    </div>
  );
}