"use client";

import {
    Calendar,
    Users,
    FileText,
    Trophy,
    CheckCircle,
    Clock,
    MapPin,
    Sparkles,
    Star,
    Award,
    Zap,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { motion } from "framer-motion";
import { Head } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { useEffect, useRef, useState } from "react";

const timelineEvents = [
    {
        id: 1,
        title: "Registrasi Tahap 1",
        date: "08 - 14 Agustus 2025",
        description: "Periode pendaftaran awal untuk peserta lomba IBP 2025",
        type: "registration",
        icon: Users,
        status: "upcoming",
    },
    {
        id: 2,
        title: "Registrasi Tahap 2",
        date: "15 - 21 Agustus 2025",
        description: "Periode pendaftaran tahap kedua",
        type: "registration",
        icon: Users,
        status: "upcoming",
    },
    {
        id: 3,
        title: "Technical Meeting Preliminary Round",
        date: "24 Agustus 2025",
        description: "Pertemuan teknis untuk babak penyisihan",
        type: "meeting",
        icon: FileText,
        status: "upcoming",
    },
    {
        id: 4,
        title: "Preliminary Round",
        date: "15 - 31 Agustus 2025",
        description:
            "Case Release (15 Agustus) • Materi (15 Agustus) • Batas pengumpulan (31 Agustus)",
        type: "competition",
        icon: Trophy,
        status: "upcoming",
        details: [
            "Case Release: 15 Agustus 2025",
            "Materi: 15 Agustus 2025",
            "Batas pengumpulan: 31 Agustus 2025",
        ],
    },
    {
        id: 5,
        title: "Penilaian Preliminary Round",
        date: "04 - 08 September 2025",
        description: "Periode penilaian babak penyisihan",
        type: "evaluation",
        icon: CheckCircle,
        status: "upcoming",
    },
    {
        id: 6,
        title: "Pengumuman Semifinalis",
        date: "09 September 2025",
        description: "Pengumuman peserta yang lolos ke babak semifinal",
        type: "announcement",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 7,
        title: "Registrasi Ulang Tahap 1",
        date: "09 - 13 September 2025",
        description: "Pendaftaran ulang untuk semifinalis tahap pertama",
        type: "registration",
        icon: Users,
        status: "upcoming",
    },
    {
        id: 8,
        title: "Registrasi Ulang Tahap 2",
        date: "14 - 16 September 2025",
        description: "Pendaftaran ulang untuk semifinalis tahap kedua",
        type: "registration",
        icon: Users,
        status: "upcoming",
    },
    {
        id: 9,
        title: "Pengumpulan Semifinalis",
        date: "10 - 23 September 2025",
        description:
            "Case release BCC (10 Sept) • Materi BPC and BCC (10 Sept) • Batas pengumpulan (23 Sept)",
        type: "competition",
        icon: Trophy,
        status: "upcoming",
        details: [
            "Case release BCC: 10 September 2025",
            "Materi BPC and BCC: 10 September 2025",
            "Batas pengumpulan: 23 September 2025",
        ],
    },
    {
        id: 10,
        title: "Penilaian Semifinalis",
        date: "24 - 28 September 2025",
        description: "Periode penilaian babak semifinal",
        type: "evaluation",
        icon: CheckCircle,
        status: "upcoming",
    },
    {
        id: 11,
        title: "Pengumuman Finalis",
        date: "30 September 2025",
        description: "Pengumuman peserta yang lolos ke babak final",
        type: "announcement",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 12,
        title: "Pengumpulan Finalis",
        date: "01 - 20 Oktober 2025",
        description: "Periode pengumpulan tugas untuk finalis",
        type: "competition",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 13,
        title: "Technical Meeting Final Round",
        date: "03 Oktober 2025",
        description: "Pertemuan teknis untuk babak final",
        type: "meeting",
        icon: FileText,
        status: "upcoming",
    },
    {
        id: 14,
        title: "Mentoring Session",
        date: "04, 05, 11, 12, 18 Oktober 2025",
        description: "Sesi mentoring untuk finalis",
        type: "mentoring",
        icon: Users,
        status: "upcoming",
    },
    {
        id: 15,
        title: "Day 1 IBP Internasional",
        date: "25 Oktober 2025",
        description: "Hari pertama kompetisi IBP Internasional",
        type: "final",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 16,
        title: "Day 2 IBP Internasional",
        date: "26 Oktober 2025",
        description: "Hari kedua kompetisi IBP Internasional",
        type: "final",
        icon: Trophy,
        status: "upcoming",
    },
];

const getTypeColor = (type: string) => {
    switch (type) {
        case "registration":
            return "bg-gradient-to-r from-blue-500 to-blue-600";
        case "meeting":
            return "bg-gradient-to-r from-purple-500 to-purple-600";
        case "competition":
            return "bg-gradient-to-r from-green-500 to-green-600";
        case "evaluation":
            return "bg-gradient-to-r from-orange-500 to-orange-600";
        case "announcement":
            return "bg-gradient-to-r from-red-500 to-red-600";
        case "mentoring":
            return "bg-gradient-to-r from-indigo-500 to-indigo-600";
        case "final":
            return "bg-gradient-to-r from-yellow-500 to-yellow-600";
        default:
            return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
};

const getTypeBadge = (type: string) => {
    switch (type) {
        case "registration":
            return "Registrasi";
        case "meeting":
            return "Meeting";
        case "competition":
            return "Kompetisi";
        case "evaluation":
            return "Penilaian";
        case "announcement":
            return "Pengumuman";
        case "mentoring":
            return "Mentoring";
        case "final":
            return "Final";
        default:
            return "Event";
    }
};

const getTypeGlow = (type: string) => {
    switch (type) {
        case "registration":
            return "shadow-blue-500/50";
        case "meeting":
            return "shadow-purple-500/50";
        case "competition":
            return "shadow-green-500/50";
        case "evaluation":
            return "shadow-orange-500/50";
        case "announcement":
            return "shadow-red-500/50";
        case "mentoring":
            return "shadow-indigo-500/50";
        case "final":
            return "shadow-yellow-500/50";
        default:
            return "shadow-gray-500/50";
    }
};

export default function RundownPage() {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const timelineRefs = useRef<{ [key: number]: HTMLElement | null }>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = Number.parseInt(
                            entry.target.getAttribute("data-timeline-id") || "0"
                        );
                        setVisibleItems((prev) => new Set([...prev, id]));
                    }
                });
            },
            { threshold: 0.1, rootMargin: "50px" }
        );

        Object.values(timelineRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const setTimelineRef = (id: number) => (el: HTMLElement | null) => {
        timelineRefs.current[id] = el;
    };

    const isVisible = (id: number) => visibleItems.has(id);

    return (
        <div className="min-h-screen">
            <Navbar />
            <Head title="Timeline IBP 2025" />

            {/* Hero Section with Background */}
            <section className="relative min-h-screen overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 z-0 bg-[url('/image/auth/screen2.png')] bg-cover bg-center bg-no-repeat" />

                {/* Yellow gradient overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#FB9F32] to-[#FFE86F]" />

                {/* Enhanced animated geometric elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Floating particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-white/20"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: Math.random() * 2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Geometric shapes */}
                    <motion.div
                        className="absolute w-20 h-20 border-2 border-white/20 top-20 left-20"
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />

                    <motion.div
                        className="absolute w-16 h-16 rounded-full bg-white/10 top-1/3 right-1/4"
                        animate={{
                            y: [0, -20, 0],
                            x: [0, 10, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="space-y-8"
                        >
                            {/* Enhanced Title with Double Layer Typography */}
                            <div className="space-y-4">
                                <motion.h1
                                    className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#1E3A8A] tracking-tight"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    Timeline
                                </motion.h1>

                                <div className="relative">
                                    {/* Background layer */}
                                    <motion.span
                                        className="absolute inset-0 text-6xl md:text-7xl lg:text-8xl font-black text-[#1E3A8A]/20 blur-sm"
                                        initial={{ opacity: 0, x: -3, y: 3 }}
                                        animate={{ opacity: 1, x: -3, y: 3 }}
                                        transition={{ duration: 1, delay: 0.4 }}
                                    >
                                        IBP 2025
                                    </motion.span>

                                    {/* Foreground layer */}
                                    <motion.span
                                        className="relative block text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-[#1E3A8A] via-blue-600 to-[#1E3A8A] bg-clip-text text-transparent drop-shadow-2xl"
                                        style={{
                                            WebkitTextStroke:
                                                "2px rgba(255, 255, 255, 0.9)",
                                        }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 1, delay: 0.6 }}
                                    >
                                        IBP 2025
                                    </motion.span>

                                    {/* Decorative elements */}
                                    <motion.div
                                        className="absolute text-2xl -top-4 -right-4"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{
                                            duration: 8,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "linear",
                                        }}
                                    >
                                        ✨
                                    </motion.div>
                                    <motion.div
                                        className="absolute text-2xl -bottom-4 -left-4"
                                        animate={{ rotate: [360, 0] }}
                                        transition={{
                                            duration: 6,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "linear",
                                        }}
                                    >
                                        🚀
                                    </motion.div>
                                </div>
                            </div>

                            {/* Enhanced Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="relative group">
                                    <div className="absolute inset-0 transition-all duration-500 bg-white/20 rounded-3xl blur-lg group-hover:blur-xl" />
                                    <div className="relative p-6 transition-all duration-500 border shadow-lg bg-white/30 backdrop-blur-sm border-white/20 rounded-3xl md:p-8 hover:bg-white/40">
                                        <p className="text-lg font-medium leading-relaxed text-[#1E3A8A] md:text-xl lg:text-2xl">
                                            Ikuti jadwal lengkap kompetisi{" "}
                                            <span className="px-3 py-1 font-bold text-[#1E3A8A] bg-[#F59E0B]/20 rounded-xl border border-[#F59E0B]/30">
                                                International Business Project
                                                2025
                                            </span>
                                            . Pastikan Anda tidak melewatkan
                                            setiap tahapan penting dalam lomba
                                            ini.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Enhanced Timeline Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-[#1E3A8A]/5 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-[#FB9F32]/5 rounded-full -top-48 -left-48 blur-3xl" />
                    <div className="absolute w-96 h-96 bg-[#1E3A8A]/5 rounded-full -bottom-48 -right-48 blur-3xl" />
                </div>

                <div className="relative max-w-6xl px-4 mx-auto">
                    {/* Enhanced Timeline Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mb-20 text-center"
                    >
                        <div className="flex items-center justify-center mb-8 space-x-6">
                            <motion.div
                                className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-blue-600 rounded-2xl shadow-xl"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Clock className="w-10 h-10 text-white" />
                                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl animate-pulse" />
                            </motion.div>

                            <div>
                                <h2 className="text-4xl md:text-6xl font-black text-[#1E3A8A] mb-2">
                                    Jadwal Kegiatan
                                </h2>
                                <motion.div
                                    className="w-32 h-2 bg-gradient-to-r from-[#1E3A8A] via-blue-400 to-[#1E3A8A] rounded-full mx-auto"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: 128 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    viewport={{ once: true }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Enhanced Timeline */}
                    <div className="relative">
                        {/* Animated timeline line */}
                        <motion.div
                            className="absolute left-8 top-0 w-1 bg-gradient-to-b from-[#1E3A8A] via-[#F59E0B] to-[#1E3A8A] rounded-full lg:left-1/2 lg:transform lg:-translate-x-1/2 overflow-hidden"
                            initial={{ height: 0 }}
                            whileInView={{ height: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            viewport={{ once: true }}
                        >
                            {/* Flowing animation */}
                            <motion.div
                                className="w-full h-20 bg-gradient-to-b from-white/50 to-transparent"
                                animate={{ y: ["-100%", "2000%"] }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                            />
                        </motion.div>

                        {/* Timeline events */}
                        <div className="space-y-16">
                            {timelineEvents.map((event, index) => {
                                const IconComponent = event.icon;
                                const isEven = index % 2 === 0;

                                return (
                                    <motion.div
                                        key={event.id}
                                        ref={setTimelineRef(event.id)}
                                        data-timeline-id={event.id}
                                        initial={{
                                            opacity: 0,
                                            x: isEven ? -100 : 100,
                                            scale: 0.8,
                                        }}
                                        animate={
                                            isVisible(event.id)
                                                ? { opacity: 1, x: 0, scale: 1 }
                                                : {
                                                      opacity: 0,
                                                      x: isEven ? -100 : 100,
                                                      scale: 0.8,
                                                  }
                                        }
                                        transition={{
                                            duration: 0.8,
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 100,
                                        }}
                                        className={`relative flex items-center ${
                                            isEven
                                                ? "lg:justify-start"
                                                : "lg:justify-end"
                                        }`}
                                        onMouseEnter={() =>
                                            setHoveredCard(event.id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredCard(null)
                                        }
                                    >
                                        {/* Enhanced Timeline dot */}
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={
                                                isVisible(event.id)
                                                    ? { scale: 1, rotate: 0 }
                                                    : { scale: 0, rotate: -180 }
                                            }
                                            transition={{
                                                duration: 0.6,
                                                delay: index * 0.1 + 0.3,
                                                type: "spring",
                                                stiffness: 200,
                                            }}
                                            className={`absolute left-[1.75rem] w-8 h-8 rounded-full ${getTypeColor(
                                                event.type
                                            )} border-4 border-white shadow-xl z-10 lg:left-1/2 lg:transform lg:-translate-x-1/2 flex items-center justify-center ${getTypeGlow(
                                                event.type
                                            )} shadow-2xl`}
                                        >
                                            <IconComponent className="w-4 h-4 text-white" />

                                            {/* Pulsing ring */}
                                            <motion.div
                                                className="absolute inset-0 border-2 rounded-full border-white/50"
                                                animate={{
                                                    scale: [1, 1.5, 1],
                                                    opacity: [1, 0, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    ease: "easeInOut",
                                                }}
                                            />
                                        </motion.div>

                                        {/* Enhanced Event card */}
                                        <div
                                            className={`ml-20 w-full lg:w-5/12 ${
                                                isEven ? "" : "lg:mr-20 lg:ml-0"
                                            }`}
                                        >
                                            <motion.div
                                                whileHover={{
                                                    y: -8,
                                                    scale: 1.02,
                                                    rotateY: isEven ? 2 : -2,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    type: "spring",
                                                    stiffness: 300,
                                                }}
                                                style={{
                                                    transformStyle:
                                                        "preserve-3d",
                                                }}
                                            >
                                                <Card
                                                    className={`transition-all duration-500 shadow-xl hover:shadow-2xl bg-white/95 backdrop-blur-sm border-white/50 overflow-hidden group ${
                                                        hoveredCard === event.id
                                                            ? getTypeGlow(
                                                                  event.type
                                                              ) + " shadow-2xl"
                                                            : ""
                                                    }`}
                                                >
                                                    {/* Card glow effect */}
                                                    <motion.div
                                                        className={`absolute inset-0 ${getTypeColor(
                                                            event.type
                                                        )} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                                        initial={{ opacity: 0 }}
                                                        whileHover={{
                                                            opacity: 0.05,
                                                        }}
                                                    />

                                                    <CardHeader className="relative pb-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-start flex-1 gap-4">
                                                                <motion.div
                                                                    className={`p-4 rounded-xl ${getTypeColor(
                                                                        event.type
                                                                    )} text-white shadow-lg relative overflow-hidden`}
                                                                    whileHover={{
                                                                        scale: 1.1,
                                                                        rotate: 5,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                    }}
                                                                >
                                                                    <IconComponent className="relative z-10 w-6 h-6" />

                                                                    {/* Icon background animation */}
                                                                    <motion.div
                                                                        className="absolute inset-0 bg-white/20"
                                                                        animate={{
                                                                            scale: [
                                                                                1,
                                                                                1.2,
                                                                                1,
                                                                            ],
                                                                            opacity:
                                                                                [
                                                                                    0,
                                                                                    0.3,
                                                                                    0,
                                                                                ],
                                                                        }}
                                                                        transition={{
                                                                            duration: 2,
                                                                            repeat: Number.POSITIVE_INFINITY,
                                                                            ease: "easeInOut",
                                                                        }}
                                                                    />
                                                                </motion.div>

                                                                <div className="flex-1">
                                                                    <CardTitle className="mb-3 text-xl font-bold text-gray-900 group-hover:text-[#1E3A8A] transition-colors duration-300">
                                                                        {
                                                                            event.title
                                                                        }
                                                                    </CardTitle>

                                                                    <motion.div
                                                                        className="flex items-center gap-2 mb-2"
                                                                        whileHover={{
                                                                            x: 5,
                                                                        }}
                                                                        transition={{
                                                                            duration: 0.2,
                                                                        }}
                                                                    >
                                                                        <Calendar className="w-4 h-4 text-[#F59E0B]" />
                                                                        <span className="text-sm font-semibold text-[#1E3A8A]">
                                                                            {
                                                                                event.date
                                                                            }
                                                                        </span>
                                                                    </motion.div>
                                                                </div>
                                                            </div>

                                                            <motion.div
                                                                whileHover={{
                                                                    scale: 1.1,
                                                                }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                }}
                                                            >
                                                                <Badge
                                                                    variant="secondary"
                                                                    className={`text-xs font-medium ${getTypeColor(
                                                                        event.type
                                                                    )} text-white border-0 shadow-lg`}
                                                                >
                                                                    {getTypeBadge(
                                                                        event.type
                                                                    )}
                                                                </Badge>
                                                            </motion.div>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent>
                                                        <CardDescription className="mb-4 text-base leading-relaxed text-gray-700">
                                                            {event.description}
                                                        </CardDescription>

                                                        {/* Enhanced details section */}
                                                        {event.details && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    height: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    height: "auto",
                                                                }}
                                                                transition={{
                                                                    duration: 0.5,
                                                                    delay: 0.2,
                                                                }}
                                                                className="bg-gradient-to-r from-[#1E3A8A]/5 to-[#F59E0B]/5 rounded-xl p-5 mt-4 border border-[#1E3A8A]/10 relative overflow-hidden"
                                                            >
                                                                {/* Background pattern */}
                                                                <div className="absolute inset-0 opacity-5">
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1E3A8A]/20 to-transparent transform -skew-x-12" />
                                                                </div>

                                                                <motion.h4
                                                                    className="text-sm font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2"
                                                                    whileHover={{
                                                                        x: 5,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.2,
                                                                    }}
                                                                >
                                                                    <MapPin className="w-4 h-4" />
                                                                    Detail
                                                                    Kegiatan:
                                                                </motion.h4>

                                                                <ul className="space-y-3">
                                                                    {event.details.map(
                                                                        (
                                                                            detail,
                                                                            idx
                                                                        ) => (
                                                                            <motion.li
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                initial={{
                                                                                    opacity: 0,
                                                                                    x: -20,
                                                                                }}
                                                                                animate={{
                                                                                    opacity: 1,
                                                                                    x: 0,
                                                                                }}
                                                                                transition={{
                                                                                    duration: 0.4,
                                                                                    delay:
                                                                                        idx *
                                                                                        0.1,
                                                                                }}
                                                                                whileHover={{
                                                                                    x: 5,
                                                                                    scale: 1.02,
                                                                                }}
                                                                                className="flex items-start gap-3 p-2 text-sm text-gray-700 transition-all duration-300 rounded-lg hover:bg-white/50"
                                                                            >
                                                                                <motion.div
                                                                                    className={`w-3 h-3 ${getTypeColor(
                                                                                        event.type
                                                                                    )} rounded-full mt-1 flex-shrink-0`}
                                                                                    animate={{
                                                                                        scale: [
                                                                                            1,
                                                                                            1.2,
                                                                                            1,
                                                                                        ],
                                                                                    }}
                                                                                    transition={{
                                                                                        duration: 2,
                                                                                        repeat: Number.POSITIVE_INFINITY,
                                                                                        delay:
                                                                                            idx *
                                                                                            0.2,
                                                                                    }}
                                                                                />
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        detail
                                                                                    }
                                                                                </span>
                                                                            </motion.li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </motion.div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Enhanced Footer info */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="mt-24"
                    >
                        <Card className="bg-gradient-to-r from-[#1E3A8A] via-blue-600 to-[#1E3A8A] text-white shadow-2xl overflow-hidden relative">
                            {/* Background animation */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                            />

                            <CardContent className="relative z-10 p-10 text-center">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{
                                            duration: 4,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                    >
                                        <Trophy className="w-16 h-16 mx-auto mb-6 text-[#F59E0B]" />
                                    </motion.div>

                                    <h3 className="mb-6 text-3xl font-bold">
                                        Informasi Penting
                                    </h3>

                                    <p className="max-w-4xl mx-auto text-lg leading-relaxed text-blue-100">
                                        Pastikan untuk selalu memantau timeline
                                        ini dan mengikuti setiap tahapan sesuai
                                        jadwal. Jangan lewatkan kesempatan untuk
                                        menjadi bagian dari kompetisi bergengsi
                                        ini. Untuk informasi lebih lanjut,
                                        silakan hubungi panitia penyelenggara.
                                    </p>

                                    {/* Decorative elements */}
                                    <div className="flex justify-center mt-8 space-x-4">
                                        {[Sparkles, Star, Award, Zap].map(
                                            (Icon, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    animate={{
                                                        y: [0, -10, 0],
                                                        rotate: [0, 180, 360],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        delay: idx * 0.5,
                                                        repeat: Number.POSITIVE_INFINITY,
                                                    }}
                                                >
                                                    <Icon className="w-6 h-6 text-[#F59E0B]" />
                                                </motion.div>
                                            )
                                        )}
                                    </div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }

                /* Enhanced shadows */
                .shadow-3xl {
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                }

                /* Smooth transitions */
                .transition-all {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Enhanced backdrop blur */
                .backdrop-blur-sm {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #1E3A8A, #F59E0B);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #F59E0B, #1E3A8A);
                }

                /* Card hover effects */
                .group:hover .group-hover\\:opacity-5 {
                    opacity: 0.05;
                }

                /* Timeline line animation */
                @keyframes flow {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(2000%); }
                }

                /* Responsive improvements */
                @media (max-width: 768px) {
                    .timeline-card {
                        margin-left: 2rem;
                        width: calc(100% - 2rem);
                    }
                }
            `}</style>
        </div>
    );
}
