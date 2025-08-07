"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { CheckCircle, Clock, FileText, Target, Trophy, UserPlus, Users, Lightbulb, GitBranch, Briefcase } from "lucide-react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import RegistrationExistsModal from "@/Components/RegistrationExistsModal";

// Import sections
import HeroSection from "@/Components/sections/bpc-sections/HeroSection";
import VisualSection from "@/Components/sections/bpc-sections/VisualSection";
import DescriptionSection from "@/Components/sections/bpc-sections/DescriptionSection";
import TimelineSection from "@/Components/sections/bpc-sections/TimelineSection";
import PrizeSection from "@/Components/sections/bpc-sections/PrizeSection";
import CTASection from "@/Components/sections/bpc-sections/CTASection";
import ContactSection from "@/Components/sections/bpc-sections/ContactSection";
import RequirementsSection from "@/Components/sections/bcc-sections/RequirementsSection";
import StatsSection from "@/Components/sections/bcc-sections/StatsSection";
import ProcessSection from "@/Components/sections/bcc-sections/ProcessSection";

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

const BusinessPlanCompetition: React.FC = () => {
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

    const requirementsData = [
        {
            title: "Team of 3 Members",
            description:
                "Each team consists of maximum 2 members with 1 team leader (1 leader + 2 members)",
            icon: <Users className="w-6 h-6 text-blue-600" />,
        },
        {
            title: "Active Undergraduate Students",
            description:
                "Open for active S1/D4 students from accredited universities worldwide",
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        },
        {
            title: "Complete Documentation",
            description:
                "Student ID, twibbon proof, Instagram follow & story screenshot",
            icon: <FileText className="w-6 h-6 text-purple-600" />,
        },
        {
            title: "Full Program Commitment",
            description:
                "Must participate in all IBP Academy phases from preliminary to final",
            icon: <Clock className="w-6 h-6 text-orange-600" />,
        },
    ];

    const processSteps = [
        {
            title: "Registration",
            description: "Team registration and document verification",
            icon: <UserPlus className="w-8 h-8" />,
            color: "bg-gradient-to-r from-blue-500 to-blue-600",
        },
        {
            title: "Preliminary Round",
            description: "Business plan submission and initial evaluation",
            icon: <FileText className="w-8 h-8" />,
            color: "bg-gradient-to-r from-purple-500 to-purple-600",
        },
        {
            title: "Semifinal Round",
            description: "Advanced development with LMS access and mentoring",
            icon: <Lightbulb className="w-8 h-8" />,
            color: "bg-gradient-to-r from-green-500 to-green-600",
        },
        {
            title: "Final Round",
            description: "Presentation at IBP International Day",
            icon: <Trophy className="w-8 h-8" />,
            color: "bg-gradient-to-r from-yellow-500 to-orange-500",
        },
    ];

    const timelineData = [
        {
            date: "August 8 - 21, 2025",
            phase: "Phase 1 Registration",
            description: "Team registration and document submission period",
        },
        {
            date: "August 15 - 31, 2025",
            phase: "Preliminary Round",
            description: "Business plan development and initial submission",
        },
        {
            date: "September 9 - 23, 2025",
            phase: "Semifinal Round",
            description: "Advanced development with IBP Academy LMS access",
        },
        {
            date: "October 25 - 26, 2025",
            phase: "Final Presentation",
            description: "IBP International Day judging and awarding",
        },
    ];

    const prizeData = [
        {
            title: "Champion",
            prize: "Rp 25,000,000",
            benefits: "+ Trophy + Certificate + LMS Access",
            gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
            icon: "🏆",
        },
        {
            title: "1st Runner-up",
            prize: "Rp 15,000,000",
            benefits: "+ Trophy + Certificate + LMS Access",
            gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
            icon: "🥈",
        },
        {
            title: "2nd Runner-up",
            prize: "Rp 10,000,000",
            benefits: "+ Trophy + Certificate + LMS Access",
            gradient: "bg-gradient-to-br from-green-400 to-green-600",
            icon: "🥉",
        },
    ];

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

    const specialAwards = [
        "🎯 Special Awards: Best Innovation, Most Sustainable Solution, Best Implementation",
        "💼 Business incubation opportunities through IBP Academy",
        "🌟 Exclusive access to mentor and investor networks",
    ];

    const ctaButtons = [
        {
            text: "📘 Download BPC Guideline",
            href: "/files/ibp-business-plan-guideline.pdf",
            type: "secondary" as const,
            icon: <FileText className="w-6 h-6" />,
            external: true,
        },
        {
            text: "🚀 Register Your Team",
            href: route("competition.bpc.register.create"),
            type: "primary" as const,
            icon: <UserPlus className="w-6 h-6" />,
            external: false,
        },
    ];

    const contactPersons = [
        {
            name: "Tiara Ramadhani",
            whatsapp: "+62 821-6702-7236",
            role: "BPC Coordinator"
        },
        {
            name: "Najwa Laili",
            whatsapp: "+62 813-3338-4548",
            role: "Technical Support"
        },
    ];

    const descriptionContent = [
        "The IBP Academy Business Plan Competition (BPC) is a flagship program designed to transform innovative ideas into viable business solutions through our 'From Curiosity to Creation' approach. As part of the Industrial Business Project ecosystem, BPC challenges participants to develop sustainable business models aligned with SDGs.",

        "Participants gain access to the IBP Academy LMS platform featuring business and technology modules, expert mentoring, and networking opportunities with industry practitioners and investors. The competition emphasizes practical implementation, with finalists presenting at IBP International Day.",

        "Beyond competition, BPC serves as an incubation platform where participants continue developing their projects post-event through IBP Academy's learning management system and professional network."
    ];

    return (
        <>
            <Navbar />
            <Head title="Business Plan Competition - IBP Academy 2025" />

            <div className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <HeroSection 
                    title="Business Plan Competition" 
                    backUrl="/"
                />

                <VisualSection
                    images={{
                        main: "/image/bpc/bpc1.JPG",
                        secondary: [
                            "/image/bpc/bpc2.JPG",
                            "/image/bpc/bpc3.JPG",
                        ],
                    }}
                />

                <DescriptionSection
                    title="About IBP Academy BPC"
                    content={descriptionContent}
                    icon={<Briefcase className="w-8 h-8 text-[#1E3A8A]" />}
                />

                <StatsSection
                    title="IBP Academy Impact"
                    subtitle="Sustainable business education platform"
                    stats={statsData}
                    backgroundColor="bg-gradient-to-r from-[#1E3A8A] to-blue-600"
                />

                {/* <ProcessSection
                    title="Competition Journey"
                    subtitle="The IBP Academy BPC experience"
                    steps={processSteps}
                /> */}

                <RequirementsSection
                    title="Eligibility Criteria"
                    subtitle="Requirements for IBP Academy BPC 2025"
                    requirements={requirementsData}
                />

                <TimelineSection
                    title="Competition Timeline"
                    items={timelineData}
                />

                <PrizeSection
                    title="Awards & Benefits"
                    prizes={prizeData}
                    specialAwards={specialAwards}
                />

                <CTASection
                    buttons={ctaButtons}
                />

                <ContactSection
                    title="Our Team"
                    subtitle="Contact the BPC organizing committee"
                    contacts={contactPersons}
                />
            </div>
            <Footer />

            {flash?.existingRegistration && flash?.category ? (
                <RegistrationExistsModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    registration={flash.existingRegistration}
                    category={flash.category}
                />
            ) : showModal ? (
                <RegistrationExistsModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    registration={{
                        id: 1,
                        registration_number: "BPC202508001",
                        tim_name: "Sample Team",
                        asal_universitas: "Sample University",
                        prodi_fakultas: "Sample Faculty",
                        leader_name: "Team Leader",
                        leader_email: "team@example.com",
                        leader_phone: "+628123456789",
                        status: "pending",
                        created_at: new Date().toISOString(),
                    }}
                    category={{
                        id: 1,
                        name: "BPC",
                        full_name: "Business Plan Competition",
                    }}
                />
            ) : null}
        </>
    );
};

export default BusinessPlanCompetition;