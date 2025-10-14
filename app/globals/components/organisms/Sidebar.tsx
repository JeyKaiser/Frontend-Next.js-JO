'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Layers,
  Package,
  Tag,
  Settings,
  Users,
  BarChart3,
  FileText,
  Eye,
  ChevronRight,
  Wrench,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    href: '/modules/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/modules/colecciones',
    label: 'Colecciones',
    icon: Layers,
    badge: 'Nuevo',
  },
  {
    href: '/modules/consumos',
    label: 'Consumos',
    icon: Package,
  },
  {
    href: '/modules/parametros',
    label: 'Parámetros',
    icon: Wrench,
  }, 
  {
    href: '/modules/referentes',
    label: 'Referentes',
    icon: Tag,
  },
  {
    href: '/modules/users',
    label: 'Usuarios',
    icon: Users,
  },
  {
    href: '/modules/dashboard',
    label: 'Reportes',
    icon: BarChart3,
    children: [
      { href: '/modules/reportes/ventas', label: 'Ventas', icon: FileText },
      { href: '/modules/reportes/produccion', label: 'Producción', icon: FileText },
      { href: '/modules/reportes/inventario', label: 'Inventario', icon: FileText },
    ],
  },
  {
    href: '#', // Cambiado a '#' porque es un menú padre, no un enlace directo
    label: 'Configuración',
    icon: Settings,
    children: [
        {
            href: '/modules/configuracion/crear-referente',
            label: 'Crear Referente',
            icon: FileText,
        },
    ]
  },
];


export default function Sidebar() {
  const pathname = usePathname();
  // 1. Mover el estado DENTRO del componente
  // 2. Usar el label del item como identificador único para el submenú abierto
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const isActiveRoute = (href: string) => {
    if (href === '/modules/dashboard') return pathname === href;
    return pathname.startsWith(href) && href !== '#';
  };

  return (
    <aside className="fixed top-16 bottom-0 w-64 bg-white border-r border-secondary-200 shadow-sm z-40 flex flex-col">
      {/* Header section with preview toggle */}
      <div className="p-4 border-b border-secondary-100">
        <div className="flex items-center gap-2 p-3 bg-secondary-50 rounded-lg">
          <Eye className="w-4 h-4 text-secondary-600" />
          <span className="text-sm font-medium text-secondary-700">Vista Previa</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <div key={item.href}>
              {item.children ? (
                // --- LÓGICA PARA MENÚ DESPLEGABLE ---
                <div>
                  <button
                    onClick={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                    className="flex items-center justify-between w-full p-3 text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSubmenu === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {/* Renderiza el submenú si está abierto */}
                  {openSubmenu === item.label && (
                    <ul className="mt-1 ml-4 pl-5 border-l border-secondary-200 space-y-1">
                      {item.children.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={`block p-2 text-sm rounded-md ${
                              isActiveRoute(subItem.href) ? 'font-semibold text-primary-600' : 'text-secondary-600 hover:bg-secondary-100'
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Regular menu item
                <Link
                  href={item.href}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                    isActiveRoute(item.href)
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon 
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActiveRoute(item.href) ? 'text-primary-600' : 'text-secondary-500 group-hover:text-secondary-700'
                      }`} 
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Quick stats section */}
      <div className="p-4 border-t border-secondary-100">
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-secondary-600">Referencias Activas</span>
              <span className="text-sm font-bold text-primary-700">247</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-1.5">
              <div className="bg-primary-500 h-1.5 rounded-full w-3/4"></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-success-50 to-warning-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-secondary-600">En Producción</span>
              <span className="text-sm font-bold text-success-700">89</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-1.5">
              <div className="bg-success-500 h-1.5 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}