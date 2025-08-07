"use client";

import ApplicationLogo from "@/Components/ApplicationLogo";
import { Head } from "@inertiajs/react";
import {
    Target,
    Trophy,
    GitBranch,
    Calendar,
    Sparkles,
    Users,
    Award,
    Lightbulb,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SpotlightCard from "@/Components/ReactBits/SpotlightCard/SpotlightCard";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { motion, Variants } from "framer-motion";

export default function About() {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(
        new Set()
    );
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections(
                            (prev) => new Set([...prev, entry.target.id])
                        );
                    }
                });
            },
            { threshold: 0.1, rootMargin: "50px" }
        );

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const setSectionRef = (id: string) => (el: HTMLElement | null) => {
        sectionRefs.current[id] = el;
    };

    const isVisible = (id: string) => visibleSections.has(id);

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const fadeInLeft: Variants = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const fadeInRight: Variants = {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Head title="About IBP 2025" />

            {/* Hero Section */}
            <section
                id="hero"
                ref={setSectionRef("hero")}
                className="relative flex items-center justify-center min-h-screen pt-12 overflow-hidden"
            >
                {/* Background image */}
                <div className="absolute inset-0 z-0 bg-[url('/image/auth/screen2.png')] bg-cover bg-center bg-no-repeat" />
                {/* Yellow gradient overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#fb9f32]/60 via-yellow-300 to-[#fae04c]/60" />

                {/* Animated geometric elements - more subtle */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Floating elements */}
                    <motion.div
                        className="absolute w-3 h-3 rounded-full bg-[#1E3A8A]/20 top-20 left-20"
                        animate={{
                            y: [0, -15, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute w-2 h-2 rounded-full bg-[#F59E0B]/20 top-1/3 right-1/4"
                        animate={{
                            y: [0, 10, 0],
                            opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                            duration: 5,
                            delay: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute w-2.5 h-2.5 bg-white/20 rounded-full bottom-1/3 left-1/3"
                        animate={{
                            y: [0, -8, 0],
                            opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                            duration: 6,
                            delay: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Geometric shapes - more subtle */}
                    <motion.div
                        className="absolute w-16 h-16 rotate-45 border top-32 right-32 border-white/10"
                        animate={{
                            rotate: [45, 90, 45],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute w-12 h-12 border rounded-full bottom-40 left-16 border-[#F59E0B]/15"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 7,
                            delay: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-6xl px-4 mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate={isVisible("hero") ? "visible" : "hidden"}
                        variants={fadeInUp}
                        className="space-y-8"
                    >
                        {/* Logo */}
                        <motion.div
                            className="mb-8"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ApplicationLogo className="w-auto h-32 mx-auto md:h-40 lg:h-48 drop-shadow-lg" />
                        </motion.div>

                        {/* Title */}
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] tracking-tight">
                                IBP Academy
                            </h1>

                            <div className="flex items-center justify-center space-x-2 text-amber-500">
                                <Sparkles className="w-6 h-6" />
                                <span className="text-lg font-semibold">
                                    From Curiosity to Creation
                                </span>
                                <Sparkles className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Description */}
                        <motion.div
                            className="max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-lg" />
                                <div className="relative p-6 border shadow-sm bg-white/30 backdrop-blur-sm border-white/20 rounded-3xl md:p-8">
                                    <p className="text-lg font-normal leading-relaxed text-[#1E3A8A] md:text-xl lg:text-2xl">
                                        IBP Academy is a strategic learning platform designed to transform participants' curiosity into tangible creations. As a bridge between ideas and implementation, IBP Academy challenges participants to explore critical thinking, learn from top mentors, and create innovative solutions to real-world challenges.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Objectives Section */}
            <section
                id="objectives"
                ref={setSectionRef("objectives")}
                className="py-24 bg-gradient-to-br from-gray-50 to-[#1E3A8A]/5"
            >
                <div className="px-4 mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        animate={isVisible("objectives") ? "visible" : "hidden"}
                        variants={fadeInLeft}
                        className="grid items-center gap-16 lg:grid-cols-2"
                    >
                        {/* Content */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-blue-600 rounded-2xl shadow-lg"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Target className="w-8 h-8 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-[#1E3A8A]">
                                        Our Concept
                                    </h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-[#1E3A8A] to-amber-400 rounded-full mt-2" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <motion.div
                                    className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl"
                                    whileHover={{
                                        y: -5, 
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#1E3A8A]/10 rounded-xl">
                                            <Lightbulb className="w-6 h-6 text-[#1E3A8A]" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-xl font-bold text-gray-800">
                                                Learning
                                            </h3>
                                            <p className="leading-relaxed text-gray-600">
                                                Providing intensive materials on business, technology, and implementation strategies through learning modules, videos, and case studies.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl"
                                    whileHover={{
                                        y: -5,
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-amber-400/10 rounded-xl">
                                            <Users className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-xl font-bold text-gray-800">
                                                Networking
                                            </h3>
                                            <p className="leading-relaxed text-gray-600">
                                                Connecting participants with academics, practitioners, and investors through discussion forums, mentoring sessions, and networking events.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl"
                                    whileHover={{
                                        y: -5,
                                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-xl">
                                            <GitBranch className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="mb-2 text-xl font-bold text-gray-800">
                                                Implementation
                                            </h3>
                                            <p className="leading-relaxed text-gray-600">
                                                Providing opportunities for participants to apply their knowledge to develop competition works into applicable and commercializable solutions.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Visual Element */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={
                                isVisible("objectives")
                                    ? { opacity: 1, scale: 1 }
                                    : { opacity: 0, scale: 0.8 }
                            }
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative bg-gradient-to-br from-[#1E3A8A] to-blue-600 rounded-3xl p-8 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                                <div className="relative space-y-6 text-center text-white">
                                    <div className="flex justify-center space-x-4">
                                        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl">
                                            <Lightbulb className="w-8 h-8" />
                                        </div>
                                        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl">
                                            <Users className="w-8 h-8" />
                                        </div>
                                        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl">
                                            <GitBranch className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold">
                                        Learning Management System
                                    </h3>
                                    <p className="leading-relaxed text-white/90">
                                        A digital platform providing access to business and technology modules, work documentation, and flexible mentoring for sustainable development.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Theme Section */}
            <section
                id="theme"
                ref={setSectionRef("theme")}
                className="py-24 bg-white"
            >
                <div className="px-4 mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        animate={isVisible("theme") ? "visible" : "hidden"}
                        variants={fadeInRight}
                        className="grid items-center gap-16 lg:grid-cols-2"
                    >
                        {/* Visual Element */}
                        <motion.div
                            className="relative order-2 lg:order-1"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={
                                isVisible("theme")
                                    ? { opacity: 1, scale: 1 }
                                    : { opacity: 0, scale: 0.8 }
                            }
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <SpotlightCard
                                className="p-6 shadow-2xl bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl"
                                spotlightColor="rgba(255, 255, 255, 0.3)"
                            >
                                <div className="space-y-4 text-center text-white">
                                    <div className="flex justify-center">
                                        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl">
                                            <Trophy className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black leading-tight">
                                        "Empowering Young Innovators for{" "}
                                        <span className="text-yellow-100">
                                            Sustainable Industry Transformation
                                        </span>
                                        "
                                    </h3>
                                </div>
                            </SpotlightCard>
                        </motion.div>

                        {/* Content */}
                        <div className="order-1 space-y-8 lg:order-2">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl"
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Trophy className="w-8 h-8 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-[#1E3A8A]">
                                        Our Purpose
                                    </h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-[#1E3A8A] rounded-full mt-2" />
                                </div>
                            </div>

                            <div className="p-8 border border-gray-100 bg-gradient-to-br from-gray-50 to-amber-50/50 rounded-2xl">
                                <p className="mb-6 text-lg leading-relaxed text-gray-700 md:text-xl">
                                    IBP Academy aims to be an intellectual and professional mentoring ecosystem based on real challenges by integrating business training, technology, and leadership.
                                </p>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-[#1E3A8A] rounded-full" />
                                        <span className="font-medium text-gray-600">
                                            Providing space for critical thinking and tangible solutions
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                                        <span className="font-medium text-gray-600">
                                            Post-competition development platform
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-[#1E3A8A] rounded-full" />
                                        <span className="font-medium text-gray-600">
                                            Tracking participant progress
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                                        <span className="font-medium text-gray-600">
                                            Long-term material repository
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Competition Branch Section */}
            <section
                id="branch"
                ref={setSectionRef("branch")}
                className="py-24 bg-gradient-to-br from-[#1E3A8A]/5 to-gray-50"
            >
                <div className="px-4 mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        animate={isVisible("branch") ? "visible" : "hidden"}
                        variants={fadeInLeft}
                        className="mb-16 text-center"
                    >
                        <div className="flex items-center justify-center mb-8 space-x-4">
                            <motion.div
                                className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-blue-600 rounded-2xl shadow-lg"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                <GitBranch className="w-8 h-8 text-white" />
                            </motion.div>
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-[#1E3A8A]">
                                    Key Features
                                </h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-[#1E3A8A] to-amber-400 rounded-full mt-2 mx-auto" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: Award,
                                title: "Learning Modules",
                                description:
                                    "Video content, modules, and case studies accessible to participants based on their needs and project development stage",
                                color: "from-[#1E3A8A] to-blue-600",
                                bgColor: "from-[#1E3A8A]/10 to-blue-600/10",
                            },
                            {
                                icon: Lightbulb,
                                title: "Mentorship & Project Clinic",
                                description:
                                    "Guidance from academics, practitioners, and IBP alumni for project and business development",
                                color: "from-amber-400 to-amber-600",
                                bgColor: "from-amber-400/10 to-amber-600/10",
                            },
                            {
                                icon: Users,
                                title: "Certification & Roadmap",
                                description:
                                    "Providing certificates and development roadmaps for participants as appreciation and guidance",
                                color: "from-green-500 to-green-600",
                                bgColor: "from-green-500/10 to-green-600/10",
                            },
                        ].map((branch, index) => (
                            <motion.div
                                key={branch.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={
                                    isVisible("branch")
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 30 }
                                }
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.2,
                                }}
                                whileHover={{
                                    y: -10,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                                }}
                                className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg rounded-3xl hover:border-gray-200"
                            >
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${branch.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                                >
                                    <branch.icon className="w-8 h-8 text-white" />
                                </div>

                                <h3 className="mb-4 text-xl font-bold text-gray-800">
                                    {branch.title}
                                </h3>

                                <p className="leading-relaxed text-gray-600">
                                    {branch.description}
                                </p>

                                <div
                                    className={`w-full h-1 bg-gradient-to-r ${branch.bgColor} rounded-full mt-6`}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Activities Section */}
            <section
                id="activities"
                ref={setSectionRef("activities")}
                className="py-24 bg-white"
            >
                <div className="px-4 mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        animate={isVisible("activities") ? "visible" : "hidden"}
                        variants={fadeInRight}
                        className="grid items-center gap-16 lg:grid-cols-2"
                    >
                        {/* Content */}
                        <div className="space-y-8">
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    className="flex items-center justify-center w-16 h-16 shadow-lg bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl"
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Calendar className="w-8 h-8 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-[#1E3A8A]">
                                        Series of Activities
                                    </h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-[#1E3A8A] rounded-full mt-2" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-[#1E3A8A]/5 rounded-2xl p-8 border border-gray-100">
                                <p className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
                                    The series of IBP 2025 activities are designed to holistically support participant development through various integrated programs.
                                </p>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {[
                                        {
                                            name: "Seminars & Workshops",
                                            icon: "📚",
                                        },
                                        {
                                            name: "Mentoring Sessions",
                                            icon: "👥",
                                        },
                                        {
                                            name: "Competition Phase",
                                            icon: "🏆",
                                        },
                                        {
                                            name: "Program Incubation",
                                            icon: "🚀",
                                        },
                                        {
                                            name: "Networking Events",
                                            icon: "🤝",
                                        },
                                        { name: "Awarding Night", icon: "🎉" },
                                    ].map((activity, index) => (
                                        <motion.div
                                            key={activity.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={
                                                isVisible("activities")
                                                    ? { opacity: 1, x: 0 }
                                                    : { opacity: 0, x: -20 }
                                            }
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                            }}
                                            className="flex items-center p-4 space-x-4 bg-white border border-gray-100 shadow-sm rounded-xl"
                                        >
                                            <span className="text-2xl">
                                                {activity.icon}
                                            </span>
                                            <span className="font-semibold text-gray-700">
                                                {activity.name}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Visual Timeline */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={
                                isVisible("activities")
                                    ? { opacity: 1, scale: 1 }
                                    : { opacity: 0, scale: 0.8 }
                            }
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative bg-gradient-to-br from-[#1E3A8A] to-blue-600 rounded-3xl p-8 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                                <div className="relative space-y-8 text-center text-white">
                                    <h3 className="text-2xl font-bold">
                                        Main Events
                                    </h3>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                phase: "Registration Phase 1",
                                                time: "August 8-21",
                                            },
                                            {
                                                phase: "Preliminary Round",
                                                time: "August 15-31",
                                            },
                                            {
                                                phase: "Semifinal Round",
                                                time: "September 10-23",
                                            },
                                            {
                                                phase: "Final Round",
                                                time: "October 1-20",
                                            },
                                            {
                                                phase: "IBP International Day 1",
                                                time: "October 25",
                                            },
                                            {
                                                phase: "IBP International Day 2",
                                                time: "October 26",
                                            },
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.phase}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={
                                                    isVisible("activities")
                                                        ? { opacity: 1, y: 0 }
                                                        : { opacity: 0, y: 20 }
                                                }
                                                transition={{
                                                    duration: 0.5,
                                                    delay: 0.5 + index * 0.1,
                                                }}
                                                className="flex items-center justify-between p-4 bg-white/10 rounded-xl"
                                            >
                                                <span className="font-semibold">
                                                    {item.phase}
                                                </span>
                                                <span className="text-sm text-white/80">
                                                    {item.time}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }

                .custom-spotlight-card {
                    position: relative;
                    overflow: hidden;
                }

                .custom-spotlight-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}