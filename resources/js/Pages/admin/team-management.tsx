"use client";

import { useState, useMemo } from "react";
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
    ImageIcon,
    Instagram,
    Mail,
    Calendar,
    Filter,
} from "lucide-react";

// Mock data based on your migration schema
interface TeamRegistration {
    id: number;
    leader_name: string;
    leader_nim: string;
    member1_name?: string;
    member1_nim?: string;
    member2_name?: string;
    member2_nim?: string;
    member3_name?: string;
    member3_nim?: string;
    ktm_scan_link: string;
    formal_photo_link: string;
    twibbon_link: string;
    ig_account_link: string;
    email: string;
    ppt_link?: string;
    image_link?: string;
    created_at: string;
    updated_at: string;
    status?: "pending" | "approved" | "rejected";
}

// Mock data
const mockTeams: TeamRegistration[] = [
    {
        id: 1,
        leader_name: "Ahmad Rizki",
        leader_nim: "2021001",
        member1_name: "Siti Nurhaliza",
        member1_nim: "2021002",
        member2_name: "Budi Santoso",
        member2_nim: "2021003",
        member3_name: "Dewi Sartika",
        member3_nim: "2021004",
        ktm_scan_link: "https://example.com/ktm1.pdf",
        formal_photo_link: "https://example.com/photo1.jpg",
        twibbon_link: "https://example.com/twibbon1.jpg",
        ig_account_link: "https://instagram.com/team1",
        email: "team1@example.com",
        ppt_link: "https://example.com/presentation1.pptx",
        image_link: "https://example.com/image1.jpg",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        status: "approved",
    },
    {
        id: 2,
        leader_name: "Maria Gonzalez",
        leader_nim: "2021005",
        member1_name: "John Doe",
        member1_nim: "2021006",
        member2_name: "Jane Smith",
        member2_nim: "2021007",
        ktm_scan_link: "https://example.com/ktm2.pdf",
        formal_photo_link: "https://example.com/photo2.jpg",
        twibbon_link: "https://example.com/twibbon2.jpg",
        ig_account_link: "https://instagram.com/team2",
        email: "team2@example.com",
        created_at: "2024-01-16T14:20:00Z",
        updated_at: "2024-01-16T14:20:00Z",
        status: "pending",
    },
    {
        id: 3,
        leader_name: "Ravi Patel",
        leader_nim: "2021008",
        member1_name: "Lisa Wong",
        member1_nim: "2021009",
        ktm_scan_link: "https://example.com/ktm3.pdf",
        formal_photo_link: "https://example.com/photo3.jpg",
        twibbon_link: "https://example.com/twibbon3.jpg",
        ig_account_link: "https://instagram.com/team3",
        email: "team3@example.com",
        ppt_link: "https://example.com/presentation3.pptx",
        created_at: "2024-01-17T09:15:00Z",
        updated_at: "2024-01-17T09:15:00Z",
        status: "rejected",
    },
];

