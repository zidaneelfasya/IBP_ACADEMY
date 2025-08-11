import { useState } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/Components/ui/alert";
import { Switch } from "@/Components/ui/switch";
import {
    CalendarIcon,
    ArrowLeft,
    Save,
    AlertCircle,
    Clock,
    BookOpen,
    FileText,
    Users,
    CheckCircle2,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { toast } from "sonner";

interface CompetitionStage {
    id: number;
    name: string;
    order: number;
}

interface CreateAssignmentProps {
    stages: CompetitionStage[];
}

interface FormData {
    competition_stage_id: string;
    title: string;
    description: string;
    instructions: string;
    deadline: string;
    is_active: boolean;
}

export default function CreateAssignment({ stages }: CreateAssignmentProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        competition_stage_id: "",
        title: "",
        description: "",
        instructions: "",
        deadline: "",
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        post(route("admin.assignments.store"), {
            onSuccess: () => {
                toast.success("Tugas berhasil dibuat!");
                reset();
            },
            onError: (errors) => {
                toast.error("Terjadi kesalahan saat membuat tugas");
                console.error("Form errors:", errors);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const getMinDateTime = () => {
        const now = new Date();
        // Add 1 hour to current time as minimum deadline
        now.setHours(now.getHours() + 1);
        return now.toISOString().slice(0, 16);
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.assignments.index")}
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </div>
                    
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Buat Tugas Baru</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Buat tugas baru untuk peserta kompetisi. Pastikan semua informasi yang diperlukan telah diisi dengan lengkap dan benar.
                        </p>
                    </div>
                </div>

                {/* Error Alert */}
                {hasErrors && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Terdapat kesalahan pada form</AlertTitle>
                        <AlertDescription className="mt-2">
                            <ul className="list-disc list-inside space-y-1">
                                {Object.entries(errors).map(([field, error]) => (
                                    <li key={field} className="text-sm">
                                        <span className="font-medium capitalize">
                                            {field.replace('_', ' ')}:
                                        </span>{" "}
                                        {Array.isArray(error) ? error[0] : error}
                                    </li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <CardTitle>Informasi Dasar</CardTitle>
                            </div>
                            <CardDescription>
                                Informasi dasar tentang tugas yang akan dibuat
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Competition Stage */}
                            <div className="space-y-2">
                                <Label htmlFor="competition_stage_id" className="text-sm font-medium">
                                    Tahap Kompetisi <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.competition_stage_id}
                                    onValueChange={(value) => setData("competition_stage_id", value)}
                                >
                                    <SelectTrigger className={`w-full ${errors.competition_stage_id ? 'border-red-500 focus:border-red-500' : ''}`}>
                                        <SelectValue placeholder="Pilih tahap kompetisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stages.map((stage) => (
                                            <SelectItem key={stage.id} value={stage.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                                        {stage.order}
                                                    </div>
                                                    {stage.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.competition_stage_id && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.competition_stage_id}
                                    </p>
                                )}
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium">
                                    Judul Tugas <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="Masukkan judul tugas yang jelas dan deskriptif"
                                    className={`${errors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                                    maxLength={255}
                                />
                                <div className="flex justify-between items-center">
                                    {errors.title ? (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.title}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            Gunakan judul yang jelas dan mudah dipahami
                                        </p>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {data.title.length}/255
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Deskripsi <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    placeholder="Jelaskan tujuan dan konteks dari tugas ini"
                                    className={`min-h-[100px] resize-none ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                                    maxLength={1000}
                                />
                                <div className="flex justify-between items-center">
                                    {errors.description ? (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.description}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            Berikan deskripsi yang jelas tentang tugas ini
                                        </p>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {data.description.length}/1000
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Instructions & Deadline */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                <CardTitle>Instruksi & Tenggat Waktu</CardTitle>
                            </div>
                            <CardDescription>
                                Petunjuk detail dan batas waktu pengumpulan tugas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Instructions */}
                            <div className="space-y-2">
                                <Label htmlFor="instructions" className="text-sm font-medium">
                                    Instruksi Detail
                                </Label>
                                <Textarea
                                    id="instructions"
                                    value={data.instructions}
                                    onChange={(e) => setData("instructions", e.target.value)}
                                    placeholder="Berikan instruksi step-by-step yang detail untuk menyelesaikan tugas ini"
                                    className={`min-h-[120px] resize-none ${errors.instructions ? 'border-red-500 focus:border-red-500' : ''}`}
                                    maxLength={2000}
                                />
                                <div className="flex justify-between items-center">
                                    {errors.instructions ? (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.instructions}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">
                                            Instruksi yang detail akan membantu peserta memahami tugas dengan baik
                                        </p>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {data.instructions.length}/2000
                                    </span>
                                </div>
                            </div>

                            {/* Deadline */}
                            <div className="space-y-2">
                                <Label htmlFor="deadline" className="text-sm font-medium">
                                    Tenggat Waktu <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="deadline"
                                        type="datetime-local"
                                        value={data.deadline}
                                        onChange={(e) => setData("deadline", e.target.value)}
                                        min={getMinDateTime()}
                                        className={`${errors.deadline ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                                {errors.deadline ? (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.deadline}
                                    </p>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Tentukan batas waktu pengumpulan tugas
                                        </p>
                                        {data.deadline && (
                                            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md">
                                                <CalendarIcon className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm text-blue-800">
                                                    Deadline: {new Date(data.deadline).toLocaleString("id-ID", {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <CardTitle>Pengaturan Tugas</CardTitle>
                            </div>
                            <CardDescription>
                                Konfigurasi tambahan untuk tugas ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <Label htmlFor="is_active" className="text-sm font-medium">
                                        Status Aktif
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Tentukan apakah tugas ini langsung aktif setelah dibuat
                                    </p>
                                </div>
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData("is_active", checked)}
                                />
                            </div>
                            <div className="mt-3">
                                <Alert className={`border-2 ${data.is_active ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle className={data.is_active ? 'text-green-800' : 'text-yellow-800'}>
                                        {data.is_active ? "Tugas Aktif" : "Tugas Nonaktif"}
                                    </AlertTitle>
                                    <AlertDescription className={data.is_active ? 'text-green-700' : 'text-yellow-700'}>
                                        {data.is_active 
                                            ? "Tugas akan langsung tersedia untuk peserta setelah dibuat"
                                            : "Tugas akan disimpan sebagai draft dan perlu diaktifkan secara manual"
                                        }
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
                        <Link
                            href={route("admin.assignments.index")}
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                            Batal
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing || isSubmitting}
                            className="flex-1 sm:flex-none sm:min-w-[160px] h-12"
                        >
                            {processing || isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Menyimpan...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Buat Tugas
                                </div>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Help Section */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-blue-900">Tips Membuat Tugas yang Efektif</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Gunakan judul yang jelas dan deskriptif</li>
                                    <li>• Berikan instruksi yang detail dan mudah dipahami</li>
                                    <li>• Tetapkan deadline yang realistis dan masuk akal</li>
                                    <li>• Pastikan tugas sesuai dengan tahap kompetisi yang dipilih</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}