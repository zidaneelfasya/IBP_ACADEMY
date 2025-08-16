import React from "react";
import { Head } from "@inertiajs/react";
import { SiteHeaderLMS } from "@/Components/site-header-lms";
import {
    Lock,
    Users,
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Clock,
    FileText,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";

interface Team {
    name: string;
    status: string;
    registration_number: string;
}

interface AssignmentsLockedProps {
    message: string;
    team?: Team | null;
}

export default function AssignmentsLocked({
    message,
    team,
}: AssignmentsLockedProps) {
    return (
        <>
            <Head title="Access Restricted - Assignments" />
            <SiteHeaderLMS />

            <div className="relative min-h-screen overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-900">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute w-2 h-2 bg-white rounded-full top-10 left-10 animate-pulse"></div>
                        <div className="absolute w-1 h-1 delay-300 bg-white rounded-full top-20 right-20 animate-pulse"></div>
                        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
                        <div className="absolute w-1 h-1 delay-1000 bg-white rounded-full bottom-10 right-10 animate-pulse"></div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
                    <div className="absolute delay-1000 rounded-full bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse"></div>
                    <div className="absolute w-64 h-64 delay-500 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-indigo-500/10 blur-3xl animate-pulse"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
                    <div className="w-full max-w-2xl">
                        {/* Glassmorphism Card */}
                        <Card className="border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20">
                            <CardContent className="p-8 text-center md:p-12">
                                {/* Lock Icon with Glow Effect */}
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 rounded-full bg-red-500/30 blur-xl"></div>
                                    <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full shadow-2xl bg-gradient-to-br from-red-500 to-red-600">
                                        <Lock className="w-12 h-12 text-white" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
                                    Access Restricted
                                </h1>

                                <p className="mb-8 text-xl text-white/80">
                                    Assignment Portal Locked
                                </p>

                                {/* Message Card */}
                                <div className="p-6 mb-8 border backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl">
                                    <div className="flex items-start gap-4">
                                        <AlertTriangle className="flex-shrink-0 w-6 h-6 mt-1 text-yellow-400" />
                                        <div className="text-left">
                                            <h3 className="mb-2 text-lg font-semibold text-white">
                                                Why am I seeing this?
                                            </h3>
                                            <p className="leading-relaxed text-white/80">
                                                {message}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Info (if available) */}
                                {team && (
                                    <div className="p-6 mb-8 border backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Users className="w-5 h-5 text-blue-400" />
                                            <h3 className="text-lg font-semibold text-white">
                                                Your Team Status
                                            </h3>
                                        </div>
                                        <div className="space-y-3 text-left">
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/70">
                                                    Team Name:
                                                </span>
                                                <span className="font-medium text-white">
                                                    {team.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/70">
                                                    Registration #:
                                                </span>
                                                <span className="font-medium text-white">
                                                    {team.registration_number}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Progress Steps */}
                                <div className="p-6 mb-8 border backdrop-blur-lg bg-white/10 border-white/20 rounded-2xl">
                                    <h3 className="flex items-center gap-2 mb-6 text-lg font-semibold text-white">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        How to Access Assignments
                                    </h3>
                                    <div className="space-y-4 text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 border rounded-full bg-green-500/20 border-green-500/30">
                                                <span className="text-sm font-bold text-green-300">
                                                    1
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">
                                                    Complete Registration
                                                </p>
                                                <p className="text-sm text-white/70">
                                                    Submit your team
                                                    registration and required
                                                    documents
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 border rounded-full bg-blue-500/20 border-blue-500/30">
                                                <span className="text-sm font-bold text-blue-300">
                                                    2
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">
                                                    Wait for Approval
                                                </p>
                                                <p className="text-sm text-white/70">
                                                    Admin will review and
                                                    approve your registration
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 border rounded-full bg-purple-500/20 border-purple-500/30">
                                                <span className="text-sm font-bold text-purple-300">
                                                    3
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">
                                                    Access Preliminary Stage
                                                </p>
                                                <p className="text-sm text-white/70">
                                                    Once approved, you'll gain
                                                    access to assignments
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="text-white backdrop-blur-lg bg-white/10 border-white/30 hover:bg-white/20 hover:border-white/40"
                                    >
                                        <a
                                            href="/user/dashboard"
                                            className="flex items-center gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back to Dashboard
                                        </a>
                                    </Button>
                                </div>

                                {/* Contact Support */}
                                <div className="pt-6 mt-8 border-t border-white/20">
                                    <p className="text-sm text-white/60">
                                        Need help?{" "}
                                        <a
                                            href="/contact"
                                            className="text-blue-400 underline hover:text-blue-300"
                                        >
                                            Contact Support
                                        </a>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
