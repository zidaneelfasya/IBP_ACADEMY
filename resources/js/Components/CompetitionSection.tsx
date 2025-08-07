const CompetitionSection: React.FC = () => {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Enhanced Background with Modern Effects - Rotated for seamless connection */}
            <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900 via-blue-900 to-slate-900">
                {/* Geometric Grid Pattern - Rotated */}
                <div className="absolute inset-0 transform rotate-45 opacity-20">
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

                {/* Gradient Mesh Orbs - Repositioned for flow */}
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-purple-400/30 to-blue-600/30 blur-3xl" />
                <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-pink-400/30 to-indigo-600/30 blur-3xl" />
                <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 right-1/4 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 blur-2xl" />

                {/* Additional orb for better flow */}
                <div className="absolute transform rounded-full w-80 h-80 translate-x-1/3 -translate-y-1/3 top-1/4 left-1/2 bg-gradient-to-br from-violet-400/25 to-purple-600/25 blur-3xl" />

                {/* Radial Gradients - Rotated */}
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-indigo-900/50" />

                {/* Additional flowing gradient for seamless connection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/30 via-transparent to-blue-900/30" />
            </div>

            <div className="container relative z-10 px-4 mx-auto">
                {/* Glass Badge */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center px-6 py-3 border rounded-full bg-white/10 backdrop-blur-sm border-white/20">
                        <span className="text-base font-medium text-white">
                            Main Competitions
                        </span>
                    </div>
                </div>

                <h2 className="mb-6 text-5xl font-bold leading-tight text-center text-white lg:text-6xl">
                    Competition
                    <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                        Programs
                    </span>
                </h2>

                <div className="max-w-3xl mx-auto mb-16 text-center">
                    <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-md rounded-2xl border-white/20">
                        <p className="text-lg leading-relaxed text-gray-200 lg:text-xl">
                            Join our challenging and inspiring business
                            competitions. Hone your analytical skills,
                            creativity, and entrepreneurial spirit through
                            competitions specifically designed to develop the
                            best potential of Indonesian students.
                        </p>
                    </div>
                </div>

                <div className="grid max-w-6xl gap-8 mx-auto md:grid-cols-2">
                    {/* Business Plan Competition Card */}
                    <div className="overflow-hidden transition-all duration-300 border shadow-2xl bg-white/15 backdrop-blur-lg border-white/25 rounded-3xl hover:shadow-3xl hover:scale-105">
                        <div className="p-8 bg-gradient-to-r from-yellow-400/90 to-orange-500/90 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-center text-white lg:text-3xl">
                                Business Plan Competition (BPC)
                            </h3>
                        </div>
                        <div className="p-8">
                            <p className="mb-8 text-base leading-relaxed text-gray-200 lg:text-lg">
                                A business plan competition that challenges
                                participants to develop innovative and
                                sustainable business ideas. Present your
                                entrepreneurial vision and business strategies
                                that can make a positive impact on society.
                            </p>
                            <div className="text-center">
                                <button className="relative px-8 py-3 text-base font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 lg:text-lg">
                                    <span className="relative z-10">
                                        More Information
                                    </span>
                                    <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:opacity-20" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Business Case Competition Card */}
                    <div className="overflow-hidden transition-all duration-300 border shadow-2xl bg-white/15 backdrop-blur-lg border-white/25 rounded-3xl hover:shadow-3xl hover:scale-105">
                        <div className="p-8 bg-gradient-to-r from-yellow-400/90 to-orange-500/90 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-center text-white lg:text-3xl">
                                Business Case Competition (BCC)
                            </h3>
                        </div>
                        <div className="p-8">
                            <p className="mb-8 text-base leading-relaxed text-gray-200 lg:text-lg">
                                In-depth analysis of real business cases that
                                test your strategic thinking and problem-solving
                                skills. Develop innovative solutions to
                                contemporary business challenges with a
                                comprehensive analytical approach.
                            </p>
                            <div className="text-center">
                                <button className="relative px-8 py-3 text-base font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 lg:text-lg">
                                    <span className="relative z-10">
                                        More Information
                                    </span>
                                    <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:opacity-20" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CompetitionSection;
