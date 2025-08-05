"use client";

import { useState } from "react";
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
} from "lucide-react";
import { router, Link } from "@inertiajs/react";
import { toast } from 'sonner';

interface TeamRegistration {
    id: number;
    registration_number: string;
    tim_name: string;
    competition_category: {
        id: number;
        name: string;
    };
    leader_name: string;
    leader_nim: string;
    leader_email: string;
    leader_phone: string;
    member1_name: string | null;
    member1_nim: string | null;
    member1_email: string | null;
    member1_phone: string | null;
    member2_name: string | null;
    member2_nim: string | null;
    member2_email: string | null;
    member2_phone: string | null;
    member3_name: string | null;
    member3_nim: string | null;
    member3_email: string | null;
    member3_phone: string | null;
    asal_universitas: string;
    prodi_fakultas: string;
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
}

interface TeamManagementProps {
    teams: {
        data: TeamRegistration[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search: string;
        progress_status: string;
        category: string; // Add category filter
    };
    stats: {
        total: number;
        approved: number;
        pending: number;
        not_started: number;
    };
    categories: string[]; // Add categories prop
}


const getLatestStatus = (team: TeamRegistration) => {
    if (!team.progress || team.progress.length === 0) {
        return { status: 'not_started', stage: 'Not Started' };
    }
    
    const sortedProgress = [...team.progress].sort((a, b) => b.stage.order - a.stage.order);
    const latestProgress = sortedProgress[0];
    
    return {
        status: latestProgress.status,
        stage: latestProgress.stage.name
    };
};

const getStatusBadge = (
    status: string
): { variant: BadgeProps["variant"]; label: string } => {
    switch (status) {
        case "approved":
            return { variant: "default", label: "Approved" };
        case "submitted":
            return { variant: "secondary", label: "Pending Review" };
        case "not_started":
            return { variant: "outline", label: "Not Started" };
        case "rejected":
            return { variant: "destructive", label: "Rejected" };
        case "in_progress":
            return { variant: "secondary", label: "In Progress" };
        default:
            return { variant: "outline", label: "Unknown" };
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

export default function TeamManagement({
    teams: initialTeams,
    filters: initialFilters,
    stats,
    categories, // Add categories prop
}: TeamManagementProps) {
    const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(null);
    const [filters, setFilters] = useState({
        search: initialFilters.search || "",
        progress_status: initialFilters.progress_status || "all",
        category: initialFilters.category || "all", // Add category filter
    });
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

    const handleViewTeam = (team: TeamRegistration) => {
        setSelectedTeam(team);
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
                        router.reload({ only: ['teams'] });
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

    const handleDeleteTeam = (teamId: number) => {
        router.delete(route("team.destroy", teamId));
    };

    return (
        <AdminLayout>
            <div className="space-y-4 p-2 sm:p-4 md:p-6">
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
                        <a
                            href={route("export.team-registrations")}
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Export Data</span>
                            <span className="sm:hidden">Export</span>
                        </a>
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
                            value: stats.approved,
                            icon: null,
                            description: "Tim disetujui",
                            variant: "default",
                            color: "text-green-600",
                        },
                        {
                            title: "Pending",
                            value: stats.pending,
                            icon: null,
                            description: "Menunggu review",
                            variant: "secondary",
                            color: "text-yellow-600",
                        },
                        {
                            title: "Not Started",
                            value: stats.not_started,
                            icon: null,
                            description: "Belum memulai",
                            variant: "outline",
                            color: "text-gray-600",
                        },
                    ].map((stat, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                {stat.icon ? (
                                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Badge
                                        variant={stat.variant as BadgeProps["variant"]}
                                        className="h-4 w-4 p-0"
                                    />
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className={`text-xl font-bold sm:text-2xl ${stat.color || ""}`}>
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
                            Cari dan filter data tim berdasarkan kriteria tertentu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama leader, NIM, atau email..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange("search", e.target.value)}
                                        className="pl-10 text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                            <Select
                                value={filters.progress_status}
                                onValueChange={(value) => handleFilterChange("progress_status", value)}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Status Progress" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="not_started">Not Started</SelectItem>
                                    <SelectItem value="submitted">Pending Review</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.category}
                                onValueChange={(value) => handleFilterChange("category", value)}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Trophy className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Kategori Lomba" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
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
                        <div className="rounded-md border overflow-x-auto">
                            <Table className="min-w-[800px] sm:min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap px-3 py-3 sm:px-6">
                                            Team Info
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap px-3 py-3 sm:px-6">
                                            Members
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap px-3 py-3 sm:px-6">
                                            Category
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap px-3 py-3 sm:px-6">
                                            Status
                                        </TableHead>
                                        <TableHead className="whitespace-nowrap px-3 py-3 sm:px-6">
                                            Registered
                                        </TableHead>
                                        <TableHead className="text-right whitespace-nowrap px-3 py-3 sm:px-6">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {initialTeams.data.map((team) => {
                                        const latestStatus = getLatestStatus(team);
                                        const statusBadge = getStatusBadge(latestStatus.status);
                                        const memberCount = getMemberCount(team);

                                        return (
                                            <TableRow key={team.id}>
                                                <TableCell className="whitespace-nowrap px-3 py-4 sm:px-6">
                                                    <div className="space-y-1">
                                                        <div className="font-medium line-clamp-1">
                                                            {team.tim_name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {team.leader_name} • {team.leader_nim}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {team.asal_universitas}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap px-3 py-4 sm:px-6">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {memberCount} members
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap px-3 py-4 sm:px-6">
                                                    <Badge variant="outline" className="text-xs">
                                                        <Trophy className="mr-1 h-3 w-3" />
                                                        {team.competition_category?.name || 'Unknown'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap px-3 py-4 sm:px-6">
                                                    <Badge variant={statusBadge.variant}>
                                                        {statusBadge.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap px-3 py-4 sm:px-6">
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(team.registered_at || team.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right whitespace-nowrap px-3 py-4 sm:px-6">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                                aria-label="Open menu"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-40">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleViewTeam(team)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(team.id, "approved")}
                                                                className="text-green-600"
                                                            >
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusChange(team.id, "rejected")}
                                                                className="text-red-600"
                                                            >
                                                                Reject
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleDeleteTeam(team.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
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
                            <div className="flex flex-col items-center gap-3 mt-4 px-4 py-3 sm:flex-row sm:justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {initialTeams.data.length} dari {stats.total} tim
                                </div>
                                <div className="flex gap-1">
                                    {initialTeams.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => router.get(link.url || "", {}, { preserveState: true })}
                                            className={`
                                                ${!link.url ? "opacity-50 cursor-not-allowed" : ""}
                                                ${index !== 0 && index !== initialTeams.links.length - 1 ? "hidden sm:inline-flex" : ""}
                                            `}
                                        >
                                            {index === 0 ? (
                                                <ChevronLeft className="h-4 w-4" />
                                            ) : index === initialTeams.links.length - 1 ? (
                                                <ChevronRight className="h-4 w-4" />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Team Detail Dialog */}
                <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-full sm:max-w-2xl md:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">
                                Detail Tim - {selectedTeam?.tim_name}
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                                Informasi lengkap tentang tim dan progress mereka
                            </DialogDescription>
                        </DialogHeader>

                        {selectedTeam && (
                            <div className="space-y-4">
                                {/* Team Info */}
                                <div>
                                    <h3 className="text-base font-semibold mb-2 sm:text-lg">
                                        Informasi Tim
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Nomor Registrasi
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedTeam.registration_number}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Kategori Lomba
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedTeam.competition_category?.name || 'Unknown'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Asal Universitas
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedTeam.asal_universitas}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Prodi/Fakultas
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedTeam.prodi_fakultas}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Leader */}
                                <div>
                                    <h3 className="text-base font-semibold mb-2 sm:text-lg">
                                        Team Leader
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 p-3 bg-muted/50 rounded-lg">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Nama
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedTeam.leader_name}
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
                                            <p className="text-sm sm:text-base">
                                                {selectedTeam.leader_email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                No. HP
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedTeam.leader_phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div>
                                    <h3 className="text-base font-semibold mb-2 sm:text-lg">
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
                                                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 p-3 bg-muted/50 rounded-lg"
                                                >
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            Anggota {num}
                                                        </label>
                                                        <p className="text-sm sm:text-base">
                                                            {memberName}
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
                                                        <p className="text-sm sm:text-base">
                                                            {memberEmail}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            No. HP
                                                        </label>
                                                        <p className="text-sm sm:text-base">
                                                            {memberPhone}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Progress Timeline */}
                                <div>
                                    <h3 className="text-base font-semibold mb-2 sm:text-lg">
                                        Progress Lomba
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedTeam.progress && selectedTeam.progress.length > 0 ? (
                                            [...selectedTeam.progress]
                                                .sort((a, b) => a.stage.order - b.stage.order)
                                                .map((progress) => (
                                                    <div key={progress.id} className="flex gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`h-4 w-4 rounded-full ${
                                                                progress.status === 'approved' ? 'bg-green-500' :
                                                                progress.status === 'submitted' ? 'bg-yellow-500' :
                                                                progress.status === 'rejected' ? 'bg-red-500' :
                                                                'bg-gray-300'
                                                            }`} />
                                                            <div className="w-px h-full bg-gray-200" />
                                                        </div>
                                                        <div className="flex-1 pb-4">
                                                            <div className="flex justify-between">
                                                                <h4 className="font-medium">
                                                                    {progress.stage.name}
                                                                </h4>
                                                                <Badge variant={
                                                                    progress.status === 'approved' ? 'default' :
                                                                    progress.status === 'submitted' ? 'secondary' :
                                                                    progress.status === 'rejected' ? 'destructive' :
                                                                    'outline'
                                                                }>
                                                                    {progress.status}
                                                                </Badge>
                                                            </div>
                                                            {progress.approved_at && (
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    Disetujui pada: {formatDate(progress.approved_at)}
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
                                        onClick={() => handleStatusChange(selectedTeam.id, "approved")}
                                        className="bg-green-600 hover:bg-green-700"
                                        size="sm"
                                    >
                                        Approve Team
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusChange(selectedTeam.id, "rejected")}
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
            </div>
        </AdminLayout>
    );
}