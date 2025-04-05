import { Header } from "@/components/header/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            {children}
        </div>
    )
}