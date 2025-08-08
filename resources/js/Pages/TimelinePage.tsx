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

const businessPlanTimeline = [
    {
        id: 1,
        title: "Registration",
        date: "August 8 - 21, 2025",
        description: "Registration period for Business Plan Competition",
        type: "registration",
        icon: Users,
        status: "active",
    },
    {
        id: 2,
        title: "Technical Meeting Preliminary Round",
        date: "August 24, 2025",
        description: "Technical meeting for preliminary round",
        type: "meeting",
        icon: FileText,
        status: "upcoming",
    },
    {
        id: 3,
        title: "Preliminary Round (BMC Submission)",
        date: "August 15 - 31, 2025",
        description: "Business Model Canvas submission period",
        type: "competition",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 4,
        title: "Semifinalist Announcement",
        date: "September 9, 2025",
        description: "Announcement of participants advancing to semifinals",
        type: "announcement",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 5,
        title: "Re-registration",
        date: "September 9 - 16, 2025",
        description: "Re-registration period for semifinalists",
        type: "registration",
        icon: Users,
        status: "upcoming",
    },
    {
        id: 6,
        title: "Semifinal Round (Proposal Submission)",
        date: "September 10 - 23, 2025",
        description: "Business proposal submission period",
        type: "competition",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 7,
        title: "Finalist Announcement",
        date: "September 30, 2025",
        description: "Announcement of participants advancing to finals",
        type: "announcement",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 8,
        title: "Poster Submission",
        date: "October 1 - 10, 2025",
        description: "Business plan poster submission",
        type: "competition",
        icon: FileText,
        status: "upcoming",
    },
    {
        id: 9,
        title: "Final Round Submission",
        date: "October 1 - 20, 2025",
        description: "Final business plan submission",
        type: "competition",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 10,
        title: "Technical Meeting Final Round",
        date: "October 3, 2025",
        description: "Technical meeting for final round",
        type: "meeting",
        icon: FileText,
        status: "upcoming",
    },
    {
        id: 11,
        title: "Mentoring Session",
        date: "TBA",
        description: "Mentoring sessions for finalists",
        type: "mentoring",
        icon: Users,
        status: "upcoming",
    },
    {
        id: 12,
        title: "IBP International Final Round",
        date: "October 25 - 26, 2025",
        description: "International Business Plan final competition",
        type: "final",
        icon: Trophy,
        status: "upcoming",
    },
];

