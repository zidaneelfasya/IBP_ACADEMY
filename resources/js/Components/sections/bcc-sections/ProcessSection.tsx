"use client";

import type React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

interface ProcessStep {
    title: string;
    description: string;
    icon?: React.ReactNode;
    color?: string;
}

interface ProcessSectionProps {
    title?: string;
    subtitle?: string;
    steps: ProcessStep[];
}

const ProcessSection: React.FC<ProcessSectionProps> = ({
    title = "Alur Kompetisi",
    subtitle = "Ikuti langkah-langkah berikut untuk mengikuti kompetisi",
    steps,
}) => {
    const ProcessStep: React.FC<{
        step: ProcessStep;
        index: number;
        isLast: boolean;
    }> = ({ step, index, isLast }) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });

        return (
            <div className="flex items-center">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={
                        isInView
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.5 }
                    }
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="flex flex-col items-center"
                >
                    {/* Step Circle */}
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                            step.color ||
                            "bg-gradient-to-r from-[#1E3A8A] to-blue-600"
                        }`}
                    >
                        {step.icon || index + 1}
                    </motion.div>

                    {/* Step Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                            isInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 20 }
                        }
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                        className="max-w-xs mt-6 text-center"
                    >
                        <h3 className="mb-2 text-lg font-bold text-gray-800">
                            {step.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-600">
                            {step.description}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Arrow */}
                {!isLast && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                            isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -20 }
                        }
                        transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                        className="hidden mx-8 lg:block"
                    >
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                        >
                            <ArrowRight className="w-8 h-8 text-gray-400" />
                        </motion.div>
                    </motion.div>
                )}
            </div>
        );
    };

    return (
        <div className="container px-4 mx-auto mb-16">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto"
            >
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
                        {title}
                    </h2>
                    <p className="text-lg text-gray-600">{subtitle}</p>
                </div>

                <div className="p-8 border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl md:p-12 border-white/20">
                    <div className="flex flex-col items-center justify-center space-y-12 lg:flex-row lg:space-y-0">
                        {steps.map((step, index) => (
                            <ProcessStep
                                key={index}
                                step={step}
                                index={index}
                                isLast={index === steps.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProcessSection;
