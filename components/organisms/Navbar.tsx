import SearchBar from '@/components/molecules/SearchBar';

export default function Navbar() {
  return (
    // Cambiamos 'sticky' a 'fixed'.
    // Añadimos 'left-0 right-0' para que ocupe todo el ancho.
    // Aumentamos el z-index a z-20 para que esté por encima del sidebar (z-10).
    // Añadimos 'h-16' para darle una altura fija de 64px, lo que usaremos para el padding en el layout.
    <nav className="fixed top-0 left-0 right-0 z-20 h-16 bg-white shadow px-6 py-4 flex items-center justify-between">
      <div>
        <ul className="flex gap-6">
          <li>
            <a href="#" className="text-gray-800 font-semibold hover:text-blue-600 transition">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-800 font-semibold hover:text-blue-600 transition">
              Gestión
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-800 font-semibold hover:text-blue-600 transition">
              Reportes
            </a>
          </li>
        </ul>
      </div>
      <form className="flex items-center gap-2">
        <SearchBar />
      </form>
    </nav>
  );
}

