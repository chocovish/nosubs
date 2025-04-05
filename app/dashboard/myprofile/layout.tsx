import { Header } from "@/components/header/header";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserCircle, CreditCard, ShoppingBag } from "lucide-react";
import { PathNameProvider } from "./layout-client";

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
        <div className="flex justify-between items-center mb-6">
          {/* Profile title - shown on /myprofile route and for all buyer users */}
          <h1 
            data-path="profile" 
            className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 ${isBuyer ? 'block' : '[.pathname-myprofile_&]:block hidden'}`}
          >
            <UserCircle className="h-8 w-8 text-blue-600" />
            My Profile
          </h1>
          
          {/* Payment methods title - shown on /myprofile/payment route (sellers only) */}
          {!isBuyer && (
            <h1 data-path="payment" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 [.pathname-payment_&]:block hidden">
              <CreditCard className="h-8 w-8 text-purple-600" />
              Payment Methods
            </h1>
          )}
          
          {/* Purchases title - shown on /myprofile/purchases route (sellers only) */}
          {!isBuyer && (
            <h1 data-path="purchases" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 [.pathname-purchases_&]:block hidden">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              My Purchases
            </h1>
          )}
          
          {/* Default title - fallback (sellers only) */}
          {!isBuyer && (
            <h1 data-path="default" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 [.pathname-myprofile_&]:hidden [.pathname-payment_&]:hidden [.pathname-purchases_&]:hidden block">
              <UserCircle className="h-8 w-8 text-blue-600" />
              My Account
            </h1>
          )}
        </div>
        
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