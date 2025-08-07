"use client";
import { motion } from "framer-motion";
import {
    Calendar,
    Users,
    FileText,
    Trophy,
    CheckCircle,
    Clock,
    Sparkles,
    Award,
    Download,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface TimelineEvent {
    id: number;
    title: string;
    date: string;
    description: string;
    icon: React.ComponentType<any>;
    status: "completed" | "upcoming" | "active";
    type:
        | "registration"
        | "preliminary"
        | "semifinal"
        | "final"
        | "announcement";
}

const TimelineSection = () => {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const itemRefs = useRef<{ [key: number]: HTMLElement | null }>({});

    const timelineEvents: TimelineEvent[] = [
        {
            id: 1,
            title: "Phase 1 & 2 Registration",
            date: "August 8 - 21, 2025",
            description:
                "Registration period for all IBP 2025 competition categories",
            icon: Users,
            status: "active",
            type: "registration",
        },
        {
            id: 2,
            title: "Preliminary Round",
            date: "August 15 - 31, 2025",
            description:
                "Initial selection stage with evaluation of participant proposals and documents",
            icon: FileText,
            status: "upcoming",
            type: "preliminary",
        },
        {
            id: 3,
            title: "Semifinal Round",
            date: "September 10 - 23, 2025",
            description:
                "Semifinal stage with presentations and pitching for finalists",
            icon: Trophy,
            status: "upcoming",
            type: "semifinal",
        },
        {
            id: 4,
            title: "Final Round",
            date: "October 25 - 26, 2025",
            description:
                "Grand final of IBP International competition with final judging",
            icon: Award,
            status: "upcoming",
            type: "final",
        },
        {
            id: 5,
            title: "Winners Announcement",
            date: "October 26, 2025",
            description:
                "Awarding night and announcement of IBP 2025 competition champions",
            icon: Sparkles,
            status: "upcoming",
            type: "announcement",
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = parseInt(
                            entry.target.getAttribute("data-timeline-id") || "0"
                        );
                        setVisibleItems((prev) => new Set([...prev, id]));
                    }
                });
            },
            { threshold: 0.3, rootMargin: "50px" }
        );

        Object.values(itemRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const setItemRef = (id: number) => (el: HTMLElement | null) => {
        itemRefs.current[id] = el;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500";
            case "active":
                return "bg-gradient-to-r from-[#FB9F32] to-[#FFE86F]";
            default:
                return "bg-[#1E3A8A]";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "registration":
                return "from-[#1E3A8A] to-blue-600";
            case "preliminary":
                return "from-[#FB9F32] to-[#FFE86F]";
            case "semifinal":
                return "from-[#1E3A8A] to-indigo-600";
            case "final":
                return "from-[#FB9F32] to-yellow-500";
            case "announcement":
                return "from-[#FFE86F] to-yellow-400";
            default:
                return "from-[#1E3A8A] to-blue-600";
        }
    };

    return (
        <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#FB9F32] via-[#FFE86F] to-[#FB9F32]">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0 bg-repeat"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-40 h-40 rounded-full top-20 left-10 bg-white/10 blur-2xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                        x: [0, 20, 0],
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute w-32 h-32 rounded-full bottom-32 right-16 bg-[#1E3A8A]/10 blur-xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.7, 0.4],
                        x: [0, -15, 0],
                        y: [0, 15, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: 1,
                    }}
                />
                <motion.div
                    className="absolute w-24 h-24 rounded-full top-1/2 right-1/4 bg-white/5 blur-lg"
                    animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.2, 0.5, 0.2],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        delay: 2,
                    }}
                />
            </div>

            <div className="relative max-w-6xl px-6 mx-auto">
                {/* Header with Double Layer Typography */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <div className="flex items-center justify-center mb-8 space-x-6">
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="absolute inset-0 bg-[#1E3A8A] rounded-2xl blur-xl opacity-40 animate-pulse" />
                            <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-blue-600 rounded-2xl shadow-2xl">
                                <Clock className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#FB9F32] to-[#FFE86F] rounded-full">
                                    <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                                </div>
                            </div>
                        </motion.div>

                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-[#1E3A8A] mb-2">
                                Competition Timeline
                            </h2>
                            <motion.div
                                className="w-32 h-2 bg-gradient-to-r from-[#1E3A8A] via-[#FB9F32] to-[#FFE86F] rounded-full mx-auto"
                                initial={{ width: 0 }}
                                whileInView={{ width: 128 }}
                                transition={{ duration: 1.2, delay: 0.6 }}
                                viewport={{ once: true }}
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl" />
                            <div className="relative p-8 border shadow-2xl backdrop-blur-sm bg-white/30 border-white/40 rounded-3xl">
                                <p className="text-xl md:text-2xl font-semibold leading-relaxed text-[#1E3A8A]">
                                    Follow the complete schedule of the{" "}
                                    <span className="px-3 py-1 font-bold text-[#1E3A8A] bg-[#FFE86F]/30 rounded-xl border border-[#FB9F32]/30">
                                        IBP 2025
                                    </span>{" "}
                                    competition and make sure you don't miss any
                                    important stages on your journey to success.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Animated Center Line */}
                    <motion.div
                        className="absolute left-[2rem] top-8 w-1 bg-gradient-to-b from-[#1E3A8A] via-[#FB9F32] to-[#1E3A8A] rounded-full md:left-1/2 md:transform md:-translate-x-0.5 shadow-lg"
                        initial={{ height: 0 }}
                        whileInView={{ height: "calc(100% - 4rem)" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        viewport={{ once: true }}
                    />

                    <div className="space-y-16">
                        {timelineEvents.map((event, index) => {
                            const IconComponent = event.icon;
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={event.id}
                                    ref={setItemRef(event.id)}
                                    data-timeline-id={event.id}
                                    initial={{
                                        opacity: 0,
                                        x: isEven ? -80 : 80,
                                        scale: 0.8,
                                        rotateY: isEven ? -15 : 15,
                                    }}
                                    animate={
                                        visibleItems.has(event.id)
                                            ? {
                                                  opacity: 1,
                                                  x: 0,
                                                  scale: 1,
                                                  rotateY: 0,
                                              }
                                            : {
                                                  opacity: 0,
                                                  x: isEven ? -80 : 80,
                                                  scale: 0.8,
                                                  rotateY: isEven ? -15 : 15,
                                              }
                                    }
                                    transition={{
                                        duration: 0.8,
                                        delay: index * 0.15,
                                        type: "spring",
                                        stiffness: 120,
                                        damping: 20,
                                    }}
                                    className={`relative flex items-center ${
                                        isEven
                                            ? "md:justify-start"
                                            : "md:justify-end"
                                    }`}
                                >
                                    {/* Enhanced Timeline Dot */}
                                    <motion.div
                                        className={`absolute left-[2rem] w-8 h-8 rounded-full border-4 border-white shadow-2xl z-10 md:left-1/2 md:transform md:-translate-x-1/2 flex items-center justify-center ${getStatusColor(
                                            event.status
                                        )}`}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={
                                            visibleItems.has(event.id)
                                                ? { scale: 1, rotate: 0 }
                                                : { scale: 0, rotate: -180 }
                                        }
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.15 + 0.4,
                                            type: "spring",
                                            stiffness: 200,
                                        }}
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        <IconComponent className="w-4 h-4 text-white drop-shadow-sm" />

                                        {/* Pulsing rings for active status */}
                                        {event.status === "active" && (
                                            <>
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-[#FB9F32]/30 border-2 border-[#FFE86F]/50"
                                                    animate={{
                                                        scale: [1, 1.8, 1],
                                                        opacity: [1, 0, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-[#FFE86F]/20 border border-[#FB9F32]/30"
                                                    animate={{
                                                        scale: [1, 2.2, 1],
                                                        opacity: [0.8, 0, 0.8],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        delay: 0.5,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            </>
                                        )}
                                    </motion.div>

                                    {/* Enhanced Content Card */}
                                    <div
                                        className={`ml-20 w-full md:w-5/12 ${
                                            isEven ? "" : "md:mr-20 md:ml-0"
                                        }`}
                                    >
                                        <motion.div
                                            whileHover={{
                                                y: -8,
                                                scale: 1.03,
                                                rotateX: 5,
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="group"
                                            style={{ perspective: "1000px" }}
                                        >
                                            <div
                                                className="relative overflow-hidden transition-all duration-500 bg-white border shadow-2xl border-white/50 rounded-3xl group-hover:border-[#FB9F32]/30"
                                                style={{
                                                    boxShadow:
                                                        "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.boxShadow =
                                                        "0 35px 60px -12px rgba(0, 0, 0, 0.25)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.boxShadow =
                                                        "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
                                                }}
                                            >
                                                {/* Gradient overlay on hover */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-br from-[#FB9F32]/5 to-[#FFE86F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    initial={false}
                                                />

                                                {/* Glassmorphism effect */}
                                                <div className="absolute inset-0 pointer-events-none rounded-3xl bg-gradient-to-br from-white/60 via-white/20 to-transparent" />

                                                <div className="relative p-8">
                                                    <div className="flex items-start gap-6">
                                                        <motion.div
                                                            className={`p-4 rounded-2xl bg-gradient-to-br ${getTypeColor(
                                                                event.type
                                                            )} text-white shadow-xl ring-4 ring-white/50`}
                                                            whileHover={{
                                                                scale: 1.15,
                                                                rotate: 8,
                                                                boxShadow:
                                                                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                                            }}
                                                            transition={{
                                                                duration: 0.3,
                                                            }}
                                                        >
                                                            <IconComponent className="w-6 h-6" />
                                                        </motion.div>

                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <motion.span
                                                                    className={`px-4 py-2 text-sm font-bold rounded-full border-2 shadow-sm ${
                                                                        event.status ===
                                                                        "active"
                                                                            ? "bg-gradient-to-r from-[#FB9F32] to-[#FFE86F] text-[#1E3A8A] border-[#FB9F32]/30"
                                                                            : event.status ===
                                                                              "completed"
                                                                            ? "bg-green-50 text-green-800 border-green-200"
                                                                            : "bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20"
                                                                    }`}
                                                                    whileHover={{
                                                                        scale: 1.05,
                                                                    }}
                                                                >
                                                                    {event.status ===
                                                                    "active"
                                                                        ? "🔥 Ongoing Now"
                                                                        : event.status ===
                                                                          "completed"
                                                                        ? "✅ Completed"
                                                                        : "⏳ Upcoming"}
                                                                </motion.span>
                                                            </div>

                                                            <h3 className="text-2xl font-black text-[#1E3A8A] mb-4 group-hover:text-blue-700 transition-colors duration-300">
                                                                {event.title}
                                                            </h3>

                                                            <motion.div
                                                                className="flex items-center gap-3 p-4 mb-4 border-2 rounded-2xl bg-gradient-to-r from-[#FFE86F]/20 to-[#FB9F32]/20 border-[#FB9F32]/30 shadow-inner"
                                                                whileHover={{
                                                                    scale: 1.02,
                                                                }}
                                                            >
                                                                <Calendar className="w-5 h-5 text-[#FB9F32]" />
                                                                <p className="text-lg font-bold text-[#1E3A8A]">
                                                                    {event.date}
                                                                </p>
                                                            </motion.div>

                                                            <p className="text-base font-medium leading-relaxed text-gray-700 transition-colors duration-300 group-hover:text-gray-800">
                                                                {
                                                                    event.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-center mb-8 space-x-6 mt-16">
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="absolute inset-0 bg-[#1E3A8A] rounded-2xl blur-xl opacity-40 animate-pulse" />
                        <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-blue-600 rounded-2xl shadow-2xl">
                            <Download className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2">
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#FB9F32] to-[#FFE86F] rounded-full">
                                <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                            </div>
                        </div>
                    </motion.div>

                    <div>
                        <h2 className="text-4xl md:text-6xl font-black text-[#1E3A8A] mb-2">
                            View Timeline Posters
                        </h2>
                        <motion.div
                            className="w-32 h-2 bg-gradient-to-r from-[#1E3A8A] via-[#FB9F32] to-[#FFE86F] rounded-full mx-auto"
                            initial={{ width: 0 }}
                            whileInView={{ width: 128 }}
                            transition={{ duration: 1.2, delay: 0.6 }}
                            viewport={{ once: true }}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-8 mt-16">
                    {/* Poster 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 max-w-md"
                    >
                        <div className="relative group">
                            {/* Glassmorphism Card - made clickable */}
                            <a
                                href="/image/poster/bpc.png"
                                download="IBP_Timeline_Poster_BPC.png"
                                className="relative overflow-hidden bg-white/30 backdrop-blur-sm border border-white/40 rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl block"
                            >
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FB9F32]/10 to-[#1E3A8A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Poster Image */}
                                <div className="p-6">
                                    <div className="relative overflow-hidden rounded-2xl shadow-lg">
                                        <img
                                            src="/image/poster/bpc.png"
                                            alt="IBP 2025 Timeline Poster"
                                            className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Overlay effect */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Download Indicator */}
                                    <div className="flex justify-center mt-6">
                                        <div className="flex items-center justify-center gap-3 px-4 py-2 bg-gradient-to-r from-[#1E3A8A] via-blue-600 to-[#1E3A8A] text-white font-bold text-sm rounded-xl shadow-2xl border-2 border-white/20">
                                            <Download className="w-4 h-4" />
                                            Click to Download
                                        </div>
                                    </div>
                                </div>
                            </a>

                            {/* Floating decoration */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FFE86F]/30 rounded-full blur-xl group-hover:opacity-80 transition-opacity duration-300" />
                        </div>
                    </motion.div>

                    {/* Poster 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2 max-w-md"
                    >
                        <div className="relative group">
                            {/* Glassmorphism Card - made clickable */}
                            <a
                                href="/image/poster/bcc.png"
                                download="IBP_Timeline_Poster_BCC.png"
                                className="relative overflow-hidden bg-white/30 backdrop-blur-sm border border-white/40 rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl block"
                            >
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFE86F]/10 to-[#FB9F32]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Poster Image */}
                                <div className="p-6">
                                    <div className="relative overflow-hidden rounded-2xl shadow-lg">
                                        <img
                                            src="/image/poster/bcc.png"
                                            alt="IBP Detailed Timeline Poster"
                                            className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Overlay effect */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Download Indicator */}
                                    <div className="flex justify-center mt-6">
                                        <div className="flex items-center justify-center gap-3 px-4 py-2 bg-gradient-to-r from-[#1E3A8A] via-blue-600 to-[#1E3A8A] text-white font-bold text-sm rounded-xl shadow-2xl border-2 border-white/20">
                                            <Download className="w-4 h-4" />
                                            Click to Download
                                        </div>
                                    </div>
                                </div>
                            </a>

                            {/* Floating decoration */}
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#1E3A8A]/20 rounded-full blur-xl group-hover:opacity-80 transition-opacity duration-300" />
                        </div>
                    </motion.div>
                </div>

                {/* Enhanced CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <motion.a
                        href="/timeline"
                        whileHover={{
                            scale: 1.08,
                            y: -4,
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#1E3A8A] via-blue-600 to-[#1E3A8A] text-white font-bold text-lg rounded-3xl shadow-2xl transition-all duration-300 border-2 border-white/20"
                        style={{
                            boxShadow:
                                "0 25px 50px -12px rgba(30, 58, 138, 0.25)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                                "0 35px 60px -12px rgba(30, 58, 138, 0.35)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow =
                                "0 25px 50px -12px rgba(30, 58, 138, 0.25)";
                        }}
                    >
                        <Calendar className="w-6 h-6" />
                        View Full Timeline
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            →
                        </motion.div>
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default TimelineSection;
