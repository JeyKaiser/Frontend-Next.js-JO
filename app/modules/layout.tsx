import Navbar from '@/app/globals/components/organisms/Navbar';
import Sidebar from '@/app/globals/components/organisms/Sidebar';
import { SAPDataProvider } from '@/app/contexts/SAPDataContext';

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Envolvemos todo con el SAPDataProvider para que esté disponible en todos los módulos
    <SAPDataProvider>
      <div className="min-h-screen bg-secondary-50">
        {/* Renderiza la barra de navegación superior */}
        <Navbar />
        {/* Renderiza el menú lateral */}
        <Sidebar />

        {/* Define el área principal para el contenido de la página */}
        <main className="pl-64 pt-16">
          {children} {/* Aquí Next.js insertará el contenido de tu page.tsx */}
        </main>
      </div>
    </SAPDataProvider>
  );
}
