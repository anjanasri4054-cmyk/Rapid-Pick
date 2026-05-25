import React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../../lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuContent = ContextMenuPrimitive.Content;

const ContextMenuItem = React.forwardRef(({ className, ...props }, ref) => (
    <ContextMenuPrimitive.Item ref={ref} className={cn("cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent", className)} {...props} />
));

export {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
};