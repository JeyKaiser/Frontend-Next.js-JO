//app/modules/(dashboard)/layout.tsx
import Navbar from '@/app/globals/components/organisms/Navbar';
import Sidebar from '@/app/globals/components/organisms/Sidebar';
import Footer from '@/app/globals/components/organisms/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 pt-16 overflow-hidden">
                <Sidebar />
                <main className="flex-1 ml-64 p-6 overflow-y-auto bg-secondary-50">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}

