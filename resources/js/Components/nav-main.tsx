"use client";

import {
    MailIcon,
    PlusCircleIcon,
    ChevronRightIcon,
    type LucideIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/Components/ui/button";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuBadge,
} from "@/Components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: string | number;
    description?: string;
    isExternal?: boolean;
    children?: NavItem[];
}

interface NavMainProps {
    items: NavItem[];
    title?: string;
    showQuickActions?: boolean;
    className?: string;
}

// Quick action items for the dropdown
const quickActions = [
    { title: "New Project", icon: PlusCircleIcon, action: "project" },
    { title: "New Task", icon: PlusCircleIcon, action: "task" },
    { title: "New Team", icon: PlusCircleIcon, action: "team" },
    { title: "Import Data", icon: PlusCircleIcon, action: "import" },
];

export function NavMain({
    items,
    title = "Navigation",
    showQuickActions = true,
    className,
}: NavMainProps) {
    const { url: currentUrl } = usePage();
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    // Check if a URL is active (exact match or starts with for nested routes)
    const isActiveUrl = useMemo(() => {
        return (url: string, exact = false) => {
            if (exact) {
                return url === currentUrl;
            }
            // For non-exact matching, still allow nested routes
            if (url === currentUrl) return true;
            if (url !== "/" && currentUrl.startsWith(url + "/")) return true;
            return false;
        };
    }, [currentUrl]);

    // Check if any child is active
    const hasActiveChild = (item: NavItem): boolean => {
        if (!item.children) return false;
        return item.children.some(
            (child) => isActiveUrl(child.url) || hasActiveChild(child)
        );
    };

    // Toggle expanded state for items with children
    const toggleExpanded = (title: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(title)) {
                newSet.delete(title);
            } else {
                newSet.add(title);
            }
            return newSet;
        });
    };

    // Handle quick action selection
    const handleQuickAction = (action: string) => {
        console.log(`Quick action: ${action}`);
        // Implement your quick action logic here
    };

    const renderNavItem = (item: NavItem, level = 0) => {
        // Use exact matching for top-level items, nested for children
        const isActive =
            level === 0 ? isActiveUrl(item.url, true) : isActiveUrl(item.url);
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.title);
        const hasActiveChildItem = hasActiveChild(item);

        return (
            <div key={item.title}>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild={!hasChildren}
                        isActive={isActive || hasActiveChildItem}
                        tooltip={item.description || item.title}
                        className={cn(
                            level > 0 &&
                                "ml-4 border-l border-sidebar-border pl-4",
                            hasActiveChildItem &&
                                !isActive &&
                                "bg-sidebar-accent/50"
                        )}
                        onClick={
                            hasChildren
                                ? () => toggleExpanded(item.title)
                                : undefined
                        }
                    >
                        {hasChildren ? (
                            <div className="flex w-full items-center gap-2">
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span className="flex-1">{item.title}</span>
                                <ChevronRightIcon
                                    className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        isExpanded && "rotate-90"
                                    )}
                                />
                            </div>
                        ) : (
                            <Link
                                href={item.url}
                                className="flex w-full items-center gap-2"
                                {...(item.isExternal && {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                })}
                            >
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span className="flex-1">{item.title}</span>
                                {item.isExternal && (
                                    <ChevronRightIcon className="h-3 w-3 rotate-45" />
                                )}
                            </Link>
                        )}
                    </SidebarMenuButton>

                    {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                </SidebarMenuItem>

                {/* Render children if expanded */}
                {hasChildren && isExpanded && (
                    <div className="mt-1 space-y-1">
                        {item.children!.map((child) =>
                            renderNavItem(child, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <SidebarGroup className={className}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
                {/* Quick Actions Section */}
                {showQuickActions && (
                    <SidebarMenu>
                        <SidebarMenuItem className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip="Quick Create"
                                        className="min-w-8 bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/50"
                                    >
                                        <PlusCircleIcon className="h-4 w-4" />
                                        <span>Quick Create</span>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="start"
                                    className="w-48"
                                    sideOffset={8}
                                >
                                    {quickActions.map((action, index) => (
                                        <DropdownMenuItem
                                            key={action.action}
                                            onClick={() =>
                                                handleQuickAction(action.action)
                                            }
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <action.icon className="h-4 w-4" />
                                            <span>{action.title}</span>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-muted-foreground">
                                        More options coming soon...
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 shrink-0 transition-all duration-200 hover:bg-accent hover:scale-105 active:scale-95 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:pointer-events-none bg-transparent"
                                asChild
                            >
                                <Link href="/inbox">
                                    <MailIcon className="h-4 w-4" />
                                    <span className="sr-only">Inbox</span>
                                </Link>
                            </Button>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}

                {/* Main Navigation */}
                <SidebarMenu className="space-y-1">
                    {items.map((item) => renderNavItem(item))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

// Export types for external use

