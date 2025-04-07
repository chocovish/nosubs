"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserCircle, CreditCard, ShoppingBag, Banknote } from "lucide-react";

const navigation = [
  { name: "Profile Info", href: "/dashboard/myprofile", icon: UserCircle },
  { name: "Purchases", href: "/dashboard/myprofile/purchases", icon: ShoppingBag },
  { name: "Payment Methods", href: "/dashboard/myprofile/payment", icon: CreditCard },
  { name: "Withdrawals", href: "/dashboard/myprofile/withdrawals", icon: Banknote },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full md:w-64 bg-gradient-to-br from-white to-slate-50 shadow-sm rounded-lg p-4 border border-blue-100">
      <h2 className="text-lg font-semibold mb-4 px-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Account</h2>
      <nav className="space-y-2 max-sm:grid max-sm:grid-cols-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                pathname === item.href
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 