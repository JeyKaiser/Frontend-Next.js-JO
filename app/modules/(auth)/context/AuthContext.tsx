// app/context/AuthContext.tsx
'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // 1. Importar la librería js-cookie
import { login, refreshToken, decodeToken, verifyToken } from '../services/auth';

const ACCESS_COOKIE = 'auth_token';
const REFRESH_COOKIE = 'refresh_token';

const getCookieOptions = (days: number) => ({
    expires: days,
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    sameSite: 'lax' as const,
});

// ... (la interfaz AuthContextType no cambia)
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

    // 2. Modificamos updateTokens para usar Cookies en lugar de localStorage
    const updateTokens = useCallback((newAccessToken: string | null, newRefreshToken: string | null) => {
        console.log('[AuthContext - updateTokens] Llamado. Usando Cookies.');

        setAccessToken(newAccessToken);
        if (newAccessToken) {
            try {
                const decoded = decodeToken(newAccessToken);
                setUser({ id: decoded.user_id });
                Cookies.set(ACCESS_COOKIE, newAccessToken, getCookieOptions(7));
                console.log(`[AuthContext - updateTokens] Token de acceso guardado en cookie "${ACCESS_COOKIE}".`);
            } catch (error) {
                console.error('[AuthContext - updateTokens] Error al decodificar o guardar access token:', error);
                setUser(null);
                Cookies.remove(ACCESS_COOKIE);
            }
        } else {
            setUser(null);
            Cookies.remove(ACCESS_COOKIE);
            console.log(`[AuthContext - updateTokens] Cookie "${ACCESS_COOKIE}" removida.`);
        }

        if (newRefreshToken) {
            Cookies.set(REFRESH_COOKIE, newRefreshToken, getCookieOptions(30));
            console.log('[AuthContext - updateTokens] Refresh token guardado en cookie.');
        } else {
            Cookies.remove(REFRESH_COOKIE);
            console.log(`[AuthContext - updateTokens] Cookie "${REFRESH_COOKIE}" removida.`);
        }
    }, []);

    // La función loginUser no necesita cambios, ya que llama a updateTokens que ahora usa cookies.
    const loginUser = useCallback(async (username: string, password: string) => {
        console.log(`[AuthContext - loginUser] Intentando iniciar sesión para: ${username}`);
        try {
            setLoading(true);
            const { access, refresh } = await login(username, password);
            console.log('[AuthContext - loginUser] Login service exitoso. Access/Refresh recibidos.');
            updateTokens(access, refresh);
            // La redirección del middleware ahora es la principal, pero esta es un buen fallback.
            router.push('/modules/dashboard');
            console.log('[AuthContext - loginUser] Redirigiendo a modules/dashboard.');
        } catch (error) {
            console.error('[AuthContext - loginUser] Fallo en el login:', error);
            updateTokens(null, null); // Asegura que las cookies se limpien en caso de error
            throw error;
        } finally {
            setLoading(false);
            console.log('[AuthContext - loginUser] Finalizó el intento de login. Loading a false.');
        }
    }, [router, updateTokens]);

    // La función logoutUser tampoco necesita cambios directos.
    const logoutUser = useCallback(() => {
        console.log('[AuthContext - logoutUser] Llamado. Limpiando tokens de cookies.');
        updateTokens(null, null);
        router.push('/modules/login');
        console.log('[AuthContext - logoutUser] Redirigiendo a /modules/login.');
    }, [router, updateTokens]);

    // 3. Modificamos checkAuthStatus para leer desde Cookies
    const checkAuthStatus = useCallback(async () => {
        console.log('[AuthContext - checkAuthStatus] Iniciando verificación desde Cookies.');
        setLoading(true);

        const storedAccessToken = Cookies.get(ACCESS_COOKIE);
        const storedRefreshToken = Cookies.get(REFRESH_COOKIE);
        console.log(`[AuthContext - checkAuthStatus] Cookies - Access: ${storedAccessToken ? 'presente' : 'nulo'}, Refresh: ${storedRefreshToken ? 'presente' : 'nulo'}`);

        if (!storedAccessToken && !storedRefreshToken) {
            console.log('[AuthContext - checkAuthStatus] No hay tokens en cookies. Usuario no autenticado.');
            updateTokens(null, null); // Asegura que el estado esté limpio
            setLoading(false);
            return;
        }

        try {
            if (storedAccessToken && (await verifyToken(storedAccessToken))) {
                console.log('[AuthContext - checkAuthStatus] Access token válido. Autenticado.');
                updateTokens(storedAccessToken, storedRefreshToken || null);
            } else if (storedRefreshToken) {
                console.log('[AuthContext - checkAuthStatus] Access token inválido/ausente, intentando refrescar...');
                const newAccessToken = await refreshToken(storedRefreshToken);
                console.log('[AuthContext - checkAuthStatus] Refresh exitoso. Nuevo access token recibido.');
                updateTokens(newAccessToken, storedRefreshToken);
            } else {
                console.log('[AuthContext - checkAuthStatus] No hay tokens válidos, refresco imposible. Desautenticando.');
                logoutUser();
            }
        } catch (error) {
            console.error('[AuthContext - checkAuthStatus] Error durante validación/refresco de token:', error);
            logoutUser();
        } finally {
            setLoading(false);
            console.log('[AuthContext - checkAuthStatus] Verificación finalizada. Loading a false.');
        }
    }, [logoutUser, updateTokens]);
    
    // El useEffect para la verificación inicial y el intervalo de refresco no necesitan cambios.
    // Su lógica interna ya depende de `checkAuthStatus` y `updateTokens`, que hemos modificado.
    useEffect(() => {
        checkAuthStatus();

        const refreshInterval = setInterval(() => {
            const currentAccessToken = Cookies.get(ACCESS_COOKIE);
            const currentRefreshToken = Cookies.get(REFRESH_COOKIE);
            if (currentRefreshToken && currentAccessToken) {
                try {
                    const decoded = decodeToken(currentAccessToken);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp - currentTime < 60) {
                        refreshToken(currentRefreshToken)
                            .then((newAccess) => updateTokens(newAccess, currentRefreshToken))
                            .catch((err) => {
                                console.error('[AuthContext - Interval] Fallo al auto-refrescar token:', err);
                                logoutUser();
                            });
                    }
                } catch (error) {
                    console.error('[AuthContext - Interval] Token invalido en cookies:', error);
                    logoutUser();
                }
            }
        }, 30000);

        return () => {
            clearInterval(refreshInterval);
        };
    }, [checkAuthStatus, logoutUser, updateTokens]);

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

// El hook useAuth no cambia.
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
