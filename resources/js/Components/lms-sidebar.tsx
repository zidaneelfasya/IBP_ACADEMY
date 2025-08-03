import { BookOpen, Lock, User, LayoutDashboard, LogOut } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/Components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/Components/ui/tooltip";

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

export function LMSSidebar() {
    return (
        <TooltipProvider delayDuration={300}>
            <Sidebar className="border-r-0">
                <SidebarContent className="bg-primary flex flex-col">
                    {/* Dashboard Menu */}
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={true}
                                        className="text-white/80 hover:text-white hover:bg-white/10 data-[active=true]:bg-accent data-[active=true]:text-primary font-medium"
                                    >
                                        <a
                                            href="/user/dashboard"
                                            className="flex items-center gap-3 px-3 py-2"
                                        >
                                            <LayoutDashboard className="h-5 w-5" />
                                            <span>Dashboard</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Profile Section */}
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        className="text-white/80 hover:text-white hover:bg-white/10 data-[active=true]:bg-accent data-[active=true]:text-primary font-medium"
                                    >
                                        <a
                                            href="/user/profile"
                                            className="flex items-center gap-3 px-3 py-2"
                                        >
                                            <User className="h-5 w-5" />
                                            <span>Profile</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Course Section */}
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        className="text-white/80 hover:text-white hover:bg-white/10 data-[active=true]:bg-accent data-[active=true]:text-primary font-medium"
                                    >
                                        <a
                                            href="#"
                                            className="flex items-center gap-3 px-3 py-2"
                                        >
                                            <course.icon className="h-5 w-5" />
                                            <span>{course.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Form Stages Section */}
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-white/70 text-xs font-medium px-3 py-2">
                            FORMS
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {dashboardStages.map((stage, index) => (
                                    <SidebarMenuItem key={stage.title}>
                                        {stage.status === "locked" ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div>
                                                        <SidebarMenuButton
                                                            asChild
                                                            isActive={false}
                                                            className="text-white/80 hover:text-white hover:bg-white/10 font-medium opacity-50 cursor-not-allowed"
                                                            disabled
                                                        >
                                                            <div className="flex items-center gap-3 px-3 py-2 w-full">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                                                    <span className="text-sm">
                                                                        {
                                                                            stage.title
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <Lock className="h-3 w-3 ml-auto" />
                                                            </div>
                                                        </SidebarMenuButton>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="right"
                                                    className="bg-white text-primary font-medium"
                                                >
                                                    <p>{stage.lockedMessage}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <SidebarMenuButton
                                                asChild
                                                isActive={
                                                    stage.status === "active"
                                                }
                                                className="text-white/80 hover:text-white hover:bg-white/10 data-[active=true]:bg-accent data-[active=true]:text-primary font-medium"
                                            >
                                                <a
                                                    href={stage.url}
                                                    className="flex items-center gap-3 px-3 py-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${
                                                                stage.status ===
                                                                "active"
                                                                    ? "bg-green-400"
                                                                    : "bg-blue-400"
                                                            }`}
                                                        />
                                                        <span className="text-sm">
                                                            {stage.title}
                                                        </span>
                                                    </div>
                                                </a>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Spacer to push logout button to bottom */}
                    <div className="flex-1" />

                    {/* Logout Button */}
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        className="text-white/80 hover:text-white hover:bg-red-600/20 font-medium"
                                    >
                                        <a
                                            href="/logout"
                                            className="flex items-center gap-3 px-3 py-2"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Logout</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </TooltipProvider>
    );
}
