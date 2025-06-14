import { ImageIcon, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import DashboardClient from "./DashboardClient";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import Recent from "~/components/recent";

const Page = async () => {
    const serverSession = await auth();
    const user = await db.user.findUnique({
        where: {
            id: serverSession?.user.id
        },
        select: {
            credits: true,
            name: true,
            email: true,
        },
    });

    // Handle case when user is out of credits
    if (user?.credits === 0) {
        return (
            <div className="mx-auto max-w-md space-y-8 py-10">
                <Card className="overflow-hidden border-none bg-background/80 backdrop-blur-lg shadow-lg">
                    <CardHeader className="space-y-2 pb-4">
                        <CardTitle className="text-2xl">No Credits Left</CardTitle>
                        <CardDescription>
                            You need credits to generate thumbnails with AI background removal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="rounded-lg border bg-muted/50 p-3">
                            <div className="flex items-center justify-between">
                                <div className="font-semibold">Current Credits</div>
                                <div className="text-destructive font-bold">0</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                            <span>Each thumbnail creation costs 1 credit</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/pricing" className="w-full">
                            <Button size="lg" className="w-full gap-2">
                                <CreditCard className="h-4 w-4" />
                                Get More Credits
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
                <div className="mt-10">
                    <Recent />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <DashboardClient />
            <div className="mt-10">
                <Recent />
            </div>
        </div>
    );
};

export default Page;