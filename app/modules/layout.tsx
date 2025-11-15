'use client';

import { useAuth } from '@/app/modules/(auth)/context/AuthContext'; 
import Navbar from '@/app/globals/components/organisms/Navbar';
import Sidebar from '@/app/globals/components/organisms/sidebar';
import { SAPDataProvider } from '@/app/contexts/SAPDataContext';
import { use } from 'react';

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // O un componente de carga más elaborado
  }
  
   return (
    <SAPDataProvider>
      <div className="min-h-screen bg-secondary-50">
        {isAuthenticated ? (
          <>
            <Navbar />
            <Sidebar />
            <main className="pl-64 pt-16">
              {children}
            </main>
          </>
        ) : (
          <main className="min-h-screen">
            {children}
          </main>
        )}
      </div>
    </SAPDataProvider>
  );
}
