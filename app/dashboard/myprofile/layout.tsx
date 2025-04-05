import { Header } from "@/components/header/header";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { auth } from "@/lib/auth";
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

  // Get the current pathname to determine which title and icon to show
  // This needs to be done on the client side, so we'll handle it with CSS

  return (
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            {/* Profile title - shown on /myprofile route */}
            <h1 data-path="profile" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 [.pathname-myprofile_&]:block hidden">
              <UserCircle className="h-8 w-8 text-blue-600" />
              My Profile
            </h1>
            
            {/* Payment methods title - shown on /myprofile/payment route */}
            <h1 data-path="payment" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 [.pathname-payment_&]:block hidden">
              <CreditCard className="h-8 w-8 text-purple-600" />
              Payment Methods
            </h1>
            
            {/* Purchases title - shown on /myprofile/purchases route */}
            <h1 data-path="purchases" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 [.pathname-purchases_&]:block hidden">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              My Purchases
            </h1>
            
            {/* Default title - fallback */}
            <h1 data-path="default" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 [.pathname-myprofile_&]:hidden [.pathname-payment_&]:hidden [.pathname-purchases_&]:hidden block">
              <UserCircle className="h-8 w-8 text-blue-600" />
              My Account
            </h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <ProfileSidebar />
            <div className="flex-1 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-sm md:p-6 border border-blue-100">
              {children}
            </div>
          </div>
        </main>
  );
} 