"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Instagram } from "lucide-react";

interface ContactPerson {
    name: string;
    whatsapp: string;
    instagram?: string;
    line?: string;
}

interface ContactSectionProps {
    title?: string;
    subtitle?: string;
    contacts: ContactPerson[];
}

const ContactSection: React.FC<ContactSectionProps> = ({
    title = "Contact Person",
    subtitle = "Hubungi kami untuk informasi lebih lanjut",
    contacts,
}) => {
    return (
        <div className="container px-4 mx-auto">
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
                                rotate: [0, 15, -15, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        >
                            <Phone className="w-8 h-8 text-[#1E3A8A]" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            {title}
                        </h2>
                    </div>
                    <p className="text-gray-600">{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {contacts.map((contact, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.02,
                                y: -5,
                                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                            }}
                            className="p-8 border shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/20"
                        >
                            <motion.h3
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1 + 0.2,
                                }}
                                className="mb-6 text-xl font-bold text-center text-gray-800"
                            >
                                {contact.name}
                            </motion.h3>

                            <div className="space-y-4">
                                <motion.a
                                    href={`https://wa.me/${contact.whatsapp.replace(
                                        /[^0-9]/g,
                                        ""
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-3 p-4 transition-colors duration-200 bg-green-50 rounded-2xl hover:bg-green-100"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                    >
                                        <MessageCircle className="w-6 h-6 text-green-600" />
                                    </motion.div>
                                    <div>
                                        <p className="font-semibold text-green-800">
                                            WhatsApp
                                        </p>
                                        <p className="text-green-600">
                                            {contact.whatsapp}
                                        </p>
                                    </div>
                                </motion.a>

                                {contact.instagram && (
                                    <motion.a
                                        href={`https://instagram.com/${contact.instagram.replace(
                                            "@",
                                            ""
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center gap-3 p-4 transition-colors duration-200 bg-pink-50 rounded-2xl hover:bg-pink-100"
                                    >
                                        <motion.div
                                            animate={{
                                                rotate: [0, -10, 10, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                            }}
                                        >
                                            <Instagram className="w-6 h-6 text-pink-600" />
                                        </motion.div>
                                        <div>
                                            <p className="font-semibold text-pink-800">
                                                Instagram
                                            </p>
                                            <p className="text-pink-600">
                                                {contact.instagram}
                                            </p>
                                        </div>
                                    </motion.a>
                                )}

                                {contact.line && (
                                    <motion.div
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl"
                                    >
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                            }}
                                        >
                                            <MessageCircle className="w-6 h-6 text-green-600" />
                                        </motion.div>
                                        <div>
                                            <p className="font-semibold text-green-800">
                                                LINE
                                            </p>
                                            <p className="text-green-600">
                                                {contact.line}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default ContactSection;
