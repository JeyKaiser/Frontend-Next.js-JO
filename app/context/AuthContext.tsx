// app/context/AuthContext.tsx
'use client'; // Esto es importante para indicar que este componente es un Client Component

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';
import { login, refreshToken, decodeToken, verifyToken } from '../services/auth'; // Asegúrate de la ruta correcta
import { useRouter } from 'next/navigation'; // Para redirección con App Router

interface AuthContextType {
    accessToken: string | null;
    user: { id: number } | null;
    isAuthenticated: boolean;
    loginUser: (username: string, password: string) => Promise<void>;
    logoutUser: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const updateTokens = useCallback((newAccessToken: string | null, newRefreshToken: string | null) => {
        setAccessToken(newAccessToken);
        if (newAccessToken) {
            const decoded = decodeToken(newAccessToken);
            setUser({ id: decoded.user_id });
            localStorage.setItem('access_token', newAccessToken);
        } else {
            setUser(null);
            localStorage.removeItem('access_token');
        }

        if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
        } else {
            localStorage.removeItem('refresh_token');
        }
    }, []);

    const loginUser = useCallback(async (username: string, password: string) => {
        try {
            setLoading(true);
            const { access, refresh } = await login(username, password);
            updateTokens(access, refresh);
            router.push('/dashboard'); // Redirige al dashboard después del login exitoso
        } catch (error) {
            console.error('Login failed:', error);
            // Aquí puedes manejar y mostrar mensajes de error al usuario
            throw error; // Propagar el error para que el componente de login lo maneje
        } finally {
            setLoading(false);
        }
    }, [router, updateTokens]);

    const logoutUser = useCallback(() => {
        updateTokens(null, null);
        router.push('/login'); // Redirige a la página de login después del logout
    }, [router, updateTokens]);

    const checkAuthStatus = useCallback(async () => {
        const storedAccessToken = localStorage.getItem('access_token');
        const storedRefreshToken = localStorage.getItem('refresh_token');

        if (!storedAccessToken && !storedRefreshToken) {
            setLoading(false);
            return;
        }

        try {
            // 1. Intentar verificar el token de acceso actual
            if (storedAccessToken && (await verifyToken(storedAccessToken))) {
                updateTokens(storedAccessToken, storedRefreshToken);
            } else if (storedRefreshToken) {
                // 2. Si el token de acceso no es válido, intentar refrescarlo
                const newAccessToken = await refreshToken(storedRefreshToken);
                updateTokens(newAccessToken, storedRefreshToken);
            } else {
                // No hay tokens válidos
                logoutUser();
            }
        } catch (error) {
            console.error('Error during token validation/refresh:', error);
            // Si el refresh token también falla o hay un error, limpiar y desautenticar
            logoutUser();
        } finally {
            setLoading(false);
        }
    }, [logoutUser, updateTokens]);

    useEffect(() => {
        checkAuthStatus();
        // Configurar un intervalo para refrescar el token de acceso periódicamente
        // Esto es un ejemplo, ajusta la frecuencia según la vida útil de tu token de acceso
        const refreshInterval = setInterval(() => {
            const storedRefreshToken = localStorage.getItem('refresh_token');
            if (storedRefreshToken && accessToken) {
                // Solo intenta refrescar si el token de acceso actual está cerca de expirar
                const decoded = decodeToken(accessToken);
                const currentTime = Date.now() / 1000; // en segundos
                // Refrescar 1 minuto antes de que expire (ajústalo)
                if (decoded.exp - currentTime < 60) {
                    refreshToken(storedRefreshToken)
                        .then((newAccess) => updateTokens(newAccess, storedRefreshToken))
                        .catch((err) => {
                            console.error('Failed to auto-refresh token:', err);
                            logoutUser(); // Si el refresh falla, desautenticar
                        });
                }
            }
        }, 30000); // Cada 30 segundos (ajústalo según la vida de tu token de acceso)

        return () => clearInterval(refreshInterval); // Limpiar el intervalo al desmontar
    }, [checkAuthStatus, accessToken, logoutUser, updateTokens]);

    const value = {
        accessToken,
        user,
        isAuthenticated: !!accessToken,
        loginUser,
        logoutUser,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};