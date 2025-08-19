import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
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
    DialogFooter,
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
    Edit,
    Trash2,
    Plus,
    Calendar,
    Clock,
    FileText,
    Filter,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import { router, Link } from "@inertiajs/react";
import { toast } from 'sonner';

interface Assignment {
    id: number;
    uuid: string;
    title: string;
    description: string;
    instructions: string | null;
    deadline: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    competition_stage: {
        id: number;
        name: string;
        order: number;
    };
    creator: {
        id: number;
        name: string;
    };
    submission_count: number;
    pending_count: number;
    graded_count: number;
}

interface CompetitionStage {
    id: number;
    name: string;
    order: number;
}

interface AssignmentIndexProps {
    assignments: {
        data: Assignment[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    stages: CompetitionStage[];
    filters: {
        stage_id: string;
        status: string;
        search: string;
    };
    stats: {
        total: number;
        active: number;
        inactive: number;
        overdue: number;
    };
}

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getDeadlineStatus = (deadline: string): { 
    status: 'active' | 'warning' | 'overdue'; 
    label: string; 
    variant: BadgeProps["variant"] 
} => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 0) {
        return { status: 'overdue', label: 'Overdue', variant: 'destructive' };
    } else if (diffHours < 24) {
        return { status: 'warning', label: 'Due Soon', variant: 'secondary' };
    } else {
        return { status: 'active', label: 'Active', variant: 'default' };
    }
};

