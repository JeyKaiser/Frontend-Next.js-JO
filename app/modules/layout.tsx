import ModulesShell from './ModulesShell';

export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ModulesShell>{children}</ModulesShell>;
}
