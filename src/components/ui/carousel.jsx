import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";

const CarouselContext = React.createContext(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);
    if (!context) throw new Error("useCarousel must be used within a <Carousel />");
    return context;
}

const Carousel = React.forwardRef(({ orientation = "horizontal", className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel({ axis: orientation === "horizontal" ? "x" : "y" });
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

    React.useEffect(() => {
        if (!api) return;
        const onSelect = () => {
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        };
        api.on("select", onSelect);
        onSelect();
        return () => api.off("select", onSelect);
    }, [api]);

    return (
        <CarouselContext.Provider value={{ carouselRef, scrollPrev, scrollNext, canScrollPrev, canScrollNext, orientation }}>
            <div ref={ref} className={cn("relative", className)} {...props}>
                {children}
            </div>
        </CarouselContext.Provider>
    );
});
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
    const { carouselRef } = useCarousel();
    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div ref={ref} className={cn("flex", className)} {...props} />
        </div>
    );
});
CarouselContent.displayName = "CarouselContent";

export { Carousel, CarouselContent };