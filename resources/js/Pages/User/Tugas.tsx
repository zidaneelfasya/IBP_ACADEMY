import {
    Clock,
    Lock,
    FileText,
    CheckCircle,
    AlertCircle,
    Calendar,
    Info,
    Users,
    Building,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/Components/ui/tooltip";
import UserLayout from "@/Layouts/UserLayout";

type TaskStatus = "pending" | "locked" | "available" | "completed";

interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    deadline?: string;
    lockedMessage: string;
    icon: typeof FileText;
    progress?: number;
    category: "submission" | "attendance";
}

const tasks: Task[] = [
    {
        id: "preliminary-submission",
        title: "Pengumpulan Karya Preliminary Round",
        description:
            "Upload karya atau project untuk tahap penyisihan. Pastikan format file sesuai dengan ketentuan yang telah ditetapkan.",
        status: "locked",
        deadline: "20 Februari 2024",
        lockedMessage: "Menunggu verifikasi registrasi untuk membuka tahap ini",
        icon: FileText,
        category: "submission",
    },
    {
        id: "semifinal-submission",
        title: "Pengumpulan Karya Semifinal Round",
        description:
            "Upload karya yang telah diperbaiki untuk tahap semifinal. Sertakan dokumentasi dan penjelasan teknis.",
        status: "locked",
        deadline: "5 Maret 2024",
        lockedMessage: "Hanya tersedia untuk peserta yang lolos penyisihan",
        icon: FileText,
        category: "submission",
    },
    {
        id: "final-submission",
        title: "Pengumpulan Karya Final Round",
        description:
            "Upload karya final yang akan dipresentasikan kepada juri. Pastikan semua komponen sudah lengkap dan siap demo.",
        status: "locked",
        deadline: "18 Maret 2024",
        lockedMessage: "Hanya tersedia untuk peserta yang lolos semifinal",
        icon: FileText,
        category: "submission",
    },
    {
        id: "mentoring-session-1",
        title: "Bukti Kehadiran Mentoring Session 1",
        description:
            "Upload bukti kehadiran atau screenshot dari mentoring session pertama. Sertakan ringkasan materi yang didapat.",
        status: "locked",
        deadline: "25 Februari 2024",
        lockedMessage: "Akan dibuka setelah jadwal mentoring session 1 dimulai",
        icon: Users,
        category: "attendance",
    },
    {
        id: "mentoring-session-2",
        title: "Bukti Kehadiran Mentoring Session 2",
        description:
            "Upload bukti kehadiran atau screenshot dari mentoring session kedua. Sertakan catatan penting dari sesi mentoring.",
        status: "locked",
        deadline: "10 Maret 2024",
        lockedMessage: "Akan dibuka setelah jadwal mentoring session 2 dimulai",
        icon: Users,
        category: "attendance",
    },
    {
        id: "company-session",
        title: "Bukti Kehadiran Company's Session",
        description:
            "Upload bukti kehadiran dari sesi company visit atau company sharing session. Sertakan insight yang didapat.",
        status: "locked",
        deadline: "15 Maret 2024",
        lockedMessage: "Akan dibuka setelah jadwal company session dimulai",
        icon: Building,
        category: "attendance",
    },
];

const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
        case "pending":
            return (
                <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                    <Clock className="h-3 w-3 mr-1" />
                    Menunggu
                </Badge>
            );
        case "locked":
            return (
                <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-600 border-gray-200"
                >
                    <Lock className="h-3 w-3 mr-1" />
                    Terkunci
                </Badge>
            );
        case "available":
            return (
                <Badge
                    variant="default"
                    className="bg-blue-100 text-blue-800 border-blue-200"
                >
                    <FileText className="h-3 w-3 mr-1" />
                    Tersedia
                </Badge>
            );
        case "completed":
            return (
                <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-200"
                >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Selesai
                </Badge>
            );
        default:
            return null;
    }
};

const getStatusIcon = (status: TaskStatus, icon: typeof FileText) => {
    const IconComponent = icon;
    switch (status) {
        case "pending":
            return <IconComponent className="h-6 w-6 text-yellow-600" />;
        case "locked":
            return <IconComponent className="h-6 w-6 text-gray-500" />;
        case "available":
            return <IconComponent className="h-6 w-6 text-blue-600" />;
        case "completed":
            return <IconComponent className="h-6 w-6 text-green-600" />;
        default:
            return <IconComponent className="h-6 w-6 text-gray-500" />;
    }
};

const getCategoryBadge = (category: "submission" | "attendance") => {
    return category === "submission" ? (
        <Badge variant="outline" className="text-xs">
            Karya
        </Badge>
    ) : (
        <Badge
            variant="outline"
            className="text-xs bg-purple-50 text-purple-700 border-purple-200"
        >
            Kehadiran
        </Badge>
    );
};

