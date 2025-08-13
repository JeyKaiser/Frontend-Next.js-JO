// app/context/AuthContext.tsx
// 'use client';

// import {
//     createContext,
//     useContext,
//     useState,
//     useEffect,
//     ReactNode,
//     useCallback,
// } from 'react';
// import { login, refreshToken, decodeToken, verifyToken } from '../services/auth';
// import { useRouter } from 'next/navigation';

// interface AuthContextType {
//     accessToken: string | null;
//     user: { id: number } | null;
//     isAuthenticated: boolean;
//     loginUser: (username: string, password: string) => Promise<void>;
//     logoutUser: () => void;
//     loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [accessToken, setAccessToken] = useState<string | null>(null);
//     const [user, setUser] = useState<{ id: number } | null>(null);
//     const [loading, setLoading] = useState(true); // Siempre empieza como true al cargar
//     const router = useRouter();

//     const updateTokens = useCallback((newAccessToken: string | null, newRefreshToken: string | null) => {
//         console.log('[AuthContext - updateTokens] Llamado. Nuevo Access:', newAccessToken ? 'presente' : 'nulo', 'Nuevo Refresh:', newRefreshToken ? 'presente' : 'nulo');

//         setAccessToken(newAccessToken);
//         if (newAccessToken) {
//             try {
//                 const decoded = decodeToken(newAccessToken);
//                 setUser({ id: decoded.user_id });
//                 localStorage.setItem('access_token', newAccessToken); // CLAVE: access_token
//                 console.log('[AuthContext - updateTokens] Token de acceso decodificado y guardado en localStorage.');
//             } catch (error) {
//                 console.error('[AuthContext - updateTokens] Error al decodificar o guardar access token:', error);
//                 setUser(null);
//                 localStorage.removeItem('access_token');
//             }
//         } else {
//             setUser(null);
//             localStorage.removeItem('access_token');
//             console.log('[AuthContext - updateTokens] Access token removido de localStorage.');
//         }

//         if (newRefreshToken) {
//             localStorage.setItem('refresh_token', newRefreshToken); // CLAVE: refresh_token
//             console.log('[AuthContext - updateTokens] Refresh token guardado en localStorage.');
//         } else {
//             localStorage.removeItem('refresh_token');
//             console.log('[AuthContext - updateTokens] Refresh token removido de localStorage.');
//         }
//     }, []);

//     const loginUser = useCallback(async (username: string, password: string) => {
//         console.log(`[AuthContext - loginUser] Intentando iniciar sesión para: ${username}`);
//         try {
//             setLoading(true);
//             const { access, refresh } = await login(username, password);
//             console.log('[AuthContext - loginUser] Login service exitoso. Access/Refresh recibidos.');
//             updateTokens(access, refresh);
//             router.push('/dashboard'); // Redirige al dashboard después del login exitoso
//             console.log('[AuthContext - loginUser] Redirigiendo a /dashboard.');
//         } catch (error) {
//             console.error('[AuthContext - loginUser] Fallo en el login:', error);
//             setAccessToken(null); // Asegúrate de limpiar si el login falla
//             setUser(null);
//             localStorage.removeItem('access_token');
//             localStorage.removeItem('refresh_token');
//             throw error; // Propagar el error para que el componente de login lo maneje
//         } finally {
//             setLoading(false);
//             console.log('[AuthContext - loginUser] Finalizó el intento de login. Loading a false.');
//         }
//     }, [router, updateTokens]);

//     const logoutUser = useCallback(() => {
//         console.log('[AuthContext - logoutUser] Llamado. Limpiando tokens.');
//         updateTokens(null, null);
//         router.push('/login'); // Redirige a la página de login después del logout
//         console.log('[AuthContext - logoutUser] Redirigiendo a /login.');
//     }, [router, updateTokens]);

//     const checkAuthStatus = useCallback(async () => {
//         console.log('[AuthContext - checkAuthStatus] Iniciando verificación de estado de autenticación.');
//         setLoading(true); // Asegurarse de que loading es true al inicio de la verificación

//         const storedAccessToken = localStorage.getItem('access_token');
//         const storedRefreshToken = localStorage.getItem('refresh_token');
//         console.log(`[AuthContext - checkAuthStatus] localStorage - Access: ${storedAccessToken ? 'presente' : 'nulo'}, Refresh: ${storedRefreshToken ? 'presente' : 'nulo'}`);

//         if (!storedAccessToken && !storedRefreshToken) {
//             console.log('[AuthContext - checkAuthStatus] No hay tokens en localStorage. Usuario no autenticado.');
//             setAccessToken(null);
//             setUser(null);
//             setLoading(false);
//             return;
//         }

