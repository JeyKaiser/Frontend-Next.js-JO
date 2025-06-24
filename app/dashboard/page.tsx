
// app/dashboard/page.tsx
'use client'; // Este es un Client Component

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function DashboardPage() {
    const { user, isAuthenticated, loading, logoutUser, accessToken } = useAuth();
    const router = useRouter();

    // Efecto para redirigir si no está autenticado después de cargar
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    // Ejemplo de cómo hacer una solicitud a una API protegida en Django
    const fetchProtectedData = async () => {
        if (!accessToken) {
            console.warn('No access token available.');
            return;
        }
        try {
            const response = await axios.get('http://localhost:8000/api/some-protected-data/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Incluye el token de acceso
                },
            });
            console.log('Protected data:', response.data);
            alert('¡Datos protegidos obtenidos con éxito! Revisa la consola.');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error('Error fetching protected data:', error.response.data);
                alert(`Error al obtener datos protegidos: ${error.response.data.detail || error.message}`);
                // Si el token expira o es inválido, podrías forzar un logout o refresco
                if (error.response.status === 401) {
                    console.log('Token expirado o inválido, intentando refrescar o forzando logout...');
                    // La lógica de refresco debería estar en el AuthContext.
                    // Si el refresco falla, el AuthContext debería llamar a logoutUser().
                }
            } else {
                console.error('Network or unknown error:', error);
                alert('Error de red o desconocido al obtener datos protegidos.');
            }
        }
    };


    if (loading) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Cargando autenticación...</p>;
    }

    if (!isAuthenticated) {
        return null; // O un spinner/mensaje de "redirigiendo..."
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h1>Dashboard</h1>
            <p>Bienvenido, {user ? `Usuario ID: ${user.id}` : 'invitado'}!</p>
            <p>¡Has iniciado sesión con éxito!</p>

            <button
                onClick={fetchProtectedData}
                style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
            >
                Obtener Datos Protegidos (Ejemplo)
            </button>

            <button
                onClick={logoutUser}
                style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Cerrar Sesión
            </button>
        </div>
    );
}