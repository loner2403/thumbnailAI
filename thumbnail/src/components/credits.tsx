"use server"

import { CreditCard } from "lucide-react"
import { getOrCreateUser } from "~/server/auth/getOrCreateUser";

const Credits = async () => {
    try {
        const user = await getOrCreateUser();
        if (!user) {
            return <span className="text-sm text-destructive">User not found</span>;
        }
        // Show different styles based on credit amount
        const creditsLeft = user.credits;
        const getColorClass = () => {
            if (creditsLeft <= 0) return "text-destructive";
            if (creditsLeft <= 2) return "text-amber-500";
            return "text-emerald-500";
        };
        return (
            <span className="flex items-center gap-1.5">
                <CreditCard className={`h-3.5 w-3.5 ${getColorClass()}`} />
                <span className={`${getColorClass()} font-medium`}>
                    {creditsLeft} {creditsLeft === 1 ? 'credit' : 'credits'}
                </span>
            </span>
        );
    } catch (error) {
        console.error("Error in Credits component:", error)
        return <span className="text-sm text-destructive">Error loading credits</span>;
    }
};

export default Credits;