import { Header } from "@/components/header/header";
import { ProfileSidebar } from "@/components/profile-sidebar";
import { ProfileForm } from "@/components/profile-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserCircle } from "lucide-react";

export default async function MyProfile() {
  const authuser = await auth();
  
  if (!authuser?.id) {
    redirect("/login");
  }

  // const user = await prisma.user.findUnique({
  //   where: { id: authuser.id },
  // });

//   if (!user) {
//     redirect("/login");
//   }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <UserCircle className="h-8 w-8 text-blue-600" />
            My Profile
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar />
          <div className="flex-1 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-sm md:p-6 border border-blue-100">
            <ProfileForm />
          </div>
        </div>
      </main>
    </div>
  );
}