const getStatusBadge = (
    status: string
): { variant: BadgeProps["variant"]; label: string } => {
    switch (status) {
        case "approved":
            return { variant: "default", label: "Approved" };
        case "pending":
            return { variant: "secondary", label: "Pending" };
        case "rejected":
            return { variant: "destructive", label: "Rejected" };
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

export default function TeamManagement() {
    const [teams] = useState<TeamRegistration[]>(mockTeams);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(
        null
    );

    const filteredTeams = useMemo(() => {
        return teams.filter((team) => {
            const matchesSearch =
                team.leader_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                team.leader_nim.includes(searchTerm) ||
                team.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.member1_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                team.member2_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                team.member3_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || team.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [teams, searchTerm, statusFilter]);

    const stats = useMemo(() => {
        const total = teams.length;
        const approved = teams.filter((t) => t.status === "approved").length;
        const pending = teams.filter((t) => t.status === "pending").length;
        const rejected = teams.filter((t) => t.status === "rejected").length;

        return { total, approved, pending, rejected };
    }, [teams]);

    const handleViewTeam = (team: TeamRegistration) => {
        setSelectedTeam(team);
    };

    const handleStatusChange = (teamId: number, newStatus: string) => {
        // In real app, this would make an API call
        console.log(`Changing team ${teamId} status to ${newStatus}`);
    };

    const handleExport = () => {
        // In real app, this would export data
        console.log("Exporting team data...");
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Team Management
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola pendaftaran tim dan lihat detail informasi
                            peserta
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleExport} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Teams
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tim terdaftar
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Approved
                            </CardTitle>
                            <Badge variant="default" className="h-4 w-4 p-0" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.approved}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tim disetujui
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Badge
                                variant="secondary"
                                className="h-4 w-4 p-0"
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.pending}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Menunggu review
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rejected
                            </CardTitle>
                            <Badge
                                variant="destructive"
                                className="h-4 w-4 p-0"
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {stats.rejected}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tim ditolak
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter & Search</CardTitle>
                        <CardDescription>
                            Cari dan filter data tim berdasarkan kriteria
                            tertentu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari nama leader, NIM, atau email..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="approved">
                                        Approved
                                    </SelectItem>
                                    <SelectItem value="rejected">
                                        Rejected
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Teams Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Daftar Tim ({filteredTeams.length})
                        </CardTitle>
                        <CardDescription>
                            Daftar lengkap tim yang telah mendaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Team Leader</TableHead>
                                        <TableHead>Members</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Files</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Registered</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTeams.map((team) => {
                                        const statusBadge = getStatusBadge(
                                            team.status || "pending"
                                        );
                                        const memberCount =
                                            getMemberCount(team);

                                        return (
                                            <TableRow key={team.id}>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="font-medium">
                                                            {team.leader_name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            NIM:{" "}
                                                            {team.leader_nim}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">
                                                            {memberCount} orang
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Mail className="h-3 w-3" />
                                                            {team.email}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Instagram className="h-3 w-3" />
                                                            Instagram
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <FileText className="mr-1 h-3 w-3" />
                                                            KTM
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <ImageIcon className="mr-1 h-3 w-3" />
                                                            Photo
                                                        </Badge>
                                                        {team.ppt_link && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                PPT
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            statusBadge.variant
                                                        }
                                                    >
                                                        {statusBadge.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(
                                                            team.created_at
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <span className="sr-only">
                                                                    Open menu
                                                                </span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
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
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        team.id,
                                                                        "approved"
                                                                    )
                                                                }
                                                                className="text-green-600"
                                                            >
                                                                Approve Team
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        team.id,
                                                                        "rejected"
                                                                    )
                                                                }
                                                                className="text-red-600"
                                                            >
                                                                Reject Team
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">
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
                    </CardContent>
                </Card>

                {/* Team Detail Dialog */}
                <Dialog
                    open={!!selectedTeam}
                    onOpenChange={() => setSelectedTeam(null)}
                >
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                Detail Tim - {selectedTeam?.leader_name}
                            </DialogTitle>
                            <DialogDescription>
                                Informasi lengkap tentang tim dan anggotanya
                            </DialogDescription>
                        </DialogHeader>

                        {selectedTeam && (
                            <div className="space-y-6">
                                {/* Team Leader */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        Team Leader
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Nama
                                            </label>
                                            <p className="text-sm">
                                                {selectedTeam.leader_name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                NIM
                                            </label>
                                            <p className="text-sm">
                                                {selectedTeam.leader_nim}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        Anggota Tim
                                    </h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((num) => {
                                            const memberName = selectedTeam[
                                                `member${num}_name` as keyof TeamRegistration
                                            ] as string;
                                            const memberNim = selectedTeam[
                                                `member${num}_nim` as keyof TeamRegistration
                                            ] as string;

                                            if (!memberName) return null;

                                            return (
                                                <div
                                                    key={num}
                                                    className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg"
                                                >
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            Anggota {num}
                                                        </label>
                                                        <p className="text-sm">
                                                            {memberName}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-muted-foreground">
                                                            NIM
                                                        </label>
                                                        <p className="text-sm">
                                                            {memberNim}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        Informasi Kontak
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Email
                                            </label>
                                            <p className="text-sm">
                                                {selectedTeam.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Instagram
                                            </label>
                                            <a
                                                href={
                                                    selectedTeam.ig_account_link
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {selectedTeam.ig_account_link}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Files */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        File Dokumen
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                KTM Scan
                                            </label>
                                            <a
                                                href={
                                                    selectedTeam.ktm_scan_link
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline block"
                                            >
                                                Lihat File KTM
                                            </a>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Foto Formal
                                            </label>
                                            <a
                                                href={
                                                    selectedTeam.formal_photo_link
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline block"
                                            >
                                                Lihat Foto Formal
                                            </a>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Twibbon
                                            </label>
                                            <a
                                                href={selectedTeam.twibbon_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline block"
                                            >
                                                Lihat Twibbon
                                            </a>
                                        </div>
                                        {selectedTeam.ppt_link && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Presentasi
                                                </label>
                                                <a
                                                    href={selectedTeam.ppt_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline block"
                                                >
                                                    Lihat Presentasi
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Actions */}
                                <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                        onClick={() =>
                                            handleStatusChange(
                                                selectedTeam.id,
                                                "approved"
                                            )
                                        }
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Approve Team
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleStatusChange(
                                                selectedTeam.id,
                                                "rejected"
                                            )
                                        }
                                        variant="destructive"
                                    >
                                        Reject Team
                                    </Button>
                                    <Button
                                        onClick={() => setSelectedTeam(null)}
                                        variant="outline"
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
