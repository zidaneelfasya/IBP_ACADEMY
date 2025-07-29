import React from "react";

const RecapSection = () => {
    return (
        <div>
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Title */}
                        <div className="w-max flex items-center justify-center">
                            <h2 className="text-6xl font-bold text-purple-800 whitespace-nowrap">
                                IBP Recap
                            </h2>
                        </div>

                        {/* Paragraph */}
                        <div className="flex-1">
                            <div className="my-2 md:my-8">
                                <p className="text-md md:text-lg font-medium text-black">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Doloribus cum at ea? Cum
                                    vero, illum ex saepe reprehenderit odit at
                                    officia quod, maxime tempore maiores optio.
                                    Ad sequi expedita sint error voluptas beatae
                                    exercitationem laboriosam, magnam minima,
                                    totam excepturi aut iste consequuntur
                                    laborum minus in, quasi mollitia libero
                                    earum sit?
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stretched text section similar to the image */}

                    <div className="mt-12 flex flex-wrap justify-center items-stretch gap-4">
                        {/* Left small images */}
                        <div className="flex flex-col gap-4 items-stretch">
                            <div className="overflow-hidden rounded-lg w-32 md:w-64 h-32 md:h-40">
                                <img
                                    src="/asset/bg-hero.jpg"
                                    alt=""
                                    className=" object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-lg w-32 md:w-64 h-32 md:h-40">
                                <img
                                    src="/asset/bg-hero.jpg"
                                    alt=""
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Center large images */}
                        <div className="flex gap-4 items-stretch">
                            <div className="overflow-hidden rounded-lg w-40 md:w-64 h-[172px] md:h-[336px]">
                                <img
                                    src="/asset/coba.jpg"
                                    alt=""
                                    className="object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-lg w-40 md:w-64 h-[172px] md:h-[336px]">
                                <img
                                    src="/asset/coba.jpg"
                                    alt=""
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Right small images */}
                        <div className="flex flex-col gap-4 items-stretch">
                            <div className="overflow-hidden rounded-lg w-32 md:w-64 h-32 md:h-40">
                                <img
                                    src="/asset/bg-hero.jpg"
                                    alt=""
                                    className=" object-cover"
                                />
                            </div>
                            <div className="overflow-hidden rounded-lg w-32 md:w-64 h-32 md:h-40">
                                <img
                                    src="/asset/bg-hero.jpg"
                                    alt=""
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors">
                            See Full Recap
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RecapSection;
