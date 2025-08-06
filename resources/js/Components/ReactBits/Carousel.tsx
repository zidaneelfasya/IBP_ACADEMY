import { useEffect, useState, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import React, { JSX } from "react";

// Using Lucide React icons instead of react-icons
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

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring" as const, stiffness: 300, damping: 30 };

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
}: CarouselProps): JSX.Element {
    const containerPadding = 16;
    const itemWidth = baseWidth - containerPadding * 2;
    const trackItemOffset = itemWidth + GAP;

    const carouselItems = loop ? [...items, items[0]] : items;
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isResetting, setIsResetting] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (pauseOnHover && containerRef.current) {
            const container = containerRef.current;
            const handleMouseEnter = () => setIsHovered(true);
            const handleMouseLeave = () => setIsHovered(false);
            container.addEventListener("mouseenter", handleMouseEnter);
            container.addEventListener("mouseleave", handleMouseLeave);
            return () => {
                container.removeEventListener("mouseenter", handleMouseEnter);
                container.removeEventListener("mouseleave", handleMouseLeave);
            };
        }
    }, [pauseOnHover]);

    useEffect(() => {
        if (autoplay && (!pauseOnHover || !isHovered)) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => {
                    if (prev === items.length - 1 && loop) {
                        return prev + 1;
                    }
                    if (prev === carouselItems.length - 1) {
                        return loop ? 0 : prev;
                    }
                    return prev + 1;
                });
            }, autoplayDelay);
            return () => clearInterval(timer);
        }
    }, [
        autoplay,
        autoplayDelay,
        isHovered,
        loop,
        items.length,
        carouselItems.length,
        pauseOnHover,
    ]);

    const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

    const handleAnimationComplete = () => {
        if (loop && currentIndex === carouselItems.length - 1) {
            setIsResetting(true);
            x.set(0);
            setCurrentIndex(0);
            setTimeout(() => setIsResetting(false), 50);
        }
    };

    const handleDragEnd = (
        _: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ): void => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
        if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
            if (loop && currentIndex === items.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setCurrentIndex((prev) =>
                    Math.min(prev + 1, carouselItems.length - 1)
                );
            }
        } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
            if (loop && currentIndex === 0) {
                setCurrentIndex(items.length - 1);
            } else {
                setCurrentIndex((prev) => Math.max(prev - 1, 0));
            }
        }
    };

    const dragProps = loop
        ? {}
        : {
              dragConstraints: {
                  left: -trackItemOffset * (carouselItems.length - 1),
                  right: 0,
              },
          };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${
                round
                    ? "rounded-full border border-white p-4"
                    : "rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 shadow-2xl"
            }`}
            style={{
                width: `${baseWidth}px`,
                ...(round && { height: `${baseWidth}px` }),
            }}
        >
            <motion.div
                className="flex"
                drag="x"
                {...dragProps}
                style={{
                    width: itemWidth,
                    gap: `${GAP}px`,
                    perspective: 1000,
                    perspectiveOrigin: `${
                        currentIndex * trackItemOffset + itemWidth / 2
                    }px 50%`,
                    x,
                }}
                onDragEnd={handleDragEnd}
                animate={{ x: -(currentIndex * trackItemOffset) }}
                transition={effectiveTransition}
                onAnimationComplete={handleAnimationComplete}
            >
                {carouselItems.map((item, index) => {
                    const range = [
                        -(index + 1) * trackItemOffset,
                        -index * trackItemOffset,
                        -(index - 1) * trackItemOffset,
                    ];
                    const outputRange = [90, 0, -90];
                    const rotateY = useTransform(x, range, outputRange, {
                        clamp: false,
                    });
                    return (
                        <motion.div
                            key={index}
                            className={`relative shrink-0 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing ${
                                round
                                    ? "items-center justify-center text-center bg-[#060010] border-0"
                                    : "items-start justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl"
                            }`}
                            style={{
                                width: itemWidth,
                                height: round ? itemWidth : showImageOnCard ? 380 : 280,
                                rotateY: rotateY,
                                ...(round && { borderRadius: "50%" }),
                            }}
                            transition={effectiveTransition}
                        >
                            {/* Image Section */}
                            {showImageOnCard && item.imageUrl && !round && (
                                <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    {/* Icon overlay on image */}
                                    <div className="absolute top-4 left-4">
                                        <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                            {item.icon}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Icon Section for non-image cards */}
                            {(!showImageOnCard || !item.imageUrl) && (
                                <div className={`${round ? "p-0 m-0" : "mb-4 p-5"}`}>
                                    <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#060010]">
                                        {item.icon}
                                    </span>
                                </div>
                            )}

                            {/* Content Section */}
                            <div className={`${showImageOnCard && item.imageUrl && !round ? "p-6" : "p-5"} flex-1 flex flex-col justify-between`}>
                                <div>
                                    <div className={`mb-2 text-lg font-bold ${round ? "text-white" : "text-white"}`}>
                                        {item.title}
                                    </div>
                                    <p className={`text-sm ${round ? "text-white" : "text-gray-200"} leading-relaxed`}>
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
                    );
                })}
            </motion.div>
            <div
                className={`flex w-full justify-center ${
                    round
                        ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2"
                        : ""
                }`}
            >
                <div className="mt-6 flex w-[200px] justify-center gap-3">
                    {items.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${
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
                                        ? 1.4
                                        : 1,
                                opacity:
                                    currentIndex % items.length === index
                                        ? 1
                                        : 0.6,
                            }}
                            onClick={() => setCurrentIndex(index)}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
