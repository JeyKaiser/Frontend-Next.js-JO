// components/atoms/Modal.tsx
import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean; // Controla si el modal está visible
    onClose: () => void; // Función para cerrar el modal
    title: string; // Título del modal (ej. "Error", "Información")
    children: ReactNode; // Contenido del modal (el mensaje)
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null; // No renderizar si no está abierto

    return (
        // Overlay oscuro de fondo
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            {/* Contenedor del modal */}
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative transform transition-all duration-300 scale-100 opacity-100">
                {/* Botón de cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Cerrar"
                >
                    &times;
                </button>

                {/* Encabezado del modal */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                    {title}
                </h2>

                {/* Contenido del modal */}
                <div className="text-gray-700 text-lg mb-6">
                    {children}
                </div>

                {/* Pie de página del modal (opcional, aquí un botón de OK) */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
