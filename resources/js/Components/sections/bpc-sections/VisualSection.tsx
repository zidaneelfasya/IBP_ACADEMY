"use client";

import type React from "react";
import { motion,easeInOut } from "framer-motion";

interface VisualSectionProps {
    images?: {
        main: string; // Bisa berupa path lokal atau URL eksternal
        secondary: string[]; // Bisa berupa path lokal atau URL eksternal
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
                ease: easeInOut,
            },
        },
    };

    const defaultImages = {
        main: "/images/bcc/main.jpg", // Path default lokal
        secondary: [
            "/images/bcc/secondary1.jpg",
            "/images/bcc/secondary2.jpg",
        ],
    };

    const imageData = images || defaultImages;

    // Fungsi untuk menentukan apakah gambar adalah URL eksternal
    const isExternalUrl = (url: string) => {
        return url.startsWith('http://') || url.startsWith('https://');
    };

    // Fungsi untuk mendapatkan URL gambar yang benar
    const getImageUrl = (url: string) => {
        if (isExternalUrl(url)) {
            return url;
        }
        // Untuk path lokal, gunakan path langsung (Laravel akan melayani dari public/)
        return url;
    };

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
                            src={getImageUrl(imageData.main)}
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
                                src={getImageUrl(src)}
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