// app/test/page.tsx
export default function TailwindTestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white px-4">
      <h1 className="text-5xl font-bold mb-4">🎨 Tailwind CSS funcionando</h1>
      <p className="text-lg mb-8">¡Tu configuración de Tailwind está activa y lista para usar!</p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        <button className="bg-white text-indigo-700 px-4 py-2 rounded shadow hover:bg-indigo-100 transition">
          Botón Claro
        </button>
        <button className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition">
          Botón Oscuro
        </button>
        <div className="col-span-2 bg-white/10 p-4 rounded-lg border border-white/20">
          <p className="text-sm text-white text-center">Esto es una tarjeta con opacidad y borde.</p>
        </div>
      </div>
    </div>
  );  
}
