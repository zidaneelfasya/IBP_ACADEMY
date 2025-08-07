import { useEffect, useState, useRef, useCallback } from "react";
import { motion, PanInfo, useMotionValue } from "framer-motion";
import React from "react";
import { Circle, Code, FileText, Layers, Layout } from "lucide-react";

export interface CarouselItem {
    title: string;
    description?: string;
    details?: string;
    id?: number;
    icon: React.ReactNode;
    color?: string;
    imageUrl?: string;
}

export interface CarouselProps {
    items?: CarouselItem[];
    baseWidth?: number;
    autoplay?: boolean;
    autoplayDelay?: number;
    pauseOnHover?: boolean;
    loop?: boolean;
    round?: boolean;
    showImageOnCard?: boolean;
    showThumbnails?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
    {
        title: "Text Animations",
        description: "Cool text animations for your projects.",
        id: 1,
        icon: <FileText className="h-[16px] w-[16px] text-white" />,
    },
    {
        title: "Animations",
        description: "Smooth animations for your projects.",
        id: 2,
        icon: <Circle className="h-[16px] w-[16px] text-white" />,
    },
    {
        title: "Components",
        description: "Reusable components for your projects.",
        id: 3,
        icon: <Layers className="h-[16px] w-[16px] text-white" />,
    },
    {
        title: "Backgrounds",
        description: "Beautiful backgrounds and patterns for your projects.",
        id: 4,
        icon: <Layout className="h-[16px] w-[16px] text-white" />,
    },
    {
        title: "Common UI",
        description: "Common UI components are coming soon!",
        id: 5,
        icon: <Code className="h-[16px] w-[16px] text-white" />,
    },
];

const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;
const GAP = 28;
const SPRING_OPTIONS = {
    type: "spring" as const,
    stiffness: 300,
    damping: 50,
    mass: 0.5,
};

