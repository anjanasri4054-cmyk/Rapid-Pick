import React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
        ref={ref}
        className={cn("fixed inset-0 z-50 bg-black/80", className)}
        {...props} />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
    "fixed z-50 bg-background p-6 shadow-lg transition ease-in-out",
    {
        variants: {
            side: {
                right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
                left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
            },
        },
        defaultVariants: { side: "right" },
    }
);

const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
            <SheetPrimitive.Close className="absolute right-4 top-4 opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
            </SheetPrimitive.Close>
            {children}
        </SheetPrimitive.Content>
    </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

export {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetClose,
    SheetOverlay,
};