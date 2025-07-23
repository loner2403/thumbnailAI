"use client";

import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { useEffect } from "react";

// Define types for Razorpay integration
interface OrderPayload {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    offer_id: string | null;
    status: string;
    attempts: number;
    notes: string[];
    created_at: number;
    error?: string;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string | undefined;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        email: string;
        contact: string;
    };
    theme: {
        color: string;
    };
}

// Extend the Window interface to include Razorpay
declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open(): void;
        };
    }
}

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
        const amount = Number(credits) * 10;
        const res = await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });

        const order = await res.json() as OrderPayload;

        if (!order.id) {
            console.error(order.error ?? "Failed to create order");
            return;
        }

        const options: RazorpayOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Thumbnail App",
            description: `Purchase ${credits} credits`,
            order_id: order.id,
            handler: function (response: RazorpayResponse) {
                // TODO: You should verify payment on the backend here
                console.log("Payment successful! Payment ID: " + response.razorpay_payment_id);
            },
            prefill: {
                email: "user@example.com",
                contact: "9999999999",
            },
            theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <Card className="h-fit w-60">
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
                    <p>1 credit = 1 thumbnail</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={() => { void handleBuyNow(); }} className="mt-6 w-full">Buy now</Button>
            </CardFooter>
        </Card>
    );
};

export default PricingCard;