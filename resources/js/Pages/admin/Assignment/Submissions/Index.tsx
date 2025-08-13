import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "sonner";
import { 
    FileText, 
    Search, 
    Filter, 
    ExternalLink, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Star,
    Download,
    Eye,
    UserCheck,
    Calendar,
    AlertTriangle,
    ChevronLeft,
    Users
} from "lucide-react";

interface TeamRegistration {
    id: number;
    tim_name: string;
    leader_name: string;
    leader_email: string;
    registration_number: string;
    competition_category: {
        name: string;
    };
}

interface User {
    id: number;
    name: string;
}

interface AssignmentSubmission {
    id: number;
    submission_link: string;
    notes: string | null;
    status: 'pending' | 'graded' | 'late';
    grade: number | null;
    feedback: string | null;
    submitted_at: string;
    graded_at: string | null;
    team: TeamRegistration;
    grader: User | null;
}

interface Assignment {
    id: number;
    title: string;
    description: string;
    deadline: string;
    is_active: boolean;
    competition_stage: {
        name: string;
        order: number;
    };
}

interface SubmissionIndexProps {
    assignment: Assignment;
    submissions: {
        data: AssignmentSubmission[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        status?: string;
        search?: string;
    };
}

const getStatusBadge = (status: string): { variant: "default" | "secondary" | "destructive" | "outline"; label: string } => {
    switch (status) {
        case "graded":
            return { variant: "default", label: "Dinilai" };
        case "pending":
            return { variant: "secondary", label: "Menunggu" };
        case "late":
            return { variant: "destructive", label: "Terlambat" };
        default:
            return { variant: "outline", label: "Unknown" };
    }
};

const getGradeBadge = (grade: number | null) => {
    if (grade === null) return null;
    
    if (grade >= 90) return { variant: "default" as const, color: "text-green-600", bgColor: "bg-green-50" };
    if (grade >= 80) return { variant: "secondary" as const, color: "text-blue-600", bgColor: "bg-blue-50" };
    if (grade >= 70) return { variant: "secondary" as const, color: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { variant: "destructive" as const, color: "text-red-600", bgColor: "bg-red-50" };
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

const isLateSubmission = (submittedAt: string, deadline: string): boolean => {
    return new Date(submittedAt) > new Date(deadline);
};

export default function SubmissionIndex({ assignment, submissions: initialSubmissions, filters: initialFilters }: SubmissionIndexProps) {
    const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
    const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
    const [gradeForm, setGradeForm] = useState({
        grade: "",
        feedback: ""
    });
    const [filters, setFilters] = useState({
        status: initialFilters.status || "all",
        search: initialFilters.search || "",
    });

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        
        // Clean empty values
        const cleanFilters: any = {};
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v && v !== "all" && v !== "") {
                cleanFilters[k] = v;
            }
        });

        setFilters(newFilters);
        
