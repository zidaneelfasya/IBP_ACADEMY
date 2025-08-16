import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { toast } from "sonner";
import { 
    FileText, 
    ExternalLink, 
    Clock, 
    CheckCircle, 
    Star,
    ChevronLeft,
    Users,
    Calendar,
    UserCheck,
    AlertTriangle,
    Edit,
    Save
} from "lucide-react";

interface TeamRegistration {
    id: number;
    tim_name: string;
    leader_name: string;
    leader_email: string;
    leader_phone: string;
    leader_univ: string;
    leader_fakultas: string;
    registration_number: string;
    member1_name?: string;
    member2_name?: string;
    member3_name?: string;
    competition_category: {
        name: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Assignment {
    id: number;
    title: string;
    description: string;
    instructions: string | null;
    deadline: string;
    is_active: boolean;
    competition_stage: {
        name: string;
        order: number;
    };
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
    assignment: Assignment;
}

interface SubmissionShowProps {
    submission: AssignmentSubmission;
}

const getStatusBadge = (status: string): { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: React.ElementType } => {
    switch (status) {
        case "graded":
            return { variant: "default", label: "Dinilai", icon: CheckCircle };
        case "pending":
            return { variant: "secondary", label: "Menunggu Review", icon: Clock };
        case "late":
            return { variant: "destructive", label: "Terlambat", icon: AlertTriangle };
        default:
            return { variant: "outline", label: "Unknown", icon: FileText };
    }
};

const getGradeBadge = (grade: number | null) => {
    if (grade === null) return null;
    
    if (grade >= 90) return { variant: "default" as const, color: "text-green-600", bgColor: "bg-green-50", label: "Excellent" };
    if (grade >= 80) return { variant: "secondary" as const, color: "text-blue-600", bgColor: "bg-blue-50", label: "Good" };
    if (grade >= 70) return { variant: "secondary" as const, color: "text-yellow-600", bgColor: "bg-yellow-50", label: "Fair" };
    return { variant: "destructive" as const, color: "text-red-600", bgColor: "bg-red-50", label: "Poor" };
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const isLateSubmission = (submittedAt: string, deadline: string): boolean => {
    return new Date(submittedAt) > new Date(deadline);
};

export default function SubmissionShow({ submission }: SubmissionShowProps) {
    const [editMode, setEditMode] = useState(false);
    const [gradeForm, setGradeForm] = useState({
        grade: submission.grade?.toString() || "",
        feedback: submission.feedback || ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const statusBadge = getStatusBadge(submission.status);
    const gradeBadge = getGradeBadge(submission.grade);
    const isLate = isLateSubmission(submission.submitted_at, submission.assignment.deadline);
    const StatusIcon = statusBadge.icon;

    const handleUpdateGrade = async () => {
        setIsSubmitting(true);
        
        try {
            router.patch(
                route("admin.assignments.submissions.grade", [submission.assignment.id, submission.id]),
                {
                    grade: parseFloat(gradeForm.grade),
                    feedback: gradeForm.feedback
                },
                {
                    onSuccess: () => {
                        toast.success("Nilai berhasil diperbarui");
                        setEditMode(false);
                    },
                    onError: () => {
                        toast.error("Gagal memperbarui nilai");
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    }
                }
            );
        } catch (error) {
            console.error("Error updating grade:", error);
            toast.error("Terjadi kesalahan saat memperbarui nilai");
            setIsSubmitting(false);
        }
    };

    const getMembersList = (team: TeamRegistration): string[] => {
        const members = [team.leader_name];
        if (team.member1_name) members.push(team.member1_name);
        if (team.member2_name) members.push(team.member2_name);
        if (team.member3_name) members.push(team.member3_name);
        return members;
    };

    return (
        <AdminLayout>
            <Head title={`Submission Detail - ${submission.team.tim_name}`} />
            
            <div className="space-y-6 p-2 sm:p-4 md:p-6">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Link
                            href={route("admin.assignments.submissions.index", submission.assignment.id)}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Kembali ke Submissions
                        </Link>
                    </div>
                    
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Submission Detail
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span>{submission.assignment.title}</span>
                                <span>•</span>
                                <Badge variant="outline">{submission.assignment.competition_stage.name}</Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => window.open(submission.submission_link, '_blank')}
                                className="gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Open Submission
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Assignment Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Assignment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">{submission.assignment.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {submission.assignment.description}
                                    </p>
                                    
                                    {submission.assignment.instructions && (
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <h5 className="font-medium text-sm mb-1">Instruksi:</h5>
                                            <p className="text-sm">{submission.assignment.instructions}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>Deadline: {formatDate(submission.assignment.deadline)}</span>
                                    </div>
                                    <Badge variant={submission.assignment.is_active ? "default" : "secondary"}>
                                        {submission.assignment.is_active ? "Aktif" : "Nonaktif"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Team Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">Nama Tim</Label>
                                        <p className="text-sm mt-1">{submission.team.tim_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">No. Registrasi</Label>
                                        <p className="text-sm mt-1">{submission.team.registration_number}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Kategori</Label>
                                        <p className="text-sm mt-1">{submission.team.competition_category.name}</p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Leader</Label>
                                    <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                                        <p className="font-medium">{submission.team.leader_name}</p>
                                        <p className="text-sm text-muted-foreground">{submission.team.leader_email}</p>
                                        <p className="text-sm text-muted-foreground">{submission.team.leader_phone}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {submission.team.leader_univ} - {submission.team.leader_fakultas}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Anggota Tim</Label>
                                    <div className="mt-1 space-y-1">
                                        {getMembersList(submission.team).map((member, index) => (
                                            <div key={index} className="text-sm px-3 py-2 bg-muted/30 rounded">
                                                {index === 0 ? "Leader" : `Member ${index}`}: {member}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submission Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Submission Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Submission Link</Label>
                                    <div className="mt-1">
                                        <a 
                                            href={submission.submission_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline break-all"
                                        >
                                            {submission.submission_link}
                                        </a>
                                    </div>
                                </div>

                                {submission.notes && (
                                    <div>
                                        <Label className="text-sm font-medium">Catatan Tim</Label>
                                        <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                                            <p className="text-sm">{submission.notes}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">Waktu Submit</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{formatDate(submission.submitted_at)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Status</Label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={statusBadge.variant} className="gap-1">
                                                <StatusIcon className="h-3 w-3" />
                                                {statusBadge.label}
                                            </Badge>
                                            {isLate && (
                                                <Badge variant="destructive">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Terlambat
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Status Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Status</span>
                                    <Badge variant={statusBadge.variant} className="gap-1">
                                        <StatusIcon className="h-3 w-3" />
                                        {statusBadge.label}
                                    </Badge>
                                </div>

                                {submission.grade !== null && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Nilai</span>
                                        <div className="flex items-center gap-2">
                                            <Badge 
                                                variant="outline" 
                                                className={gradeBadge ? `${gradeBadge.color} ${gradeBadge.bgColor}` : ''}
                                            >
                                                <Star className="w-3 h-3 mr-1" />
                                                {submission.grade}/100
                                            </Badge>
                                            {gradeBadge && (
                                                <span className="text-xs text-muted-foreground">
                                                    {gradeBadge.label}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isLate && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Keterlambatan</span>
                                        <Badge variant="destructive">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            Ya
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Grading Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="text-lg">Penilaian</span>
                                    {!editMode && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditMode(true)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {editMode ? (
                                    <>
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
                                            <Label htmlFor="feedback">Feedback</Label>
                                            <Textarea
                                                id="feedback"
                                                value={gradeForm.feedback}
                                                onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                                                placeholder="Berikan feedback untuk tim..."
                                                rows={4}
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleUpdateGrade}
                                                disabled={!gradeForm.grade || isSubmitting}
                                                className="flex-1"
                                            >
                                                {isSubmitting ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                                        Menyimpan...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Save className="h-4 w-4" />
                                                        Simpan
                                                    </div>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setGradeForm({
                                                        grade: submission.grade?.toString() || "",
                                                        feedback: submission.feedback || ""
                                                    });
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                Batal
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {submission.grade !== null ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <Label className="text-sm font-medium">Nilai</Label>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Badge 
                                                            variant="outline" 
                                                            className={gradeBadge ? `${gradeBadge.color} ${gradeBadge.bgColor}` : ''}
                                                        >
                                                            <Star className="w-3 h-3 mr-1" />
                                                            {submission.grade}/100
                                                        </Badge>
                                                        {gradeBadge && (
                                                            <span className="text-sm text-muted-foreground">
                                                                ({gradeBadge.label})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {submission.feedback && (
                                                    <div>
                                                        <Label className="text-sm font-medium">Feedback</Label>
                                                        <div className="mt-1 p-3 bg-muted/50 rounded-lg">
                                                            <p className="text-sm">{submission.feedback}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <UserCheck className="w-3 h-3" />
                                                        Dinilai oleh: {submission.grader?.name}
                                                    </div>
                                                    {submission.graded_at && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(submission.graded_at)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    Submission belum dinilai
                                                </p>
                                                <Button
                                                    onClick={() => setEditMode(true)}
                                                    size="sm"
                                                >
                                                    <Star className="h-4 w-4 mr-1" />
                                                    Beri Nilai
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