export default function TugasPage() {
    const breadcrumbItems = [
        { label: "Dashboard", href: "/user/dashboard" },
        { label: "Tugas", isActive: true },
    ];

    const submissionTasks = tasks.filter(
        (task) => task.category === "submission"
    );
    const attendanceTasks = tasks.filter(
        (task) => task.category === "attendance"
    );

    return (
        <UserLayout
            title="Tugas & Formulir"
            showBreadcrumb={true}
            breadcrumbItems={breadcrumbItems}
        >
            <TooltipProvider>
                <div className="space-y-8">
                    {/* Registration Status Alert */}
                    <Alert variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Status Registrasi</AlertTitle>
                        <AlertDescription>
                            Pendaftaran Anda sedang dalam proses review.
                            Formulir tugas akan terbuka setelah registrasi
                            diverifikasi oleh admin. Estimasi waktu verifikasi:{" "}
                            <strong>1-3 hari kerja</strong>.
                        </AlertDescription>
                    </Alert>

                    {/* Progress Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-l-4 border-l-yellow-500">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </p>
                                        <p className="text-lg font-semibold text-yellow-600">
                                            Menunggu Review
                                        </p>
                                    </div>
                                    <Clock className="h-8 w-8 text-yellow-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-gray-400">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Tugas Tersedia
                                        </p>
                                        <p className="text-lg font-semibold text-gray-600">
                                            0 dari 6
                                        </p>
                                    </div>
                                    <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Tugas Selesai
                                        </p>
                                        <p className="text-lg font-semibold text-green-600">
                                            0 dari 6
                                        </p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Progress
                                        </p>
                                        <p className="text-lg font-semibold text-purple-600">
                                            0%
                                        </p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <span className="text-sm font-bold text-purple-600">
                                            0
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submission Tasks Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    Pengumpulan Karya
                                </h2>
                                <p className="text-muted-foreground">
                                    Upload karya untuk setiap tahap kompetisi
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {submissionTasks.map((task, index) => (
                                <Card
                                    key={task.id}
                                    className={`relative transition-all duration-200 hover:shadow-md ${
                                        task.status === "locked"
                                            ? "opacity-90"
                                            : "hover:shadow-lg"
                                    }`}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-gray-50">
                                                    {getStatusIcon(
                                                        task.status,
                                                        task.icon
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CardTitle className="text-lg font-semibold">
                                                            {task.title}
                                                        </CardTitle>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(
                                                            task.status
                                                        )}
                                                        {getCategoryBadge(
                                                            task.category
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-4">
                                        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                                            {task.description}
                                        </CardDescription>
                                        {task.deadline && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 p-2 rounded-md">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    Deadline: {task.deadline}
                                                </span>
                                            </div>
                                        )}
                                        <div className="pt-2">
                                            {task.status === "locked" ? (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full bg-transparent"
                                                            disabled
                                                        >
                                                            <Lock className="h-4 w-4 mr-2" />
                                                            Terkunci
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="bottom"
                                                        className="max-w-xs"
                                                    >
                                                        <p>
                                                            {task.lockedMessage}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : task.status === "available" ? (
                                                <Button className="w-full">
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Upload Karya
                                                </Button>
                                            ) : task.status === "completed" ? (
                                                <Button
                                                    variant="outline"
                                                    className="w-full bg-transparent"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Lihat Submission
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className="w-full bg-transparent"
                                                    disabled
                                                >
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Menunggu Review
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                    <div className="absolute top-4 right-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Attendance Tasks Section */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    Bukti Kehadiran
                                </h2>
                                <p className="text-muted-foreground">
                                    Upload bukti kehadiran untuk setiap sesi
                                    yang diikuti
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {attendanceTasks.map((task, index) => (
                                <Card
                                    key={task.id}
                                    className={`relative transition-all duration-200 hover:shadow-md ${
                                        task.status === "locked"
                                            ? "opacity-90"
                                            : "hover:shadow-lg"
                                    }`}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-purple-50">
                                                    {getStatusIcon(
                                                        task.status,
                                                        task.icon
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CardTitle className="text-lg font-semibold">
                                                            {task.title}
                                                        </CardTitle>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(
                                                            task.status
                                                        )}
                                                        {getCategoryBadge(
                                                            task.category
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0 space-y-4">
                                        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                                            {task.description}
                                        </CardDescription>
                                        {task.deadline && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-purple-50 p-2 rounded-md">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    Deadline: {task.deadline}
                                                </span>
                                            </div>
                                        )}
                                        <div className="pt-2">
                                            {task.status === "locked" ? (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full bg-transparent"
                                                            disabled
                                                        >
                                                            <Lock className="h-4 w-4 mr-2" />
                                                            Terkunci
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="bottom"
                                                        className="max-w-xs"
                                                    >
                                                        <p>
                                                            {task.lockedMessage}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : task.status === "available" ? (
                                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                                    <task.icon className="h-4 w-4 mr-2" />
                                                    Upload Bukti
                                                </Button>
                                            ) : task.status === "completed" ? (
                                                <Button
                                                    variant="outline"
                                                    className="w-full bg-transparent"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Lihat Bukti
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    className="w-full bg-transparent"
                                                    disabled
                                                >
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Menunggu Jadwal
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                    <div className="absolute top-4 right-4">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                            <span className="text-sm font-medium text-purple-600">
                                                {index + 4}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Help Section */}
                    <Alert variant="info">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Informasi Penting</AlertTitle>
                        <AlertDescription className="space-y-2 mt-2">
                            <div className="grid gap-2">
                                <p>
                                    • Pastikan data registrasi Anda sudah
                                    lengkap dan benar
                                </p>
                                <p>
                                    • Proses verifikasi registrasi membutuhkan
                                    waktu 1-3 hari kerja
                                </p>
                                <p>
                                    • Anda akan mendapat notifikasi email ketika
                                    formulir sudah dapat diakses
                                </p>
                                <p>
                                    • Upload bukti kehadiran maksimal 24 jam
                                    setelah sesi berakhir
                                </p>
                                <p>
                                    • Jika ada pertanyaan, hubungi admin melalui
                                    menu Profile
                                </p>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            </TooltipProvider>
        </UserLayout>
    );
}
