"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface DescriptionSectionProps {
    title?: string;
    content: string[];
    icon?: React.ReactNode;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
    title = "Tentang Kompetisi",
    content,
    icon,
}) => {
    return (
        <div className="container px-4 mx-auto mb-16">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
            >
                <motion.div
                    whileHover={{ scale: 1.01, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl md:p-12 border-white/20"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                            transition={{
                                duration: 10,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                            }}
                        >
                            {icon || (
                                <Users className="w-8 h-8 text-[#1E3A8A]" />
                            )}
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {title}
                        </h2>
                    </div>

                    {content.map((paragraph, index) => (
                        <motion.p
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.2 + index * 0.2,
                            }}
                            className={`text-lg text-gray-600 leading-relaxed ${
                                index < content.length - 1 ? "mb-6" : ""
                            }`}
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DescriptionSection;
