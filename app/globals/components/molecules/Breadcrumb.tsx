'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1 text-sm ${className}`}>
      <Link 
        href="/modules/dashboard" 
        className="flex items-center text-secondary-500 hover:text-secondary-700 transition-colors duration-200"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Dashboard</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4 text-secondary-400" />
          {item.current ? (
            <span className="font-medium text-secondary-900">{item.label}</span>
          ) : item.href ? (
            <Link 
              href={item.href} 
              className="text-secondary-500 hover:text-secondary-700 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-secondary-500">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}