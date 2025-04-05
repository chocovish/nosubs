import PurchaseDashboard from "./purchase-dashboard";
import SalesDashboard from "./sales-dashboard";
import { getUserProfile } from "../actions/profile";

export default async function DashboardPage() {
    const userProfile = await getUserProfile();
    if (userProfile?.userType === "buyer") {
        return <PurchaseDashboard />
    } else if (userProfile?.userType === "seller") {
        return <SalesDashboard />
    } else {
        return <div>Unauthorized</div>
    }
}