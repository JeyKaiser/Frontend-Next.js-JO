'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/app/globals/components/molecules/SearchBar';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notificationCount] = useState(3);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-secondary-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo and brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JO</span>
            </div>
            <h1 className="text-xl font-bold text-secondary-900">Plataforma de Diseño</h1>
          </div>
          
          {/* Main navigation */}
          <nav className="hidden md:flex">
            <ul className="flex items-center gap-1">
              <li>
                <Link href="/modules/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/modules/colecciones" className="nav-link">
                  Gestión
                </Link>
              </li>
              <li>
                <Link href="#" className="nav-link">
                  Reportes
                </Link>
              </li>
              {/* <li>
                <Link href="/modules/configuracion" className="nav-link">
                  Configuración
                </Link>
              </li> */}
            </ul>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden sm:block">
            <SearchBar />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors duration-200">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 text-secondary-700 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white border border-secondary-200 rounded-xl shadow-lg py-2 animate-in">
                <div className="px-4 py-3 border-b border-secondary-100">
                  <p className="font-medium text-secondary-900">Usuario Administrador</p>
                  <p className="text-sm text-secondary-500">admin@empresa.com</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/modules/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors duration-200"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </Link>
                  <Link
                    href="/modules/configuracion"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors duration-200"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
                  </Link>
                  <hr className="my-2 border-secondary-100" />
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors duration-200 w-full text-left">
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile search - appears below navbar on small screens */}
      <div className="sm:hidden px-4 py-3 border-t border-secondary-100 bg-secondary-50">
        <SearchBar />
      </div>
    </nav>
  );
}

