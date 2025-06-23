"use server"

import { Separator } from "@radix-ui/react-select";
import { Button } from "./ui/button";

const Recent = () => {
    return <div className="flex flex-col">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Recent Thumbnails
        </h3>
        <p className="text-sm text-muted-foreground">
            Download your most recent thumbnails.
        </p>
        <Separator className="my-2" />
        <div className="flex h-fit max-w-full gap-2 overflow-x-scroll">
            <div className="flex min-w-fit flex-col gap-1">
                <img src="/style1.png" alt="image" className="h-56 w-auto rounded-lg object-contain" />
                <p className="text-sm">
                    From{" "}
                    {new Date().toLocaleDateString("en-GB",{
                        day: "2-digit",
                        month:"2-digit",
                        year: "numeric",
                    })}
                </p>
                <Button className="w-full" variant="outline">
                    Download
                </Button>

            </div>
            <div className="flex min-w-fit flex-col gap-1">
                <img src="/style1.png" alt="image" className="h-56 w-auto rounded-lg object-contain" />
                <p className="text-sm">
                    From{" "}
                    {new Date().toLocaleDateString("en-GB",{
                        day: "2-digit",
                        month:"2-digit",
                        year: "numeric",
                    })}
                </p>
                <Button className="w-full" variant="outline">
                    Download
                </Button>
                
            </div>
            <div className="flex min-w-fit flex-col gap-1">
                <img src="/style1.png" alt="image" className="h-56 w-auto rounded-lg object-contain" />
                <p className="text-sm">
                    From{" "}
                    {new Date().toLocaleDateString("en-GB",{
                        day: "2-digit",
                        month:"2-digit",
                        year: "numeric",
                    })}
                </p>
                <Button className="w-full" variant="outline">
                    Download
                </Button>
                
            </div>
            <div className="flex min-w-fit flex-col gap-1">
                <img src="/style1.png" alt="image" className="h-56 w-auto rounded-lg object-contain" />
                <p className="text-sm">
                    From{" "}
                    {new Date().toLocaleDateString("en-GB",{
                        day: "2-digit",
                        month:"2-digit",
                        year: "numeric",
                    })}
                </p>
                <Button className="w-full" variant="outline">
                    Download
                </Button>
                
            </div>


        </div>

    </div>;
};

export default Recent;
