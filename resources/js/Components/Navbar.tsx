"use client";

import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import type { PageProps } from "@inertiajs/core";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    X,
    ChevronDown,
    LogOut,
    Settings,
    Home,
    Info,
    Trophy,
    Calendar,
    Briefcase,
    FileText,
} from "lucide-react";

interface User {
    name: string;
    email: string;
    avatar?: string;
}

interface PagePropsWithAuth extends PageProps {
    auth: {
        user?: User;
    };
}

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCompetitionDropdownOpen, setIsCompetitionDropdownOpen] =
        useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // Show navbar when at top of page
            if (currentScrollY < 10) {
                setIsVisible(true);
            }
            // Hide navbar when scrolling down, show when scrolling up
            else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    const { auth } = usePage<PagePropsWithAuth>().props;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleCompetitionDropdown = () => {
        setIsCompetitionDropdownOpen(!isCompetitionDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".user-dropdown")) {
                setIsDropdownOpen(false);
            }
            if (!target.closest(".competition-dropdown")) {
                setIsCompetitionDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                !target.closest(".mobile-menu") &&
                !target.closest(".mobile-menu-button")
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "About", href: "/about", icon: Info },
        { name: "Timeline", href: "/timeline", icon: Calendar },
    ];

    const competitionItems = [
        {
            name: "Business Plan Competition",
            href: "/business-plan-competition",
            icon: FileText,
            description: "Kompetisi rencana bisnis untuk mahasiswa",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            name: "Business Case Competition",
            href: "/business-case-competition",
            icon: Briefcase,
            description: "Kompetisi analisis kasus bisnis",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{
                    y: isVisible ? 0 : -100,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 z-50"
            >
                <div className="mx-4 mt-4 lg:mx-24">
                    <motion.nav
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="px-4 py-3 border shadow-xl bg-white/90 backdrop-blur-xl border-white/20 rounded-2xl lg:px-8 lg:py-4"
                    >
                        <div className="flex items-center justify-between">
                            {/* Logo/Brand */}
                            <Link href="/" className="flex items-center space-x-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="flex items-center justify-center w-12 h-12 rounded-3xl">
                                        <img
                                            src="/asset/logo.png"
                                            alt="IBP Logo"
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    <div className="hidden lg:block">
                                        <div className="text-lg font-extrabold text-[#082e80] leading-tight">
                                            INDUSTRIAL BUSINESS PROJECT
                                        </div>
                                        <div className="text-xs font-medium text-gray-500">
                                            2025
                                        </div>
                                    </div>
                                    <div className="block lg:hidden">
                                        <div className="text-base font-bold text-[#1E3A8A]">
                                            IBP 2025
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden space-x-8 lg:flex">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="flex items-center space-x-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:text-[#1E3A8A] hover:scale-105 group"
                                        >
                                            <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Competition Dropdown */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="relative competition-dropdown"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={toggleCompetitionDropdown}
                                        className="flex items-center space-x-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:text-[#1E3A8A] group focus:outline-none"
                                    >
                                        <Trophy className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                        <span>Competition</span>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-200 ${
                                                isCompetitionDropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </motion.button>

                                    {/* Competition Dropdown Menu */}
                                    <AnimatePresence>
                                        {isCompetitionDropdownOpen && (
                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                    y: -10,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                    y: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                    y: -10,
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute left-0 z-50 py-3 mt-2 bg-white border border-gray-200 shadow-xl top-full w-80 rounded-2xl"
                                            >
                                                <div className="px-3 py-2 border-b border-gray-100">
                                                    <h3 className="text-sm font-semibold text-gray-800">
                                                        Pilih Kompetisi
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        Bergabunglah dengan
                                                        kompetisi yang sesuai
                                                        minat Anda
                                                    </p>
                                                </div>

                                                <div className="py-2">
                                                    {competitionItems.map(
                                                        (
                                                            competition,
                                                            index
                                                        ) => (
                                                            <motion.div
                                                                key={
                                                                    competition.name
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
                                                                    duration: 0.3,
                                                                    delay:
                                                                        index *
                                                                        0.1,
                                                                }}
                                                            >
                                                                <Link
                                                                    href={
                                                                        competition.href
                                                                    }
                                                                    onClick={() =>
                                                                        setIsCompetitionDropdownOpen(
                                                                            false
                                                                        )
                                                                    }
                                                                    className="flex items-start p-4 mx-2 transition-all duration-200 rounded-xl hover:bg-gray-50 group"
                                                                >
                                                                    <div
                                                                        className={`flex items-center justify-center w-10 h-10 ${competition.bgColor} rounded-lg mr-3 group-hover:scale-110 transition-transform duration-200`}
                                                                    >
                                                                        <competition.icon
                                                                            className={`w-5 h-5 ${competition.color}`}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-[#1E3A8A] transition-colors duration-200">
                                                                            {
                                                                                competition.name
                                                                            }
                                                                        </h4>
                                                                        <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                                                            {
                                                                                competition.description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <motion.div
                                                                        className="transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                                                                        whileHover={{
                                                                            x: 5,
                                                                        }}
                                                                    >
                                                                        <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                                                                    </motion.div>
                                                                </Link>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </div>

                                                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                                                    <p className="text-xs text-center text-gray-500">
                                                        💡{" "}
                                                        <strong>Tips:</strong>{" "}
                                                        Baca guidebook sebelum
                                                        mendaftar
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>

                            {/* Desktop Auth Section */}
                            <div className="hidden space-x-4 lg:flex lg:items-center">
                                {auth?.user ? (
                                    <div className="relative user-dropdown">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={toggleDropdown}
                                            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                                        >
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-700">
                                                    {auth.user.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {auth.user.email}
                                                </div>
                                            </div>
                                            {auth.user.avatar ? (
                                                <img
                                                    src={
                                                        auth.user.avatar ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt="User avatar"
                                                    className="object-cover w-10 h-10 rounded-xl border-2 border-[#1E3A8A]/20"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-gradient-to-r from-[#1E3A8A] to-blue-600 rounded-xl">
                                                    {getInitials(
                                                        auth.user.name
                                                    )}
                                                </div>
                                            )}
                                            <ChevronDown
                                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                                    isDropdownOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </motion.button>

                                        {/* User Dropdown Menu */}
                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                        y: -10,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                    className="absolute right-0 z-50 w-56 py-2 mt-2 bg-white border border-gray-200 shadow-xl rounded-2xl"
                                                >
                                                    <Link
                                                        href="/user/dashboard"
                                                        className="flex items-center px-4 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                                                    >
                                                        <motion.div className="w-4 h-4 mr-3 text-gray-500">
                                                            <Home />
                                                        </motion.div>
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        href="/user/profile"
                                                        className="flex items-center px-4 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                                                    >
                                                        <motion.div className="w-4 h-4 mr-3 text-gray-500">
                                                            <Settings />
                                                        </motion.div>
                                                        Profile Settings
                                                    </Link>
                                                    <hr className="my-2 border-gray-100" />
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="flex items-center w-full px-4 py-3 text-sm text-left text-red-600 transition-colors duration-200 hover:bg-red-50"
                                                    >
                                                        <motion.div className="w-4 h-4 mr-3">
                                                            <LogOut />
                                                        </motion.div>
                                                        Log Out
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-[#1E3A8A] hover:bg-gray-50 rounded-xl"
                                        >
                                            Sign In
                                        </Link>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Link
                                                href="/register"
                                                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#1E3A8A] to-blue-600 rounded-xl hover:shadow-lg transition-all duration-200"
                                            >
                                                Sign Up
                                            </Link>
                                        </motion.div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="flex items-center space-x-3 lg:hidden">
                                {auth?.user && (
                                    <div className="relative user-dropdown">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={toggleDropdown}
                                            className="flex items-center p-1 space-x-2 transition-colors duration-200 rounded-xl hover:bg-gray-50 focus:outline-none"
                                        >
                                            {auth.user.avatar ? (
                                                <img
                                                    src={
                                                        auth.user.avatar ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt="User avatar"
                                                    className="object-cover w-8 h-8 rounded-lg border border-[#1E3A8A]/20"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-gradient-to-r from-[#1E3A8A] to-blue-600 rounded-lg">
                                                    {getInitials(
                                                        auth.user.name
                                                    )}
                                                </div>
                                            )}
                                        </motion.button>

                                        {/* Mobile User Dropdown */}
                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.95,
                                                        y: -10,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                    className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border border-gray-200 shadow-xl rounded-2xl"
                                                >
                                                    <div className="px-4 py-2 border-b border-gray-100">
                                                        <div className="text-sm font-medium text-gray-700">
                                                            {auth.user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {auth.user.email}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href="/dashboard"
                                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <motion.div className="w-4 h-4 mr-3 text-gray-500">
                                                            <Home />
                                                        </motion.div>
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <motion.div className="w-4 h-4 mr-3 text-gray-500">
                                                            <Settings />
                                                        </motion.div>
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="flex items-center w-full px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50"
                                                    >
                                                        <motion.div className="w-4 h-4 mr-3">
                                                            <LogOut />
                                                        </motion.div>
                                                        Log Out
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleMobileMenu}
                                    className="mobile-menu-button p-2 text-gray-700 hover:text-[#1E3A8A] hover:bg-gray-50 rounded-xl transition-colors duration-200 focus:outline-none"
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="w-6 h-6" />
                                    ) : (
                                        <Menu className="w-6 h-6" />
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.nav>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Mobile Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed z-50 border shadow-2xl mobile-menu top-20 left-4 right-4 bg-white/95 backdrop-blur-xl border-white/20 rounded-2xl lg:hidden"
                        >
                            <div className="p-6">
                                {/* Navigation Items */}
                                <div className="space-y-4">
                                    {navItems.map((item, index) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.1,
                                            }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="flex items-center space-x-3 p-3 text-gray-700 hover:text-[#1E3A8A] hover:bg-gray-50 rounded-xl transition-all duration-200"
                                            >
                                                <motion.div className="w-5 h-5">
                                                    <item.icon />
                                                </motion.div>
                                                <span className="font-medium">
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </motion.div>
                                    ))}

                                    {/* Mobile Competition Section */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.3,
                                        }}
                                        className="pt-4 border-t border-gray-100"
                                    >
                                        <div className="flex items-center p-3 space-x-3 font-medium text-gray-800">
                                            <Trophy className="w-5 h-5" />
                                            <span>Competition</span>
                                        </div>
                                        <div className="ml-8 space-y-2">
                                            {competitionItems.map(
                                                (competition, index) => (
                                                    <motion.div
                                                        key={competition.name}
                                                        initial={{
                                                            opacity: 0,
                                                            x: -20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay:
                                                                0.4 +
                                                                index * 0.1,
                                                        }}
                                                    >
                                                        <Link
                                                            href={
                                                                competition.href
                                                            }
                                                            onClick={() =>
                                                                setIsMobileMenuOpen(
                                                                    false
                                                                )
                                                            }
                                                            className="flex items-center space-x-3 p-3 text-gray-600 hover:text-[#1E3A8A] hover:bg-gray-50 rounded-xl transition-all duration-200"
                                                        >
                                                            <div
                                                                className={`flex items-center justify-center w-8 h-8 ${competition.bgColor} rounded-lg`}
                                                            >
                                                                <competition.icon
                                                                    className={`w-4 h-4 ${competition.color}`}
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium">
                                                                    {
                                                                        competition.name
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {
                                                                        competition.description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </motion.div>
                                                )
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Auth Section for Mobile */}
                                {!auth?.user && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.6,
                                        }}
                                        className="pt-6 mt-6 border-t border-gray-100"
                                    >
                                        <div className="flex flex-col space-y-3">
                                            <Link
                                                href="/login"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="w-full px-4 py-3 text-center text-gray-700 hover:text-[#1E3A8A] hover:bg-gray-50 rounded-xl transition-colors duration-200"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href="/register"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="w-full px-4 py-3 text-center text-white bg-gradient-to-r from-[#1E3A8A] to-blue-600 rounded-xl hover:shadow-lg transition-all duration-200"
                                            >
                                                Sign Up
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
