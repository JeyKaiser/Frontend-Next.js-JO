import Link from 'next/link';
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
    <aside
      className="fixed top-16 bottom-0 md:flex w-48 text-white p-4 flex-col justify-between z-10"
      style={{ backgroundColor: 'var(--primary-color)' }}
    >
      <div>
        {/* Vista previa */}
        <div className="mb-6 p-3 bg-gray-700 rounded shadow flex items-center gap-2">
          <Eye size={18} />
          <p className="font-semibold">Vista Previa</p>
        </div>

        {/* Menú lateral */}
        <ul className="space-y-3 text-sm font-medium">
          <li>
            <Link href="/dashboard" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <LayoutDashboard size={18} /> Inicio
            </Link>
          </li>
          <li>
            <Link href="/colecciones" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <Layers size={18} /> Colecciones
            </Link>
          </li>
          <li>
            <Link href="/productos" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <Package size={18} /> Consumos
            </Link>
          </li>
          <li>
            <Link href="/categorias" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <Tag size={18} /> Categorías
            </Link>
          </li>
          <li>
            <Link href="/configuracion" className="flex items-center gap-2 hover:text-yellow-400 transition">
              <Settings size={18} /> Configuración
            </Link>
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
