"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";

interface CTAButton {
    text: string;
    href: string;
    type: "primary" | "secondary";
    icon?: React.ReactNode;
    external?: boolean;
}

interface CTASectionProps {
    buttons: CTAButton[];
}

const CTASection: React.FC<CTASectionProps> = ({ buttons }) => {
    return (
        <div className="container px-4 mx-auto mb-16">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
            >
                <div className="flex flex-col items-center justify-center max-w-2xl gap-6 mx-auto sm:flex-row">
                    {buttons.map((button, index) => {
                        const ButtonComponent = button.external ? "a" : Link;
                        const buttonProps = button.external
                            ? {
                                  href: button.href,
                                  target: "_blank",
                                  rel: "noopener noreferrer",
                              }
                            : { href: button.href };

                        return (
                            <motion.div
                                key={index}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    boxShadow:
                                        button.type === "primary"
                                            ? "0 20px 40px rgba(30, 58, 138, 0.4)"
                                            : "0 20px 40px rgba(30, 58, 138, 0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ButtonComponent
                                    {...buttonProps}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 w-full sm:w-auto justify-center group relative overflow-hidden ${
                                        button.type === "primary"
                                            ? "bg-gradient-to-r from-[#1E3A8A] to-blue-700 text-white"
                                            : "bg-white text-[#1E3A8A] border-2 border-[#1E3A8A]"
                                    }`}
                                >
                                    <motion.div
                                        animate={
                                            button.type === "primary"
                                                ? {
                                                      x: [0, 5, -5, 0],
                                                      rotate: [0, 10, -10, 0],
                                                  }
                                                : { rotate: [0, 10, -10, 0] }
                                        }
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                    >
                                        {button.icon}
                                    </motion.div>
                                    {button.text}
                                    {button.type === "primary" && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            initial={{ x: "-100%" }}
                                            whileHover={{ x: "100%" }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    )}
                                </ButtonComponent>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default CTASection;
