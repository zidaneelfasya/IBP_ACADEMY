"use client";

import type React from "react";

import { motion } from "framer-motion";

interface VisualSectionProps {
    images?: {
        main: string;
        secondary: string[];
    };
}

const VisualSection: React.FC<VisualSectionProps> = ({ images }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const defaultImages = {
        main: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        secondary: [
            "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ],
    };

    const imageData = images || defaultImages;

    return (
        <div className="container px-4 mx-auto mb-16">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-3">
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, rotateY: 5 }}
                        className="md:col-span-2"
                    >
                        <img
                            src={imageData.main || "/placeholder.svg"}
                            alt="Business Plan Competition Main"
                            className="object-cover w-full shadow-lg h-80 rounded-2xl"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants} className="space-y-6">
                        {imageData.secondary.map((src, index) => (
                            <motion.img
                                key={index}
                                whileHover={{
                                    scale: 1.05,
                                    rotateX: index % 2 === 0 ? 5 : -5,
                                }}
                                src={src}
                                alt={`Competition Image ${index + 1}`}
                                className="object-cover w-full shadow-lg h-36 rounded-2xl"
                            />
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default VisualSection;
