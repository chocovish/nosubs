import { Header } from "@/components/header/header";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { PaymentMethodForm } from "@/components/payment-methods-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreditCard } from "lucide-react";

export default async function PaymentMethods() {
  const user = await auth();
  
  if (!user?.id) {
    redirect("/login");
  }

  // const user = await prisma.user.findUnique({
  //   where: { id: session.user.id },
  // });

  // if (!user) {
  //   redirect("/login");
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-purple-600" />
            Payment Methods
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar />
          <div className="flex-1 bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-sm p-6 border border-purple-100">
            <PaymentMethodForm />
          </div>
        </div>
      </main>
    </div>
  );
} 