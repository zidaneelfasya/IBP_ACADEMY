"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
    variant?: "default" | "simple" | "icon-only";
    size?: "default" | "sm" | "lg";
    className?: string;
}

export function ThemeToggle({
    variant = "default",
    size = "default",
    className,
}: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();

    // Simple toggle version (cycles through themes)
    if (variant === "simple") {
        const cycleTheme = () => {
            if (theme === "light") setTheme("dark");
            else if (theme === "dark") setTheme("system");
            else setTheme("light");
        };

        return (
            <Button
                variant="ghost"
                size={size}
                onClick={cycleTheme}
                className={cn(
                    "relative h-9 w-9 rounded-full transition-all duration-300 hover:bg-accent/50 hover:scale-105 active:scale-95",
                    className
                )}
            >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    // Icon only version
    if (variant === "icon-only") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size={size}
                        className={cn(
                            "relative h-9 w-9 rounded-full transition-all duration-300 hover:bg-accent/50 hover:scale-105 active:scale-95",
                            className
                        )}
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="min-w-[140px] p-2 rounded-xl border-0 bg-background/95 backdrop-blur-sm shadow-lg"
                >
                    <DropdownMenuItem
                        onClick={() => setTheme("light")}
                        className="rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50 focus:bg-accent/50"
                    >
                        <Sun className="mr-3 h-4 w-4 text-amber-500" />
                        <span className="font-medium">Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme("dark")}
                        className="rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50 focus:bg-accent/50"
                    >
                        <Moon className="mr-3 h-4 w-4 text-blue-400" />
                        <span className="font-medium">Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setTheme("system")}
                        className="rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50 focus:bg-accent/50"
                    >
                        <Monitor className="mr-3 h-4 w-4 text-green-500" />
                        <span className="font-medium">System</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    // Default version with text
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size={size}
                    className={cn(
                        "gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:bg-accent/50 hover:scale-105 active:scale-95",
                        className
                    )}
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
                    <span className="hidden sm:inline-block font-medium">
                        {theme === "light"
                            ? "Light"
                            : theme === "dark"
                            ? "Dark"
                            : "System"}
                    </span>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="min-w-[160px] p-2 rounded-xl border-0 bg-background/95 backdrop-blur-sm shadow-lg"
            >
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className={cn(
                        "rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50 focus:bg-accent/50 flex items-center justify-between",
                        theme === "light" && "bg-accent/30"
                    )}
                >
                    <div className="flex items-center">
                        <Sun className="mr-3 h-4 w-4 text-amber-500" />
                        <span className="font-medium">Light</span>
                    </div>
                    {theme === "light" && (
                        <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className={cn(
                        "rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50 focus:bg-accent/50 flex items-center justify-between",
                        theme === "dark" && "bg-accent/30"
                    )}
                >
                    <div className="flex items-center">
                        <Moon className="mr-3 h-4 w-4 text-blue-400" />
                        <span className="font-medium">Dark</span>
                    </div>
                    {theme === "dark" && (
                        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className={cn(
                        "rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/50 focus:bg-accent/50 flex items-center justify-between",
                        theme === "system" && "bg-accent/30"
                    )}
                >
                    <div className="flex items-center">
                        <Monitor className="mr-3 h-4 w-4 text-green-500" />
                        <span className="font-medium">System</span>
                    </div>
                    {theme === "system" && (
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
