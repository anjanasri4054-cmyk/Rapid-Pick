import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

const Pagination = ({ className, ...props }) => (
    <nav className={cn("mx-auto flex w-full justify-center", className)} {...props} />
);

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
));

const PaginationLink = ({ className, isActive, ...props }) => (
    <a className={cn(buttonVariants({ variant: isActive ? "outline" : "ghost" }), className)} {...props} />
);

export {
    Pagination,
    PaginationContent,
    PaginationLink,
};