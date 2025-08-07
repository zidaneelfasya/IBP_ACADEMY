import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="bg-gradient-to-br from-[#fb9f32] via-yellow-400 to-[#ffe86f] py-24 relative overflow-hidden min-h-screen">
            {/* Background image */}
            <div className="absolute inset-0 opacity-10">
                <img
                    src="/asset/bg-hero.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Gradient overlays */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-yellow-200 to-transparent transform rotate-12"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-200 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 mt-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Logo section with scale animation */}
                    <motion.div
                        className="w-full md:w-1/2 flex justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <img
                            src="/asset/logo.png"
                            className="w-full max-w-[480px]"
                            alt="IBP 2025 Logo"
                        />
                    </motion.div>

                    {/* Text content with fade-in slide-up */}
                    <motion.div
                        className="w-full md:w-1/2"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="space-y-4">
                            <div className="relative">
                                {/* Background layer */}
                                <motion.span
                                    className="absolute inset-0 text-6xl md:text-7xl lg:text-8xl font-black text-[#1E3A8A]/20 blur-sm"
                                    initial={{ opacity: 0, x: -3, y: 3 }}
                                    animate={{ opacity: 1, x: -3, y: 3 }}
                                    transition={{ duration: 1, delay: 0.4 }}
                                >
                                    IBP 2025
                                </motion.span>

                                {/* Foreground layer */}
                                <motion.span
                                    className="relative block text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-[#1E3A8A] via-blue-600 to-[#1E3A8A] bg-clip-text text-transparent drop-shadow-2xl"
                                    style={{
                                        WebkitTextStroke:
                                            "2px rgba(255, 255, 255, 0.9)",
                                    }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                >
                                    IBP 2025
                                </motion.span>
                            </div>
                        </div>
                        <p className="text-gray-700 text-lg mt-8">
                            IBP (Industrial Business Project) 2025 is an
                            international competition and innovation platform
                            organized by the Business and Entrepreneurship
                            Department of the Industrial Engineering Student
                            Association at Universitas Brawijaya. As a medium
                            for education and talent incubation, IBP aims to
                            provide a comprehensive experience in the future
                            world of industry and entrepreneurship through the
                            implementation of the SDGs.
                        </p>
                    </motion.div>
                </div>

                {/* Grand Theme section with fade-in animation */}
                <motion.div
                    className="mt-16 w-full max-w-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: "easeOut", delay: 0.4 }}
                >
                    <div className="bg-[#082380] text-white px-8 md:px-16 py-4 rounded-full shadow-lg">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="flex flex-col items-center mb-4 md:mb-0 md:mr-8">
                                <div className="flex flex-row">
                                    <div className="text-2xl md:text-4xl font-bold mr-2">
                                        Grand
                                    </div>
                                    <div className="text-2xl md:text-4xl font-bold">
                                        Theme
                                    </div>
                                </div>
                                <div className="text-2xl md:text-4xl font-bold">
                                    IBP 2025
                                </div>
                            </div>
                            <div className="text-sm md:text-base text-center md:text-left">
                                "From Curiosity to Creation" – IBP Academy is a
                                strategic learning platform designed to
                                transform participants' curiosity into real
                                creations. Serving as a bridge between ideas and
                                implementation, participants are challenged to
                                explore critical thinking, learn from top
                                mentors, and create innovative solutions for
                                real-world challenges.
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }

                /* Enhanced shadows */
                .shadow-3xl {
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                }

                /* Smooth transitions */
                .transition-all {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Enhanced backdrop blur */
                .backdrop-blur-sm {
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #1E3A8A, #F59E0B);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #F59E0B, #1E3A8A);
                }

                /* Card hover effects */
                .group:hover .group-hover\\:opacity-5 {
                    opacity: 0.05;
                }

                /* Timeline line animation */
                @keyframes flow {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(2000%); }
                }

                /* Responsive improvements */
                @media (max-width: 768px) {
                    .timeline-card {
                        margin-left: 2rem;
                        width: calc(100% - 2rem);
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;
