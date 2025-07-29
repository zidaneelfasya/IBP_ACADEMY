const Hero = () => {
    return (
        <section className="bg-gradient-to-br from-orange-400 via-yellow-400 to-yellow-300 py-24 relative overflow-hidden min-h-screen">
            {/* Background image with transparency */}
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
                    {/* Logo section - moved to left */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <img src="/asset/logo.png" className="w-full max-w-[560px]" alt="IBP 2025 Logo" />
                    </div>

                    {/* Text content section - moved to right */}
                    <div className="w-full md:w-1/2">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-purple-800 mb-4">
                            WHAT IS IBP 2025?
                        </h1>
                        <p className="text-gray-700 text-lg">
                            Lorem Ipsum is simply dummy text of the printing
                            and typesetting industry. Lorem Ipsum has been
                            the industry's standard dummy text ever since
                            the 1500s, when an unknown printer took a galley
                            of type and scrambled it to make a type specimen
                            book. It has survived not only five centuries,
                            but also the leap into electronic typesetting,
                            remaining essentially unchanged.
                        </p>
                    </div>
                </div>

                {/* Grand Theme section */}
                <div className="mt-16 w-full max-w-full">
                    <div className="bg-[#3F1D78] text-white px-8 md:px-16 py-4 rounded-full shadow-lg">
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
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen
                                book.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;