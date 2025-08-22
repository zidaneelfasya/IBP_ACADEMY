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
    ArrowLeft,
    Save,
    AlertCircle,
    BookOpen,
    FileText,
    Users,
    Calendar,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { toast } from "sonner";

interface Assignment {
    id: number;
    uuid: string;
    title: string;
    description: string;
    instructions: string | null;
    deadline: string;
    is_active: boolean;
    competition_stage_id: number;
    competition_category_id: number;
}

interface CompetitionStage {
    id: number;
    name: string;
    order: number;
}

interface CompetitionCategory {
    id: number;
    name: string;
    is_active: boolean;
}

interface EditAssignmentProps {
    assignment: Assignment;
    stages: CompetitionStage[];
    categories: CompetitionCategory[];
}

interface FormData {
    competition_stage_id: string;
    competition_category_id: string;
    title: string;
    description: string;
    instructions: string;
    deadline: string;
    is_active: boolean;
}

export default function EditAssignment({ assignment, stages, categories }: EditAssignmentProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data, setData, put, processing, errors, reset } = useForm<FormData>({
        competition_stage_id: assignment.competition_stage_id.toString(),
        competition_category_id: assignment.competition_category_id.toString(),
        title: assignment.title,
        description: assignment.description,
        instructions: assignment.instructions || "",
        deadline: new Date(assignment.deadline).toISOString().slice(0, 16),
        is_active: assignment.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        put(route("admin.assignments.update", assignment.uuid), {
            onSuccess: () => {
                toast.success("Tugas berhasil diperbarui!");
            },
            onError: (errors) => {
                toast.error("Terjadi kesalahan saat memperbarui tugas");
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
                        <h1 className="text-3xl font-bold tracking-tight">Edit Tugas</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Perbarui informasi tugas untuk peserta kompetisi. Pastikan semua perubahan yang dibuat sudah sesuai dengan kebutuhan.
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
                                Informasi dasar tentang tugas yang akan diperbarui
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

                            {/* Competition Category */}
                            <div className="space-y-2">
                                <Label htmlFor="competition_category_id" className="text-sm font-medium">
                                    Kategori Kompetisi <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.competition_category_id}
                                    onValueChange={(value) => setData("competition_category_id", value)}
                                >
                                    <SelectTrigger className={`w-full ${errors.competition_category_id ? 'border-red-500 focus:border-red-500' : ''}`}>
                                        <SelectValue placeholder="Pilih kategori kompetisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${category.name === 'BPC' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                                    <span className="font-medium">
                                                        {category.name === 'BPC' ? 'Business Plan Competition' : 'Business Case Competition'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        ({category.name})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.competition_category_id && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.competition_category_id}
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
                                            Instruksi detail akan membantu peserta memahami apa yang harus dikerjakan
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
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="deadline"
                                        type="datetime-local"
                                        value={data.deadline}
                                        onChange={(e) => setData("deadline", e.target.value)}
                                        min={getMinDateTime()}
                                        className={`pl-10 ${errors.deadline ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.deadline ? (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.deadline}
                                    </p>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        Pilih tanggal dan waktu yang memberikan cukup waktu untuk peserta mengerjakan tugas
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle>Pengaturan</CardTitle>
                            <CardDescription>
                                Konfigurasi tambahan untuk tugas ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium">Status Aktif</div>
                                        <div className="text-sm text-muted-foreground">
                                            Aktifkan tugas ini agar dapat dilihat oleh peserta
                                        </div>
                                    </div>
                                    <Switch
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData("is_active", checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Link
                            href={route("admin.assignments.index")}
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            Batal
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing || isSubmitting}
                            className="min-w-[120px]"
                        >
                            {processing || isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                    Menyimpan...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Perbarui Tugas
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
