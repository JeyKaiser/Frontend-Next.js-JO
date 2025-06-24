// app/login/page.tsx
'use client'; // Este es un Client Component


import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importa el hook useAuth
import { useRouter } from 'next/navigation';
import styles from './login.module.css'; // Importa el módulo CSS

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { loginUser, isAuthenticated, loading } = useAuth(); // Obtén loginUser del contexto
    const router = useRouter();

    // // Redirigir si ya está autenticado y no está cargando
    // if (isAuthenticated && !loading) {
    //     router.push('/dashboard');
    //     return null; // No renderizar el formulario si ya está autenticado
    // }

    useEffect(() => {
        if (!loading && isAuthenticated) {
            // Redirige como respaldo
            router.replace('/dashboard');
        }
    }, [loading, isAuthenticated, router]);


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
        <div className={styles.loginContainer}>
            <h1 className={styles.title}>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.label}>Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitButton}
                >
                    {loading ? 'Iniciando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}

