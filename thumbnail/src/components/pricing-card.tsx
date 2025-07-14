import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

const PricingCard = ({
    pricing, 
    credits
} : {
    pricing: string;
    credits: string;
}) => {
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
        <Button onClick={() => {}} className="mt-6 w-full">Buy now</Button>
    </CardFooter>
</Card>
}

export default PricingCard;