const businessCaseTimeline = [
    {
        id: 1,
        title: "Registration",
        date: "August 8 - 21, 2025",
        description: "Registration period for Business Case Competition",
        type: "registration",
        icon: Users,
        status: "active",
    },
    {
        id: 2,
        title: "Preliminary Round Case Release",
        date: "August 15, 2025",
        description: "Release of preliminary round case study",
        type: "competition",
        icon: FileText,
        status: "upcoming",
    },
    {
        id: 3,
        title: "Technical Meeting Preliminary Round",
        date: "August 24, 2025",
        description: "Technical meeting for preliminary round",
        type: "meeting",
        icon: FileText,
        status: "upcoming",
    },
    {
        id: 4,
        title: "Preliminary Round Submission",
        date: "August 15 - 31, 2025",
        description: "Submission period for preliminary round",
        type: "competition",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 5,
        title: "Semifinalists Announcement",
        date: "September 9, 2025",
        description: "Announcement of participants advancing to semifinals",
        type: "announcement",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 6,
        title: "Re-registration",
        date: "September 9 - 16, 2025",
        description: "Re-registration period for semifinalists",
        type: "registration",
        icon: Users,
        status: "upcoming",
    },
    {
        id: 7,
        title: "Semifinal Round Case Release",
        date: "September 10, 2025",
        description: "Release of semifinal round case study",
        type: "competition",
        icon: FileText,
        status: "upcoming",
    },
    {
        id: 8,
        title: "Semifinal Round Submission",
        date: "September 10 - 23, 2025",
        description: "Submission period for semifinal round",
        type: "competition",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 9,
        title: "Finalist Announcement",
        date: "September 30, 2025",
        description: "Announcement of participants advancing to finals",
        type: "announcement",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 10,
        title: "Final Round Submission",
        date: "October 1 - 20, 2025",
        description: "Final case analysis submission",
        type: "competition",
        icon: Trophy,
        status: "upcoming",
    },
    {
        id: 11,
        title: "Technical Meeting Final Round",
        date: "October 3, 2025",
        description: "Technical meeting for final round",
        type: "meeting",
        icon: FileText,
        status: "upcoming",
    },
    {
        id: 12,
        title: "Mentoring Session",
        date: "TBA",
        description: "Mentoring sessions for finalists",
        type: "mentoring",
        icon: Users,
        status: "upcoming",
    },
    {
        id: 13,
        title: "IBP International Final Round",
        date: "October 25 - 26, 2025",
        description: "International Business Case final competition",
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
            return "Registration";
        case "meeting":
            return "Meeting";
        case "competition":
            return "Competition";
        case "evaluation":
            return "Evaluation";
        case "announcement":
            return "Announcement";
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

const getCardBackgroundColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-gradient-to-br from-[#082E80]/10 via-[#FB9F32]/10 to-[#FFE86F]/20 border-[#082E80]/30 shadow-lg shadow-[#FB9F32]/20";
        case "completed":
            return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md shadow-green-100";
        case "upcoming":
            return "bg-white/95 border-gray-200";
        default:
            return "bg-white/95 border-gray-200";
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case "active":
            return {
                text: "Active",
                color: "bg-gradient-to-r from-[#082E80] to-[#FB9F32] text-white",
            };
        case "completed":
            return {
                text: "Completed",
                color: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
            };
        case "upcoming":
            return {
                text: "Upcoming",
                color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white",
            };
        default:
            return {
                text: "Event",
                color: "bg-gradient-to-r from-gray-400 to-gray-500 text-white",
            };
    }
};

export default function TimelinePage() {
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
            <Head title="IBP 2025 Timeline" />

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
                                            Follow the complete competition
                                            schedule of{" "}
                                            <span className="px-3 py-1 font-bold text-[#1E3A8A] bg-[#F59E0B]/20 rounded-xl border border-[#F59E0B]/30">
                                                International Business Project
                                                2025
                                            </span>
                                            . Make sure you don't miss any
                                            important stages of this
                                            competition.
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
                                    Competition Timelines
                                </h2>
                                <motion.div
                                    className="w-32 h-2 bg-gradient-to-r from-[#1E3A8A] via-blue-400 to-[#1E3A8A] rounded-full mx-auto"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: 128 }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    viewport={{ once: true }}
                                />
                                <p className="mt-4 text-lg text-[#1E3A8A]/80">
                                    Business Plan Competition & Business Case
                                    Competition
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Enhanced Timeline - Two Columns */}
                    <div className="relative">
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Business Plan Competition Timeline */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="flex items-center justify-center mb-4 space-x-3">
                                        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-blue-700">
                                            Business Plan Competition
                                        </h3>
                                    </div>
                                    <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                                </motion.div>

                                {/* Timeline line for BPC */}
                                <div className="relative">
                                    <div className="absolute left-4 top-0 w-0.5 h-full bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />

                                    <div className="space-y-6">
                                        {businessPlanTimeline.map(
                                            (event, index) => {
                                                const IconComponent =
                                                    event.icon;
                                                return (
                                                    <motion.div
                                                        key={event.id}
                                                        ref={setTimelineRef(
                                                            event.id
                                                        )}
                                                        data-timeline-id={
                                                            event.id
                                                        }
                                                        initial={{
                                                            opacity: 0,
                                                            x: -50,
                                                            scale: 0.9,
                                                        }}
                                                        animate={
                                                            isVisible(event.id)
                                                                ? {
                                                                      opacity: 1,
                                                                      x: 0,
                                                                      scale: 1,
                                                                  }
                                                                : {
                                                                      opacity: 0,
                                                                      x: -50,
                                                                      scale: 0.9,
                                                                  }
                                                        }
                                                        transition={{
                                                            duration: 0.6,
                                                            delay: index * 0.1,
                                                            type: "spring",
                                                            stiffness: 100,
                                                        }}
                                                        className="relative flex items-start"
                                                        onMouseEnter={() =>
                                                            setHoveredCard(
                                                                event.id
                                                            )
                                                        }
                                                        onMouseLeave={() =>
                                                            setHoveredCard(null)
                                                        }
                                                    >
                                                        {/* Timeline dot */}
                                                        <motion.div
                                                            initial={{
                                                                scale: 0,
                                                                rotate: -180,
                                                            }}
                                                            animate={
                                                                isVisible(
                                                                    event.id
                                                                )
                                                                    ? {
                                                                          scale: 1,
                                                                          rotate: 0,
                                                                      }
                                                                    : {
                                                                          scale: 0,
                                                                          rotate: -180,
                                                                      }
                                                            }
                                                            transition={{
                                                                duration: 0.4,
                                                                delay:
                                                                    index *
                                                                        0.1 +
                                                                    0.2,
                                                                type: "spring",
                                                                stiffness: 200,
                                                            }}
                                                            className={`relative z-10 w-8 h-8 rounded-full ${getTypeColor(
                                                                event.type
                                                            )} border-2 border-white shadow-lg flex items-center justify-center`}
                                                        >
                                                            <IconComponent className="w-4 h-4 text-white" />
                                                        </motion.div>

                                                        {/* Event card */}
                                                        <div className="flex-1 ml-6">
                                                            <motion.div
                                                                whileHover={{
                                                                    y: -4,
                                                                    scale: 1.02,
                                                                }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                }}
                                                            >
                                                                <Card
                                                                    className={`transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm ${getCardBackgroundColor(
                                                                        event.status
                                                                    )} ${
                                                                        hoveredCard ===
                                                                        event.id
                                                                            ? getTypeGlow(
                                                                                  event.type
                                                                              ) +
                                                                              " shadow-lg"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <CardHeader className="pb-3">
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-1">
                                                                                <CardTitle className="mb-2 text-sm font-bold text-gray-900">
                                                                                    {
                                                                                        event.title
                                                                                    }
                                                                                </CardTitle>
                                                                                <div className="flex items-center gap-2 mb-2">
                                                                                    <Calendar className="w-3 h-3 text-gray-500" />
                                                                                    <span className="text-xs font-semibold text-gray-700">
                                                                                        {
                                                                                            event.date
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col gap-2">
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className={`text-xs font-medium ${
                                                                                        getStatusBadge(
                                                                                            event.status
                                                                                        )
                                                                                            .color
                                                                                    } border-0 shadow-sm`}
                                                                                >
                                                                                    {
                                                                                        getStatusBadge(
                                                                                            event.status
                                                                                        )
                                                                                            .text
                                                                                    }
                                                                                </Badge>
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className={`text-xs font-medium ${getTypeColor(
                                                                                        event.type
                                                                                    )} text-white border-0 shadow-sm`}
                                                                                >
                                                                                    {getTypeBadge(
                                                                                        event.type
                                                                                    )}
                                                                                </Badge>
                                                                            </div>
                                                                        </div>
                                                                    </CardHeader>
                                                                    <CardContent className="pt-0">
                                                                        <CardDescription className="text-xs leading-relaxed text-gray-600">
                                                                            {
                                                                                event.description
                                                                            }
                                                                        </CardDescription>
                                                                    </CardContent>
                                                                </Card>
                                                            </motion.div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Business Case Competition Timeline */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="flex items-center justify-center mb-4 space-x-3">
                                        <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-secondary">
                                            Business Case Competition
                                        </h3>
                                    </div>
                                    <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
                                </motion.div>

                                {/* Timeline line for BCC */}
                                <div className="relative">
                                    <div className="absolute left-4 top-0 w-0.5 h-full bg-gradient-to-b from-orange-500 to-orange-600 rounded-full" />

                                    <div className="space-y-6">
                                        {businessCaseTimeline.map(
                                            (event, index) => {
                                                const IconComponent =
                                                    event.icon;
                                                return (
                                                    <motion.div
                                                        key={`bcc-${event.id}`}
                                                        ref={setTimelineRef(
                                                            event.id + 100
                                                        )}
                                                        data-timeline-id={
                                                            event.id + 100
                                                        }
                                                        initial={{
                                                            opacity: 0,
                                                            x: 50,
                                                            scale: 0.9,
                                                        }}
                                                        animate={
                                                            isVisible(
                                                                event.id + 100
                                                            )
                                                                ? {
                                                                      opacity: 1,
                                                                      x: 0,
                                                                      scale: 1,
                                                                  }
                                                                : {
                                                                      opacity: 0,
                                                                      x: 50,
                                                                      scale: 0.9,
                                                                  }
                                                        }
                                                        transition={{
                                                            duration: 0.6,
                                                            delay: index * 0.1,
                                                            type: "spring",
                                                            stiffness: 100,
                                                        }}
                                                        className="relative flex items-start"
                                                        onMouseEnter={() =>
                                                            setHoveredCard(
                                                                event.id + 100
                                                            )
                                                        }
                                                        onMouseLeave={() =>
                                                            setHoveredCard(null)
                                                        }
                                                    >
                                                        {/* Timeline dot */}
                                                        <motion.div
                                                            initial={{
                                                                scale: 0,
                                                                rotate: -180,
                                                            }}
                                                            animate={
                                                                isVisible(
                                                                    event.id +
                                                                        100
                                                                )
                                                                    ? {
                                                                          scale: 1,
                                                                          rotate: 0,
                                                                      }
                                                                    : {
                                                                          scale: 0,
                                                                          rotate: -180,
                                                                      }
                                                            }
                                                            transition={{
                                                                duration: 0.4,
                                                                delay:
                                                                    index *
                                                                        0.1 +
                                                                    0.2,
                                                                type: "spring",
                                                                stiffness: 200,
                                                            }}
                                                            className={`relative z-10 w-8 h-8 rounded-full ${getTypeColor(
                                                                event.type
                                                            )} border-2 border-white shadow-lg flex items-center justify-center`}
                                                        >
                                                            <IconComponent className="w-4 h-4 text-white" />
                                                        </motion.div>

                                                        {/* Event card */}
                                                        <div className="flex-1 ml-6">
                                                            <motion.div
                                                                whileHover={{
                                                                    y: -4,
                                                                    scale: 1.02,
                                                                }}
                                                                transition={{
                                                                    duration: 0.2,
                                                                }}
                                                            >
                                                                <Card
                                                                    className={`transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm ${getCardBackgroundColor(
                                                                        event.status
                                                                    )} ${
                                                                        hoveredCard ===
                                                                        event.id +
                                                                            100
                                                                            ? getTypeGlow(
                                                                                  event.type
                                                                              ) +
                                                                              " shadow-lg"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <CardHeader className="pb-3">
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-1">
                                                                                <CardTitle className="mb-2 text-sm font-bold text-gray-900">
                                                                                    {
                                                                                        event.title
                                                                                    }
                                                                                </CardTitle>
                                                                                <div className="flex items-center gap-2 mb-2">
                                                                                    <Calendar className="w-3 h-3 text-gray-500" />
                                                                                    <span className="text-xs font-semibold text-gray-700">
                                                                                        {
                                                                                            event.date
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col gap-2">
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className={`text-xs font-medium ${
                                                                                        getStatusBadge(
                                                                                            event.status
                                                                                        )
                                                                                            .color
                                                                                    } border-0 shadow-sm`}
                                                                                >
                                                                                    {
                                                                                        getStatusBadge(
                                                                                            event.status
                                                                                        )
                                                                                            .text
                                                                                    }
                                                                                </Badge>
                                                                                <Badge
                                                                                    variant="secondary"
                                                                                    className={`text-xs font-medium ${getTypeColor(
                                                                                        event.type
                                                                                    )} text-white border-0 shadow-sm`}
                                                                                >
                                                                                    {getTypeBadge(
                                                                                        event.type
                                                                                    )}
                                                                                </Badge>
                                                                            </div>
                                                                        </div>
                                                                    </CardHeader>
                                                                    <CardContent className="pt-0">
                                                                        <CardDescription className="text-xs leading-relaxed text-gray-600">
                                                                            {
                                                                                event.description
                                                                            }
                                                                        </CardDescription>
                                                                    </CardContent>
                                                                </Card>
                                                            </motion.div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
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
                                        Important Information
                                    </h3>

                                    <p className="max-w-4xl mx-auto text-lg leading-relaxed text-blue-100">
                                        Make sure to always monitor this
                                        timeline and follow each stage according
                                        to schedule. Don't miss the opportunity
                                        to be part of this prestigious
                                        competition. For more information,
                                        please contact the organizing committee.
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
                @media (max-width: 1024px) {
                    .grid-cols-2 {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                }

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
