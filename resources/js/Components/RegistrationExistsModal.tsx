import React from "react";
import Modal from "@/Components/Modal";
import { Link } from "@inertiajs/react";
import {
    CheckCircle,
    Calendar,
    Users,
    FileText,
    User,
    Phone,
    Mail,
} from "lucide-react";

interface TeamRegistration {
    id: number;
    registration_number: string;
    tim_name: string;
    leader_name: string;
    leader_email: string;
    leader_phone: string;
    status: string;
    created_at: string;
}

interface CompetitionCategory {
    id: number;
    name: string;
    full_name?: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    registration: TeamRegistration;
    category: CompetitionCategory;
}

export default function RegistrationExistsModal({
    show,
    onClose,
    registration,
    category,
}: Props) {
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

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: {
                color: "bg-yellow-100 text-yellow-800",
                text: "Pending Verification",
            },
            approved: {
                color: "bg-green-100 text-green-800",
                text: "Approved",
            },
            rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
        };

        const config =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.pending;

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
            >
                {config.text}
            </span>
        );
    };

    const getCompetitionName = () => {
        if (category.name === "BPC") return "Business Plan Competition";
        if (category.name === "BCC") return "Business Case Competition";
        return category.full_name || category.name;
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="mb-6 text-center">
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                        You're Already Registered!
                    </h3>
                    <p className="text-gray-600">
                        You have already registered for{" "}
                        <span className="font-semibold text-ibp-primary">
                            {getCompetitionName()}
                        </span>
                    </p>
                </div>

                {/* Registration Details */}
                <div className="p-4 mb-6 rounded-lg bg-gray-50">
                    <h4 className="flex items-center mb-3 font-semibold text-gray-900">
                        <FileText className="w-5 h-5 mr-2 text-ibp-primary" />
                        Registration Details
                    </h4>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Registration Number
                                </label>
                                <p className="font-mono text-sm font-semibold text-gray-900">
                                    {registration.registration_number}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Team Name
                                </label>
                                <p className="flex items-center text-sm font-semibold text-gray-900">
                                    <Users className="w-4 h-4 mr-1 text-ibp-primary" />
                                    {registration.tim_name}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Team Leader
                                </label>
                                <p className="flex items-center text-sm font-semibold text-gray-900">
                                    <User className="w-4 h-4 mr-1 text-ibp-primary" />
                                    {registration.leader_name}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Leader Email
                                </label>
                                <p className="flex items-center text-sm text-gray-900">
                                    <Mail className="w-4 h-4 mr-1 text-ibp-primary" />
                                    {registration.leader_email}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Status
                                </label>
                                <div className="mt-1">
                                    {getStatusBadge(registration.status)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            Registered on: {formatDate(registration.created_at)}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 font-semibold text-gray-800 transition-colors duration-200 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>

                {/* Help Text */}
                <div className="p-3 mt-4 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> If you need to update your
                        registration details or have any issues, please contact
                        the committee through the available contact person.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
