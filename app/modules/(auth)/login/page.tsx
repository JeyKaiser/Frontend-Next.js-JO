'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function LoginPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { loginUser, isAuthenticated, loading } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/modules/dashboard');
            // router.replace('modules/dashboard');
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

    if (loading) { // Mostramos 'Cargando...' mientras el contexto verifica el estado
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <p className="text-gray-700 text-lg">Cargando...</p>
            </div>
        );
    }

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
