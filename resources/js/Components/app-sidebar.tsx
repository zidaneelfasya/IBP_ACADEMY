import * as React from "react";
import {
    ArrowUpCircleIcon,
    BarChartIcon,
    CameraIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    SearchIcon,
    SettingsIcon,
    UsersIcon,
    UsersRound,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { NavDocuments } from "@/Components/nav-documents";
import { NavMain } from "@/Components/nav-main";
import { NavSecondary } from "@/Components/nav-secondary";
import { NavUser } from "@/Components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/Components/ui/sidebar";
import { NavParticipant } from "./nav-participant";

const data = {
    // user: {
    //     name: "shadcn",
    //     email: "m@example.com",
    //     avatar: "/avatars/shadcn.jpg",
    // },
    navMain: [
        {
            title: "Dashboard",
            url: "/admin",
            icon: LayoutDashboardIcon,
        },

        // {
        //     title: "Participants",
        //     url: "/admin/dashboard",
        //     icon: UsersRound,
        // },
        // {
        //     title: "Analytics",
        //     url: "#",
        //     icon: BarChartIcon,
        // },
        {
            title: "Assignment",
            url: "/admin/assignments",
            icon: FolderIcon,
        },
        {
            title: "Course",
            url: "/admin/dashboard/courses",
            icon: ListIcon,
        },
        {
            title: "Competition Stage",
            url: "/admin/dashboard/competition-stages",
            icon: UsersIcon,
        },


    ],
    navClouds: [
        {
            title: "Capture",
            icon: CameraIcon,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: FileTextIcon,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: FileCodeIcon,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: SettingsIcon,
        },
        {
            title: "Get Help",
            url: "#",
            icon: HelpCircleIcon,
        },
        {
            title: "Search",
            url: "#",
            icon: SearchIcon,
        },
    ],
     competitionStages: [
        {
            title: "Participants",
            url: "/admin/dashboard/participant",
            icon: UsersRound,
        },
        {
            title: "Registrasi Awal",
            url: "/admin/dashboard/registrasi-awal",
            icon: DatabaseIcon,
        },
        {
            title: "Preliminary Round",
            url: "/admin/dashboard/preliminary",
            icon: ClipboardListIcon,
        },
        {
            title: "Semifinal Round",
            url: "/admin/dashboard/semifinal",
            icon: FileIcon,
        },
        {
            title: "Final Round",
            url: "/admin/dashboard/final",
            icon: FileIcon,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible="offcanvas"
            {...props}
            className="bg-sidebar text-sidebar-foreground border-r"
        >
            <SidebarHeader className="">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="
                data-[slot=sidebar-menu-button]:!p-1.5
                hover:bg-primary/10
                data-[state=open]:bg-primary/20
              "
                        >
                            <a href="#">
                                <ApplicationLogo className="h-6 w-6 text-foreground" />
                                <span className="text-base font-semibold">
                                    IBP ACADEMY ADMIN
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="">
                <NavMain items={data.navMain} />
                 <div className="px-4 py-2">

                </div>
                <NavParticipant
                    items={data.competitionStages}

                />

                {/* <NavDocuments items={data.documents} /> */}
                <NavSecondary
                    items={data.navSecondary}
                    className="mt-auto  "
                />
            </SidebarContent>
            <SidebarFooter className="">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
