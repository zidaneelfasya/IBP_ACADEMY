import { usePage } from "@inertiajs/react";
import {
    BellIcon,
    CreditCardIcon,
    LogOutIcon,
    MoreVerticalIcon,
    UserCircleIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/Components/ui/sidebar";
import { router } from "@inertiajs/react";
import { PageProps } from "@inertiajs/core";

interface User {
    name: string;
    email: string;
    avatar?: string;
}

interface PagePropsWithAuth extends PageProps {
    auth: {
        user?: User;
    };
}

export function NavUser() {
    const { isMobile } = useSidebar();
    const { auth } = usePage<PagePropsWithAuth>().props;

    if (!auth?.user) {
        return null;
    }

    const user = auth.user;

    const handleLogout = () => {
        router.post(route("logout"));
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="
                                data-[state=open]:bg-primary
                                data-[state=open]:text-primary-foreground
                                hover:bg-primary/90
                                hover:text-primary-foreground
                            "
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {user.avatar ? (
                                    <AvatarImage
                                        src={user.avatar}
                                        alt={user.name}
                                    />
                                ) : null}
                                <AvatarFallback className="rounded-lg bg-muted text-sm font-medium">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {user.avatar ? (
                                        <AvatarImage
                                            src={user.avatar}
                                            alt={user.name}
                                        />
                                    ) : null}
                                    <AvatarFallback className="rounded-lg bg-muted text-sm font-medium">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="hover:bg-primary/10 focus:bg-primary/10">
                                <UserCircleIcon className="mr-2 size-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-primary/10 focus:bg-primary/10">
                                <CreditCardIcon className="mr-2 size-4" />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-primary/10 focus:bg-primary/10">
                                <BellIcon className="mr-2 size-4" />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="hover:bg-destructive/10 focus:bg-destructive/10 text-destructive hover:text-destructive"
                        >
                            <LogOutIcon className="mr-2 size-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
