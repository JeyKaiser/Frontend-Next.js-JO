// app/page.tsx
'use client'; // Este es un Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Redirigiendo...</h1>
      <p>Espera un momento mientras verificamos tu estado de autenticación.</p>      
    </div>
  );
}




