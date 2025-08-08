import React from "react";
import { Head, Link } from "@inertiajs/react";

interface CompetitionCategory {
    id: number;
    name: string;
    description?: string;
    full_name?: string;
}

interface TeamRegistration {
    id: number;
    registration_number: number;
    tim_name: string;
    asal_universitas: string;
    leader_name: string;
    leader_email: string;
    created_at: string;
}

interface Props {
    category: CompetitionCategory;
    registration: TeamRegistration;
}

export default function RegistrationSuccess({ category, registration }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <Head
                title={`Registration Success - ${category.name} - IBP Academy`}
            />
            <div className="min-h-screen py-4 sm:py-8 bg-gradient-to-br from-green-50 via-ibp-white to-green-50">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
                            {/* Header Success */}
                            <div className="relative px-4 py-8 overflow-hidden text-white sm:px-6 sm:py-12 bg-gradient-to-br from-green-600 via-ibp-secondary to-green-600">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute w-32 h-32 bg-white rounded-full sm:w-40 sm:h-40 -top-6 -right-6 mix-blend-multiply filter blur-xl animate-pulse"></div>
                                    <div className="absolute w-24 h-24 delay-1000 bg-yellow-300 rounded-full sm:w-32 sm:h-32 -bottom-6 -left-6 mix-blend-multiply filter blur-xl animate-pulse"></div>
                                </div>

                                {/* Success Content */}
                                <div className="relative text-center">
                                    {/* Success Icon */}
                                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 sm:w-24 sm:h-24 bg-white rounded-full">
                                        <svg
                                            className="w-12 h-12 sm:w-16 sm:h-16 text-ibp-secondary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>

                                    {/* Title */}
                                    <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                                        Registration Successful!
                                    </h1>

                                    <p className="mb-2 text-lg text-green-100 sm:text-xl">
                                        Congratulations! Your team has been
                                        successfully registered for
                                    </p>
                                    <p className="text-xl font-semibold sm:text-2xl text-ibp-accent">
                                        {category.full_name || category.name}
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 sm:p-8">
                                {/* Registration Details */}
                                <div className="mb-8">
                                    <h2 className="mb-6 text-2xl font-semibold text-ibp-primary">
                                        Registration Details
                                    </h2>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="p-4 border rounded-lg bg-ibp-neutral/10 border-ibp-neutral">
                                            <h3 className="mb-3 text-lg font-medium text-ibp-primary">
                                                Team Information
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-ibp-black">
                                                        Registration ID:
                                                    </span>
                                                    <span className="ml-2 font-mono text-ibp-secondary">
                                                        #
                                                        {registration.registration_number.toString()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-ibp-black">
                                                        Team Name:
                                                    </span>
                                                    <span className="ml-2 text-ibp-black">
                                                        {registration.tim_name}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-ibp-black">
                                                        Team Leader:
                                                    </span>
                                                    <span className="ml-2 text-ibp-black">
                                                        {
                                                            registration.leader_name
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                            <h3 className="mb-3 text-lg font-medium text-blue-800">
                                                Registration Time
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-blue-700">
                                                        Date & Time:
                                                    </span>
                                                    <span className="ml-2 text-blue-800">
                                                        {formatDate(
                                                            registration.created_at
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-blue-700">
                                                        Confirmation Email:
                                                    </span>
                                                    <span className="ml-2 text-blue-800">
                                                        {
                                                            registration.leader_email
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="mb-8">
                                    <h2 className="mb-4 text-2xl font-semibold text-ibp-primary">
                                        Next Steps
                                    </h2>

                                    <div className="p-6 border-l-4 rounded-lg bg-ibp-accent/10 border-ibp-accent">
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <div className="flex items-center justify-center w-8 h-8 mr-4 rounded-full bg-ibp-accent text-ibp-white">
                                                    <span className="text-sm font-bold">
                                                        1
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-ibp-primary">
                                                        Check Your Dashboard
                                                    </h4>
                                                    <p className="text-sm text-ibp-black/70">
                                                        Your registration status
                                                        will be updated on your
                                                        dashboard once approved
                                                        by the admin team.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex items-center justify-center w-8 h-8 mr-4 rounded-full bg-ibp-secondary text-ibp-white">
                                                    <span className="text-sm font-bold">
                                                        2
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-ibp-primary">
                                                        Follow Announcements
                                                    </h4>
                                                    <p className="text-sm text-ibp-black/70">
                                                        Follow IBP Academy's
                                                        social media for the
                                                        latest competition
                                                        updates.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="flex items-center justify-center w-8 h-8 mr-4 rounded-full bg-ibp-primary text-ibp-white">
                                                    <span className="text-sm font-bold">
                                                        3
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-ibp-primary">
                                                        Competition Preparation
                                                    </h4>
                                                    <p className="text-sm text-ibp-black/70">
                                                        Start preparing your
                                                        presentation materials
                                                        for the competition.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="mb-8">
                                    <h2 className="mb-4 text-2xl font-semibold text-ibp-primary">
                                        Contact Information
                                    </h2>

                                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <p className="mb-2 text-sm text-gray-700">
                                            If you have any questions or issues,
                                            please contact our team:
                                        </p>
                                        <div className="space-y-1 text-sm">
                                            <div>
                                                <span className="font-medium">
                                                    Email:
                                                </span>
                                                <span className="ml-2">
                                                    industrialbusinessproject@gmail.com
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    WhatsApp:
                                                </span>
                                                <span className="ml-2">
                                                    +62 813-3338-4548
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                    <Link
                                        href="/user/dashboard"
                                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 border border-transparent rounded-lg shadow-sm text-ibp-white bg-ibp-primary hover:bg-ibp-primary/90 focus:outline-none focus:ring-2 focus:ring-ibp-primary focus:ring-offset-2"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Go to Dashboard
                                    </Link>

                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 border border-transparent rounded-lg shadow-sm text-ibp-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                            />
                                        </svg>
                                        Back to Home
                                    </Link>

                                    <button
                                        onClick={() => window.print()}
                                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 border rounded-lg text-ibp-primary border-ibp-primary hover:bg-ibp-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-ibp-primary focus:ring-offset-2"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                            />
                                        </svg>
                                        Print Registration Proof
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
