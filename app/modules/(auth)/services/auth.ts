// app/services/auth.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Importa jwtDecode desde jwt-decode

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const API_BASE_URL = backendUrl || 'http://localhost:8000/api';

interface Tokens {
    access: string;
    refresh: string;
}

interface DecodedToken {
    user_id: number;
    exp: number; // Expiración en segundos desde la época (Unix timestamp)
    // Otros claims del token, como token_type, jti, etc.
}

/**
 * Realiza la solicitud de login para obtener los tokens de acceso y refresco.
 * @param username El nombre de usuario.
 * @param password La contraseña.
 * @returns Una promesa que resuelve con los tokens si la autenticación es exitosa.
 */
export const login = async (
    username: string,
    password: string
): Promise<Tokens> => {
    try {
        const response = await axios.post<Tokens>(`${API_BASE_URL}/token/`, {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Puedes manejar errores específicos del backend aquí, por ejemplo, credenciales inválidas.
            throw new Error(
                error.response.data.detail || "Error de inicio de sesión"
            );
        }
        throw new Error("Error de red o desconocido al iniciar sesión.");
    }
};

/**
 * Refresca el token de acceso utilizando el token de refresco.
 * @param refreshToken El token de refresco.
 * @returns Una promesa que resuelve con el nuevo token de acceso.
 */
export const refreshToken = async (refreshToken: string): Promise<string> => {
    try {
        const response = await axios.post<{ access: string }>(
            `${API_BASE_URL}/token/refresh/`,
            {
                refresh: refreshToken,
            }
        );
        return response.data.access;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Esto suele indicar que el token de refresco es inválido o ha expirado.
            throw new Error(
                error.response.data.detail || "Error al refrescar el token"
            );
        }
        throw new Error("Error de red o desconocido al refrescar el token.");
    }
};

/**
 * Verifica la validez de un token de acceso.
 * @param accessToken El token de acceso a verificar.
 * @returns Una promesa que resuelve a `true` si el token es válido, `false` en caso contrario.
 */
export const verifyToken = async (accessToken: string): Promise<boolean> => {
    try {
        // La API de verificación de Django Simple JWT devuelve un 200 OK si es válido, 401 si no.
        await axios.post(`${API_BASE_URL}/token/verify/`, {
            token: accessToken,
        });
        return true;
    } catch (error) {
        return false; // El token no es válido
    }
};

/**
 * Decodifica un token JWT para extraer su payload.
 * @param token El token JWT a decodificar.
 * @returns El payload decodificado del token.
 */
export const decodeToken = (token: string): DecodedToken => {
    return jwtDecode<DecodedToken>(token);
};
