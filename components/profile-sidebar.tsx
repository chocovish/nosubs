"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Profile Info", href: "/myprofile" },
  { name: "Payment Methods", href: "/myprofile/payment" },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm rounded-lg p-4">
      <nav className="space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "block px-4 py-2 rounded-md text-sm font-medium",
              pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
} 