const Footer: React.FC = () => {
    return (
        <footer className="bg-[#082e80] text-white py-8">
            <div className="container px-2 mx-auto">
                <div className="flex flex-col items-start justify-between space-y-6 md:flex-row md:space-y-0">
                    <div className="flex items-start space-x-4">
                        <div className="w-32">
                            <img
                                src="/asset/logo.png"
                                alt="IBP Logo"
                                className="w-full h-auto"
                            />
                        </div>
                        <div>
                            <h4 className="font-bold">
                                Industrial Business Project 2025
                            </h4>
                            <p className="text-sm opacity-80">
                                Himpunan Mahasiswa Teknik Industri
                            </p>
                            <p className="text-sm opacity-80">
                                Fakultas Teknik
                            </p>
                            <p className="text-sm opacity-80">
                                Universitas Brawijaya
                            </p>
                            <div className="mt-2 text-xs opacity-60">
                                Jl. Veteran No. 10-11, Ketawanggede,
                                <br />
                                Kec. Lowokwaru, Kota Malang
                                <br />
                                Jawa Timur 65145
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-2 font-bold">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.instagram.com/ibp_ieub/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-8 h-8 bg-white rounded bg-opacity-20 hover:bg-opacity-30 transition-all"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="2"
                                        y="2"
                                        width="20"
                                        height="20"
                                        rx="5"
                                        ry="5"
                                    ></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line
                                        x1="17.5"
                                        y1="6.5"
                                        x2="17.51"
                                        y2="6.5"
                                    ></line>
                                </svg>
                            </a>
                        </div>
                        <p className="mt-2 text-xs opacity-60">@ibp_ieub</p>
                        <p className="text-xs opacity-60">
                            industrialbusinessproject@gmail.com
                        </p>
                    </div>
                </div>

                <div className="pt-4 mt-8 text-xs text-center border-t border-purple-700 opacity-60">
                    © 2025 IBP. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
