'use client'; // Este componente necesita ser un Client Component para usar useState y useRouter

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import Input from '@/app/globals/components/atoms/Input';
import Button from '@/app/globals/components/atoms/Button';
import Modal from '@/app/globals/components/atoms/Modal'; 
import type { PTSearchResult } from '@/app/modules/types'; 

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Nuevo estado para el modal
  const router = useRouter();

  const handleSearch = async () => {
    setSearchError(null); // Limpiar errores anteriores
    setIsModalOpen(false); // Asegurarse de que el modal esté cerrado al iniciar una nueva búsqueda

    if (!searchTerm.trim()) {
      setSearchError("Por favor, ingresa un código PT para buscar.");
      setIsModalOpen(true); // Abrir modal con el mensaje
      return;
    }

    const DJANGO_API_BASE_URL = 'http://localhost:8000';
    const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
    const apiUrl = `${DJANGO_API_BASE_URL}/api/search-pt/?ptCode=${encodedSearchTerm}`;

    console.log(`[Next.js Client - SearchBar] Solicitando API de búsqueda: ${apiUrl}`);

    try {
      const res = await fetch(apiUrl, { cache: 'no-store' });

      if (!res.ok) {
        let errorMessage = `Error en la búsqueda. Estado: ${res.status}.`;
        if (res.status === 404) {
          errorMessage = `Código '${searchTerm}' no encontrado o no existe.`;
        } else {
          let errorBody = 'No body';
          try { errorBody = await res.text(); } catch (e) {}
          errorMessage = `Error al realizar la búsqueda: ${errorMessage} Cuerpo: ${errorBody}`;
        }
        setSearchError(errorMessage);
        setIsModalOpen(true); // Abrir modal con el mensaje de error
        return;
      }

      const data: PTSearchResult | null = await res.json();
      console.log(`[Next.js Client - SearchBar] Resultado de búsqueda:`, data);

      if (data && data.U_GSP_REFERENCE && data.U_GSP_COLLECTION) {
        const targetUrl = `/telas/${data.U_GSP_REFERENCE}?collectionId=${data.U_GSP_COLLECTION}`;
        router.push(targetUrl);
      } else {
        setSearchError(`Código '${searchTerm}' no encontrado o no existe.`);
        setIsModalOpen(true); // Abrir modal si no se encontró resultado
      }
    } catch (err) {
      console.error("[Next.js Client - SearchBar] Error de red o al parsear JSON:", err);
      setSearchError(`Error de conexión o al procesar la respuesta: ${(err as Error).message}`);
      setIsModalOpen(true); // Abrir modal para errores de red/JSON
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchError(null); // Limpiar el error cuando se cierra el modal
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <Input
        placeholder="Buscar código PT..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full sm:w-auto"
      />
      <Button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Buscar
      </Button>

      {/* Renderiza el Modal condicionalmente */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Búsqueda de Código PT"
      >
        <p>{searchError}</p>
      </Modal>
    </div>
  );
}
