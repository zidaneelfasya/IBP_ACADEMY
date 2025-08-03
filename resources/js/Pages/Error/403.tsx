"use client";

import { useState, useEffect } from "react";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Forbidden() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate particles only once
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
                <div className="absolute top-40 left-40 w-60 h-60 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23FEF08A%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 pointer-events-none" />

            {/* Main content */}
            <div
                className={`relative z-10 text-center max-w-2xl mx-auto transition-all duration-1000 ${
                    mounted
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                }`}
            >
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-30 animate-pulse" />
                        <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-full shadow-2xl">
                            <ShieldX className="w-16 h-16 text-blue-900" />
                        </div>
                    </div>
                </div>

                {/* Error code */}
                <div className="mb-6">
                    <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent leading-none tracking-tight">
                        403
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mt-4 rounded-full" />
                </div>

                {/* Error message */}
                <div className="mb-8 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Access Forbidden
                    </h2>
                    <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
                        You don't have permission to access this page.
                    </p>
                    <p className="text-blue-200">
                        It seems like you're trying to access a restricted area.
                        Please check your credentials or contact an
                        administrator.
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
                    >
                        <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                        Return Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-yellow-500/10 backdrop-blur-sm text-yellow-400 font-semibold rounded-xl border border-yellow-400/20 hover:bg-yellow-500/20 transform hover:scale-105 transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                        Go Back
                    </button>
                </div>

                {/* Additional help text */}
                <div className="mt-12 p-6 bg-blue-800/20 backdrop-blur-sm rounded-2xl border border-blue-400/10">
                    <p className="text-blue-100 text-sm">
                        <strong className="text-yellow-300">Need help?</strong>{" "}
                        If you believe this is an error, please contact our
                        support team or try logging in again.
                    </p>
                </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute w-2 h-2 bg-yellow-300/30 rounded-full animate-float"
                        style={{
                            left: particle.left,
                            top: particle.top,
                            animationDelay: particle.delay,
                            animationDuration: particle.duration,
                        }}
                    />
                ))}
            </div>

            <style>
                {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
            </style>
        </div>
    );
}
