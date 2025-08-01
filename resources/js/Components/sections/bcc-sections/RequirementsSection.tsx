"use client";

import type React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface Requirement {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

interface RequirementsSectionProps {
    title?: string;
    subtitle?: string;
    requirements: Requirement[];
}

const RequirementsSection: React.FC<RequirementsSectionProps> = ({
    title = "Persyaratan Kompetisi",
    subtitle = "Pastikan tim Anda memenuhi semua persyaratan berikut",
    requirements,
}) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <div className="container px-4 mx-auto mb-16">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
            >
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
                        {title}
                    </h2>
                    <p className="text-lg text-gray-600">{subtitle}</p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="p-8 border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl md:p-12 border-white/20"
                >
                    <div className="space-y-6">
                        {requirements.map((requirement, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, x: 10 }}
                                className="flex items-start gap-4 p-6 border border-green-100 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{
                                        duration: 10,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                    }}
                                    className="flex-shrink-0 mt-1"
                                >
                                    {requirement.icon || (
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    )}
                                </motion.div>
                                <div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-800">
                                        {requirement.title}
                                    </h3>
                                    <p className="leading-relaxed text-gray-600">
                                        {requirement.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RequirementsSection;
