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





// // app/page.tsx
// import Image from 'next/image';
// import Link from 'next/link';
// import styles from '@/styles/CollectionsPage.module.css';
// // import cardStyles from '../styles/Cards.module.css';
// import type { Collection, FormattedCollection } from '../../types/'; // Importa tus interfaces

// async function getCollections(): Promise<FormattedCollection[]> { // Tipado de la función
//   try {
//     const res = await fetch('http://localhost:8000/api/colecciones/', {
//       cache: 'no-store'
//     });

//     if (!res.ok) {
//       console.error("Failed to fetch collections:", res.status, res.statusText);
//       return [];
//     }

//     const collections: Collection[] = await res.json(); // Tipado de la respuesta de la API

//     const formattedCollections: FormattedCollection[] = collections.map(col => ({ // Tipado del mapeo
//       id: col.id,
//       name: col.nombre,
//       slug: col.slug || col.nombre.toLowerCase().replace(/\s/g, '_'),
//       imageUrl: `http://localhost:8000${col.imagen_url}`,
//       color: col.color_fondo || '#ffffff',
//     }));

//     return formattedCollections;
//   } catch (error) {
//     console.error("Error fetching collections:", error);
//     return [];
//   }
// }

// export default async function HomePage() { // Componente de servidor (no 'use client')
//   const collections = await getCollections(); // `collections` ya estará tipado por `getCollections`

//   return (
//     <>
//       <header className={styles.coleccionesHeader}>
//         <h2>COLECCIONES</h2>
//       </header>

//       <div className={styles.coleccionGrid}>
//         {collections.map((collection: FormattedCollection) => ( // Tipado en el mapeo
//           <Link key={collection.id} href={`/colecciones/${collection.slug}`}>
//             <div className={cardStyles.card} style={{ '--bg': collection.color }}>
//               <Image
//                 src={collection.imageUrl}
//                 alt={collection.name}
//                 width={300}
//                 height={225}
//                 className={cardStyles.cardImage}
//                 priority
//               />
//               <span className={cardStyles.cardSpan}>{collection.name}</span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </>
//   );
// }