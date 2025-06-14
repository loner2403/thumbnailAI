"use server"

import { CreditCard } from "lucide-react"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

const Credits = async () => {
    try {
        const session = await auth()
        
        if (!session?.user?.email) {
            return <span className="flex items-center text-muted-foreground text-sm">Sign in to view credits</span>
        }
        
        // Get the full user record to ensure we get all fields
        const user = await db.user.findUnique({
            where: {
                email: session.user.email
            }
        });
            
        if (!user) {
            console.error("User not found for email:", session.user.email)
            return <span className="text-sm text-destructive">User not found</span>
        }
        
        // Show different styles based on credit amount
        const creditsLeft = user.credits;
        const getColorClass = () => {
            if (creditsLeft <= 0) return "text-destructive";
            if (creditsLeft <= 2) return "text-amber-500";
            return "text-emerald-500";
        };
        
        // Access the credits field directly from the user object
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
        return <span className="text-sm text-destructive">Error loading credits</span>
    }
};

export default Credits;