import { usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { PageProps } from "@inertiajs/core";
import { Link } from '@inertiajs/react';

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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.user-dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
                isVisible
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0"
            }`}
        >
            <div className="mx-24 mt-4">
                <nav className="bg-white bg-opacity-85 backdrop-blur-md rounded-full px-8 py-4 shadow-lg border border-white border-opacity-20">
                    <div className="flex justify-between items-center">
                        {/* Bagian Kiri */}
                        <div className="text-sm font-bold text-purple-800">
                            INDUSTRIAL BUSINESS PROJECT 2025
                        </div>
                        
                        {/* Bagian Tengah */}
                        <div className="flex space-x-6">
                            <a
                                href="#"
                                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                            >
                                Home
                            </a>
                            <a
                                href="/about"
                                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                            >
                                About
                            </a>
                            <a
                                href="/competition"
                                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                            >
                                Competition
                            </a>
                            <a
                                href="/timeline"
                                className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                            >
                                Timeline
                            </a>
                        </div>
                        
                        {/* Bagian Kanan - Updated based on auth status */}
                        <div className="flex items-center space-x-4">
                            {auth?.user ? (
                                <div className="relative user-dropdown">
                                    <button 
                                        onClick={toggleDropdown}
                                        className="flex items-center space-x-3 focus:outline-none"
                                    >
                                        <span className="text-sm font-medium text-gray-700">
                                            {auth.user.email}
                                        </span>
                                        {auth.user.avatar ? (
                                            <img 
                                                src={auth.user.avatar} 
                                                alt="User avatar" 
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                {getInitials(auth.user.name)}
                                            </div>
                                        )}
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                            <Link
                                                href="/user"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Log Out
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;