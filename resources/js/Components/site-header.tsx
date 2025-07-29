import { Separator } from "@/Components/ui/separator";
import { SidebarTrigger } from "@/Components/ui/sidebar";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/Components/theme-toggle";

export function SiteHeader({ className }: { className?: string }) {
    return (
        <header
            className={cn(
                "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 h-12",
                "flex shrink-0 items-center transition-[width,height] ease-linear",
                className
            )}
        >
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />

                <div className="flex items-center gap-2">
                    <ApplicationLogo className="h-6 w-6 text-foreground" />
                    <h1 className="text-foreground font-medium tracking-tight">
                        IBP ACADEMY
                    </h1>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {/* You can add additional header items here like user menu, notifications, etc. */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
