"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown } from "lucide-react";

// Import your original ApplicationLogo component
import ApplicationLogo from "@/Components/ApplicationLogo";

interface GuestLayoutProps {
    children: React.ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const floatingElements = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: i * 0.5,
        duration: 3 + i * 0.5,
    }));

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-100">
            {/* Original Background with Enhancements */}
            <div className="fixed inset-0">
                {/* Your original background image */}
                <div className="absolute inset-0 bg-[url('/image/auth/screen2.png')] bg-cover bg-center bg-no-repeat" />
                {/* Your original gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffe86f]/70 to-[#fba131]/70" />

                {/* Enhanced floating elements */}
                <AnimatePresence>
                    {isLoaded &&
                        floatingElements.map((element) => (
                            <motion.div
                                key={element.id}
                                initial={{ opacity: 0, y: 100 }}
                                animate={{
                                    opacity: [0.2, 0.4, 0.2],
                                    y: [-20, -100, -20],
                                    x: [0, 30, 0],
                                    rotate: [0, 180, 360],
                                }}
                                transition={{
                                    duration: element.duration,
                                    delay: element.delay,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                }}
                                className="absolute"
                                style={{
                                    left: `${10 + element.id * 15}%`,
                                    top: `${20 + element.id * 10}%`,
                                }}
                            >
                                <div className="w-2 h-2 bg-white/30 rounded-full blur-sm" />
                            </motion.div>
                        ))}
                </AnimatePresence>

                {/* Additional subtle geometric shapes */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-md px-6 py-8"
                >
                    {/* Original Logo with Enhanced Animation */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            duration: 1,
                            delay: 0.2,
                            type: "spring",
                            stiffness: 100,
                        }}
                        className="flex justify-center mb-6"
                    >
                        <div className="relative">
                            {/* Enhanced glow effect around your logo */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-lg scale-150" />
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 20px rgba(255, 232, 111, 0.3)",
                                        "0 0 40px rgba(251, 161, 49, 0.4)",
                                        "0 0 20px rgba(255, 232, 111, 0.3)",
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeInOut",
                                }}
                                className="relative bg-white/20 backdrop-blur-sm rounded-full p-4"
                            >
                                <ApplicationLogo className="w-28 h-28 fill-current text-gray-800 drop-shadow-lg" />
                            </motion.div>
                            {/* Rotating border */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 20,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                                className="absolute -inset-6 border-2 border-dashed border-white/20 rounded-full"
                            />
                        </div>
                    </motion.div>

                    {/* Enhanced Welcome Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center mb-8"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-xs font-medium text-gray-800 uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                Welcome to the Future of Learning
                            </span>
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                        </div>

                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="text-3xl font-bold text-primary tracking-wider mb-2"
                        >
                            WELCOME TO
                        </motion.h1>

                        <motion.h2
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.8,
                                type: "spring",
                            }}
                            className="text-4xl font-extrabold text-primary mt-2 tracking-wide"
                        >
                            IBP ACADEMY {currentYear}
                        </motion.h2>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "60%" }}
                            transition={{ duration: 1, delay: 1 }}
                            className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-4"
                        />
                    </motion.div>

                    {/* Enhanced Form Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 1.2,
                            type: "spring",
                            stiffness: 100,
                        }}
                    >
                        <div className="relative">
                            {/* Enhanced glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-xl blur-lg" />

                            {/* Main Card - keeping your original styling enhanced */}
                            <div className="relative bg-white/70 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/40">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 p-4 border-b border-white/20">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                                        <span className="text-sm font-medium text-gray-800">
                                            Secure Access Portal
                                        </span>
                                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="p-6">{children}</div>

                                {/* Card Footer */}
                                <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 p-4 border-t border-white/20">
                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-700">
                                        <span>Powered by IBP Technology</span>
                                        <ChevronDown className="w-3 h-3 animate-bounce" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                        className="mt-6 text-center"
                    >
                        <p className="text-xs text-gray-700/80">
                            © {currentYear} IBP Academy. Empowering minds,
                            shaping futures.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
