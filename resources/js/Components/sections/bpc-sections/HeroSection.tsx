"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { ArrowLeft, Zap } from "lucide-react";
import { easeInOut } from "framer-motion";


interface HeroSectionProps {
    title: string;
    backUrl?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    title,
    backUrl = "/",
}) => {
    const floatingVariants = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: easeInOut,
            },
        },
    };

    return (
        <>
            {/* Animated Background Elements */}
            <motion.div
                animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                }}
                className="absolute w-32 h-32 rounded-full top-20 right-20 bg-gradient-to-r from-blue-200 to-yellow-200 opacity-20 blur-xl"
            />

            <motion.div
                animate={{
                    rotate: -360,
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 25,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                }}
                className="absolute w-40 h-40 rounded-full bottom-20 left-20 bg-gradient-to-r from-yellow-200 to-blue-200 opacity-20 blur-xl"
            />

            {/* Main Title */}
            <div className="container px-4 py-2 mx-auto mt-8 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-2 text-center"
                >
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold text-[#1E3A8A] mb-4"
                        animate={{
                            backgroundPosition: [
                                "0% 50%",
                                "100% 50%",
                                "0% 50%",
                            ],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                        style={{
                            background:
                                "linear-gradient(45deg, #1E3A8A, #3B82F6, #1E3A8A)",
                            backgroundSize: "200% 200%",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        {title}
                    </motion.h1>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 96 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-1 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                    />

                    <motion.div
                        variants={floatingVariants}
                        initial="initial"
                        animate="animate"
                        className="mt-4"
                    >
                        <Zap className="w-8 h-8 mx-auto text-yellow-500" />
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};

export default HeroSection;