export default function Carousel({
    items = DEFAULT_ITEMS,
    baseWidth = 400,
    autoplay = true,
    autoplayDelay = 4000,
    pauseOnHover = true,
    loop = true,
    round = false,
    showImageOnCard = true,
    showThumbnails = false,
}: CarouselProps) {
    // Responsive width calculation
    const [windowWidth, setWindowWidth] = useState<number>(
        typeof window !== "undefined" ? window.innerWidth : 1200
    );

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    // Calculate responsive width
    const getResponsiveWidth = () => {
        if (windowWidth < 640) {
            // Mobile
            return Math.min(windowWidth - 32, 320); // Max 320px with 16px padding on each side
        } else if (windowWidth < 768) {
            // Small tablet
            return Math.min(windowWidth - 64, 500); // Max 500px with 32px padding on each side
        } else if (windowWidth < 1024) {
            // Tablet
            return Math.min(windowWidth - 96, 600); // Max 600px with 48px padding on each side
        } else {
            // Desktop
            return baseWidth;
        }
    };

    const responsiveWidth = getResponsiveWidth();
    const containerPadding = windowWidth < 640 ? 12 : 20;
    const itemWidth = responsiveWidth - containerPadding * 2;
    const trackItemOffset = itemWidth + GAP;

    // Only clone the first item if loop is enabled
    const carouselItems = loop ? [...items, items[0]] : items;
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    useEffect(() => {
        if (pauseOnHover && containerRef.current) {
            const container = containerRef.current;
            container.addEventListener("mouseenter", handleMouseEnter);
            container.addEventListener("mouseleave", handleMouseLeave);
            return () => {
                container.removeEventListener("mouseenter", handleMouseEnter);
                container.removeEventListener("mouseleave", handleMouseLeave);
            };
        }
    }, [pauseOnHover, handleMouseEnter, handleMouseLeave]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => {
            if (prev >= items.length - 1) {
                if (loop) {
                    // For loop, go to clone item first
                    return prev + 1;
                } else {
                    // For non-loop, stay at last item
                    return prev;
                }
            }
            return prev + 1;
        });
    }, [items.length, loop]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => {
            if (prev <= 0) {
                if (loop) {
                    // For loop, go to last real item
                    return items.length - 1;
                } else {
                    // For non-loop, stay at first item
                    return 0;
                }
            }
            return prev - 1;
        });
    }, [items.length, loop]);

    useEffect(() => {
        if (autoplay && (!pauseOnHover || !isHovered) && !isDragging) {
            const timer = setInterval(() => {
                if (currentIndex >= carouselItems.length - 1 && loop) {
                    // Reset to first item with animation
                    setCurrentIndex(0);
                } else if (currentIndex < items.length - 1 || loop) {
                    goToNext();
                }
            }, autoplayDelay);
            return () => clearInterval(timer);
        }
    }, [
        autoplay,
        autoplayDelay,
        isHovered,
        pauseOnHover,
        isDragging,
        currentIndex,
        items.length,
        carouselItems.length,
        loop,
        goToNext,
    ]);

    const handleAnimationComplete = useCallback(() => {
        if (loop && currentIndex === carouselItems.length - 1) {
            // Instantly jump to first item without animation
            x.set(0);
            setCurrentIndex(0);
        }
    }, [loop, currentIndex, carouselItems.length, x]);

    const handleDragStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleDragEnd = useCallback(
        (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
            setIsDragging(false);

            const offset = info.offset.x;
            const velocity = info.velocity.x;

            // Handle swipe based on velocity
            if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
                if (velocity < 0) {
                    // Swipe left - go to next
                    if (currentIndex < items.length - 1 || loop) {
                        goToNext();
                    }
                } else {
                    // Swipe right - go to previous
                    if (currentIndex > 0 || loop) {
                        goToPrev();
                    }
                }
            }
            // Handle drag based on offset
            else if (offset < -DRAG_BUFFER) {
                // Drag left - go to next if possible
                if (currentIndex < items.length - 1 || loop) {
                    goToNext();
                }
            } else if (offset > DRAG_BUFFER) {
                // Drag right - go to previous if possible
                if (currentIndex > 0 || loop) {
                    goToPrev();
                }
            } else {
                // Return to current position if not enough drag
                x.set(-(currentIndex * trackItemOffset));
            }
        },
        [
            currentIndex,
            items.length,
            loop,
            goToNext,
            goToPrev,
            trackItemOffset,
            x,
        ]
    );

    const goToSlide = useCallback(
        (index: number) => {
            if (index >= 0 && index < items.length) {
                setCurrentIndex(index);
            }
        },
        [items.length]
    );

    // Calculate drag constraints based on loop mode
    const getDragConstraints = useCallback(() => {
        if (loop) {
            return {};
        } else {
            return {
                dragConstraints: {
                    left: -trackItemOffset * (items.length - 1),
                    right: 0,
                },
            };
        }
    }, [loop, trackItemOffset, items.length]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${
                round
                    ? "rounded-full border border-white p-4"
                    : "rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl"
            }`}
            style={{
                width: `${responsiveWidth}px`,
                padding: `${containerPadding}px`,
                ...(round && { height: `${responsiveWidth}px` }),
            }}
        >
            <motion.div
                className="flex"
                drag="x"
                {...getDragConstraints()}
                style={{
                    x,
                    width: "100%",
                    gap: `${GAP}px`,
                }}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                animate={{
                    x: -(currentIndex * trackItemOffset),
                    transition: SPRING_OPTIONS,
                }}
                onAnimationComplete={handleAnimationComplete}
            >
                {carouselItems.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`relative shrink-0 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing ${
                            round
                                ? "items-center justify-center text-center bg-[#060010] border-0"
                                : "items-start justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl"
                        }`}
                        style={{
                            width: itemWidth,
                            height: round
                                ? itemWidth
                                : showImageOnCard
                                ? windowWidth < 640
                                    ? 300
                                    : 460
                                : windowWidth < 640
                                ? 240
                                : 280,
                            ...(round && { borderRadius: "50%" }),
                        }}
                        initial={false}
                    >
                        {/* Image Section */}
                        {showImageOnCard && item.imageUrl && !round && (
                            <div
                                className={`relative w-full overflow-hidden rounded-t-2xl ${
                                    windowWidth < 640 ? "h-48" : "h-80"
                                }`}
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="object-cover w-full h-full"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {/* Icon overlay on image */}
                                <div
                                    className={`absolute ${
                                        windowWidth < 640
                                            ? "top-2 left-2"
                                            : "top-4 left-4"
                                    }`}
                                >
                                    <span
                                        className={`flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 ${
                                            windowWidth < 640
                                                ? "h-[24px] w-[24px]"
                                                : "h-[32px] w-[32px]"
                                        }`}
                                    >
                                        {React.cloneElement(
                                            item.icon as React.ReactElement,
                                            {
                                                className: `${
                                                    windowWidth < 640
                                                        ? "h-[12px] w-[12px]"
                                                        : "h-[16px] w-[16px]"
                                                } text-white`,
                                            }
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Icon Section for non-image cards */}
                        {(!showImageOnCard || !item.imageUrl) && (
                            <div
                                className={`${
                                    round
                                        ? "p-0 m-0"
                                        : windowWidth < 640
                                        ? "mb-3 p-3"
                                        : "mb-4 p-5"
                                }`}
                            >
                                <span
                                    className={`flex items-center justify-center rounded-full bg-[#060010] ${
                                        windowWidth < 640
                                            ? "h-[24px] w-[24px]"
                                            : "h-[28px] w-[28px]"
                                    }`}
                                >
                                    {React.cloneElement(
                                        item.icon as React.ReactElement,
                                        {
                                            className: `${
                                                windowWidth < 640
                                                    ? "h-[12px] w-[12px]"
                                                    : "h-[16px] w-[16px]"
                                            } text-white`,
                                        }
                                    )}
                                </span>
                            </div>
                        )}

                        {/* Content Section */}
                        <div
                            className={`${
                                showImageOnCard && item.imageUrl && !round
                                    ? windowWidth < 640
                                        ? "p-3"
                                        : "p-4"
                                    : windowWidth < 640
                                    ? "p-3"
                                    : "p-5"
                            } flex-1 flex flex-col justify-between`}
                        >
                            <div>
                                <div
                                    className={`${
                                        windowWidth < 640
                                            ? "mb-1 text-sm"
                                            : "mb-2 text-base"
                                    } font-bold ${
                                        round ? "text-white" : "text-white"
                                    }`}
                                >
                                    {item.title}
                                </div>
                                <p
                                    className={`${
                                        windowWidth < 640
                                            ? "text-xs"
                                            : "text-sm"
                                    } ${
                                        round ? "text-white" : "text-gray-200"
                                    } leading-relaxed line-clamp-3`}
                                >
                                    {item.description || item.details}
                                </p>
                            </div>

                            {/* Gradient background for better readability */}
                            {item.color && !round && (
                                <div
                                    className={`absolute inset-0 opacity-5 rounded-2xl bg-gradient-to-br ${item.color}`}
                                />
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Indicators */}
            <div
                className={`flex w-full justify-center ${
                    round
                        ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2"
                        : ""
                }`}
            >
                <div
                    className={`${windowWidth < 640 ? "mt-3" : "mt-6"} flex ${
                        windowWidth < 640 ? "w-[150px]" : "w-[200px]"
                    } justify-center gap-3`}
                >
                    {items.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`${
                                windowWidth < 640 ? "h-1.5 w-1.5" : "h-2 w-2"
                            } rounded-full cursor-pointer ${
                                currentIndex % items.length === index
                                    ? round
                                        ? "bg-white"
                                        : "bg-white"
                                    : round
                                    ? "bg-white/40"
                                    : "bg-white/40"
                            }`}
                            animate={{
                                scale:
                                    currentIndex % items.length === index
                                        ? windowWidth < 640
                                            ? 1.2
                                            : 1.4
                                        : 1,
                            }}
                            onClick={() => goToSlide(index)}
                            transition={{ duration: 0.2 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
