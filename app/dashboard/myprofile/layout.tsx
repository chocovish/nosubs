import { Header } from "@/components/header/header";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserCircle, CreditCard, ShoppingBag } from "lucide-react";
import { PathNameProvider } from "./layout-client";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "My profile - noSubs",
  description: "get paid for your digital products without the hassle of subscriptions",
};

export default async function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authuser = await auth();
  
  if (!authuser?.id) {
    redirect("/login");
  }

  // Get the user profile to check if they are a buyer or seller
  const userProfile = await prisma.user.findUnique({
    where: { id: authuser.id },
    select: { userType: true }
  });

  const isBuyer = userProfile?.userType === "buyer";

  return (
    <PathNameProvider>
      <main className="container mx-auto px-4 py-8">
        
        <div className={`flex ${isBuyer ? 'flex-col' : 'flex-col md:flex-row'} gap-8`}>
          {/* Only show sidebar for sellers */}
          {!isBuyer && <ProfileSidebar />}
          <div className={`flex-1 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-sm md:p-6 border border-blue-100 ${isBuyer ? 'max-w-4xl mx-auto w-full' : ''}`}>
            {children}
          </div>
        </div>
      </main>
    </PathNameProvider>
  );
} 