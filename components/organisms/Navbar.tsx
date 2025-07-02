import SearchBar from '@/components/molecules/SearchBar';

export default function Navbar() {
  return (
  
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

