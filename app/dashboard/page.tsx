"use client";
import { LoaderSkeleton } from "@/components/dashboard/loader-skeletone";
import PurchaseDashboard from "./purchase-dashboard";
import SalesDashboard from "./sales-dashboard";
import { useUserProfile } from "@/hooks/use-user";

export default function DashboardPage() {
    const {userProfile, isLoading} = useUserProfile();

    if (isLoading) {
        return <LoaderSkeleton />
    }

    if (userProfile?.userType === "buyer") {
        return <PurchaseDashboard />
    } else if (userProfile?.userType === "seller") {
        return <SalesDashboard />
    } else {
        return <div>Unauthorized</div>
    }
}