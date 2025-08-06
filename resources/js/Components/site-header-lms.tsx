"use client";

import { useState } from "react";
import {
    BookOpen,
    User,
    LayoutDashboard,
    ClipboardList,
    ArrowLeft,
    Menu,
    X,
} from "lucide-react";
import { TooltipProvider } from "@/Components/ui/tooltip";
import { Button } from "@/Components/ui/button";
import UserProfile from "@/Components/UserProfile";
import ApplicationLogo from "./ApplicationLogo";

interface CourseItem {
    title: string;
    url: string;
    icon: typeof BookOpen;
}

interface NavItem {
    title: string;
    url: string;
    icon: typeof LayoutDashboard;
}

const course: CourseItem = {
    title: "Course",
    url: "#",
    icon: BookOpen,
};

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/user/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Profile",
        url: route("dashboard.user.profile"),
        icon: User,
    },
    {
        title: "Course",
        url: "#",
        icon: BookOpen,
    },
    {
        title: "Tugas",
        url: "/user/tugas",
        icon: ClipboardList,
    },
];

export function SiteHeaderLMS() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <TooltipProvider delayDuration={300}>
            <header className="bg-primary border-b border-primary/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ApplicationLogo className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </div>
                                <h1 className="text-white font-bold text-base sm:text-xl truncate">
                                    IBP LMS Platform
                                </h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                            {/* Back to Home - Changed to ArrowLeft */}
                            <a
                                href="/"
                                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors relative group py-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="font-medium">
                                    Kembali ke Beranda
                                </span>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                            </a>

                            {/* Navigation Items */}
                            {navItems.map((item) => (
                                <a
                                    key={item.title}
                                    href={item.url}
                                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors relative group py-2"
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span className="font-medium">
                                        {item.title}
                                    </span>
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                                </a>
                            ))}
                        </nav>

                        {/* Desktop User Profile */}
                        <div className="hidden md:flex items-center">
                            <UserProfile />
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-2 md:hidden">
                            {/* Mobile User Profile */}
                            <div className="lg:hidden">
                                <UserProfile />
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMobileMenu}
                                className="text-white/80 hover:text-white hover:bg-white/10 p-2"
                                aria-label="Toggle mobile menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        className={`lg:hidden border-t border-primary/20 transition-all duration-300 ease-in-out ${
                            isMobileMenuOpen
                                ? "max-h-96 opacity-100 py-4"
                                : "max-h-0 opacity-0 py-0 overflow-hidden"
                        }`}
                    >
                        <div className="space-y-1">
                            {/* Back to Home - Mobile - Changed to ArrowLeft */}
                            <a
                                href="/"
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors py-3 px-2 rounded-md"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span className="font-medium">
                                    Kembali ke Beranda
                                </span>
                            </a>

                            {/* Navigation Items - Mobile */}
                            {navItems.map((item) => (
                                <a
                                    key={item.title}
                                    href={item.url}
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors py-3 px-2 rounded-md"
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">
                                        {item.title}
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* Mobile User Profile Section */}
                        <div className="pt-4 mt-4 border-t border-primary/20 md:hidden">
                            <div className="px-2">
                                <UserProfile />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </TooltipProvider>
    );
}
