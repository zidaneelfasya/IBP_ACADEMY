"use client";

import type React from "react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Stat {
    number: number;
    label: string;
    suffix?: string;
    prefix?: string;
    icon?: React.ReactNode;
}

interface StatsSectionProps {
    title?: string;
    subtitle?: string;
    stats: Stat[];
    backgroundColor?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({
    title = "Statistik Kompetisi",
    subtitle,
    stats,
    backgroundColor = "bg-gradient-to-r from-[#1E3A8A] to-blue-700",
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const Counter: React.FC<{ stat: Stat; delay: number }> = ({
        stat,
        delay,
    }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (isInView) {
                const timer = setTimeout(() => {
                    const duration = 2000;
                    const steps = 60;
                    const increment = stat.number / steps;
                    let current = 0;

                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= stat.number) {
                            setCount(stat.number);
                            clearInterval(counter);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, duration / steps);

                    return () => clearInterval(counter);
                }, delay);

                return () => clearTimeout(timer);
            }
        }, [isInView, stat.number, delay]);

        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.6, delay }}
                className="text-center"
            >
                {stat.icon && (
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="flex justify-center mb-4"
                    >
                        {stat.icon}
                    </motion.div>
                )}
                <motion.div
                    className="mb-2 text-4xl font-bold text-white md:text-5xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                >
                    {stat.prefix}
                    {count}
                    {stat.suffix}
                </motion.div>
                <p className="text-lg font-medium text-blue-100">
                    {stat.label}
                </p>
            </motion.div>
        );
    };

    return (
        <div className="container px-4 mx-auto mb-16">
            <motion.div
                ref={ref}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`${backgroundColor} rounded-3xl shadow-2xl p-8 md:p-12`}
            >
                {title && (
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-lg text-blue-100">{subtitle}</p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Counter key={index} stat={stat} delay={index * 0.2} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default StatsSection;