export default function Assignment({
    assignments: initialAssignments,
    stages,
    filters: initialFilters,
    stats = { // Default values if stats is undefined
        total: 0,
        active: 0,
        inactive: 0,
        overdue: 0
    },
}: AssignmentIndexProps) {
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        stage_id: initialFilters.stage_id || "all",
        status: initialFilters.status || "all",
        search: initialFilters.search || "",
    });

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        
        // Clear empty values to clean URL
        const cleanFilters: any = {};
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v && v !== "all" && v !== "") {
                cleanFilters[k] = v;
            }
        });

        setFilters(newFilters);
        
        router.get(
            route("admin.assignments.index"),
            cleanFilters,
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleViewAssignment = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
    };

    const handleToggleStatus = async (assignmentUuid: string) => {
        if (isTogglingStatus === assignmentUuid) return;
        
        setIsTogglingStatus(assignmentUuid);
        
        try {
            router.patch(
                route("admin.assignments.toggle-status", assignmentUuid),
                {},
                {
                    onSuccess: () => {
                        toast.success("Status tugas berhasil diubah");
                        setIsTogglingStatus(null);
                    },
                    onError: () => {
                        toast.error("Gagal mengubah status tugas");
                        setIsTogglingStatus(null);
                    },
                    onFinish: () => {
                        setIsTogglingStatus(null);
                    },
                    preserveScroll: true,
                }
            );
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Terjadi kesalahan saat mengubah status");
            setIsTogglingStatus(null);
        }
    };

    const handleDeleteAssignment = async (assignmentUuid: string) => {
        if (isDeleting === assignmentUuid) return;

        setIsDeleting(assignmentUuid);
        
        try {
            router.delete(route("admin.assignments.destroy", assignmentUuid), {
                onSuccess: () => {
                    toast.success("Tugas dan semua submission berhasil dihapus");
                    setIsDeleting(null);
                    setDeleteConfirmOpen(null);
                },
                onError: () => {
                    toast.error("Gagal menghapus tugas");
                    setIsDeleting(null);
                    setDeleteConfirmOpen(null);
                },
                onFinish: () => {
                    setIsDeleting(null);
                    setDeleteConfirmOpen(null);
                }
            });
        } catch (error) {
            console.error("Error deleting assignment:", error);
            toast.error("Terjadi kesalahan saat menghapus tugas");
            setIsDeleting(null);
            setDeleteConfirmOpen(null);
        }
    };

    const confirmDelete = (assignmentUuid: string) => {
        setDeleteConfirmOpen(assignmentUuid);
    };

    return (
        <AdminLayout>
            <div className="space-y-4 p-2 sm:p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Assignment Management
                        </h1>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Kelola tugas dan pantau pengumpulan peserta
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={route("admin.assignments.create")}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Buat Tugas</span>
                            <span className="sm:hidden">Buat</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Total Assignments",
                            value: stats.total,
                            icon: BookOpen,
                            description: "Total tugas",
                            color: "text-blue-600",
                        },
                        {
                            title: "Active",
                            value: stats.active,
                            icon: CheckCircle,
                            description: "Tugas aktif",
                            color: "text-green-600",
                        },
                        {
                            title: "Inactive",
                            value: stats.inactive,
                            icon: XCircle,
                            description: "Tugas nonaktif",
                            color: "text-gray-600",
                        },
                        {
                            title: "Overdue",
                            value: stats.overdue,
                            icon: AlertCircle,
                            description: "Tugas terlambat",
                            color: "text-red-600",
                        },
                    ].map((stat, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-xl font-bold sm:text-2xl ${stat.color}`}>
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
                            Cari dan filter tugas berdasarkan kriteria tertentu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari judul tugas atau deskripsi..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange("search", e.target.value)}
                                        className="pl-10 text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                            <Select
                                value={filters.stage_id}
                                onValueChange={(value) => handleFilterChange("stage_id", value)}
                            >
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Competition Stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Stage</SelectItem>
                                    {stages.map((stage) => (
                                        <SelectItem key={stage.id} value={stage.id.toString()}>
                                            {stage.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => handleFilterChange("status", value)}
                            >
                                <SelectTrigger className="w-full sm:w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Assignments Grid */}
                <div>
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                            Daftar Tugas ({initialAssignments.data.length})
                        </h2>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Daftar lengkap tugas yang telah dibuat
                        </p>
                    </div>

                    {/* Assignment Cards Grid */}
                    {initialAssignments.data.length === 0 ? (
                        <Card className="p-8 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                                <div>
                                    <h3 className="text-lg font-semibold">Belum ada tugas</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Buat tugas pertama untuk mulai mengelola assignment
                                    </p>
                                </div>
                                <Link
                                    href={route("admin.assignments.create")}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Buat Tugas Pertama
                                </Link>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {initialAssignments.data.map((assignment) => {
                                const deadlineStatus = getDeadlineStatus(assignment.deadline);
                                const isCurrentlyDeleting = isDeleting === assignment.uuid;
                                const isCurrentlyTogglingStatus = isTogglingStatus === assignment.uuid;

                                return (
                                    <Card key={assignment.id} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-lg sm:text-xl line-clamp-2 group-hover:text-primary transition-colors">
                                                        {assignment.title}
                                                    </CardTitle>
                                                    <CardDescription className="mt-2 line-clamp-3 text-sm">
                                                        {assignment.description}
                                                    </CardDescription>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge 
                                                        variant={assignment.is_active ? "default" : "secondary"}
                                                        className="shrink-0"
                                                    >
                                                        {assignment.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 shrink-0"
                                                                aria-label="Open menu"
                                                                disabled={isCurrentlyDeleting || isCurrentlyTogglingStatus}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleViewAssignment(assignment)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route("admin.assignments.submissions.index", assignment.uuid)}>
                                                                    <FileText className="mr-2 h-4 w-4" />
                                                                    View Submissions
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route("admin.assignments.edit", assignment.uuid)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleToggleStatus(assignment.uuid)}
                                                                className={assignment.is_active ? "text-yellow-600" : "text-green-600"}
                                                                disabled={isCurrentlyTogglingStatus}
                                                            >
                                                                {isCurrentlyTogglingStatus ? "Loading..." : assignment.is_active ? "Deactivate" : "Activate"}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => confirmDelete(assignment.uuid)}
                                                            disabled={isCurrentlyDeleting}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            {isCurrentlyDeleting ? "Deleting..." : "Delete"}
                                                        </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Assignment Meta Info */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Competition Stage
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {assignment.competition_stage.name}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Created By
                                                    </div>
                                                    <div className="text-sm font-medium">
                                                        {assignment.creator.name}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Deadline Info */}
                                            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Deadline
                                                    </div>
                                                    <Badge variant={deadlineStatus.variant} className="text-xs">
                                                        {deadlineStatus.label}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium">
                                                        {formatDate(assignment.deadline)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Submission Statistics */}
                                            <div className="space-y-2">
                                                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Submission Statistics
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                        <div className="text-lg font-bold text-blue-600">
                                                            {assignment.submission_count}
                                                        </div>
                                                        <div className="text-xs text-blue-600 font-medium">Total</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                                        <div className="text-lg font-bold text-yellow-600">
                                                            {assignment.pending_count}
                                                        </div>
                                                        <div className="text-xs text-yellow-600 font-medium">Pending</div>
                                                    </div>
                                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                                        <div className="text-lg font-bold text-green-600">
                                                            {assignment.graded_count}
                                                        </div>
                                                        <div className="text-xs text-green-600 font-medium">Graded</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Creation Date */}
                                            <div className="pt-2 border-t border-dashed">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    Created {formatDate(assignment.created_at)}
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    onClick={() => handleViewAssignment(assignment)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Button>
                                                <Link
                                                    href={route("admin.assignments.submissions.index", assignment.uuid)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 flex-1"
                                                >
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Submissions ({assignment.submission_count})
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination - Only show if needed */}
                    {initialAssignments.links.length > 3 && (
                        <div className="flex flex-col items-center gap-3 mt-8 sm:flex-row sm:justify-between">
                            <div className="text-sm text-muted-foreground">
                                Menampilkan {initialAssignments.data.length} tugas
                            </div>
                            <div className="flex gap-1">
                                {initialAssignments.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => router.get(link.url || "", {}, { preserveState: true })}
                                        className={`
                                            ${!link.url ? "opacity-50 cursor-not-allowed" : ""}
                                            ${index !== 0 && index !== initialAssignments.links.length - 1 ? "hidden sm:inline-flex" : ""}
                                        `}
                                    >
                                        {index === 0 ? (
                                            <ChevronLeft className="h-4 w-4" />
                                        ) : index === initialAssignments.links.length - 1 ? (
                                            <ChevronRight className="h-4 w-4" />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Assignment Detail Dialog */}
                <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-full sm:max-w-2xl md:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">
                                Assignment Details - {selectedAssignment?.title}
                            </DialogTitle>
                            <DialogDescription className="text-sm">
                                Informasi lengkap tentang tugas dan statistik pengumpulan
                            </DialogDescription>
                        </DialogHeader>

                        {selectedAssignment && (
                            <div className="space-y-4">
                                {/* Assignment Info */}
                                <div>
                                    <h3 className="text-base font-semibold mb-2 sm:text-lg">
                                        Informasi Tugas
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Competition Stage
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedAssignment.competition_stage.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Created By
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {selectedAssignment.creator.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Deadline
                                            </label>
                                            <p className="text-sm sm:text-base">
                                                {formatDate(selectedAssignment.deadline)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Status
                                            </label>
                                            <Badge variant={selectedAssignment.is_active ? "default" : "secondary"}>
                                                {selectedAssignment.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-base font-semibold mb-2 sm:text-lg">
                                        Deskripsi
                                    </h3>
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-sm sm:text-base whitespace-pre-wrap">
                                            {selectedAssignment.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Instructions */}
                                {selectedAssignment.instructions && (
                                    <div>
                                        <h3 className="text-base font-semibold mb-2 sm:text-lg">
                                            Instruksi
                                        </h3>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-sm sm:text-base whitespace-pre-wrap">
                                                {selectedAssignment.instructions}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Submission Statistics */}
                                <div>
                                    <h3 className="text-base font-semibold mb-2 sm:text-lg">
                                        Statistik Pengumpulan
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {selectedAssignment.submission_count}
                                            </div>
                                            <div className="text-sm text-blue-600">Total</div>
                                        </div>
                                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-600">
                                                {selectedAssignment.pending_count}
                                            </div>
                                            <div className="text-sm text-yellow-600">Pending</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">
                                                {selectedAssignment.graded_count}
                                            </div>
                                            <div className="text-sm text-green-600">Graded</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 pt-4 border-t sm:flex-row">
                                    <Link
                                        href={route("admin.assignments.submissions.index", selectedAssignment.uuid)}
                                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Submissions
                                    </Link>
                                    <Link
                                        href={route("admin.assignments.edit", selectedAssignment.uuid)}
                                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Assignment
                                    </Link>
                                    <Button
                                        onClick={() => setSelectedAssignment(null)}
                                        variant="outline"
                                        className="sm:ml-auto"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={!!deleteConfirmOpen} onOpenChange={() => setDeleteConfirmOpen(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Assignment ini akan dihapus secara permanen 
                                beserta semua submission yang terkait.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting === deleteConfirmOpen}>
                                Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteConfirmOpen && handleDeleteAssignment(deleteConfirmOpen)}
                                disabled={isDeleting === deleteConfirmOpen}
                                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            >
                                {isDeleting === deleteConfirmOpen ? "Menghapus..." : "Ya, Hapus"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AdminLayout>
    );
}