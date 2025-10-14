export default function ConfiguracionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Este layout está anidado bajo /modules/layout.tsx, que ya proporciona Navbar y Sidebar.
    // Por lo tanto, simplemente renderizamos los children aquí.
    <>{children}</>
  );
}
