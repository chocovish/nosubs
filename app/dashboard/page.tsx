import { getUserProfile } from "../actions/profile";
import PurchaseDashboard from "./purchase-dashboard";
import SalesDashboard from "./sales-dashboard";
export default async function DashboardPage() {
    let userProfile = await getUserProfile()
    if (userProfile?.userType === "buyer") {
        return <PurchaseDashboard />
    } else {
        return <SalesDashboard />
    }
}