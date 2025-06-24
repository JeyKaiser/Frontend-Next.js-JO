import '../../globals.css';
import { Inter } from 'next/font/google';
import Navbar  from '@/components/organisms/Navbar';
import Sidebar from '@/components/organisms/Sidebar';
import Footer  from '@/components/organisms/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // <html lang="es"></html>
    <html>                               
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}