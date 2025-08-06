"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    FileText,
    UserPlus,
    Briefcase,
    Users,
    Trophy,
    Target,
    Clock,
    CheckCircle,
} from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import RegistrationExistsModal from "@/Components/RegistrationExistsModal";

// Import sections
import HeroSection from "@/Components/sections/bpc-sections/HeroSection";
import VisualSection from "@/Components/sections/bpc-sections/VisualSection";
import DescriptionSection from "@/Components/sections/bpc-sections/DescriptionSection";
import StatsSection from "@/Components/sections/bcc-sections/StatsSection";
import RequirementsSection from "@/Components/sections/bcc-sections/RequirementsSection";
import ProcessSection from "@/Components/sections/bcc-sections/ProcessSection";
import TimelineSection from "@/Components/sections/bpc-sections/TimelineSection";
import PrizeSection from "@/Components/sections/bpc-sections/PrizeSection";
import CTASection from "@/Components/sections/bpc-sections/CTASection";
import ContactSection from "@/Components/sections/bpc-sections/ContactSection";

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

interface FlashData {
    showRegistrationModal?: boolean;
    existingRegistration?: TeamRegistration;
    category?: CompetitionCategory;
}

const BusinessCaseCompetition: React.FC = () => {
    const page = usePage();
    const flash = page.props.flash as FlashData | undefined;
    const [showModal, setShowModal] = useState(false);

    // Show modal if redirected with flash data
    useEffect(() => {
        console.log("All props:", page.props);
        console.log("Flash data:", flash);

        // Check for URL parameters as fallback
        const urlParams = new URLSearchParams(window.location.search);
        const showModalParam = urlParams.get("showModal") === "true";

        if (
            (flash?.showRegistrationModal && flash?.existingRegistration) ||
            showModalParam
        ) {
            console.log(
                "Showing modal with registration:",
                flash?.existingRegistration
            );
            setShowModal(true);
        }
    }, [flash, page.props]);

    // Debug flash data
    useEffect(() => {
        if (flash) {
            console.log("Flash data:", flash);
        }
    }, [flash]);
    // Stats data
    const statsData = [
        {
            number: 150,
            label: "Tim Peserta",
            suffix: "+",
            icon: <Users className="w-8 h-8 text-white" />,
        },
        {
            number: 25,
            label: "Universitas",
            suffix: "+",
            icon: <Trophy className="w-8 h-8 text-white" />,
        },
        {
            number: 48,
            label: "Jam Kompetisi",
            icon: <Clock className="w-8 h-8 text-white" />,
        },
        {
            number: 50,
            label: "Total Hadiah",
            prefix: "Rp ",
            suffix: "Jt",
            icon: <Target className="w-8 h-8 text-white" />,
        },
    ];

    // Requirements data
    const requirementsData = [
        {
            title: "Tim Maksimal 4 Orang",
            description:
                "Setiap tim terdiri dari maksimal 4 anggota dengan minimal 1 ketua tim",
            icon: <Users className="w-6 h-6 text-blue-600" />,
        },
        {
            title: "Mahasiswa Aktif S1/D4",
            description:
                "Peserta adalah mahasiswa aktif program S1 atau D4 dari universitas terakreditasi",
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        },
        {
            title: "Dokumen Lengkap",
            description:
                "Menyertakan KTM, CV, dan surat keterangan aktif kuliah dari semua anggota tim",
            icon: <FileText className="w-6 h-6 text-purple-600" />,
        },
        {
            title: "Komitmen Waktu",
            description:
                "Sanggup mengikuti seluruh rangkaian kompetisi dari awal hingga akhir",
            icon: <Clock className="w-6 h-6 text-orange-600" />,
        },
    ];

    // Process steps data
    const processSteps = [
        {
            title: "Registrasi",
            description: "Daftar tim dan lengkapi dokumen persyaratan",
            icon: <UserPlus className="w-8 h-8" />,
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
        },
        {
            title: "Case Release",
            description: "Terima case study dan mulai analisis",
            icon: <FileText className="w-8 h-8" />,
            color: "bg-gradient-to-r from-purple-500 to-purple-600",
        },
        {
            title: "Analysis",
            description: "Kerjakan case study dan buat solusi",
            icon: <Target className="w-8 h-8" />,
            color: "bg-gradient-to-r from-green-500 to-green-600",
        },
        {
            title: "Presentation",
            description: "Presentasikan solusi di hadapan juri",
            icon: <Trophy className="w-8 h-8" />,
            color: "bg-gradient-to-r from-yellow-500 to-orange-500",
        },
    ];

    // Timeline data
    const timelineData = [
        {
            date: "15 - 30 Maret 2024",
            phase: "Pendaftaran Tim",
            description:
                "Periode pendaftaran tim dan verifikasi kelengkapan dokumen",
        },
        {
            date: "1 - 5 April 2024",
            phase: "Technical Meeting",
            description: "Briefing kompetisi dan pembagian case study",
        },
        {
            date: "6 - 20 April 2024",
            phase: "Analisis Case Study",
            description: "Periode analisis mendalam dan penyusunan solusi",
        },
        {
            date: "21 - 25 April 2024",
            phase: "Submission Proposal",
            description: "Pengumpulan proposal solusi case study",
        },
        {
            date: "30 April - 1 Mei 2024",
            phase: "Final Presentation",
            description: "Presentasi final dan penilaian juri",
        },
    ];

    // Prize data
    const prizeData = [
        {
            title: "Juara 1",
            prize: "Rp 20.000.000",
            benefits: "+ Trophy + Sertifikat + Mentoring",
            gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
            icon: "🏆",
        },
        {
            title: "Juara 2",
            prize: "Rp 12.500.000",
            benefits: "+ Trophy + Sertifikat + Mentoring",
            gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
            icon: "🥈",
        },
        {
            title: "Juara 3",
            prize: "Rp 8.000.000",
            benefits: "+ Trophy + Sertifikat + Mentoring",
            gradient: "bg-gradient-to-br from-green-400 to-green-600",
            icon: "🥉",
        },
    ];

    const specialAwards = [
        "🎯 Special Awards: Best Analysis, Most Creative Solution, Best Presentation",
        "💼 Kesempatan magang di perusahaan partner",
        "🌟 Fast track interview untuk program graduate trainee",
    ];

    // CTA buttons
    const ctaButtons = [
        {
            text: "📋 Download Case Study Guide",
            href: "/files/ibp-business-case-guide.pdf",
            type: "secondary" as const,
            icon: <FileText className="w-6 h-6" />,
            external: true,
        },
        {
            text: "🚀 Register Team",
            href: route("competition.bcc.register.create"),
            type: "primary" as const,
            icon: <UserPlus className="w-6 h-6" />,
            external: false,
        },
    ];

    // Contact persons
    const contactPersons = [
        {
            name: "Tiara Ramadhani",
            whatsapp: "+62 821-6702-7236",
        },
        {
            name: "Najwa Laili",
            whatsapp: "+62 813-3338-4548",
        },
    ];

    const descriptionContent = [
        "Business Case Competition IBP Academy adalah kompetisi analisis kasus bisnis yang menantang peserta untuk memecahkan permasalahan bisnis nyata dari perusahaan-perusahaan terkemuka. Kompetisi ini dirancang untuk mengasah kemampuan analitis, strategic thinking, dan problem-solving skills peserta.",
        "Peserta akan diberikan case study yang kompleks dan harus mengembangkan solusi inovatif dengan pendekatan yang sistematis dan data-driven. Tim akan dinilai berdasarkan kedalaman analisis, kreativitas solusi, dan kemampuan presentasi di hadapan panel juri yang terdiri dari senior executives dan business leaders.",
        "Kompetisi ini menjadi platform ideal untuk mendemonstrasikan kemampuan konsultasi bisnis dan membangun portfolio yang kuat untuk karir di bidang strategy consulting, business development, dan management.",
    ];

    return (
        <>
            <Navbar />
            <Head title="Business Case Competition - IBP Academy" />

            <div className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
                <HeroSection title="Business Case Competition" backUrl="/" />

                <VisualSection
                    images={{
                        main: "https://images.unsplash.com/photo-1506781961370-37a89d6b3095?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        secondary: [
                            "https://images.unsplash.com/photo-1599576838688-8a6c11263108?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                            "https://images.unsplash.com/photo-1494094892896-7f14a4433b7a?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                        ],
                    }}
                />

                <DescriptionSection
                    title="Tentang Kompetisi"
                    content={descriptionContent}
                    icon={<Briefcase className="w-8 h-8 text-[#1E3A8A]" />}
                />

                <StatsSection
                    title="Kompetisi dalam Angka"
                    subtitle="Bergabunglah dengan ratusan peserta dari seluruh Indonesia"
                    stats={statsData}
                    backgroundColor="bg-gradient-to-r from-purple-600 to-blue-600"
                />

                <RequirementsSection
                    title="Persyaratan Kompetisi"
                    subtitle="Pastikan tim Anda memenuhi semua persyaratan berikut"
                    requirements={requirementsData}
                />

                <ProcessSection
                    title="Alur Kompetisi"
                    subtitle="Ikuti langkah-langkah berikut untuk mengikuti kompetisi"
                    steps={processSteps}
                />

                <TimelineSection
                    title="Timeline Kompetisi"
                    items={timelineData}
                />

                <PrizeSection
                    title="Prize & Recognition"
                    prizes={prizeData}
                    specialAwards={specialAwards}
                />

                <CTASection buttons={ctaButtons} />

                <ContactSection
                    title="Contact Person"
                    subtitle="Hubungi kami untuk informasi lebih lanjut tentang kompetisi"
                    contacts={contactPersons}
                />
            </div>
            <Footer />

            {/* Registration Exists Modal */}
            {flash?.existingRegistration && flash?.category && (
                <RegistrationExistsModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    registration={flash.existingRegistration}
                    category={flash.category}
                />
            )}
        </>
    );
};

export default BusinessCaseCompetition;
