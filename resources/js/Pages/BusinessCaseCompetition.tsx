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

    useEffect(() => {
        console.log("All props:", page.props);
        console.log("Flash data:", flash);

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

    useEffect(() => {
        if (flash) {
            console.log("Flash data:", flash);
        }
    }, [flash]);

    // Updated stats data based on IBP 2025 document
    const statsData = [
        {
            number: 100,
            label: "Participating Teams",
            suffix: "+",
            icon: <Users className="w-8 h-8 text-white" />,
        },
        {
            number: 30,
            label: "Universities",
            suffix: "+",
            icon: <Trophy className="w-8 h-8 text-white" />,
        },
        {
            number: 6,
            label: "Learning Modules",
            icon: <FileText className="w-8 h-8 text-white" />,
        },
        {
            number: 50,
            label: "Total Prizes",
            prefix: "Rp ",
            suffix: "M+",
            icon: <Target className="w-8 h-8 text-white" />,
        },
    ];

    // Updated requirements based on IBP registration process
    const requirementsData = [
        {
            title: "Maximum 3 Members per Team",
            description:
                "Each team consists of maximum 2 members with 1 team leader (1 leader + 2 members)",
            icon: <Users className="w-6 h-6 text-blue-600" />,
        },
        {
            title: "Active S1/D4 Students",
            description:
                "Participants must be active undergraduate (S1) or diploma (D4) students from accredited universities",
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        },
        {
            title: "Complete Documents",
            description:
                "Must include student ID, twibbon proof, Instagram follow screenshot, and Instagram Story post",
            icon: <FileText className="w-6 h-6 text-purple-600" />,
        },
        {
            title: "Program Commitment",
            description:
                "Must commit to participate in all IBP Academy series from preliminary to final round",
            icon: <Clock className="w-6 h-6 text-orange-600" />,
        },
    ];

    // Updated process steps based on IBP 2025 timeline
    const processSteps = [
        {
            title: "Registration",
            description: "Register your team and complete required documents",
            icon: <UserPlus className="w-8 h-8" />,
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
        },
        {
            title: "Preliminary Round",
            description: "Case release and initial solution submission",
            icon: <FileText className="w-8 h-8" />,
            color: "bg-gradient-to-r from-purple-500 to-purple-600",
        },
        {
            title: "Semifinal Round",
            description: "Advanced solution development with mentoring",
            icon: <Target className="w-8 h-8" />,
            color: "bg-gradient-to-r from-green-500 to-green-600",
        },
        {
            title: "Final Round",
            description: "Solution presentation at IBP International Day",
            icon: <Trophy className="w-8 h-8" />,
            color: "bg-gradient-to-r from-yellow-500 to-orange-500",
        },
    ];

    // Updated timeline based on IBP 2025 schedule
    const timelineData = [
        {
            date: "August 8 - 21, 2025",
            phase: "Participant Registration",
            description:
                "Team registration period and document verification",
        },
        {
            date: "August 15 - 31, 2025",
            phase: "Preliminary Round",
            description: "Case release and initial solution submission",
        },
        {
            date: "September 9 - 23, 2025",
            phase: "Semifinal Round",
            description: "Advanced solution development with BCC module access",
        },
        {
            date: "October 25 - 26, 2025",
            phase: "IBP International Day",
            description: "Final presentation and international judging",
        },
    ];

    // Prize data updated with IBP Academy values
    const prizeData = [
        {
            title: "1st Place",
            prize: "Rp 25,000,000",
            benefits: "+ Trophy + Certificate + IBP Academy LMS Access",
            gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
            icon: "🏆",
        },
        {
            title: "2nd Place",
            prize: "Rp 15,000,000",
            benefits: "+ Trophy + Certificate + IBP Academy LMS Access",
            gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
            icon: "🥈",
        },
        {
            title: "3rd Place",
            prize: "Rp 10,000,000",
            benefits: "+ Trophy + Certificate + IBP Academy LMS Access",
            gradient: "bg-gradient-to-br from-green-400 to-green-600",
            icon: "🥉",
        },
    ];

    const specialAwards = [
        "🎯 Special Awards: Best Innovation, Most Sustainable Solution, Best Implementation",
        "💼 Business incubation opportunities through IBP Academy",
        "🌟 Exclusive access to mentor and investor networks",
    ];

    // Updated CTA buttons
    const ctaButtons = [
        {
            text: "📋 Download BCC Guideline",
            href: "/files/ibp-bcc-guideline.pdf",
            type: "secondary" as const,
            icon: <FileText className="w-6 h-6" />,
            external: true,
        },
        {
            text: "🚀 Register Now",
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

    // Updated description content based on IBP Academy concept
    const descriptionContent = [
        "IBP Academy Business Case Competition (BCC) is a business case analysis competition challenging participants to develop innovative solutions based on Sustainable Development Goals (SDGs). This competition is part of the IBP Academy education ecosystem that bridges ideas to real implementation.",
        "Participants will get access to the IBP Academy LMS platform providing business and technology modules, mentoring from industry practitioners, and opportunities to develop their work from preliminary to final stages. Solutions will be judged based on innovation, implementation feasibility, and industry impact.",
        "Through the 'From Curiosity to Creation' approach, IBP Academy BCC focuses not only on competition but also on participant capacity development through continuous learning and professional networking.",
    ];

    return (
        <>
            <Navbar />
            <Head title="Business Case Competition - IBP Academy 2025" />

            <div className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
                <HeroSection
                    title="Business Case Competition"
                    backUrl="/"
                />

                <VisualSection
                    images={{
                        main: "/image/bcc/bcc1.JPG",
                        secondary: [
                            "/image/bcc/bcc2.JPG",
                            "/image/bcc/bcc3.JPG",
                        ],
                    }}
                />

                <DescriptionSection
                    title="About IBP Academy BCC"
                    content={descriptionContent}
                    icon={<Briefcase className="w-8 h-8 text-[#1E3A8A]" />}
                />

                <StatsSection
                    title="IBP Academy in Numbers"
                    subtitle="Sustainable business and technology education platform"
                    stats={statsData}
                    backgroundColor="bg-gradient-to-r from-[#1E3A8A] to-blue-600"
                />

                <RequirementsSection
                    title="Participant Requirements"
                    subtitle="Requirements to join IBP Academy BCC 2025"
                    requirements={requirementsData}
                />

                <TimelineSection
                    title="IBP Academy 2025 Timeline"
                    items={timelineData}
                />

                <PrizeSection
                    title="Prizes & Recognition"
                    prizes={prizeData}
                    specialAwards={specialAwards}
                />

                <CTASection
                    buttons={ctaButtons}
                />

                <ContactSection
                    title="Contact Us"
                    subtitle="For more information about IBP Academy BCC"
                    contacts={contactPersons}
                />
            </div>
            <Footer />

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