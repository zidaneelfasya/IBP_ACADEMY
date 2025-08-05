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
    asal_universitas: string;
    prodi_fakultas: string;
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
        return new Date(dateString).toLocaleDateString("id-ID", {
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
                text: "Menunggu Verifikasi",
            },
            approved: {
                color: "bg-green-100 text-green-800",
                text: "Disetujui",
            },
            rejected: { color: "bg-red-100 text-red-800", text: "Ditolak" },
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
                        Anda Sudah Terdaftar!
                    </h3>
                    <p className="text-gray-600">
                        Anda telah terdaftar untuk kompetisi{" "}
                        <span className="font-semibold text-ibp-primary">
                            {getCompetitionName()}
                        </span>
                    </p>
                </div>

                {/* Registration Details */}
                <div className="p-4 mb-6 rounded-lg bg-gray-50">
                    <h4 className="flex items-center mb-3 font-semibold text-gray-900">
                        <FileText className="w-5 h-5 mr-2 text-ibp-primary" />
                        Detail Pendaftaran
                    </h4>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Nomor Registrasi
                                </label>
                                <p className="font-mono text-sm font-semibold text-gray-900">
                                    {registration.registration_number}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Nama Tim
                                </label>
                                <p className="flex items-center text-sm font-semibold text-gray-900">
                                    <Users className="w-4 h-4 mr-1 text-ibp-primary" />
                                    {registration.tim_name}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Universitas
                                </label>
                                <p className="text-sm text-gray-900">
                                    {registration.asal_universitas}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Ketua Tim
                                </label>
                                <p className="flex items-center text-sm font-semibold text-gray-900">
                                    <User className="w-4 h-4 mr-1 text-ibp-primary" />
                                    {registration.leader_name}
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                    Email Ketua
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
                            Terdaftar pada:{" "}
                            {formatDate(registration.created_at)}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                        href={route("competition.success", registration.id)}
                        className="flex-1 px-4 py-3 font-semibold text-center text-white transition-colors duration-200 rounded-lg bg-ibp-primary hover:bg-ibp-primary/90"
                    >
                        Lihat Detail Pendaftaran
                    </Link>

                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 font-semibold text-gray-800 transition-colors duration-200 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Tutup
                    </button>
                </div>

                {/* Help Text */}
                <div className="p-3 mt-4 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-800">
                        <strong>Catatan:</strong> Jika ada perubahan data atau
                        masalah dengan pendaftaran, silakan hubungi panitia
                        melalui contact person yang tersedia.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
