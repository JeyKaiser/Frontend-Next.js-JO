import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <section className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-semibold text-gray-800">
          Recuperar contraseña
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Esta pantalla todavia esta en desarrollo.
        </p>
        <Link
          href="/modules/login"
          className="block w-full rounded-md bg-blue-600 px-5 py-3 text-center text-base font-bold text-white transition hover:bg-blue-700"
        >
          Volver al inicio de sesion
        </Link>
      </section>
    </main>
  );
}
