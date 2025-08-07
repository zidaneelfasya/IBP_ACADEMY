"use client";

import UserLayout from "@/Layouts/UserLayout";
import { Lock, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";

export default function MaintenancePage() {
    return (
        <UserLayout title="Assignment Information">
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                        {/* Icons */}
                        <div className="flex justify-center items-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-full">
                                    <Lock className="w-10 h-10 text-white" />
                                </div>
                            </div>
                            <div className="mx-8 w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full">
                                    <BookOpen className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl font-bold text-gray-800 mb-6">
                            Assignment Portal
                        </h1>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
                            <h2 className="text-xl font-semibold text-yellow-800 mb-3">
                                Currently Locked
                            </h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Assignments will be provided once the
                                registration phase is completed. Please wait for
                                further announcements.
                            </p>
                        </div>

                        {/* Motivational Section */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl">
                            <h3 className="text-2xl font-bold mb-4">
                                Stay Ready!
                            </h3>
                            <p className="text-lg italic mb-4">
                                "Success is where preparation and opportunity
                                meet."
                            </p>
                            <p className="text-blue-100">
                                Your journey to excellence begins soon. Stay
                                motivated and be prepared!
                            </p>
                        </div>

                        {/* Status Indicator */}
                        <div className="mt-8 flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-600 font-medium">
                                Registration Phase Active
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
