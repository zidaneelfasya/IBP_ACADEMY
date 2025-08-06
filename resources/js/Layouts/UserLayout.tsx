import { Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import { SiteHeaderLMS } from "@/Components/site-header-lms";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UserLayoutProps {
    children: ReactNode;
    title?: string;
    className?: string;
    showBreadcrumb?: boolean;
    breadcrumbItems?: Array<{
        label: string;
        href?: string;
        isActive?: boolean;
    }>;
}

export default function UserLayout({
    children,
    title = "Dashboard",
    className,
    showBreadcrumb = false,
    breadcrumbItems = [],
}: UserLayoutProps) {
    return (
        <>
            <Head title={`${title} - IBP Academy`} />

            {/* Header */}
            <SiteHeaderLMS />

            {/* Main Content */}
            <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background">
                {/* Breadcrumb Section */}
                {showBreadcrumb && breadcrumbItems.length > 0 && (
                    <div className="border-b bg-background">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                            <nav className="flex items-center space-x-1 sm:space-x-2 text-sm text-muted-foreground overflow-x-auto">
                                {breadcrumbItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center whitespace-nowrap"
                                    >
                                        {index > 0 && (
                                            <svg
                                                className="mx-1 sm:mx-2 h-4 w-4 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        )}
                                        {item.href && !item.isActive ? (
                                            <a
                                                href={item.href}
                                                className="hover:text-primary transition-colors"
                                            >
                                                {item.label}
                                            </a>
                                        ) : (
                                            <span
                                                className={cn(
                                                    item.isActive &&
                                                        "text-primary font-medium"
                                                )}
                                            >
                                                {item.label}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <ScrollArea className="flex-1">
                    <main className={cn("w-full", className)}>
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                            {/* Page Header */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
                                        {title}
                                    </h1>
                                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
                                        Welcome back to IBP Academy
                                    </p>
                                </div>

                                {/* ibp academy */}
                                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">



                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="w-full">{children}</div>
                        </div>
                    </main>
                </ScrollArea>
            </div>
        </>
    );
}
