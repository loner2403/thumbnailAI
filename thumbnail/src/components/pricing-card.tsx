import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useEffect } from "react";

const PricingCard = ({
    pricing, 
    credits
} : {
    pricing: string;
    credits: string;
}) => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleBuyNow = async () => {
        // Convert credits to number and calculate amount (e.g., 1 credit = 10 INR)
        const amount = Number(credits) * 10;
        // 1. Create order on backend
        const res = await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });
        const order = await res.json();
        if (!order.id) {
            alert(order.error || "Failed to create order");
            return;
        }
        // 2. Open Razorpay checkout
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Thumbnail App",
            description: `Purchase ${credits} credits` ,
            order_id: order.id,
            handler: function (response: any) {
                // TODO: You should verify payment on the backend here
                alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
            },
            prefill: {
                email: "user@example.com",
                contact: "9999999999",
            },
            theme: { color: "#3399cc" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };
    return <Card className="h-fit w-60">
    <CardHeader>
        <CardTitle>
            <div className="flex items-end gap-2">
                <p>{pricing}</p>
                <p className="text-sm font-normal">/ one time</p>
            </div>
        </CardTitle>
        <CardDescription>A pack of {credits} credits</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <IoIosCheckmarkCircleOutline className="h-4 w-4 " />
            <p>{credits} credits</p>
        </div>
        <div className="flex items-center gap-2">
            <IoIosCheckmarkCircleOutline className="h-4 w-4 " />
            <p>1 credits = 1 thumbnail</p>
        </div>

    </CardContent>
    <CardFooter>
        <Button onClick={handleBuyNow} className="mt-6 w-full">Buy now</Button>
    </CardFooter>
</Card>
}

export default PricingCard;