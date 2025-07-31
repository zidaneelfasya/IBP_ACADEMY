import ApplicationLogo from "@/Components/ApplicationLogo";
import { Head } from "@inertiajs/react";
import { Target, Trophy, GitBranch, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SpotlightCard from "@/Components/ReactBits/SpotlightCard/SpotlightCard";

export default function About() {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(
        new Set()
    );
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections(
                            (prev) => new Set([...prev, entry.target.id])
                        );
                    }
                });
            },
            { threshold: 0.1, rootMargin: "50px" }
        );

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const setSectionRef = (id: string) => (el: HTMLElement | null) => {
        sectionRefs.current[id] = el;
    };

    const isVisible = (id: string) => visibleSections.has(id);

    return (
        <>
            <Head title="About IBP 2025" />

            {/* Background container */}
            <div className="relative min-h-screen overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0 z-0 bg-[url('/image/auth/screen2.png')] bg-cover bg-center bg-no-repeat" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#C59400]/90 to-[#C59400]/80" />

                {/* Decorative elements */}
                <div className="absolute w-32 h-32 rounded-full top-20 left-10 bg-white/5 blur-xl animate-pulse"></div>
                <div className="absolute bottom-32 right-16 w-24 h-24 bg-[#19006E]/20 rounded-full blur-lg animate-pulse delay-1000"></div>
                <div className="absolute w-16 h-16 delay-500 rounded-full top-1/2 left-1/4 bg-white/10 blur-md animate-pulse"></div>

                {/* Main content */}
                <div className="relative z-10 min-h-screen">
                    {/* Hero Section */}
                    <section
                        id="hero"
                        ref={setSectionRef("hero")}
                        className={`flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center transition-all duration-1000 transform ${
                            isVisible("hero")
                                ? "translate-y-0 opacity-100"
                                : "translate-y-8 opacity-0"
                        }`}
                    >
                        <div className="max-w-4xl mx-auto">
                            <h1 className="mb-8 text-5xl font-black text-[#19006E] md:text-7xl lg:text-8xl drop-shadow-2xl tracking-tight">
                                ABOUT IBP
                                <span className="block text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#19006E] to-[#411E7A] bg-clip-text text-transparent">
                                    2025
                                </span>
                            </h1>

                            <div className="mb-8 transition-transform duration-300 transform hover:scale-105">
                                <ApplicationLogo className="w-auto h-32 mx-auto md:h-40 lg:h-48 drop-shadow-2xl" />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#19006E]/20 to-[#411E7A]/20 rounded-2xl blur-xl"></div>
                                <p className="relative max-w-3xl px-6 py-4 mx-auto text-lg font-semibold leading-relaxed text-white md:text-xl lg:text-2xl drop-shadow-lg">
                                    IBP (Industrial Business Project) tidak
                                    hanya bertujuan sebagai sebuah{" "}
                                    <span className="font-bold text-yellow-200">
                                        kompetisi bisnis dan teknologi
                                    </span>
                                    , tetapi juga sebagai media{" "}
                                    <span className="font-bold text-yellow-200">
                                        edukasi dan inkubasi bakat
                                    </span>{" "}
                                    bagi peserta yang terdiri dari mahasiswa dan
                                    praktisi muda.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Objectives Section - Left */}
                    <section
                        id="objectives"
                        ref={setSectionRef("objectives")}
                        className="px-4 py-24 bg-gradient-to-r from-black/10 to-transparent"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div
                                className={`flex flex-col lg:flex-row items-center gap-12 transition-all duration-1000 transform ${
                                    isVisible("objectives")
                                        ? "translate-x-0 opacity-100"
                                        : "-translate-x-12 opacity-0"
                                }`}
                            >
                                {/* Icon & Title */}
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-[#19006E] to-[#411E7A] rounded-2xl shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-300">
                                        <Target className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="mb-6 text-4xl font-black text-[#19006E] md:text-5xl drop-shadow-lg">
                                        IBP 2025
                                        <span className="block text-3xl font-bold md:text-4xl">
                                            Objectives
                                        </span>
                                    </h2>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-[#19006E]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                        <div className="relative p-8 transition-all duration-300 border shadow-2xl bg-white/10 backdrop-blur-sm rounded-3xl border-white/20 hover:shadow-3xl hover:bg-white/15">
                                            <p className="text-lg font-medium leading-relaxed text-white md:text-xl">
                                                Menjadi wadah{" "}
                                                <span className="font-bold text-yellow-300">
                                                    pengembangan potensi,
                                                    kreativitas, dan inovasi
                                                </span>{" "}
                                                mahasiswa serta praktisi muda
                                                dalam bidang bisnis dan
                                                teknologi melalui{" "}
                                                <span className="font-bold text-yellow-300">
                                                    kompetisi, edukasi, dan
                                                    inkubasi
                                                </span>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Competition Theme Section - Right */}
                    <section
                        id="theme"
                        ref={setSectionRef("theme")}
                        className="px-4 py-24 bg-gradient-to-l from-black/10 to-transparent"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div
                                className={`flex flex-col lg:flex-row-reverse items-center gap-12 transition-all duration-1000 transform ${
                                    isVisible("theme")
                                        ? "translate-x-0 opacity-100"
                                        : "translate-x-12 opacity-0"
                                }`}
                            >
                                {/* Icon & Title */}
                                <div className="flex-1 text-center lg:text-right">
                                    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-[#C59400] to-[#E6A500] rounded-2xl shadow-2xl transform hover:scale-110 hover:-rotate-3 transition-all duration-300">
                                        <Trophy className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="mb-6 text-4xl font-black text-[#19006E] md:text-5xl drop-shadow-lg">
                                        Competition
                                        <span className="block text-3xl font-bold md:text-4xl">
                                            Theme
                                        </span>
                                    </h2>
                                </div>

                                {/* Spotlight Card */}
                                <SpotlightCard
                                    className="flex-1 custom-spotlight-card bg-gradient-to-r from-[#411E7A] to-[#676898] shadow-2xl"
                                    spotlightColor="rgba(255, 225, 255, 0.3)"
                                >
                                    <p className="text-xl font-bold leading-relaxed text-center text-white md:text-2xl">
                                        "Empowering Young Innovators for{" "}
                                        <span className="text-yellow-300">
                                            Sustainable Industry Transformation
                                        </span>
                                        "
                                    </p>
                                </SpotlightCard>
                                {/* Content */}
                                {/* <div className="flex-1">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#C59400]/30 to-[#19006E]/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
                                        <div className="relative px-8 py-6 bg-gradient-to-r from-[#411E7A] to-[#676898] rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                                            <p className="text-xl font-bold leading-relaxed text-center text-white md:text-2xl">
                                                "Empowering Young Innovators for{" "}
                                                <span className="text-yellow-300">
                                                    Sustainable Industry
                                                    Transformation
                                                </span>
                                                "
                                            </p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </section>

                    {/* Competition Branch Section - Left */}
                    <section
                        id="branch"
                        ref={setSectionRef("branch")}
                        className="px-4 py-24 bg-gradient-to-r from-black/10 to-transparent"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div
                                className={`flex flex-col lg:flex-row items-center gap-12 transition-all duration-1000 transform ${
                                    isVisible("branch")
                                        ? "translate-x-0 opacity-100"
                                        : "-translate-x-12 opacity-0"
                                }`}
                            >
                                {/* Icon & Title */}
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-[#676898] to-[#411E7A] rounded-2xl shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-300">
                                        <GitBranch className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="mb-6 text-4xl font-black text-[#19006E] md:text-5xl drop-shadow-lg">
                                        Competition
                                        <span className="block text-3xl font-bold md:text-4xl">
                                            Branch
                                        </span>
                                    </h2>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-[#676898]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                        <div className="relative p-8 transition-all duration-300 border shadow-2xl bg-white/10 backdrop-blur-sm rounded-3xl border-white/20 hover:shadow-3xl hover:bg-white/15">
                                            <p className="text-lg font-medium leading-relaxed text-white md:text-xl">
                                                Kompetisi terdiri dari beberapa
                                                cabang utama:{" "}
                                                <span className="font-bold text-yellow-300">
                                                    Business Plan
                                                </span>
                                                ,{" "}
                                                <span className="font-bold text-yellow-300">
                                                    Technology Innovation
                                                </span>
                                                , dan{" "}
                                                <span className="font-bold text-yellow-300">
                                                    Startup Pitching
                                                </span>{" "}
                                                yang terbuka untuk mahasiswa dan
                                                praktisi muda di seluruh
                                                Indonesia.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Series of Activities Section - Right */}
                    <section
                        id="activities"
                        ref={setSectionRef("activities")}
                        className="px-4 py-24 pb-32 bg-gradient-to-l from-black/10 to-transparent"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div
                                className={`flex flex-col lg:flex-row-reverse items-center gap-12 transition-all duration-1000 transform ${
                                    isVisible("activities")
                                        ? "translate-x-0 opacity-100"
                                        : "translate-x-12 opacity-0"
                                }`}
                            >
                                {/* Icon & Title */}
                                <div className="flex-1 text-center lg:text-right">
                                    <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-[#E6A500] to-[#C59400] rounded-2xl shadow-2xl transform hover:scale-110 hover:-rotate-3 transition-all duration-300">
                                        <Calendar className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="mb-6 text-4xl font-black text-[#19006E] md:text-5xl drop-shadow-lg">
                                        Series of Activities
                                        <span className="block text-3xl font-bold md:text-4xl">
                                            for IBP 2025
                                        </span>
                                    </h2>
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-[#C59400]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                                        <div className="relative p-8 transition-all duration-300 border shadow-2xl bg-white/10 backdrop-blur-sm rounded-3xl border-white/20 hover:shadow-3xl hover:bg-white/15">
                                            <p className="text-lg font-medium leading-relaxed text-white md:text-xl">
                                                Rangkaian kegiatan IBP 2025
                                                meliputi:{" "}
                                                <span className="font-bold text-yellow-300">
                                                    seminar, workshop,
                                                    mentoring, kompetisi,
                                                    inkubasi
                                                </span>
                                                , hingga{" "}
                                                <span className="font-bold text-yellow-300">
                                                    awarding night
                                                </span>{" "}
                                                yang dirancang untuk mendukung
                                                pengembangan peserta secara
                                                holistik.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }

                .shadow-3xl {
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                }

                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .5;
                    }
                }
            `}</style>
        </>
    );
}
