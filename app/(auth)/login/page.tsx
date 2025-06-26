// src/app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function LoginPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { loginUser, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    // Lógica para redirigir si ya está autenticado.
    // Usamos un useEffect para asegurar que esto solo se ejecute en el cliente
    // y después de que el AuthContext haya verificado el estado inicial.
    useEffect(() => {
        // Solo redirige si loading es false (la verificación inicial ha terminado)
        // Y el usuario está autenticado.
        if (!loading && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [loading, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await loginUser(username, password);
        } catch (err: any) {
            setError(err.message || 'Credenciales inválidas. Inténtalo de nuevo.');
            console.error('Login form error:', err);
        }
    };

    // Si `loading` es `true` (mientras se verifica el estado inicial)
    // O si `isAuthenticated` es `true` (y estamos en el login pero deberíamos estar en dashboard)
    // Mostramos un spinner para evitar parpadeos o el formulario de login innecesariamente.
    // Esto es especialmente relevante en el SSR, donde `loading` será true inicialmente.
    if (loading) { // Mostramos 'Cargando...' mientras el contexto verifica el estado
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-gray-700 text-lg">Cargando...</p>
            </div>
        );
    }

    // Si llegamos aquí, `loading` es `false`. Ahora verificamos `isAuthenticated`.
    // Si isAuthenticated es true, ya deberíamos haber sido redirigidos por el useEffect.
    // Esta condición es una doble verificación para asegurar que el formulario no se muestre
    // si el usuario ya está autenticado pero la redirección aún no se ha completado.
    if (isAuthenticated) {
        return null; // No renderizar nada, la redirección está en curso o ya se completó
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5 box-border">
            <Head>
                <title>Iniciar Sesión - JO Project</title>
            </Head>
            <form onSubmit={handleSubmit}
                  className="p-8 max-w-md w-full mx-auto mt-12 border border-gray-300 rounded-lg shadow-md bg-white">
                <h1 className="text-center text-gray-800 text-3xl font-semibold mb-6">Iniciar Sesión</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm text-center border border-red-300">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-800 font-bold mb-2">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-800 font-bold mb-2">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-5 bg-blue-600 text-white font-bold rounded-md cursor-pointer text-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? 'Iniciando...' : 'Entrar'}
                </button>

                <div className="mt-6 text-base text-center">
                    <a href="/signup" className="text-blue-600 font-bold hover:underline">No tengo cuenta. Registrarme</a>
                </div>
            </form>
        </div>
    );
}


// // src/app/login/page.tsx
// 'use client'; // Este es un Client Component

// import { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext'; // Importa el hook useAuth, asegura que la ruta sea correcta
// import { useRouter } from 'next/navigation';
// // No necesitamos importar styles/login.module.css aquí, ya que usaremos Tailwind directamente.
// import Head from 'next/head'; // Asegúrate de importar Head para el título de la página

// export default function LoginPage() {
//     const [username, setUsername] = useState<string>('');
//     const [password, setPassword] = useState<string>('');
//     const [error, setError] = useState<string | null>(null);
//     // Obtén loginUser, isAuthenticated y loading del contexto de autenticación
//     const { loginUser, isAuthenticated, loading } = useAuth();
//     const router = useRouter();

//     // Redirigir si ya está autenticado y no está cargando
//     useEffect(() => {
//         if (!loading && isAuthenticated) {
//             router.replace('/dashboard'); // Redirige al dashboard (o la ruta que sea tu página principal protegida)
//         }
//     }, [loading, isAuthenticated, router]); // Dependencias del useEffect

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null); // Limpiar errores previos
//         try {
//             await loginUser(username, password);
//             // La redirección a /dashboard ya se maneja dentro de loginUser en AuthContext
//         } catch (err: any) {
//             // Captura errores específicos o un mensaje genérico
//             setError(err.message || 'Credenciales inválidas. Inténtalo de nuevo.');
//             console.error('Login form error:', err);
//         }
//     };

//     // Si ya está autenticado y cargando, puedes mostrar un spinner o no renderizar nada
//     // Esto previene que el formulario se muestre brevemente antes de la redirección.
//     if (loading || isAuthenticated) {
//         return (
//             <div className="flex justify-center items-center min-h-screen bg-gray-100">
//                 <p className="text-gray-700 text-lg">Cargando...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5 box-border">
//             <Head>
//                 <title>Iniciar Sesión - JO Project</title>
//             </Head>
//             <form onSubmit={handleSubmit}
//                   className="p-8 max-w-md w-full mx-auto mt-12 border border-gray-300 rounded-lg shadow-md bg-white">
//                 <h1 className="text-center text-gray-800 text-3xl font-semibold mb-6">Iniciar Sesión</h1>

//                 {error && (
//                     <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm text-center border border-red-300">
//                         {error}
//                     </div>
//                 )}

//                 <div className="mb-4"> {/* formGroup */}
//                     <label htmlFor="username" className="block text-gray-800 font-bold mb-2">Usuario:</label>
//                     <input
//                         type="text"
//                         id="username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                         className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" // inputField
//                     />
//                 </div>

//                 <div className="mb-6"> {/* formGroup */}
//                     <label htmlFor="password" className="block text-gray-800 font-bold mb-2">Contraseña:</label>
//                     <input
//                         type="password"
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         className="w-full p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" // inputField
//                     />
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={loading} // Se deshabilita si loading es true
//                     className="w-full py-3 px-5 bg-blue-600 text-white font-bold rounded-md cursor-pointer text-lg transition-all duration-300 ease-in-out hover:bg-blue-700 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none" // submitButton
//                 >
//                     {loading ? 'Iniciando...' : 'Entrar'} {/* Texto condicional */}
//                 </button>

//                 <div className="mt-6 text-base text-center">
//                     <a href="/signup" className="text-blue-600 font-bold hover:underline">No tengo cuenta. Registrarme</a>
//                 </div>
//             </form>
//         </div>
//     );
// }

