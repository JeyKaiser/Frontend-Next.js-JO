export function getBackendUrl(): string {
  // Si estamos en el navegador
  if (typeof window !== 'undefined') {
    const currentHost = window.location.hostname;

    // Si estamos accediendo desde localhost o 127.0.0.1 (desarrollo local)
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:8000';
    }

    // Si estamos accediendo desde cualquier IP externa (producción/red local)
    // Usar la misma IP del frontend pero con puerto 8000
    return `http://${currentHost}:8000`;
  }

  // En el servidor (SSR), usar variable de entorno o localhost por defecto
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
}
