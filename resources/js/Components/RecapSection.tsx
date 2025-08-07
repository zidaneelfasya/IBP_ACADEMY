import React from "react";
import Carousel from "./ReactBits/Carousel";
import {
    Calendar,
    Trophy,
    Users,
    Award,
    Target,
    Lightbulb,
} from "lucide-react";

const RecapSection = () => {
    // IBP Academy specific carousel items
    const recapItems = [
        {
            title: "2024 Opening Ceremony",
            description:
                "The official opening of IBP Academy with welcome speeches from various stakeholders and participants from across Indonesia.",
            id: 1,
            icon: <Calendar className="h-[16px] w-[16px] text-white" />,
            color: "from-blue-600 to-purple-700",
            imageUrl: "/image/img6.jpeg",
        },
        {
            title: "Competition Highlights",
            description:
                "The best moments from various competitions: Business Case, Business Plan, and Innovation Competition.",
            id: 2,
            icon: <Trophy className="h-[16px] w-[16px] text-white" />,
            color: "from-green-600 to-blue-600",
            imageUrl: "/image/img2.jpeg",
        },
        {
            title: "Team Collaboration",
            description:
                "Solid teamwork and innovative strategies from participants in facing various business challenges.",
            id: 3,
            icon: <Users className="h-[16px] w-[16px] text-white" />,
            color: "from-orange-600 to-pink-600",
            imageUrl: "/image/img4.jpeg",
        },
        {
            title: "Winners Celebration",
            description:
                "Celebration of the champions' achievements and appreciation for all participants who gave their best.",
            id: 4,
            icon: <Award className="h-[16px] w-[16px] text-white" />,
            color: "from-purple-600 to-red-600",
            imageUrl: "/image/img1.jpeg",
        },
        {
            title: "Networking Sessions",
            description:
                "Networking sessions connecting participants with mentors, industry professionals, and fellow young entrepreneurs.",
            id: 5,
            icon: <Target className="h-[16px] w-[16px] text-white" />,
            color: "from-indigo-600 to-purple-600",
            imageUrl: "/image/img3.jpeg",
        },
        {
            title: "Innovation Showcase",
            description:
                "Exhibition of innovations and creative ideas from participants showcasing the future potential of Indonesian business.",
            id: 6,
            icon: <Lightbulb className="h-[16px] w-[16px] text-white" />,
            color: "from-cyan-600 to-blue-600",
            imageUrl: "/image/img7.jpeg",
        },
    ];

    return (
        <div>
            {/* Modern Background with Gradient */}
            <section className="relative py-24 overflow-hidden">
                {/* Enhanced Background with Modern Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
                    {/* Geometric Grid Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                            `,
                                backgroundSize: "50px 50px",
                            }}
                        />
                    </div>

                    {/* Gradient Mesh Orbs */}
                    <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 blur-3xl" />
                    <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-pink-600/30 blur-3xl" />
                    <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 blur-2xl" />

                    {/* Radial Gradients */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/50" />

                    {/* Bottom flow gradient for seamless transition */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900/60 via-blue-900/30 to-transparent" />
                </div>

                <div className="container relative z-10 px-4 mx-auto">
                    <div className="flex flex-col items-start gap-8 lg:flex-row">
                        {/* Title Section with Glass Effect */}
                        <div className="flex flex-col items-start justify-center lg:w-1/3">
                            {/* Glass Badge */}
                            <div className="inline-flex items-center px-4 py-2 mb-6 border rounded-full bg-white/10 backdrop-blur-sm border-white/20">
                                <Trophy className="w-4 h-4 mr-2 text-blue-300" />
                                <span className="text-sm font-medium text-white">
                                    Event Highlights
                                </span>
                            </div>

                            <h2 className="mb-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
                                IBP Recap
                                <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                                    2024
                                </span>
                            </h2>
                        </div>

                        {/* Content Section */}
                        <div className="lg:w-2/3">
                            <div className="mb-12">
                                {/* Glass Morphism Container */}
                                <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
                                    <p className="text-lg leading-relaxed text-gray-200 lg:text-xl">
                                        The year 2024 marked a historic
                                        milestone for IBP Academy with
                                        participation from over
                                        <span className="font-semibold text-blue-300">
                                            {" "}
                                            500 participants{" "}
                                        </span>
                                        from various universities across
                                        Indonesia. Through innovative business
                                        competitions, intensive workshops, and
                                        meaningful networking, we successfully
                                        created a learning ecosystem that
                                        inspires the next generation of young
                                        Indonesian entrepreneurs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Section - Full Width and Centered */}
                    <div className="flex items-center justify-center mt-16">
                        <Carousel
                            items={recapItems}
                            baseWidth={800}
                            autoplay={true}
                            autoplayDelay={4000}
                            pauseOnHover={true}
                            loop={false}
                            round={false}
                            showImageOnCard={true}
                            showThumbnails={false}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RecapSection;