//         try {
//             if (storedAccessToken && (await verifyToken(storedAccessToken))) {
//                 console.log('[AuthContext - checkAuthStatus] Access token válido. Autenticado.');
//                 updateTokens(storedAccessToken, storedRefreshToken);
//             } else if (storedRefreshToken) {
//                 console.log('[AuthContext - checkAuthStatus] Access token inválido/ausente, intentando refrescar...');
//                 const newAccessToken = await refreshToken(storedRefreshToken);
//                 console.log('[AuthContext - checkAuthStatus] Refresh exitoso. Nuevo access token recibido.');
//                 updateTokens(newAccessToken, storedRefreshToken);
//             } else {
//                 console.log('[AuthContext - checkAuthStatus] No hay tokens válidos, refresco imposible. Desautenticando.');
//                 logoutUser();
//             }
//         } catch (error) {
//             console.error('[AuthContext - checkAuthStatus] Error durante validación/refresco de token:', error);
//             logoutUser(); // Si el refresh token también falla o hay un error, limpiar y desautenticar
//         } finally {
//             setLoading(false);
//             console.log('[AuthContext - checkAuthStatus] Verificación finalizada. Loading a false.');
//         }
//     }, [logoutUser, updateTokens]);

//     // Ejecutar checkAuthStatus al montar el componente una vez
//     useEffect(() => {
//         checkAuthStatus();

//         // Configurar un intervalo para refrescar el token de acceso periódicamente
//         // Ajusta la frecuencia según la vida útil de tu token de acceso
//         const refreshInterval = setInterval(() => {
//             console.log('[AuthContext - Interval] Verificando necesidad de refrescar token.');
//             const storedRefreshToken = localStorage.getItem('refresh_token');
//             if (storedRefreshToken && accessToken) {
//                 const decoded = decodeToken(accessToken);
//                 const currentTime = Date.now() / 1000;
//                 // Si el token expira en menos de 60 segundos, intenta refrescarlo
//                 if (decoded.exp - currentTime < 60) {
//                     console.log('[AuthContext - Interval] Token a punto de expirar, intentando auto-refrescar.');
//                     refreshToken(storedRefreshToken)
//                         .then((newAccess) => updateTokens(newAccess, storedRefreshToken))
//                         .catch((err) => {
//                             console.error('[AuthContext - Interval] Fallo al auto-refrescar token:', err);
//                             logoutUser();
//                         });
//                 }
//             } else {
//                 console.log('[AuthContext - Interval] No hay refresh token o access token para verificar.');
//             }
//         }, 30000); // Cada 30 segundos (ajústalo)

//         return () => {
//             console.log('[AuthContext - Cleanup] Limpiando intervalo de refresco.');
//             clearInterval(refreshInterval);
//         };
//     }, [checkAuthStatus, accessToken, logoutUser, updateTokens]);

//     const value = {
//         accessToken,
//         user,
//         isAuthenticated: !!accessToken,
//         loginUser,
//         logoutUser,
//         loading,
//     };
//     console.log(`[AuthContext - Render] isAuthenticated: ${value.isAuthenticated}, loading: ${value.loading}, accessToken: ${value.accessToken ? 'presente' : 'nulo'}`);

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };


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
                // CLAVE: Guardamos el access token en una cookie. El middleware buscará esta.                
                Cookies.set('auth-token', newAccessToken, { expires: 7, secure: true, sameSite: 'strict' });
                console.log('[AuthContext - updateTokens] Token de acceso guardado en cookie "auth-token".');
            } catch (error) {
                console.error('[AuthContext - updateTokens] Error al decodificar o guardar access token:', error);
                setUser(null);
                Cookies.remove('auth-token');
            }
        } else {
            setUser(null);
            Cookies.remove('auth-token');
            console.log('[AuthContext - updateTokens] Cookie "auth-token" removida.');
        }

        if (newRefreshToken) {
            // El refresh token también se guarda en una cookie para persistencia.
            Cookies.set('refresh-token', newRefreshToken, { expires: 30, secure: true, sameSite: 'strict' });
            console.log('[AuthContext - updateTokens] Refresh token guardado en cookie.');
        } else {
            Cookies.remove('refresh-token');
            console.log('[AuthContext - updateTokens] Cookie "refresh-token" removida.');
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
        router.push('/login');
        console.log('[AuthContext - logoutUser] Redirigiendo a /login.');
    }, [router, updateTokens]);

    // 3. Modificamos checkAuthStatus para leer desde Cookies
    const checkAuthStatus = useCallback(async () => {
        console.log('[AuthContext - checkAuthStatus] Iniciando verificación desde Cookies.');
        setLoading(true);

        const storedAccessToken = Cookies.get('auth-token');
        const storedRefreshToken = Cookies.get('refresh-token');
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
            const currentAccessToken = Cookies.get('auth-token');
            const currentRefreshToken = Cookies.get('refresh-token');
            if (currentRefreshToken && currentAccessToken) {
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