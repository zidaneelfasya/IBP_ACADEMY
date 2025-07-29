import { AppSidebar } from "@/Components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/Components/ui/sidebar";
import { SiteHeader } from "@/Components/site-header";
import { ReactNode } from "react";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar variant="inset" />

                <div className="flex flex-1 flex-col">
                    <SiteHeader />

                    <SidebarInset>
                        <main className="flex-1 p-4 md:p-6">{children}</main>
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    );
}
