import { Header } from "@/components/header";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { ProfileForm } from "@/components/profile-form";
import { PaymentMethodsForm } from "@/components/payment-methods-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function MyProfile() {
  const authuser = await auth();
  
  if (!authuser?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: authuser.id },
  });

//   if (!user) {
//     redirect("/login");
//   }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <ProfileSidebar />
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            <ProfileForm user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}