import Navbar from '@/components/organisms/Navbar';
import Sidebar from '@/components/organisms/Sidebar';
import Footer from '@/components/organisms/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 pt-16 overflow-hidden">
                <Sidebar />
                <main className="flex-1 ml-48 p-4 overflow-y-auto bg-gray-100">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
}

