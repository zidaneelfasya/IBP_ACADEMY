"use client";

import type React from "react";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { easeInOut } from "framer-motion";

import { Trophy, Award, Sparkles, Target } from "lucide-react";


interface Prize {
    title: string;
    prize: string;
    benefits: string;
    gradient: string;
    icon: string;
}

interface PrizeSectionProps {
    title?: string;
    prizes: Prize[];
    specialAwards?: string[];
}

const PrizeSection: React.FC<PrizeSectionProps> = ({
    title = "Prize & Awarding",
    prizes,
    specialAwards,
}) => {
    const PrizeCard: React.FC<Prize & { delay: number }> = ({
        title,
        prize,
        benefits,
        gradient,
        icon,
        delay,
    }) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true });

        const pulseVariants = {
            initial: { scale: 1 },
            animate: {
                scale: [1, 1.05, 1],
                transition: {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: easeInOut,
                },
            },
        };

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={
                    isInView
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 50, scale: 0.8 }
                }
                transition={{ duration: 0.6, delay }}
                whileHover={{
                    scale: 1.05,
                    y: -10,
                    transition: { duration: 0.2 },
                }}
                className={`${gradient} rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden`}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                    className="absolute top-4 right-4 opacity-20"
                >
                    <Sparkles className="w-8 h-8" />
                </motion.div>

                <motion.div
                    variants={pulseVariants}
                    initial="initial"
                    animate="animate"
                >
                    <Award className="w-16 h-16 mx-auto mb-4" />
                </motion.div>

                <h3 className="mb-2 text-2xl font-bold">
                    {icon} {title}
                </h3>
                <motion.p
                    className="mb-2 text-3xl font-bold"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: delay + 0.3 }}
                >
                    {prize}
                </motion.p>
                <p className="text-sm opacity-90">{benefits}</p>
            </motion.div>
        );
    };

    return (
        <div className="container px-4 mx-auto mb-16">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
            >
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        >
                            <Trophy className="w-8 h-8 text-yellow-500" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            {title}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {prizes.map((prize, index) => (
                        <PrizeCard
                            key={index}
                            {...prize}
                            delay={0.1 * (index + 1)}
                        />
                    ))}
                </div>

                {specialAwards && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-8 mt-8 border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/20"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Target className="w-6 h-6 text-[#1E3A8A]" />
                            <Sparkles className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div className="text-lg text-center text-gray-600">
                            {specialAwards.map((award, index) => (
                                <p
                                    key={index}
                                    className={
                                        index < specialAwards.length - 1
                                            ? "mb-2"
                                            : ""
                                    }
                                >
                                    {award}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default PrizeSection;
