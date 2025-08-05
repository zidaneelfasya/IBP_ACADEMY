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
            <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-50 dark:bg-slate-900">
                {/* Breadcrumb Section */}
                {showBreadcrumb && breadcrumbItems.length > 0 && (
                    <div className="border-b bg-white dark:bg-slate-800">
                        <div className="container mx-auto px-4 py-3">
                            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                                {breadcrumbItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center"
                                    >
                                        {index > 0 && (
                                            <svg
                                                className="mx-2 h-4 w-4"
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
                    <main
                        className={cn("container mx-auto px-4 py-8", className)}
                    >
                        <div className="space-y-8">
                            {/* Page Header */}
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                        {title}
                                    </h1>
                                    <p className="mt-2 text-muted-foreground">
                                        Welcome back to IBP Academy
                                    </p>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex items-center gap-3">
                                    <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                        <svg
                                            className="mr-2 h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        Quick Action
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="rounded-lg border bg-card shadow-sm">
                                <div className="p-6">{children}</div>
                            </div>
                        </div>
                    </main>
                </ScrollArea>
            </div>
        </>
    );
}
