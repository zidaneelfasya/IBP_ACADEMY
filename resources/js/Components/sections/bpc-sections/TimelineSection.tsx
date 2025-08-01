"use client";

import type React from "react";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Clock } from "lucide-react";

interface TimelineItem {
    date: string;
    phase: string;
    description: string;
}

interface TimelineSectionProps {
    title?: string;
    items: TimelineItem[];
}

const TimelineSection: React.FC<TimelineSectionProps> = ({
    title = "Timeline",
    items,
}) => {
    const TimelineItem: React.FC<{ item: TimelineItem; index: number }> = ({
        item,
        index,
    }) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={
                    isInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }
                }
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-start gap-6 md:flex-row"
            >
                <div className="flex-shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#1E3A8A] to-blue-600 text-white rounded-full font-bold text-lg shadow-lg"
                    >
                        {index + 1}
                    </motion.div>
                </div>
                <div className="flex-grow w-full">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 shadow-md bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl hover:shadow-lg"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-[#1E3A8A]" />
                            <span className="text-[#1E3A8A] font-semibold">
                                {item.date}
                            </span>
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-800">
                            {item.phase}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                    </motion.div>
                </div>
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
                className="max-w-6xl mx-auto"
            >
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            transition={{
                                duration: 8,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                            }}
                        >
                            <Calendar className="w-8 h-8 text-[#1E3A8A]" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            {title}
                        </h2>
                    </div>
                </div>

                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-8 border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl md:p-12 border-white/20"
                >
                    <div className="space-y-8">
                        {items.map((item, index) => (
                            <TimelineItem
                                key={index}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default TimelineSection;
