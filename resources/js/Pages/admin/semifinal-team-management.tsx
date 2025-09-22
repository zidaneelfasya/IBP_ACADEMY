"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge, type BadgeProps } from "@/Components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import {
    Search,
    MoreHorizontal,
    Eye,
    Trash2,
    Download,
    Users,
    FileText,
    Mail,
    Calendar,
    Filter,
    ChevronLeft,
    ChevronRight,
    Trophy,
    ChevronDown,
    ExternalLink,
    Edit,
} from "lucide-react";
import { router, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "sonner";

interface TeamRegistration {
    id: number;
    registration_number: string;
    tim_name: string;
    competition_category: {
        id: number;
        name: string;
    } | null;
    leader_name: string;
    leader_nim: string;
    leader_email: string;
    leader_phone: string;
    leader_univ: string;
    leader_fakultas: string;
    member1_name: string | null;
    member1_nim: string | null;
    member1_email: string | null;
    member1_phone: string | null;
    member1_univ: string | null;
    member1_fakultas: string | null;
    member2_name: string | null;
    member2_nim: string | null;
    member2_email: string | null;
    member2_phone: string | null;
    member2_univ: string | null;
    member2_fakultas: string | null;
    member3_name: string | null;
    member3_nim: string | null;
    member3_email: string | null;
    member3_phone: string | null;
    asal_universitas: string; // For backward compatibility
    prodi_fakultas: string; // For backward compatibility
    link_berkas: string;
    status: string;
    registered_at: string;
    created_at: string;
    updated_at: string;
    progress: {
        id: number;
        status: string;
        stage: {
            id: number;
            name: string;
            order: number;
        };
        approved_at: string | null;
    }[];
    payment_status: string;
    payment_status_text: string;
}

interface TeamManagementProps {
    teams: {
        data: TeamRegistration[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search: string;
        progress_status: string;
        category: string;
    };
    stats: {
        total: number;
        approved: number;
        pending: number;
        not_started: number;
    };
    categories: string[];
    flash?: {
        success?: string;
        error?: string;
    };
}

// Status options untuk dropdown berdasarkan enum participant_progress
const STATUS_OPTIONS = [
    {
        value: "not_started",
        label: "Not Started",
        variant: "outline" as const,
        isCustomGreen: false,
    },
    {
        value: "in_progress",
        label: "In Progress",
        variant: "secondary" as const,
        isCustomGreen: false,
    },
    {
        value: "submitted",
        label: "Submitted",
        variant: "secondary" as const,
        isCustomGreen: true,
    },
    {
        value: "approved",
        label: "Approved",
        variant: "default" as const,
        isCustomGreen: false,
    },
    {
        value: "rejected",
        label: "Rejected",
        variant: "destructive" as const,
        isCustomGreen: false,
    },
];

const getLatestStatus = (team: TeamRegistration) => {
    if (!team.progress || team.progress.length === 0) {
        return { status: "not_started", stage: "Not Started" };
    }

    const sortedProgress = [...team.progress].sort(
        (a, b) => b.stage.order - a.stage.order
    );
    const latestProgress = sortedProgress[0];

    return {
        status: latestProgress.status,
        stage: latestProgress.stage.name,
    };
};
const isTeamApproved = (team: TeamRegistration): boolean => {
    if (!team.progress || team.progress.length === 0) return false;

    const latestProgress = [...team.progress].sort(
        (a, b) => b.stage.order - a.stage.order
    )[0];
    return latestProgress.status === "approved";
};

const getStatusBadge = (
    status: string
): {
    variant: BadgeProps["variant"];
    label: string;
    isCustomGreen?: boolean;
} => {
    switch (status) {
        case "approved":
            return {
                variant: "default",
                label: "Approved",
                isCustomGreen: false,
            };
        case "submitted":
            return {
                variant: "secondary",
                label: "Submitted",
                isCustomGreen: true,
            };
        case "not_started":
            return {
                variant: "outline",
                label: "Not Started",
                isCustomGreen: false,
            };
        case "rejected":
            return {
                variant: "destructive",
                label: "Rejected",
                isCustomGreen: false,
            };
        case "in_progress":
            return {
                variant: "secondary",
                label: "In Progress",
                isCustomGreen: false,
            };
        default:
            return {
                variant: "outline",
                label: "Unknown",
                isCustomGreen: false,
            };
    }
};

const getMemberCount = (team: TeamRegistration): number => {
    let count = 1; // Leader always counts
    if (team.member1_name) count++;
    if (team.member2_name) count++;
    if (team.member3_name) count++;
    return count;
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Utility function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number = 25): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

export default function TeamManagement({
    teams: initialTeams,
    filters: initialFilters,
    stats,
    categories,
    flash,
}: TeamManagementProps) {
    const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(
        null
    );
    const [editTeam, setEditTeam] = useState<TeamRegistration | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<TeamRegistration>>(
        {}
    );
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        type: "approve" | "reject" | "delete" | "edit" | "status_change" | null;
        teamId: number | null;
        teamName: string | null;
        team?: TeamRegistration | null;
        oldStatus?: string;
        newStatus?: string;
    }>({ type: null, teamId: null, teamName: null, team: null });
    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        progress_status: initialFilters.progress_status || "all",
        category: initialFilters.category || "all",
    });
    const [loadingTeams, setLoadingTeams] = useState<Set<number>>(new Set());

    // Handle flash messages saat component mount
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        router.get(
            route("team.index"),
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleProgressStatusUpdate = async (
        teamId: number,
        newStatus: string
    ) => {
        // Set loading state untuk team ini
        setLoadingTeams((prev) => new Set(prev).add(teamId));

        try {
            // Menggunakan Inertia router untuk konsistensi
            router.patch(
                route("team.update-progress-status", { team: teamId }),
                { status: newStatus },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        console.log("Success response:", page);
                        // Gunakan flash message yang sudah ada atau default message
                        toast.success("Status berhasil diperbarui");
                        // Reload hanya bagian teams tanpa redirect
                        router.reload({
                            only: ["teams"],
                        });
                    },
                    onError: (errors) => {
                        console.error("Validation errors:", errors);
                        console.log("Full errors object:", errors);

                        // Cek apakah ada flash errors dari Laravel
                        if (errors.status) {
                            toast.error(
                                Array.isArray(errors.status)
                                    ? errors.status[0]
                                    : errors.status
                            );
                        } else if (errors.message) {
                            toast.error(errors.message);
                        } else {
                            // Coba cari error pertama dari object errors
                            const firstError = Object.values(errors)[0];
                            const errorMessage = Array.isArray(firstError)
                                ? firstError[0]
                                : firstError ||
                                  "Gagal mengubah status progress";
                            toast.error(errorMessage);
                        }
                    },
                    onFinish: () => {
                        // Remove loading state
                        setLoadingTeams((prev) => {
                            const newSet = new Set(prev);
                            newSet.delete(teamId);
                            return newSet;
                        });
                    },
                }
            );
        } catch (error: any) {
            console.error("Error updating progress status:", error);
            toast.error("Terjadi kesalahan saat mengubah status");

            // Fallback remove loading state
            setLoadingTeams((prev) => {
                const newSet = new Set(prev);
                newSet.delete(teamId);
                return newSet;
            });
        }
    };

    const isTeamApproved = (team: TeamRegistration): boolean => {
        if (!team.progress || team.progress.length === 0) return false;

        const latestProgress = [...team.progress].sort(
            (a, b) => b.stage.order - a.stage.order
        )[0];
        return latestProgress.status === "approved";
    };

    const handleViewTeam = (team: TeamRegistration) => {
        setSelectedTeam(team);
    };

    const handleEditTeam = (team: TeamRegistration) => {
        setEditTeam(team);
        setEditFormData({
            tim_name: team.tim_name,
            leader_name: team.leader_name,
            leader_nim: team.leader_nim,
            leader_email: team.leader_email,
            leader_phone: team.leader_phone,
            leader_univ: team.leader_univ,
            leader_fakultas: team.leader_fakultas,
            member1_name: team.member1_name || "",
            member1_nim: team.member1_nim || "",
            member1_email: team.member1_email || "",
            member1_phone: team.member1_phone || "",
            member1_univ: team.member1_univ || "",
            member1_fakultas: team.member1_fakultas || "",
            member2_name: team.member2_name || "",
            member2_nim: team.member2_nim || "",
            member2_email: team.member2_email || "",
            member2_phone: team.member2_phone || "",
            member2_univ: team.member2_univ || "",
            member2_fakultas: team.member2_fakultas || "",
            link_berkas: team.link_berkas,
        });
        setIsFormChanged(false);
    };

    const handleFormChange = (field: string, value: string) => {
        setEditFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        setIsFormChanged(true);
    };

    const handleUpdateTeam = async () => {
        if (!editTeam || !isFormChanged) return;

        try {
            await router.put(route("team.update", editTeam.id), editFormData, {
                onSuccess: () => {
                    toast.success(`Data tim berhasil diupdate`);
                    setEditTeam(null);
                    setEditFormData({});
                    setIsFormChanged(false);
                    router.reload({ only: ["teams"] });
                },
                onError: (errors) => {
                    toast.error("Gagal mengupdate data tim");
                    console.error(errors);
                },
            });
        } catch (error) {
            console.error("Error updating team:", error);
            toast.error("Terjadi kesalahan saat mengupdate data");
        }
    };

    const confirmStatusChange = (
        teamId: number,
        action: "approve" | "reject",
        teamName: string
    ) => {
        setConfirmAction({ type: action, teamId, teamName });
    };

    const confirmStatusProgressChange = (
        teamId: number,
        teamName: string,
        oldStatus: string,
        newStatus: string
    ) => {
        setConfirmAction({
            type: "status_change",
            teamId,
            teamName,
            oldStatus,
            newStatus,
        });
    };

    const confirmDelete = (teamId: number, teamName: string) => {
        setConfirmAction({ type: "delete", teamId, teamName });
    };

    const confirmUpdate = () => {
        if (!editTeam) return;
        setConfirmAction({
            type: "edit",
            teamId: editTeam.id,
            teamName: editTeam.tim_name,
            team: editTeam,
        });
    };

    const executeStatusChange = async () => {
        if (!confirmAction.teamId || !confirmAction.type) return;

        try {
            if (confirmAction.type === "approve") {
                await handleStatusChange(confirmAction.teamId, "approved");
            } else if (confirmAction.type === "reject") {
                await handleStatusChangeReject(
                    confirmAction.teamId,
                    "rejected"
                );
            } else if (confirmAction.type === "delete") {
                await handleDeleteTeam(confirmAction.teamId);
            } else if (confirmAction.type === "edit") {
                await handleUpdateTeam();
            } else if (confirmAction.type === "status_change") {
                if (confirmAction.newStatus) {
                    await handleProgressStatusUpdate(
                        confirmAction.teamId,
                        confirmAction.newStatus
                    );
                }
            }
        } finally {
            setConfirmAction({
                type: null,
                teamId: null,
                teamName: null,
                team: null,
                oldStatus: undefined,
                newStatus: undefined,
            });
        }
    };

    const handleStatusChange = async (teamId: number, newStatus: string) => {
        try {
            await router.put(
                route("team.update-status", teamId),
                { status: newStatus },
                {
                    onSuccess: () => {
                        toast.success(`Status tim berhasil diubah`);
                        setSelectedTeam(null);
                        router.reload({ only: ["teams"] });
                    },
                    onError: (errors) => {
                        toast.error("Gagal mengubah status tim");
                        console.error(errors);
                    },
                }
            );
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Terjadi kesalahan saat mengubah status");
        }
    };

    const handleStatusChangeReject = async (
        teamId: number,
        newStatus: string
    ) => {
        try {
            await router.put(
                route("team.update-status-reject", teamId),
                { status: newStatus },
                {
                    onSuccess: () => {
                        toast.success(`Status tim berhasil diubah`);
                        setSelectedTeam(null);
                        router.reload({ only: ["teams"] });
                    },
                    onError: (errors) => {
                        toast.error("Gagal mengubah status tim");
                        console.error(errors);
                    },
                }
            );
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Terjadi kesalahan saat mengubah status");
        }
    };
    const handleDeleteTeam = async (teamId: number) => {
        try {
            await router.delete(route("team.destroy", teamId), {
                onSuccess: () => {
                    toast.success("Tim berhasil dihapus");
                    router.reload({ only: ["teams"] });
                },
                onError: (errors) => {
                    toast.error("Gagal menghapus tim");
                    console.error(errors);
                },
            });
        } catch (error) {
            console.error("Error deleting team:", error);
            toast.error("Terjadi kesalahan saat menghapus tim");
        }
    };

    // Komponen StatusDropdown untuk mengubah status progress
    const StatusDropdown = ({
        team,
        latestStatus,
    }: {
        team: TeamRegistration;
        latestStatus: { status: string; stage: string };
    }) => {
        const isLoading = loadingTeams.has(team.id);
        const currentOption =
            STATUS_OPTIONS.find((opt) => opt.value === latestStatus.status) ||
            STATUS_OPTIONS[0];

        const handleStatusChange = async (newStatus: string) => {
            if (newStatus !== latestStatus.status) {
                // Tampilkan konfirmasi sebelum mengubah status
                confirmStatusProgressChange(
                    team.id,
                    team.tim_name,
                    latestStatus.status,
                    newStatus
                );
            }
        };

        if (isLoading) {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <span className="text-sm text-muted-foreground">
                        Updating...
                    </span>
                </div>
            );
        }

        return (
            <Select
                value={latestStatus.status}
                onValueChange={handleStatusChange}
                disabled={isLoading}
            >
                <SelectTrigger className="w-[130px] h-8 text-xs">
                    <SelectValue asChild>
                        <Badge
                            variant={currentOption.variant}
                            className={`text-xs ${
                                currentOption.isCustomGreen
                                    ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                                    : ""
                            }`}
                        >
                            {currentOption.label}
                        </Badge>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <Badge
                                variant={option.variant}
                                className={`text-xs ${
                                    option.isCustomGreen
                                        ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                                        : ""
                                }`}
                            >
                                {option.label}
                            </Badge>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    };

    return (
        <AdminLayout>
            <div className="p-2 space-y-4 sm:p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Team Management
                        </h1>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Kelola pendaftaran tim dan lihat progress peserta
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-9">
                                    <Download className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">
                                        Export Data
                                    </span>
                                    <span className="sm:hidden">Export</span>
                                    <ChevronDown className="w-4 h-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>
                                    Pilih Jenis Export
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <a
                                        href={route(
                                            "export.team-registrations"
                                        )}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                Export Full
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Semua data lengkap
                                            </span>
                                        </div>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a
                                        href={route(
                                            "export.team-registrations-simple"
                                        )}
                                        className="flex items-center cursor-pointer"
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                Export Simple
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Data ringkas tim
                                            </span>
                                        </div>
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {/* Stats Cards */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Total Teams",
                            value: stats.total,
                            icon: Users,
                            description: "Tim terdaftar",
                        },
                        {
                            title: "Approved",
                            value: initialTeams.data.filter(isTeamApproved)
                                .length,
                            icon: null,
                            description: "Tim disetujui",
                            variant: "default",
                            color: "text-green-600",
                        },
                        {
                            title: "Submitted",
                            value: initialTeams.data.filter((team) => {
                                if (
                                    !team.progress ||
                                    team.progress.length === 0
                                )
                                    return false;
                                const latest = [...team.progress].sort(
                                    (a, b) => b.stage.order - a.stage.order
                                )[0];
                                return latest.status === "submitted";
                            }).length,
                            icon: null,
                            description: "Submitted",
                            variant: "secondary",
                            color: "text-green-600",
                        },
                        {
                            title: "In Progress",
                            value: initialTeams.data.filter((team) => {
                                if (
                                    !team.progress ||
                                    team.progress.length === 0
                                )
                                    return true;
                                const latest = [...team.progress].sort(
                                    (a, b) => b.stage.order - a.stage.order
                                )[0];
                                return latest.status === "in_progress";
                            }).length,
                            icon: null,
                            description: "Sedang berjalan",
                            variant: "outline",
                            color: "text-blue-600",
                        },
                    ].map((stat, index) => (
                        <Card
                            key={index}
                            className="transition-shadow hover:shadow-md"
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                {stat.icon ? (
                                    <stat.icon className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                    <Badge
                                        variant={
                                            stat.variant as BadgeProps["variant"]
                                        }
                                        className="w-4 h-4 p-0"
                                    />
                                )}
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`text-xl font-bold sm:text-2xl ${
                                        stat.color || ""
                                    }`}
                                >
                                    {stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {/* Filters */}
                <Card className="shadow-sm">
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg sm:text-xl">
                            Filter & Search
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Cari dan filter data tim berdasarkan kriteria
                            tertentu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama leader, NIM, atau email..."
                                        value={filters.search}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "search",
                                                e.target.value
                                            )
                                        }
                                        className="pl-10 text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                            <Select
                                value={filters.progress_status}
                                onValueChange={(value) =>
                                    handleFilterChange("progress_status", value)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Status Progress" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="not_started">
                                        Not Started
                                    </SelectItem>
                                    <SelectItem value="submitted">
                                        Submitted
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                    <SelectItem value="in_progress">
                                        In Progress
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.category}
                                onValueChange={(value) =>
                                    handleFilterChange("category", value)
                                }
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Trophy className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Kategori Lomba" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Kategori
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
                {/* Teams Table */}
                <Card>
                    <CardHeader className="p-4 sm:p-6">
                        <CardTitle className="text-lg sm:text-xl">
                            Daftar Tim ({initialTeams.data.length})
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Daftar lengkap tim yang telah mendaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-0">
                        <div className="overflow-x-auto border rounded-md">
                            <Table className="min-w-[800px] sm:min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="px-3 py-3 whitespace-nowrap sm:px-6">
                                            Team Info
                                        </TableHead>
                                        <TableHead className="px-3 py-3 whitespace-nowrap sm:px-6">
                                            Members
                                        </TableHead>
                                        <TableHead className="px-3 py-3 whitespace-nowrap sm:px-6">
                                            Category
                                        </TableHead>
                                        <TableHead className="px-3 py-3 whitespace-nowrap sm:px-6">
                                            Stage
                                        </TableHead>
                                        <TableHead className="px-3 py-3 whitespace-nowrap sm:px-6">
                                            Status
                                        </TableHead>
                                        <TableHead className="px-3 py-3 whitespace-nowrap sm:px-6">
                                            Berkas
                                        </TableHead>
                                        <TableHead className="px-3 py-3 whitespace-nowrap sm:px-6">
                                            Registered
                                        </TableHead>
                                        <TableHead className="px-3 py-3 whitespace-nowrap sm:px-6">
                                            Payment Status
                                        </TableHead>
                                        <TableHead className="px-3 py-3 text-right whitespace-nowrap sm:px-6">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {initialTeams.data.map((team) => {
                                        const latestStatus =
                                            getLatestStatus(team);
                                        const statusBadge = getStatusBadge(
                                            latestStatus.status
                                        );
                                        const memberCount =
                                            getMemberCount(team);
                                        const currentStage =
                                            team.progress?.length > 0
                                                ? team.progress[0].stage.name
                                                : "Not Started";

                                        return (
                                            <TableRow key={team.id}>
                                                <TableCell className="px-3 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="space-y-1">
                                                        <div className="font-medium line-clamp-1">
                                                            {team.tim_name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {team.leader_name} •{" "}
                                                            {team.leader_nim}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {team.asal_universitas ||
                                                                "No university specified"}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-3 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {memberCount}{" "}
                                                            members
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-3 py-4 whitespace-nowrap sm:px-6">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        <Trophy className="w-3 h-3 mr-1" />
                                                        {team
                                                            .competition_category
                                                            ?.name || "Unknown"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-3 py-4 whitespace-nowrap sm:px-6">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {latestStatus.stage}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-3 py-4 whitespace-nowrap sm:px-6">
                                                    <StatusDropdown
                                                        team={team}
                                                        latestStatus={
                                                            latestStatus
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="px-3 py-4 whitespace-nowrap sm:px-6">
                                                    {team.link_berkas ? (
                                                        <a
                                                            href={
                                                                team.link_berkas
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                                            title={
                                                                team.link_berkas
                                                            }
                                                        >
                                                            <FileText className="w-3 h-3" />
                                                            <span>
                                                                {truncateText(
                                                                    team.link_berkas,
                                                                    20
                                                                )}
                                                            </span>
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            No file
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-3 py-4 whitespace-nowrap sm:px-6">
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(
                                                            team.registered_at ||
                                                                team.created_at
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-3 py-4 whitespace-nowrap sm:px-6">
                                                    <Badge
                                                        variant={
                                                            team.payment_status ===
                                                            "paid"
                                                                ? "default"
                                                                : team.payment_status ===
                                                                  "rejected"
                                                                ? "destructive"
                                                                : "secondary"
                                                        }
                                                        className={`text-xs ${
                                                            team.payment_status ===
                                                            "paid"
                                                                ? "bg-green-500 hover:bg-green-600 text-white"
                                                                : team.payment_status ===
                                                                  "rejected"
                                                                ? "bg-red-500 hover:bg-red-600 text-white"
                                                                : "bg-yellow-500 hover:bg-yellow-600 text-yellow-900"
                                                        }`}
                                                    >
                                                        {
                                                            team.payment_status_text
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-3 py-4 text-right whitespace-nowrap sm:px-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="w-8 h-8 p-0"
                                                                aria-label="Open menu"
                                                            >
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-40"
                                                        >
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleViewTeam(
                                                                        team
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleEditTeam(
                                                                        team
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    confirmStatusChange(
                                                                        team.id,
                                                                        "approve",
                                                                        team.tim_name
                                                                    )
                                                                }
                                                                className="text-green-600"
                                                            >
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    confirmStatusChange(
                                                                        team.id,
                                                                        "reject",
                                                                        team.tim_name
                                                                    )
                                                                }
                                                                className="text-red-600"
                                                            >
                                                                Reject
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() =>
                                                                    confirmDelete(
                                                                        team.id,
                                                                        team.tim_name
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {initialTeams.links.length > 3 && (
                            <div className="flex flex-col items-center gap-3 px-4 py-3 mt-4 sm:flex-row sm:justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {initialTeams.data.length} dari{" "}
                                    {stats.total} tim
                                </div>
                                <div className="flex gap-1">
                                    {initialTeams.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={
                                                link.active
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() =>
                                                router.get(
                                                    link.url || "",
                                                    {},
                                                    { preserveState: true }
                                                )
                                            }
                                            className={`
                                                ${
                                                    !link.url
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }
                                                ${
                                                    index !== 0 &&
                                                    index !==
                                                        initialTeams.links
                                                            .length -
                                                            1
                                                        ? "hidden sm:inline-flex"
                                                        : ""
                                                }
                                            `}
                                        >
                                            {index === 0 ? (
                                                <ChevronLeft className="w-4 h-4" />
                                            ) : index ===
                                              initialTeams.links.length - 1 ? (
                                                <ChevronRight className="w-4 h-4" />
                                            ) : (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* Team Detail Dialog */}
                <Dialog
                    open={!!selectedTeam}
                    onOpenChange={() => setSelectedTeam(null)}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-full sm:max-w-2xl md:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">
                                Detail Tim - {selectedTeam?.tim_name}
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                                Informasi lengkap tentang tim dan progress
                                mereka
                            </DialogDescription>
                        </DialogHeader>

                        {selectedTeam && (
                            <div className="space-y-4">
                                {/* Team Info */}
                                <div>
                                    <h3 className="mb-2 text-base font-semibold sm:text-lg">
                                        Informasi Tim
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Nomor Registrasi
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {
                                                    selectedTeam.registration_number
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Kategori Lomba
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedTeam
                                                    .competition_category
                                                    ?.name || "Unknown"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Asal Universitas
                                            </label>
                                            <p
                                                className="text-sm sm:text-base"
                                                title={
                                                    selectedTeam.asal_universitas ||
                                                    "Not specified"
                                                }
                                            >
                                                {truncateText(
                                                    selectedTeam.asal_universitas ||
                                                        "Not specified",
                                                    30
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Prodi/Fakultas
                                            </label>
                                            <p
                                                className="text-sm sm:text-base"
                                                title={
                                                    selectedTeam.prodi_fakultas ||
                                                    "Not specified"
                                                }
                                            >
                                                {truncateText(
                                                    selectedTeam.prodi_fakultas ||
                                                        "Not specified",
                                                    30
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Berkas Pendaftaran */}
                                <div>
                                    <h3 className="mb-2 text-base font-semibold sm:text-lg">
                                        Berkas Pendaftaran
                                    </h3>
                                    <div className="p-3 rounded-lg bg-muted/50">
                                        {selectedTeam.link_berkas ? (
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Link Berkas
                                                    </label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <a
                                                            href={
                                                                selectedTeam.link_berkas
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 transition-colors rounded-md hover:text-blue-800 bg-blue-50 hover:bg-blue-100"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            <span className="break-all">
                                                                {
                                                                    selectedTeam.link_berkas
                                                                }
                                                            </span>
                                                            <ExternalLink className="flex-shrink-0 w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Klik link di atas untuk
                                                    membuka dan mereview berkas
                                                    pendaftaran tim
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="py-4 text-center">
                                                <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    Tidak ada berkas yang
                                                    di-upload
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Team Leader */}
                                <div>
                                    <h3 className="mb-2 text-base font-semibold sm:text-lg">
                                        Team Leader
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3 p-3 rounded-lg sm:grid-cols-2 md:grid-cols-4 bg-muted/50">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Nama
                                            </label>
                                            <p
                                                className="text-sm sm:text-base"
                                                title={selectedTeam.leader_name}
                                            >
                                                {truncateText(
                                                    selectedTeam.leader_name,
                                                    25
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                NIM
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedTeam.leader_nim}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Email
                                            </label>
                                            <p
                                                className="text-sm break-all sm:text-base"
                                                title={
                                                    selectedTeam.leader_email
                                                }
                                            >
                                                {truncateText(
                                                    selectedTeam.leader_email,
                                                    20
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                No. HP
                                            </label>
                                            <p
                                                className="text-sm sm:text-base"
                                                title={
                                                    selectedTeam.leader_phone
                                                }
                                            >
                                                {truncateText(
                                                    selectedTeam.leader_phone,
                                                    15
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div>
                                    <h3 className="mb-2 text-base font-semibold sm:text-lg">
                                        Anggota Tim
                                    </h3>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((num) => {
                                            const memberName = selectedTeam[
                                                `member${num}_name` as keyof TeamRegistration
                                            ] as string;
                                            const memberNim = selectedTeam[
                                                `member${num}_nim` as keyof TeamRegistration
                                            ] as string;
                                            const memberEmail = selectedTeam[
                                                `member${num}_email` as keyof TeamRegistration
                                            ] as string;
                                            const memberPhone = selectedTeam[
                                                `member${num}_phone` as keyof TeamRegistration
                                            ] as string;

                                            if (!memberName) return null;

                                            return (
                                                <div
                                                    key={num}
                                                    className="grid grid-cols-1 gap-3 p-3 rounded-lg sm:grid-cols-2 md:grid-cols-4 bg-muted/50"
                                                >
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            Anggota {num}
                                                        </label>
                                                        <p
                                                            className="text-sm sm:text-base"
                                                            title={memberName}
                                                        >
                                                            {truncateText(
                                                                memberName,
                                                                25
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            NIM
                                                        </label>
                                                        <p className="text-sm sm:text-base">
                                                            {memberNim}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            Email
                                                        </label>
                                                        <p
                                                            className="text-sm break-all sm:text-base"
                                                            title={
                                                                memberEmail ||
                                                                "Tidak tersedia"
                                                            }
                                                        >
                                                            {memberEmail
                                                                ? truncateText(
                                                                      memberEmail,
                                                                      20
                                                                  )
                                                                : "Tidak tersedia"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            No. HP
                                                        </label>
                                                        <p
                                                            className="text-sm sm:text-base"
                                                            title={
                                                                memberPhone ||
                                                                "Tidak tersedia"
                                                            }
                                                        >
                                                            {memberPhone
                                                                ? truncateText(
                                                                      memberPhone,
                                                                      15
                                                                  )
                                                                : "Tidak tersedia"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Progress Timeline */}
                                <div>
                                    <h3 className="mb-2 text-base font-semibold sm:text-lg">
                                        Progress Lomba
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedTeam.progress &&
                                        selectedTeam.progress.length > 0 ? (
                                            [...selectedTeam.progress]
                                                .sort(
                                                    (a, b) =>
                                                        a.stage.order -
                                                        b.stage.order
                                                )
                                                .map((progress) => (
                                                    <div
                                                        key={progress.id}
                                                        className="flex gap-4"
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <div
                                                                className={`h-4 w-4 rounded-full ${
                                                                    progress.status ===
                                                                    "approved"
                                                                        ? "bg-green-500"
                                                                        : progress.status ===
                                                                          "submitted"
                                                                        ? "bg-yellow-500"
                                                                        : progress.status ===
                                                                          "rejected"
                                                                        ? "bg-red-500"
                                                                        : "bg-gray-300"
                                                                }`}
                                                            />
                                                            <div className="w-px h-full bg-gray-200" />
                                                        </div>
                                                        <div className="flex-1 pb-4">
                                                            <div className="flex justify-between">
                                                                <h4 className="font-medium">
                                                                    {
                                                                        progress
                                                                            .stage
                                                                            .name
                                                                    }
                                                                </h4>
                                                                <Badge
                                                                    variant={
                                                                        progress.status ===
                                                                        "approved"
                                                                            ? "default"
                                                                            : progress.status ===
                                                                              "submitted"
                                                                            ? "secondary"
                                                                            : progress.status ===
                                                                              "rejected"
                                                                            ? "destructive"
                                                                            : "outline"
                                                                    }
                                                                >
                                                                    {
                                                                        progress.status
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            {progress.approved_at && (
                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                    Disetujui
                                                                    pada:{" "}
                                                                    {formatDate(
                                                                        progress.approved_at
                                                                    )}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                Belum ada progress yang tercatat
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Status Actions */}
                                <div className="flex flex-col gap-2 pt-4 border-t sm:flex-row">
                                    <Button
                                        onClick={() =>
                                            confirmStatusChange(
                                                selectedTeam.id,
                                                "approve",
                                                selectedTeam.tim_name
                                            )
                                        }
                                        className="bg-green-600 hover:bg-green-700"
                                        size="sm"
                                    >
                                        Approve Team
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            confirmStatusChange(
                                                selectedTeam.id,
                                                "reject",
                                                selectedTeam.tim_name
                                            )
                                        }
                                        variant="destructive"
                                        size="sm"
                                    >
                                        Reject Team
                                    </Button>
                                    <Button
                                        onClick={() => setSelectedTeam(null)}
                                        variant="outline"
                                        size="sm"
                                        className="sm:ml-auto"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Edit Team Dialog */}
                <Dialog
                    open={!!editTeam}
                    onOpenChange={() => {
                        setEditTeam(null);
                        setEditFormData({});
                        setIsFormChanged(false);
                    }}
                >
                    <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-full sm:max-w-2xl md:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">
                                Edit Data Tim - {editTeam?.tim_name}
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                                Update informasi tim dan anggota
                            </DialogDescription>
                        </DialogHeader>

                        {editTeam && (
                            <div className="space-y-6">
                                {/* Team Info */}
                                <div>
                                    <h3 className="mb-3 text-base font-semibold sm:text-lg">
                                        Informasi Tim
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Nama Tim
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.tim_name || ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "tim_name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nama tim..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Link Berkas
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.link_berkas ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "link_berkas",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Asal Universitas
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.leader_univ ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "leader_univ",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Universitas..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Prodi/Fakultas
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.leader_fakultas ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "leader_fakultas",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Program Studi / Fakultas..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Team Leader */}
                                <div>
                                    <h3 className="mb-3 text-base font-semibold sm:text-lg">
                                        Ketua Tim
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Nama Ketua
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.leader_name ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "leader_name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nama lengkap..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                NIM Ketua
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.leader_nim ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "leader_nim",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="NIM..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Email Ketua
                                            </label>
                                            <Input
                                                type="email"
                                                value={
                                                    editFormData.leader_email ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "leader_email",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                No. HP Ketua
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.leader_phone ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "leader_phone",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="08xx-xxxx-xxxx"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Member 1 */}
                                <div>
                                    <h3 className="mb-3 text-base font-semibold sm:text-lg">
                                        Anggota 1
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Nama Anggota 1
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member1_name ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member1_name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nama lengkap..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                NIM Anggota 1
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member1_nim ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member1_nim",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="NIM..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Email Anggota 1
                                            </label>
                                            <Input
                                                type="email"
                                                value={
                                                    editFormData.member1_email ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member1_email",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                No. HP Anggota 1
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member1_phone ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member1_phone",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="08xx-xxxx-xxxx"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Universitas Anggota 1
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member1_univ ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member1_univ",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Universitas..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Prodi/Fakultas Anggota 1
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member1_fakultas ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member1_fakultas",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Program Studi / Fakultas..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Member 2 */}
                                <div>
                                    <h3 className="mb-3 text-base font-semibold sm:text-lg">
                                        Anggota 2
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Nama Anggota 2
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member2_name ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member2_name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Nama lengkap..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                NIM Anggota 2
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member2_nim ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member2_nim",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="NIM..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Email Anggota 2
                                            </label>
                                            <Input
                                                type="email"
                                                value={
                                                    editFormData.member2_email ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member2_email",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                No. HP Anggota 2
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member2_phone ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member2_phone",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="08xx-xxxx-xxxx"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Universitas Anggota 2
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member2_univ ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member2_univ",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Universitas..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium">
                                                Prodi/Fakultas Anggota 2
                                            </label>
                                            <Input
                                                value={
                                                    editFormData.member2_fakultas ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "member2_fakultas",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Program Studi / Fakultas..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 pt-4 border-t sm:flex-row sm:justify-end">
                                    <Button
                                        onClick={() => {
                                            setEditTeam(null);
                                            setEditFormData({});
                                            setIsFormChanged(false);
                                        }}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        onClick={confirmUpdate}
                                        disabled={!isFormChanged}
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isFormChanged
                                            ? "Update Data"
                                            : "Tidak Ada Perubahan"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Confirmation Dialog */}
                <AlertDialog
                    open={!!confirmAction.type}
                    onOpenChange={() =>
                        setConfirmAction({
                            type: null,
                            teamId: null,
                            teamName: null,
                            team: null,
                        })
                    }
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Konfirmasi{" "}
                                {confirmAction.type === "approve"
                                    ? "Persetujuan"
                                    : confirmAction.type === "reject"
                                    ? "Penolakan"
                                    : confirmAction.type === "delete"
                                    ? "Penghapusan"
                                    : confirmAction.type === "status_change"
                                    ? "Perubahan Status"
                                    : "Simpan Perubahan"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {confirmAction.type === "approve" && (
                                    <>
                                        Apakah Anda yakin ingin menyetujui tim "
                                        {confirmAction.teamName}"? Tindakan ini
                                        akan mengubah status tim menjadi
                                        approved.
                                    </>
                                )}
                                {confirmAction.type === "reject" && (
                                    <>
                                        Apakah Anda yakin ingin menolak tim "
                                        {confirmAction.teamName}"? Tindakan ini
                                        akan mengubah status tim menjadi
                                        rejected.
                                    </>
                                )}
                                {confirmAction.type === "delete" && (
                                    <>
                                        Apakah Anda yakin ingin menghapus tim "
                                        {confirmAction.teamName}"? Tindakan ini
                                        tidak dapat dibatalkan dan akan
                                        menghapus semua data tim secara
                                        permanen.
                                    </>
                                )}
                                {confirmAction.type === "edit" && (
                                    <>
                                        Apakah Anda yakin ingin menyimpan
                                        perubahan data tim "
                                        {confirmAction.teamName}"? Semua
                                        perubahan yang telah dibuat akan
                                        disimpan secara permanen.
                                    </>
                                )}
                                {confirmAction.type === "status_change" && (
                                    <>
                                        Apakah Anda yakin ingin mengubah status
                                        progress tim "{confirmAction.teamName}"
                                        dari{" "}
                                        <strong>
                                            {confirmAction.oldStatus}
                                        </strong>{" "}
                                        menjadi{" "}
                                        <strong>
                                            {confirmAction.newStatus}
                                        </strong>
                                        ? Perubahan ini akan mempengaruhi
                                        progress kompetisi tim.
                                    </>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={executeStatusChange}
                                className={
                                    confirmAction.type === "approve"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : confirmAction.type === "reject"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : confirmAction.type === "delete"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : confirmAction.type === "status_change"
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                                }
                            >
                                Ya,{" "}
                                {confirmAction.type === "approve"
                                    ? "Setujui"
                                    : confirmAction.type === "reject"
                                    ? "Tolak"
                                    : confirmAction.type === "delete"
                                    ? "Hapus"
                                    : confirmAction.type === "status_change"
                                    ? "Ubah Status"
                                    : "Simpan"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}
