import React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "../../lib/utils";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef(({ className, ...props }, ref) => (
    <HoverCardPrimitive.Content
        ref={ref}
        className={cn("z-50 w-64 rounded-md border bg-popover p-4 shadow-md", className)}
        {...props}
    />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };