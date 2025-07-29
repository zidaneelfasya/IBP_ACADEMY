import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 relative">
            <div className="fixed inset-0 bg-[url('/image/auth/screen2.png')] bg-cover bg-center bg-no-repeat" />
            <div className="fixed inset-0 bg-gradient-to-br from-[#ffe86f]/70 to-[#fba131]/70" />
            <div className="relative w-full max-w-md px-6 py-8">
                <div className="flex justify-center mb-6">
                    <Link href="/">
                        <ApplicationLogo className="w-28 h-28 fill-current text-gray-800 drop-shadow-lg" />
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary tracking-wider">
                        WELCOME TO
                    </h1>
                    <h2 className="text-4xl font-extrabold text-primary mt-2 tracking-wide">
                        IBP ACADEMY 2025
                    </h2>
                </div>

                <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/40 p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
