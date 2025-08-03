import { Head } from "@inertiajs/react";
import { ReactNode } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { LMSSidebar } from "@/Components/lms-sidebar";
import UserProfile from "@/Components/UserProfile";

interface UserLayoutProps {
    children: ReactNode;
    title?: string;
    defaultOpen?: boolean;
}

export default function UserLayout({
    children,
    title = "Dashboard",
    defaultOpen = true,
}: UserLayoutProps) {
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <Head title={title} />
            <LMSSidebar />
            <SidebarInset>
                <header className="flex h-16 items-center border-b bg-card px-4">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                            <SidebarTrigger className="text-primary" />
                            <div className="flex items-center gap-2">
                                <ApplicationLogo className="h-6 w-6 text-foreground" />
                                <h1 className="font-medium text-foreground">
                                    IBP ACADEMY
                                </h1>
                            </div>
                        </div>
                        <UserProfile />
                    </div>
                </header>
                <main className="bg-background text-foreground">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
