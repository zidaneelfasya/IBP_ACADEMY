"use client";

import UserLayout from "@/Layouts/UserLayout";
import { Flame, GraduationCap } from "lucide-react";

export default function CoursePage() {
    return (
        <UserLayout title="Course Access">
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="max-w-lg w-full text-center">
                    {/* Icons */}
                    <div className="flex justify-center items-center mb-12">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full">
                                <Flame className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="mx-6 w-px h-12 bg-gray-200"></div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Course Access
                    </h1>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-10">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Course will be open if your team advances to the
                            <span className="font-bold text-indigo-600">
                                {" "}
                                semifinal round
                            </span>
                            .
                        </p>
                    </div>

                    {/* Motivational Section */}
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg blur opacity-20"></div>
                            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg">
                                <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
                                    <Flame className="w-5 h-5 mr-2" />
                                    IGNITE YOUR POTENTIAL
                                </h2>
                                <p className="text-orange-100">
                                    Push harder, dream bigger, achieve
                                    greatness!
                                </p>
                            </div>
                        </div>

                        <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                            🔥 MAKE IT TO THE SEMIFINALS! 🔥
                        </p>
                    </div>

                    {/* Status */}
                    <div className="mt-12 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-500 font-medium">
                            You are currently in the registration phase.
                        </span>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
