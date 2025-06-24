import {
  LayoutDashboard,
  Layers,
  Package,
  Tag,
  Settings,
  Bell,
  Eye,
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-48 bg-gray-800 text-white p-4 flex-col justify-between">
      <div>
        {/* Vista previa */}
        <div className="mb-6 p-3 bg-gray-700 rounded shadow flex items-center gap-2">
          <Eye size={18} />
          <p className="font-semibold">Vista Previa</p>
        </div>

        {/* Menú lateral */}
        <ul className="space-y-3 text-sm font-medium">
          <li>
            <a href="/dashboard" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <LayoutDashboard size={18} /> Inicio
            </a>
          </li>
          <li>
            <a href="/colecciones" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <Layers size={18} /> Colecciones
            </a>
          </li>
          <li>
            <a href="/productos" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <Package size={18} /> Productos
            </a>
          </li>
          <li>
            <a href="/categorias" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <Tag size={18} /> Categorías
            </a>
          </li>
          <li>
            <a href="/configuracion" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <Settings size={18} /> Configuración
            </a>
          </li>
        </ul>
      </div>

      {/* Notificaciones */}
      <div className="mt-6 p-3 bg-gray-700 rounded shadow flex items-center gap-2">
        <Bell size={18} />
        <p className="font-semibold">Notificaciones</p>
      </div>
    </aside>
  );
}





// export default function Sidebar() {
//   return (
//     <aside className="w-64 bg-gray-800 text-white p-4 hidden md:block">
//       <nav>
//         <ul className="space-y-2">
//           <li><a href="/dashboard" className="block hover:text-yellow-400">Dashboard</a></li>
//           <li><a href="/colecciones" className="block hover:text-yellow-400">Colecciones</a></li>
//         </ul>
//       </nav>
//     </aside>
//   );
// }