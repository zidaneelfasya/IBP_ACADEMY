import { BookOpen, Lock, User, LayoutDashboard } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/Components/ui/tooltip";
import UserProfile  from "@/Components/UserProfile";
import App from "@/Pages/Landing";
import ApplicationLogo from "./ApplicationLogo";

type StageStatus = "active" | "completed" | "locked";

interface DashboardStage {
    title: string;
    url: string;
    status: StageStatus;
    lockedMessage: string;
}

const dashboardStages: DashboardStage[] = [
    {
        title: "Form Penyisihan",
        url: "/dashboard/elimination",
        status: "active",
        lockedMessage: "Selesaikan tahap penyisihan untuk membuka",
    },
    {
        title: "Form Semifinal",
        url: "/dashboard/semifinal",
        status: "locked",
        lockedMessage: "Hanya tersedia untuk peserta yang lolos semifinal",
    },
    {
        title: "Final",
        url: "/dashboard/final",
        status: "locked",
        lockedMessage: "Hanya tersedia untuk finalis",
    },
];

interface CourseItem {
    title: string;
    url: string;
    icon: typeof BookOpen;
}

const course: CourseItem = {
    title: "Course",
    url: "#",
    icon: BookOpen,
};

export function SiteHeaderLMS() {
    return (
        <TooltipProvider delayDuration={300}>
            <header className="bg-primary border-b border-primary/20 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Title */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <ApplicationLogo className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-white font-bold text-xl">
                                    IBP LMS Platform
                                </h1>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="hidden md:flex items-center gap-8">
                            {/* Dashboard */}
                            <a
                                href="/user/dashboard"
                                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors relative group py-2"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="font-medium">Dashboard</span>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                            </a>

                            {/* Profile */}
                            <a
                                href="/user/profile"
                                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors relative group py-2"
                            >
                                <User className="h-4 w-4" />
                                <span className="font-medium">Profile</span>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                            </a>

                            {/* Course */}
                            <a
                                href="#"
                                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors relative group py-2"
                            >
                                <course.icon className="h-4 w-4" />
                                <span className="font-medium">
                                    {course.title}
                                </span>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                            </a>

                            {/* Form Stages */}
                            {dashboardStages.map((stage, index) => (
                                <div key={stage.title}>
                                    {stage.status === "locked" ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center gap-2 text-white/50 cursor-not-allowed py-2">
                                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                                    <span className="font-medium text-sm">
                                                        {stage.title}
                                                    </span>
                                                    <Lock className="h-3 w-3" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="bottom"
                                                className="bg-white text-primary font-medium"
                                            >
                                                <p>{stage.lockedMessage}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <a
                                            href={stage.url}
                                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors relative group py-2"
                                        >
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    stage.status === "active"
                                                        ? "bg-green-400"
                                                        : "bg-blue-400"
                                                }`}
                                            />
                                            <span className="font-medium text-sm">
                                                {stage.title}
                                            </span>
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* User Profile Dropdown */}
                        <div className="flex items-center">
                            <UserProfile />
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button className="text-white/80 hover:text-white">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu (hidden by default) */}
                    <div className="md:hidden border-t border-primary/20 py-4 space-y-2">
                        <a
                            href="/user/dashboard"
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors py-2"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="font-medium">Dashboard</span>
                        </a>

                        <a
                            href="/user/profile"
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors py-2"
                        >
                            <User className="h-4 w-4" />
                            <span className="font-medium">Profile</span>
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors py-2"
                        >
                            <course.icon className="h-4 w-4" />
                            <span className="font-medium">{course.title}</span>
                        </a>

                        {dashboardStages.map((stage, index) => (
                            <div key={stage.title}>
                                {stage.status === "locked" ? (
                                    <div className="flex items-center gap-2 text-white/50 cursor-not-allowed py-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                                        <span className="font-medium text-sm">
                                            {stage.title}
                                        </span>
                                        <Lock className="h-3 w-3" />
                                    </div>
                                ) : (
                                    <a
                                        href={stage.url}
                                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors py-2"
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                stage.status === "active"
                                                    ? "bg-green-400"
                                                    : "bg-blue-400"
                                            }`}
                                        />
                                        <span className="font-medium text-sm">
                                            {stage.title}
                                        </span>
                                    </a>
                                )}
                            </div>
                        ))}
                        <div className="pt-2 border-t border-primary/20">
                            <UserProfile />
                        </div>
                    </div>
                </div>
            </header>
        </TooltipProvider>
    );
}