        router.get(
            route("admin.assignments.submissions.index", assignment.id),
            cleanFilters,
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleViewSubmission = (submission: AssignmentSubmission) => {
        setSelectedSubmission(submission);
    };

    const handleGradeSubmission = (submission: AssignmentSubmission) => {
        setSelectedSubmission(submission);
        setGradeForm({
            grade: submission.grade?.toString() || "",
            feedback: submission.feedback || ""
        });
        setGradeDialogOpen(true);
    };

    const submitGrade = async () => {
        if (!selectedSubmission) return;

        try {
            router.patch(
                route("admin.assignments.submissions.grade", [assignment.id, selectedSubmission.id]),
                {
                    grade: parseFloat(gradeForm.grade),
                    feedback: gradeForm.feedback
                },
                {
                    onSuccess: () => {
                        toast.success("Nilai berhasil disimpan");
                        setGradeDialogOpen(false);
                        setSelectedSubmission(null);
                        setGradeForm({ grade: "", feedback: "" });
                    },
                    onError: () => {
                        toast.error("Gagal menyimpan nilai");
                    },
                }
            );
        } catch (error) {
            console.error("Error grading submission:", error);
            toast.error("Terjadi kesalahan saat menyimpan nilai");
        }
    };

    const exportSubmissions = () => {
        window.location.href = route("admin.assignments.submissions.export", assignment.id);
    };

    // Calculate stats
    const stats = {
        total: initialSubmissions.data.length,
        pending: initialSubmissions.data.filter(s => s.status === 'pending').length,
        graded: initialSubmissions.data.filter(s => s.status === 'graded').length,
        late: initialSubmissions.data.filter(s => s.status === 'late').length,
    };

    return (
        <AdminLayout>
            <Head title={`Submissions - ${assignment.title}`} />
            
            <div className="space-y-4 p-2 sm:p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Link
                                href={route("admin.assignments.index")}
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Kembali ke Assignments
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Submissions: {assignment.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{assignment.competition_stage.name}</Badge>
                            <span>•</span>
                            <span>Deadline: {formatDate(assignment.deadline)}</span>
                            <span>•</span>
                            <Badge variant={assignment.is_active ? "default" : "secondary"}>
                                {assignment.is_active ? "Aktif" : "Nonaktif"}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={exportSubmissions}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Total Submissions",
                            value: stats.total,
                            icon: FileText,
                            description: "Total pengumpulan",
                            color: "text-blue-600",
                        },
                        {
                            title: "Pending Review",
                            value: stats.pending,
                            icon: Clock,
                            description: "Menunggu penilaian",
                            color: "text-yellow-600",
                        },
                        {
                            title: "Graded",
                            value: stats.graded,
                            icon: CheckCircle,
                            description: "Sudah dinilai",
                            color: "text-green-600",
                        },
                        {
                            title: "Late Submissions",
                            value: stats.late,
                            icon: AlertTriangle,
                            description: "Terlambat",
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
                            Cari dan filter submissions berdasarkan kriteria tertentu
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Cari berdasarkan nama tim atau leader..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => handleFilterChange("status", value)}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="pending">Menunggu</SelectItem>
                                        <SelectItem value="graded">Dinilai</SelectItem>
                                        <SelectItem value="late">Terlambat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submissions List */}
                <div>
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                            Daftar Submissions ({initialSubmissions.data.length})
                        </h2>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Daftar pengumpulan tugas dari tim peserta
                        </p>
                    </div>

                    {initialSubmissions.data.length === 0 ? (
                        <Card className="p-8 text-center">
                            <div className="flex flex-col items-center gap-4">
                                <FileText className="h-12 w-12 text-muted-foreground" />
                                <div>
                                    <h3 className="text-lg font-medium">Belum ada submissions</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada tim yang mengumpulkan tugas ini.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {initialSubmissions.data.map((submission) => {
                                const statusBadge = getStatusBadge(submission.status);
                                const gradeBadge = getGradeBadge(submission.grade);
                                const isLate = isLateSubmission(submission.submitted_at, assignment.deadline);

                                return (
                                    <Card key={submission.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                {/* Team Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                                                            <Users className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-lg">
                                                                {submission.team.tim_name}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Leader: {submission.team.leader_name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {submission.team.registration_number}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {submission.notes && (
                                                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                                            <p className="text-sm">{submission.notes}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Submission Details */}
                                                <div className="lg:text-right space-y-2">
                                                    <div className="flex flex-wrap gap-2 lg:justify-end">
                                                        <Badge variant={statusBadge.variant}>
                                                            {statusBadge.label}
                                                        </Badge>
                                                        {isLate && (
                                                            <Badge variant="destructive">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                Terlambat
                                                            </Badge>
                                                        )}
                                                        {gradeBadge && (
                                                            <Badge 
                                                                variant="outline" 
                                                                className={`${gradeBadge.color} ${gradeBadge.bgColor}`}
                                                            >
                                                                <Star className="w-3 h-3 mr-1" />
                                                                {submission.grade}/100
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1 lg:justify-end">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(submission.submitted_at)}
                                                        </div>
                                                        {submission.graded_at && (
                                                            <div className="flex items-center gap-1 lg:justify-end">
                                                                <UserCheck className="w-3 h-3" />
                                                                Dinilai: {formatDate(submission.graded_at)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2 lg:justify-end">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => window.open(submission.submission_link, '_blank')}
                                                        >
                                                            <ExternalLink className="w-3 h-3 mr-1" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleViewSubmission(submission)}
                                                        >
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            Detail
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleGradeSubmission(submission)}
                                                        >
                                                            <Star className="w-3 h-3 mr-1" />
                                                            {submission.grade ? 'Edit' : 'Grade'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {initialSubmissions.links.length > 3 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex gap-1">
                                {initialSubmissions.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Submission Detail Dialog */}
                <Dialog open={!!selectedSubmission && !gradeDialogOpen} onOpenChange={() => setSelectedSubmission(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Detail Submission</DialogTitle>
                            <DialogDescription>
                                Informasi lengkap submission dari tim
                            </DialogDescription>
                        </DialogHeader>

                        {selectedSubmission && (
                            <div className="space-y-4">
                                {/* Team Info */}
                                <div className="space-y-2">
                                    <h4 className="font-medium">Informasi Tim</h4>
                                    <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                                        <p><strong>Nama Tim:</strong> {selectedSubmission.team.tim_name}</p>
                                        <p><strong>Leader:</strong> {selectedSubmission.team.leader_name}</p>
                                        <p><strong>Email:</strong> {selectedSubmission.team.leader_email}</p>
                                        <p><strong>No. Registrasi:</strong> {selectedSubmission.team.registration_number}</p>
                                    </div>
                                </div>

                                {/* Submission Info */}
                                <div className="space-y-2">
                                    <h4 className="font-medium">Informasi Submission</h4>
                                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                                        <p><strong>Link:</strong> 
                                            <a 
                                                href={selectedSubmission.submission_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="ml-2 text-primary hover:underline"
                                            >
                                                {selectedSubmission.submission_link}
                                            </a>
                                        </p>
                                        <p><strong>Waktu Submit:</strong> {formatDate(selectedSubmission.submitted_at)}</p>
                                        <p><strong>Status:</strong> 
                                            <Badge variant={getStatusBadge(selectedSubmission.status).variant} className="ml-2">
                                                {getStatusBadge(selectedSubmission.status).label}
                                            </Badge>
                                        </p>
                                        {selectedSubmission.notes && (
                                            <div>
                                                <strong>Catatan:</strong>
                                                <p className="mt-1 text-sm">{selectedSubmission.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Grading Info */}
                                {selectedSubmission.status === 'graded' && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Penilaian</h4>
                                        <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                                            <p><strong>Nilai:</strong> {selectedSubmission.grade}/100</p>
                                            {selectedSubmission.feedback && (
                                                <div>
                                                    <strong>Feedback:</strong>
                                                    <p className="mt-1 text-sm">{selectedSubmission.feedback}</p>
                                                </div>
                                            )}
                                            <p><strong>Dinilai oleh:</strong> {selectedSubmission.grader?.name}</p>
                                            <p><strong>Waktu Penilaian:</strong> {selectedSubmission.graded_at && formatDate(selectedSubmission.graded_at)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Grade Dialog */}
                <Dialog open={gradeDialogOpen} onOpenChange={setGradeDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Beri Nilai</DialogTitle>
                            <DialogDescription>
                                Berikan nilai dan feedback untuk submission
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="grade">Nilai (0-100)</Label>
                                <Input
                                    id="grade"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={gradeForm.grade}
                                    onChange={(e) => setGradeForm(prev => ({ ...prev, grade: e.target.value }))}
                                    placeholder="Masukkan nilai"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="feedback">Feedback (Opsional)</Label>
                                <Textarea
                                    id="feedback"
                                    value={gradeForm.feedback}
                                    onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                                    placeholder="Berikan feedback untuk tim..."
                                    rows={4}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setGradeDialogOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={submitGrade}
                                    disabled={!gradeForm.grade}
                                >
                                    Simpan Nilai
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
