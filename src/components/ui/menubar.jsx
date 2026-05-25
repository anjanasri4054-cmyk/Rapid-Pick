import React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../../lib/utils";

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
    <MenubarPrimitive.Root ref={ref} className={cn("flex h-9 items-center space-x-1 rounded-md border bg-background p-1", className)} {...props} />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
    <MenubarPrimitive.Trigger ref={ref} className={cn("cursor-default select-none rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent", className)} {...props} />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

export {
    Menubar,
    MenubarTrigger,
};