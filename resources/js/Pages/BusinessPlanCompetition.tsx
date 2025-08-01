"use client";

import type React from "react";
import { Head } from "@inertiajs/react";
import { FileText, UserPlus } from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

// Import sections
import HeroSection from "@/Components/sections/bpc-sections/HeroSection";
import VisualSection from "@/Components/sections/bpc-sections/VisualSection";
import DescriptionSection from "@/Components/sections/bpc-sections/DescriptionSection";
import TimelineSection from "@/Components/sections/bpc-sections/TimelineSection";
import PrizeSection from "@/Components/sections/bpc-sections/PrizeSection";
import CTASection from "@/Components/sections/bpc-sections/CTASection";
import ContactSection from "@/Components/sections/bpc-sections/ContactSection";

const BusinessPlanCompetition: React.FC = () => {
    // Data untuk setiap section
    const timelineData = [
        {
            date: "1 - 15 Maret 2024",
            phase: "Pendaftaran",
            description: "Periode pendaftaran peserta dan pengumpulan berkas",
        },
        {
            date: "16 - 31 Maret 2024",
            phase: "Seleksi Administrasi",
            description: "Verifikasi berkas dan seleksi tahap awal",
        },
        {
            date: "1 - 30 April 2024",
            phase: "Pengembangan Business Plan",
            description: "Periode pengembangan dan penyusunan business plan",
        },
        {
            date: "1 - 7 Mei 2024",
            phase: "Submission",
            description: "Pengumpulan business plan final",
        },
        {
            date: "15 - 16 Mei 2024",
            phase: "Presentasi & Final",
            description: "Presentasi business plan dan penentuan pemenang",
        },
    ];

    const prizeData = [
        {
            title: "Juara 1",
            prize: "Rp 15.000.000",
            benefits: "+ Sertifikat + Mentoring",
            gradient: "bg-gradient-to-br from-yellow-400 to-yellow-500",
            icon: "🥇",
        },
        {
            title: "Juara 2",
            prize: "Rp 10.000.000",
            benefits: "+ Sertifikat + Mentoring",
            gradient: "bg-gradient-to-br from-gray-300 to-gray-400",
            icon: "🥈",
        },
        {
            title: "Juara 3",
            prize: "Rp 7.500.000",
            benefits: "+ Sertifikat + Mentoring",
            gradient: "bg-gradient-to-br from-orange-400 to-orange-500",
            icon: "🥉",
        },
    ];

    const specialAwards = [
        "🎯 Special Awards: Best Innovation, Best Social Impact, Best Presentation",
        "💼 Kesempatan inkubasi bisnis dan akses ke investor",
    ];

    const ctaButtons = [
        {
            text: "📘 Download Guidebook",
            href: "/files/ibp-business-plan-guidebook.pdf",
            type: "secondary" as const,
            icon: <FileText className="w-6 h-6" />,
            external: true,
        },
        {
            text: "📝 Register Now",
            href: "/register",
            type: "primary" as const,
            icon: <UserPlus className="w-6 h-6" />,
            external: false,
        },
    ];

    const contactPersons = [
        {
            name: "Sarah Wijaya",
            whatsapp: "+62 812-3456-7890",
            instagram: "@sarahwijaya_ibp",
            line: "sarahwijaya",
        },
        {
            name: "Ahmad Rizki",
            whatsapp: "+62 813-9876-5432",
            instagram: "@ahmadrizki_ibp",
        },
    ];

    const descriptionContent = [
        "Business Plan Competition IBP Academy adalah kompetisi bergengsi yang dirancang untuk mengasah kemampuan mahasiswa dan praktisi muda dalam menyusun rencana bisnis yang inovatif dan berkelanjutan. Kompetisi ini menjadi wadah untuk mengembangkan ide-ide kreatif menjadi solusi bisnis yang dapat diimplementasikan di dunia nyata.",
        "Peserta akan dibimbing oleh mentor berpengalaman dan dinilai oleh juri yang terdiri dari praktisi industri, akademisi, dan investor. Kompetisi ini tidak hanya tentang memenangkan hadiah, tetapi juga tentang membangun jaringan, mengembangkan keterampilan, dan menciptakan dampak positif bagi masyarakat.",
    ];

    return (
        <>
            <Navbar />
            <Head title="Business Plan Competition - IBP Academy" />

            <div className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <HeroSection
                    title="Business Plan Competition"
                    backUrl="/"
                />

                <VisualSection />

                <DescriptionSection
                    title="Tentang Kompetisi"
                    content={descriptionContent}
                />

                <TimelineSection title="Timeline" items={timelineData} />

                <PrizeSection
                    title="Prize & Awarding"
                    prizes={prizeData}
                    specialAwards={specialAwards}
                />

                <CTASection buttons={ctaButtons} />

                <ContactSection
                    title="Contact Person"
                    subtitle="Hubungi kami untuk informasi lebih lanjut"
                    contacts={contactPersons}
                />
            </div>
            <Footer />
        </>
    );
};

export default BusinessPlanCompetition;
