import React from "react";
import {
    Calendar,
    Trophy,
    Users,
    Award,
    Target,
    Lightbulb,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";

type ImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

const Image: React.FC<ImageProps> = ({ src, alt, width, height, className }) => (
  <img 
    src={src} 
    alt={alt} 
    width={width} 
    height={height} 
    className={className}
    loading="lazy"
  />
);

const RecapSection = () => {
    const recapItems = [
        {
            title: "Opening Ceremony 2024",
            description: "Pembukaan resmi IBP Academy dengan sambutan dari berbagai stakeholder dan peserta dari seluruh Indonesia.",
            id: 1,
            icon: <Calendar className="h-[16px] w-[16px] text-white" />,
            color: "from-blue-600 to-purple-700",
            imageUrl: "/image/img6.JPG",
            size: "large"
        },
        {
            title: "Competition Highlights",
            description: "Momen-momen terbaik dari berbagai kompetisi: Business Case, Business Plan, dan Innovation Competition.",
            id: 2,
            icon: <Trophy className="h-[16px] w-[16px] text-white" />,
            color: "from-green-600 to-blue-600",
            imageUrl: "/image/img2.JPG",
            size: "small"
        },
        {
            title: "Team Collaboration",
            description: "Kerjasama tim yang solid dan strategi inovatif dari para peserta dalam menghadapi berbagai tantangan bisnis.",
            id: 3,
            icon: <Users className="h-[16px] w-[16px] text-white" />,
            color: "from-orange-600 to-pink-600",
            imageUrl: "/image/img4.JPG",
            size: "medium"
        },
        {
            title: "Winners Celebration",
            description: "Perayaan pencapaian para juara dan apresiasi untuk semua peserta yang telah memberikan yang terbaik.",
            id: 4,
            icon: <Award className="h-[16px] w-[16px] text-white" />,
            color: "from-purple-600 to-red-600",
            imageUrl: "/image/img1.JPG",
            size: "small"
        },
        {
            title: "Networking Sessions",
            description: "Sesi networking yang mempertemukan peserta dengan mentor, industri, dan sesama entrepreneur muda.",
            id: 5,
            icon: <Target className="h-[16px] w-[16px] text-white" />,
            color: "from-indigo-600 to-purple-600",
            imageUrl: "/image/img3.JPG",
            size: "small"
        },
        {
            title: "Innovation Showcase",
            description: "Pameran inovasi dan ide-ide kreatif dari para peserta yang menunjukkan potensi masa depan bisnis Indonesia.",
            id: 6,
            icon: <Lightbulb className="h-[16px] w-[16px] text-white" />,
            color: "from-cyan-600 to-blue-600",
            imageUrl: "/image/img7.JPG",
            size: "large"
        },
                {
            title: "Innovation Showcase",
            description: "Pameran inovasi dan ide-ide kreatif dari para peserta yang menunjukkan potensi masa depan bisnis Indonesia.",
            id: 6,
            icon: <Lightbulb className="h-[16px] w-[16px] text-white" />,
            color: "from-cyan-600 to-blue-600",
            imageUrl: "/image/img7.JPG",
            size: "small"
        },
    ];

    // Mengambil item berdasarkan urutan layout yang diinginkan
    const [firstLargeItem, secondLargeItem] = recapItems.filter(item => item.size === "large");
    const mediumItem = recapItems.find(item => item.size === "medium");
    const smallItems = recapItems.filter(item => item.size === "small");

    return (
        <div>
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
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

                    <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-600/30 blur-3xl" />
                    <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 rounded-full w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-pink-600/30 blur-3xl" />
                    <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 blur-2xl" />

                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-900/50" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900/60 via-blue-900/30 to-transparent" />
                </div>

                <div className="container relative z-10 px-4 mx-auto">
                    <div className="flex flex-col items-start gap-8 lg:flex-row">
                        <div className="flex flex-col items-start justify-center lg:w-1/3">
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

                        <div className="lg:w-2/3">
                            <div className="mb-12">
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

                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Baris pertama: large image dan medium image */}
                            {firstLargeItem && (
                                <Card className="md:col-span-2 lg:col-span-2 overflow-hidden group">
                                    <CardContent className="relative p-0">
                                        <Image
                                            src={firstLargeItem.imageUrl}
                                            alt={firstLargeItem.title}
                                            width={600}
                                            height={400}
                                            className="w-full h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                                            <div>
                                                <div className={`inline-flex items-center px-3 py-1 mb-2 text-xs font-medium rounded-full bg-gradient-to-r ${firstLargeItem.color}`}>
                                                    {firstLargeItem.icon}
                                                    <span className="ml-2">{firstLargeItem.title.split(' ')[0]}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white">{firstLargeItem.title}</h3>
                                                <p className="text-sm text-gray-300 line-clamp-2">{firstLargeItem.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {mediumItem && (
                                <Card className="overflow-hidden group">
                                    <CardContent className="relative p-0">
                                        <Image
                                            src={mediumItem.imageUrl}
                                            alt={mediumItem.title}
                                            width={300}
                                            height={400}
                                            className="w-full h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                                            <div>
                                                <div className={`inline-flex items-center px-3 py-1 mb-2 text-xs font-medium rounded-full bg-gradient-to-r ${mediumItem.color}`}>
                                                    {mediumItem.icon}
                                                    <span className="ml-2">{mediumItem.title.split(' ')[0]}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-white">{mediumItem.title}</h3>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Baris kedua: 3 small images */}
                            {smallItems.slice(0, 3).map((item) => (
                                <Card key={item.id} className="overflow-hidden group">
                                    <CardContent className="relative p-0">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title}
                                            width={300}
                                            height={300}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                                            <div>
                                                <div className={`inline-flex items-center px-2 py-1 mb-1 text-xs font-medium rounded-full bg-gradient-to-r ${item.color}`}>
                                                    {item.icon}
                                                </div>
                                                <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Baris ketiga: large image dan small image */}
                            {secondLargeItem && (
                                <Card className="md:col-span-2 overflow-hidden group">
                                    <CardContent className="relative p-0">
                                        <Image
                                            src={secondLargeItem.imageUrl}
                                            alt={secondLargeItem.title}
                                            width={600}
                                            height={300}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                                            <div>
                                                <div className={`inline-flex items-center px-3 py-1 mb-2 text-xs font-medium rounded-full bg-gradient-to-r ${secondLargeItem.color}`}>
                                                    {secondLargeItem.icon}
                                                    <span className="ml-2">{secondLargeItem.title.split(' ')[0]}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white">{secondLargeItem.title}</h3>
                                                <p className="text-sm text-gray-300 line-clamp-2">{secondLargeItem.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {smallItems[3] && (
                                <Card className="overflow-hidden group">
                                    <CardContent className="relative p-0">
                                        <Image
                                            src={smallItems[3].imageUrl}
                                            alt={smallItems[3].title}
                                            width={300}
                                            height={300}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                                            <div>
                                                <div className={`inline-flex items-center px-2 py-1 mb-1 text-xs font-medium rounded-full bg-gradient-to-r ${smallItems[3].color}`}>
                                                    {smallItems[3].icon}
                                                </div>
                                                <h3 className="text-sm font-bold text-white line-clamp-1">{smallItems[3].title}</h3>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RecapSection;