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
            title: "Opening Ceremony 2024",
            description:
                "Pembukaan resmi IBP Academy dengan sambutan dari berbagai stakeholder dan peserta dari seluruh Indonesia.",
            id: 1,
            icon: <Calendar className="h-[16px] w-[16px] text-white" />,
            color: "from-blue-600 to-purple-700",
            imageUrl: "/image/img6.JPG",
        },
        {
            title: "Competition Highlights",
            description:
                "Momen-momen terbaik dari berbagai kompetisi: Business Case, Business Plan, dan Innovation Competition.",
            id: 2,
            icon: <Trophy className="h-[16px] w-[16px] text-white" />,
            color: "from-green-600 to-blue-600",
            imageUrl: "/image/img2.JPG",
        },
        {
            title: "Team Collaboration",
            description:
                "Kerjasama tim yang solid dan strategi inovatif dari para peserta dalam menghadapi berbagai tantangan bisnis.",
            id: 3,
            icon: <Users className="h-[16px] w-[16px] text-white" />,
            color: "from-orange-600 to-pink-600",
            imageUrl: "/image/img4.JPG",
        },
        {
            title: "Winners Celebration",
            description:
                "Perayaan pencapaian para juara dan apresiasi untuk semua peserta yang telah memberikan yang terbaik.",
            id: 4,
            icon: <Award className="h-[16px] w-[16px] text-white" />,
            color: "from-purple-600 to-red-600",
            imageUrl: "/image/img1.JPG",
        },
        {
            title: "Networking Sessions",
            description:
                "Sesi networking yang mempertemukan peserta dengan mentor, industri, dan sesama entrepreneur muda.",
            id: 5,
            icon: <Target className="h-[16px] w-[16px] text-white" />,
            color: "from-indigo-600 to-purple-600",
            imageUrl: "/image/img3.JPG",
        },
        {
            title: "Innovation Showcase",
            description:
                "Pameran inovasi dan ide-ide kreatif dari para peserta yang menunjukkan potensi masa depan bisnis Indonesia.",
            id: 6,
            icon: <Lightbulb className="h-[16px] w-[16px] text-white" />,
            color: "from-cyan-600 to-blue-600",
            imageUrl: "/image/img7.JPG",
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
                                        Tahun 2024 menjadi tonggak bersejarah
                                        bagi IBP Academy dengan partisipasi
                                        lebih dari
                                        <span className="font-semibold text-blue-300">
                                            {" "}
                                            500 peserta{" "}
                                        </span>
                                        dari berbagai universitas di Indonesia.
                                        Melalui kompetisi bisnis yang inovatif,
                                        workshop intensif, dan networking yang
                                        bermakna, kami berhasil menciptakan
                                        ekosistem pembelajaran yang
                                        menginspirasi generasi entrepreneur muda
                                        Indonesia.
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

                    {/* Call to Action */}
                    {/* <div className="mt-16 text-center">
                        <div className="inline-flex flex-col items-center gap-4 sm:flex-row">
                            <button className="relative px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform rounded-full shadow-xl group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:scale-105">
                                <span className="relative z-10">
                                    See Full Recap
                                </span>
                                <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:opacity-20" />
                            </button>
                            <button className="px-8 py-4 text-lg font-medium text-white transition-all duration-300 border rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20">
                                Download Highlights
                            </button>
                        </div>
                    </div> */}
                </div>
            </section>
        </div>
    );
};

export default RecapSection;
