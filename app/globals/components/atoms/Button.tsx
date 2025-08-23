// components/atoms/Button.tsx
import React, { ReactNode, MouseEvent } from 'react'; // Importa MouseEvent

interface ButtonProps {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>; // Haz onClick opcional y permite Promise<void>
  className?: string; // Haz className opcional
  type?: 'button' | 'submit' | 'reset'; // Añade el tipo para el botón HTML
  disabled?: boolean; // Añade la propiedad disabled
}

export default function Button({ children, onClick, className, type = 'button', disabled = false }: ButtonProps) {
  return (
    <button
      type={type} // Asigna el tipo HTML
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-4 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${className || 'bg-blue-500 hover:bg-blue-600 text-white'}`} // Clase por defecto si no se proporciona
    >
      {children}
    </button>
  );
}




// export default function Button({ children }: { children: React.ReactNode }) {
//   return (
//     <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
//       {children}
//     </button>
//   );
// }