"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { LogOut, User, Mail } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
    email: string;
    // Add other user fields as needed
}

interface AuthProps {
    user: User;
}

interface PageProps {
    auth: AuthProps;
    [key: string]: unknown;
}

export default function UserProfile() {
    const { auth } = usePage<PageProps>().props;

    if (!auth.user) return null;

    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-accent p-0 hover:bg-accent/80"
                >
                    <span className="text-sm font-medium text-accent-foreground">
                        {getInitials(auth.user.name)}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex flex-col p-2">
                    <div className="font-medium text-foreground">
                        {auth.user.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {auth.user.email}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer p-0 text-destructive focus:text-destructive">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="flex w-full items-center px-2 py-1.5 text-left"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
