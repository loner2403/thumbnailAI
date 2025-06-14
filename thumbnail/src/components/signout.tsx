"use client"

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

const SignOut = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={() => signOut()} 
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign out</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SignOut;