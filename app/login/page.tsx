// app/login/page.tsx
'use client'; // Este es un Client Component

import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Importa el hook useAuth
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { loginUser, isAuthenticated, loading } = useAuth(); // Obtén loginUser del contexto
    const router = useRouter();

    // Redirigir si ya está autenticado y no está cargando
    if (isAuthenticated && !loading) {
        router.push('/dashboard');
        return null; // No renderizar el formulario si ya está autenticado
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Limpiar errores previos
        try {
            await loginUser(username, password);
            // La redirección se maneja dentro de loginUser en AuthContext
        } catch (err: any) {
            setError(err.message || 'Credenciales inválidas. Inténtalo de nuevo.');
            console.error('Login form error:', err);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {loading ? 'Iniciando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}



// // app/login/page.tsx
// 'use client'; // Sigue siendo un componente cliente

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Head from 'next/head';
// import styles from '../../../styles/login.module.css';
// import type { AuthTokenResponse, ApiErrorResponse } from '../../../.next/types/index'; // Importa tus interfaces

// export default function LoginPage() {
//     const [username, setUsername] = useState<string>(''); // Tipado de estado
//     const [password, setPassword] = useState<string>(''); // Tipado de estado
//     const [error, setError] = useState<string>(''); // Tipado de estado
//     const router = useRouter();

//     const handleSubmit = async (e: React.FormEvent) => { // Tipado de evento
//         e.preventDefault();
//         setError('');

//         try {
//             const response = await fetch('http://localhost:8000/api/token/', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password }),
//             });

//             if (!response.ok) {
//                 const errorData: ApiErrorResponse = await response.json(); // Tipado de la respuesta de error
//                 throw new Error(errorData.detail || 'Credenciales inválidas');
//             }

//             const data: AuthTokenResponse = await response.json(); // Tipado de la respuesta exitosa
//             localStorage.setItem('accessToken', data.access);
//             localStorage.setItem('refreshToken', data.refresh);

//             router.push('/');
//         } catch (err: any) { // Puedes refinar el tipado de 'err' si tienes un tipo de error más específico
//             console.error("Error en el login:", err);
//             setError(err.message);
//         }
//     };

//     return (
//         <div className={styles.mainContainer}>
//             <Head>
//                 <title>Iniciar Sesión - JO Project</title>
//             </Head>
//             <form className={styles.formContainer} onSubmit={handleSubmit}>
//                 <h2 className={styles.formTitle}>Iniciar Sesión</h2>
//                 {error && <div className={styles.errorMessage}>{error}</div>}
//                 <div className={styles.formGroup}>
//                     <label htmlFor="username">Usuario:</label>
//                     <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className={styles.formInput} />
//                 </div>
//                 <div className={styles.formGroup}>
//                     <label htmlFor="password">Contraseña:</label>
//                     <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.formInput} />
//                 </div>
//                 <button type="submit" className={styles.submitButton}>Ingresar</button>
//                 <div className={styles.registerLink}>
//                     <a href="/signup">No tengo cuenta. Registrarme</a>
//                 </div>
//             </form>
//         </div>
//     );
// }