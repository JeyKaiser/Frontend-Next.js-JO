'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/app/globals/components/organisms/Navbar';
import Sidebar from '@/app/globals/components/organisms/Sidebar';
import { SAPDataProvider } from '@/app/contexts/SAPDataContext';

const AUTH_PATHS = [
  '/modules/login',
  '/modules/signin',
  '/modules/forgot-password',
];

export default function ModulesShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_PATHS.some((authPath) => pathname.startsWith(authPath));

  return (
    <SAPDataProvider>
      {isAuthRoute ? (
        <div className="min-h-screen bg-gray-100">{children}</div>
      ) : (
        <div className="min-h-screen bg-secondary-50">
          <Navbar />
          <Sidebar />
          <main className="pl-64 pt-16">{children}</main>
        </div>
      )}
    </SAPDataProvider>
  );
}
