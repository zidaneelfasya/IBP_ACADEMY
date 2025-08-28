import AdminLayout from "@/Layouts/AdminLayout";
import axios from 'axios';
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
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
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/Components/ui/alert";
import {
    ArrowLeft,
    Upload,
    FileText,
    ImageIcon,
    Video,
    File,
    X,
    Check,
    Edit,
    Trash2,
    Eye,
    Save,
    DeleteIcon as Cancel,
    Play,
    Tag,
    AlertTriangle,
    XCircle,
} from "lucide-react";
import { toast } from 'sonner';
import { router } from "@inertiajs/react";

interface Material {
    id: string;
    title: string;
    description: string;
    content: string;
    videoUrl?: string;
    coverImage?: string;
    category: string;
    competition_category_id: number;
    files: File[];
    readCount: number;
    isSemifinal: boolean;
    createdAt: Date;
}

interface CompetitionCategory {
    id: number;
    name: string;
    is_active: boolean;
}

interface Props {
    materials: Material[];
    competitionCategories: CompetitionCategory[];
}

export default function AdminPage({ materials: initialMaterials, competitionCategories }: Props) {
    const [materials, setMaterials] = useState<Material[]>(
        initialMaterials || []
    );

    // Update materials when initialMaterials changes (after successful operations)
    useEffect(() => {
        setMaterials(initialMaterials || []);
    }, [initialMaterials]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [isSemifinal, setIsSemifinal] = useState(false);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    // Enhanced error handling states
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editVideoUrl, setEditVideoUrl] = useState("");
    const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
    const [editIsSemifinal, setEditIsSemifinal] = useState(false);
    const [previewId, setPreviewId] = useState<string | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);
    const [updateConfirmOpen, setUpdateConfirmOpen] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            
            // Validate file sizes (max 100MB per file)
            const invalidFiles = newFiles.filter(file => file.size > 100 * 1024 * 1024);
            if (invalidFiles.length > 0) {
                setFormErrors(prev => ({
                    ...prev, 
                    files: `File terlalu besar: ${invalidFiles.map(f => f.name).join(', ')}. Maksimal 100MB per file`
                }));
                return;
            }
            
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files);
            
            // Validate file sizes (max 100MB per file)
            const invalidFiles = newFiles.filter(file => file.size > 100 * 1024 * 1024);
            if (invalidFiles.length > 0) {
                setFormErrors(prev => ({
                    ...prev, 
                    files: `File terlalu besar: ${invalidFiles.map(f => f.name).join(', ')}. Maksimal 100MB per file`
                }));
                return;
            }
            
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        // Clear file errors if no files remain or if files are valid after removal
        if (formErrors.files) {
            const remainingFiles = files.filter((_, i) => i !== index);
            const invalidFiles = remainingFiles.filter(file => file.size > 100 * 1024 * 1024);
            if (invalidFiles.length === 0) {
                setFormErrors(prev => ({...prev, files: ''}));
            }
        }
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith("image/"))
            return <ImageIcon className="w-4 h-4" />;
        if (file.type.startsWith("video/"))
            return <Video className="w-4 h-4" />;
        if (file.type.includes("pdf") || file.type.includes("document"))
            return <FileText className="w-4 h-4" />;
        return <File className="w-4 h-4" />;
    };

    const removeCoverImage = () => {
        setCoverImage(null);
        setCoverImagePreview("");
        // Clear any cover image errors
        if (formErrors.coverImage) {
            setFormErrors(prev => ({...prev, coverImage: ''}));
        }
    };

    const getEmbedUrl = (url: string) => {
        if (url.includes("youtube.com/watch?v=")) {
            const videoId = url.split("v=")[1].split("&")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("youtu.be/")) {
            const videoId = url.split("youtu.be/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes("vimeo.com/")) {
            const videoId = url.split("vimeo.com/")[1];
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return url;
    };

    const isValidVideoUrl = (url: string) => {
        return (
            url.includes("youtube.com") ||
            url.includes("youtu.be") ||
            url.includes("vimeo.com")
        );
    };

    // Client-side validation function
    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        if (!title.trim()) {
            errors.title = 'Judul materi wajib diisi';
        } else if (title.trim().length < 3) {
            errors.title = 'Judul materi minimal 3 karakter';
        } else if (title.trim().length > 255) {
            errors.title = 'Judul materi maksimal 255 karakter';
        }
        
        if (!description.trim()) {
            errors.description = 'Deskripsi wajib diisi';
        } else if (description.trim().length < 10) {
            errors.description = 'Deskripsi minimal 10 karakter';
        } else if (description.trim().length > 1000) {
            errors.description = 'Deskripsi maksimal 1000 karakter';
        }
        
        if (!content.trim()) {
            errors.content = 'Konten lengkap wajib diisi';
        } else if (content.trim().length < 50) {
            errors.content = 'Konten minimal 50 karakter';
        }
        
        if (!categoryId) {
            errors.category = 'Kategori lomba wajib dipilih';
        }
        
        if (videoUrl && !isValidVideoUrl(videoUrl)) {
            errors.videoUrl = 'URL video tidak valid. Gunakan link YouTube atau Vimeo';
        }
        
        if (coverImage && coverImage.size > 5 * 1024 * 1024) {
            errors.coverImage = 'Ukuran gambar cover maksimal 5MB';
        }
        
        // Validate files
        const invalidFiles = files.filter(file => file.size > 100 * 1024 * 1024);
        if (invalidFiles.length > 0) {
            errors.files = `File terlalu besar: ${invalidFiles.map(f => f.name).join(', ')}. Maksimal 100MB per file`;
        }
        
        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous errors
        setFormErrors({});
        setServerError(null);
        setShowErrorAlert(false);

        // Client-side validation
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            setServerError('Harap perbaiki kesalahan pada form sebelum melanjutkan');
            setShowErrorAlert(true);
            toast.error('Harap perbaiki kesalahan pada form');
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("content", content.trim());
        formData.append("competition_category_id", categoryId!.toString());
        formData.append("is_semifinal", isSemifinal ? "1" : "0");
        if (videoUrl.trim()) formData.append("video_url", videoUrl.trim());
        if (coverImage) formData.append("cover_image", coverImage);
        files.forEach((file) => formData.append("files[]", file));

        try {
            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await axios.post(route('admin.courses.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                withCredentials: true,
            });

            // Reset form and errors on success
            setTitle("");
            setDescription("");
            setContent("");
            setVideoUrl("");
            setCategoryId(null);
            setIsSemifinal(false);
            setCoverImage(null);
            setCoverImagePreview("");
            setFiles([]);
            setFormErrors({});
            setServerError(null);
            setShowErrorAlert(false);

            toast.success('Materi berhasil diupload!');
            
            // Use Inertia's router to reload the page properly
            window.location.href = route('admin.courses.index');
        } catch (error: any) {
            console.error('Error creating course:', error);
            
            // Handle validation errors from backend
            if (error.response?.status === 422 && error.response?.data?.errors) {
                const backendErrors: {[key: string]: string} = {};
                const errorData = error.response.data.errors;
                
                // Map backend field names to frontend field names
                Object.keys(errorData).forEach(key => {
                    const fieldMap: {[key: string]: string} = {
                        'title': 'title',
                        'description': 'description', 
                        'content': 'content',
                        'competition_category_id': 'category',
                        'video_url': 'videoUrl',
                        'cover_image': 'coverImage',
                        'files': 'files',
                        'files.*': 'files'
                    };
                    
                    const mappedKey = fieldMap[key] || key;
                    backendErrors[mappedKey] = Array.isArray(errorData[key]) 
                        ? errorData[key][0] 
                        : errorData[key];
                });
                
                setFormErrors(backendErrors);
                setServerError('Terdapat kesalahan dalam pengisian form. Silakan periksa dan perbaiki field yang ditandai.');
                setShowErrorAlert(true);
                toast.error('Validasi form gagal. Silakan periksa kembali input Anda.');
            } else {
                // Handle other types of errors
                const errorMessage = error.response?.data?.message || 
                                   error.message || 
                                   'Terjadi kesalahan tidak terduga saat menyimpan materi';
                                   
                setServerError(errorMessage);
                setShowErrorAlert(true);
                toast.error(errorMessage);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const startEdit = (material: Material) => {
        setEditingId(material.id);
        setEditTitle(material.title);
        setEditDescription(material.description);
        setEditContent(material.content);
        setEditVideoUrl(material.videoUrl || "");
        setEditCategoryId(material.competition_category_id);
        setEditIsSemifinal(material.isSemifinal);
    };

    const saveEdit = async (id: string) => {
        if (!editTitle.trim() || !editDescription.trim() || !editContent.trim() || !editCategoryId) {
            toast.error('Harap isi semua field yang wajib diisi');
            return;
        }
        console.log('Saving edit for material ID:', id,
            editTitle, editDescription, editContent, editCategoryId, editVideoUrl, editIsSemifinal
        );
        setIsUpdating(true);
        try {
            // Send update request to backend
            
            router.put(route('admin.courses.update', id), {
                title: editTitle,
                description: editDescription,
                content: editContent,
                competition_category_id: editCategoryId,
                video_url: editVideoUrl.trim() || null,
                is_semifinal: editIsSemifinal,
                is_active: true

            }, {
                onSuccess: () => {
                    setEditingId(null);
                    setUpdateConfirmOpen(null);
                    toast.success('Materi berhasil diperbarui');
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                    toast.error('Gagal memperbarui materi: ' + (errors.error || 'Unknown error'));
                },
                onFinish: () => {
                    setIsUpdating(false);
                }
            });
        } catch (error) {
            toast.error('Terjadi kesalahan saat memperbarui materi');
            setIsUpdating(false);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setUpdateConfirmOpen(null);
    };

    const confirmUpdate = (id: string) => {
        setUpdateConfirmOpen(id);
    };

    const confirmDelete = (id: string) => {
        setDeleteConfirmOpen(id);
    };

    const deleteMaterial = async (id: string) => {
        setIsDeleting(true);
        try {
            // Send delete request to backend
            router.delete(route('admin.courses.destroy', id), {
                onSuccess: () => {
                    setDeleteConfirmOpen(null);
                    toast.success('Materi berhasil dihapus');
                },
                onError: (errors) => {
                    console.error('Delete errors:', errors);
                    toast.error('Gagal menghapus materi: ' + (errors.error || 'Unknown error'));
                },
                onFinish: () => {
                    setIsDeleting(false);
                }
            });
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus materi');
            setIsDeleting(false);
        }
    };

    const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setFormErrors(prev => ({
                    ...prev, 
                    coverImage: 'Ukuran gambar cover maksimal 5MB'
                }));
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setFormErrors(prev => ({
                    ...prev, 
                    coverImage: 'File harus berupa gambar (JPG, PNG, GIF, dll.)'
                }));
                return;
            }
            
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Panel" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 relative">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0),
                                radial-gradient(circle at 75px 75px, #1e40af 2px, transparent 0)
                            `,
                            backgroundSize: "100px 100px",
                        }}
                    />
                </div>
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <div className="flex items-center gap-4 mb-8">

                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                Panel Admin
                            </h1>
                            <p className="text-muted-foreground">
                                Upload dan kelola materi pembelajaran
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:items-start">
                        <Card className="shadow-sm border-gray-200/80 bg-white/80 backdrop-blur-sm  flex flex-col">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <Upload className="w-5 h-5 text-blue-600" />
                                    Upload Materi Baru
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Tambahkan materi pembelajaran dengan
                                    deskripsi dan lampiran
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                {/* Error Alert */}
                                {showErrorAlert && serverError && (
                                    <Alert variant="destructive" className="mb-6">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Terjadi Kesalahan</AlertTitle>
                                        <AlertDescription>
                                            {serverError}
                                            {Object.keys(formErrors).length > 0 && (
                                                <ul className="mt-2 list-disc list-inside">
                                                    {Object.entries(formErrors).map(([field, error]) => (
                                                        <li key={field} className="text-sm">
                                                            <span className="font-medium">
                                                                {field === 'title' && 'Judul Materi'}
                                                                {field === 'description' && 'Deskripsi'}
                                                                {field === 'content' && 'Konten'}
                                                                {field === 'category' && 'Kategori'}
                                                                {field === 'videoUrl' && 'URL Video'}
                                                                {field === 'coverImage' && 'Gambar Cover'}
                                                                {field === 'files' && 'File Lampiran'}
                                                            </span>: {error}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                                            Judul Materi <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={title}
                                            onChange={(e) => {
                                                setTitle(e.target.value);
                                                // Clear error when user starts typing
                                                if (formErrors.title) {
                                                    setFormErrors(prev => ({...prev, title: ''}));
                                                }
                                            }}
                                            placeholder="Masukkan judul materi..."
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                                                formErrors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                                            }`}
                                            required
                                        />
                                        {formErrors.title && (
                                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                                <XCircle className="h-4 w-4" />
                                                <span>{formErrors.title}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                                            Deskripsi <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={description}
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                                // Clear error when user starts typing
                                                if (formErrors.description) {
                                                    setFormErrors(prev => ({...prev, description: ''}));
                                                }
                                            }}
                                            placeholder="Deskripsi singkat tentang materi ini..."
                                            rows={3}
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                                                formErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                                            }`}
                                            required
                                        />
                                        {formErrors.description && (
                                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                                <XCircle className="h-4 w-4" />
                                                <span>{formErrors.description}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                                            Kategori Lomba <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={categoryId || ""}
                                            onChange={(e) => {
                                                setCategoryId(e.target.value ? parseInt(e.target.value) : null);
                                                // Clear error when user selects a category
                                                if (formErrors.category) {
                                                    setFormErrors(prev => ({...prev, category: ''}));
                                                }
                                            }}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                                                formErrors.category ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                                            }`}
                                            required
                                        >
                                            <option value="">
                                                Pilih kategori lomba...
                                            </option>
                                            {competitionCategories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.category && (
                                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                                <XCircle className="h-4 w-4" />
                                                <span>{formErrors.category}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="coverImage" className="text-sm font-semibold text-gray-700">
                                            Gambar Cover
                                        </Label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <label
                                                        htmlFor="cover-upload"
                                                        className="cursor-pointer"
                                                    >
                                                        <ImageIcon className="w-4 h-4 mr-2" />
                                                        Pilih Gambar
                                                    </label>
                                                </Button>
                                                <input
                                                    id="cover-upload"
                                                    name="cover-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        handleCoverImageUpload(e);
                                                        // Clear error when user selects a new image
                                                        if (formErrors.coverImage) {
                                                            setFormErrors(prev => ({...prev, coverImage: ''}));
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                                {coverImage && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={
                                                            removeCoverImage
                                                        }
                                                    >
                                                        <X className="w-4 h-4 mr-1" />
                                                        Hapus
                                                    </Button>
                                                )}
                                            </div>
                                            {formErrors.coverImage && (
                                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                                    <XCircle className="h-4 w-4" />
                                                    <span>{formErrors.coverImage}</span>
                                                </div>
                                            )}
                                            {coverImagePreview && (
                                                <div className="relative inline-block p-1 bg-gray-50 rounded-lg border border-gray-200">
                                                    <img
                                                        src={coverImagePreview}
                                                        alt="Preview cover"
                                                        className="w-32 h-32 object-cover rounded-lg shadow-sm"
                                                    />
                                                    <Badge className="absolute -top-2 -right-2 text-xs">
                                                        {coverImage?.name}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content" className="text-sm font-semibold text-gray-700">
                                            Konten Lengkap <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="content"
                                            name="content"
                                            value={content}
                                            onChange={(e) => {
                                                setContent(e.target.value);
                                                // Clear error when user starts typing
                                                if (formErrors.content) {
                                                    setFormErrors(prev => ({...prev, content: ''}));
                                                }
                                            }}
                                            placeholder="Tulis konten materi lengkap di sini..."
                                            rows={8}
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                                                formErrors.content ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                                            }`}
                                            required
                                        />
                                        {formErrors.content && (
                                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                                <XCircle className="h-4 w-4" />
                                                <span>{formErrors.content}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="videoUrl" className="text-sm font-semibold text-gray-700">
                                            Link Video (Opsional)
                                        </Label>
                                        <Input
                                            id="videoUrl"
                                            name="videoUrl"
                                            value={videoUrl}
                                            onChange={(e) => {
                                                setVideoUrl(e.target.value);
                                                // Clear error when user starts typing
                                                if (formErrors.videoUrl) {
                                                    setFormErrors(prev => ({...prev, videoUrl: ''}));
                                                }
                                            }}
                                            placeholder="https://youtube.com/watch?v=... atau https://vimeo.com/..."
                                            className={`border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                                                formErrors.videoUrl ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                                            }`}
                                        />
                                        {formErrors.videoUrl && (
                                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                                <XCircle className="h-4 w-4" />
                                                <span>{formErrors.videoUrl}</span>
                                            </div>
                                        )}
                                        {videoUrl &&
                                            isValidVideoUrl(videoUrl) && (
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                                        <Play className="w-4 h-4" />
                                                        Preview Video:
                                                    </p>
                                                    <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden bg-black">
                                                        <iframe
                                                            src={getEmbedUrl(
                                                                videoUrl
                                                            )}
                                                            title="Video Preview"
                                                            className="w-full h-full"
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        {videoUrl &&
                                            !isValidVideoUrl(videoUrl) && (
                                                <p className="text-sm text-yellow-600">
                                                    URL video tidak valid.
                                                    Gunakan link YouTube atau
                                                    Vimeo.
                                                </p>
                                            )}
                                    </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="isSemifinal"
                                                    name="isSemifinal"
                                                    checked={isSemifinal}
                                                    onChange={(e) =>
                                                        setIsSemifinal(e.target.checked)
                                                    }
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                                />
                                                <Label
                                                    htmlFor="isSemifinal"
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    Khusus untuk Peserta Semifinal
                                                </Label>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Centang jika materi ini hanya untuk peserta yang telah lolos ke tahap semifinal
                                            </p>
                                        </div>

                                    <div className="space-y-4">
                                        <Label className="text-sm font-semibold text-gray-700">
                                            Lampiran File
                                        </Label>

                                        <div
                                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                                                dragActive
                                                    ? "border-blue-400 bg-blue-50/50 border-solid shadow-md"
                                                    : "border-gray-300 hover:border-blue-300 hover:bg-gray-50/50"
                                            } ${
                                                formErrors.files ? 'border-red-300' : ''
                                            }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <Upload className="w-8 h-8 mx-auto mb-4 text-gray-500" />
                                            <p className="text-sm text-gray-600 mb-2">
                                                Seret & lepas file di sini atau
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                                                asChild
                                            >
                                                <label
                                                    htmlFor="file-upload"
                                                    className="cursor-pointer"
                                                >
                                                    Pilih File
                                                </label>
                                            </Button>
                                            <p className="text-xs text-gray-500 mt-2">
                                                PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, MP4, MP3 (Maksimal 100MB per file)
                                            </p>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                multiple
                                                onChange={(e) => {
                                                    handleFileInput(e);
                                                    // Clear error when user selects files
                                                    if (formErrors.files) {
                                                        setFormErrors(prev => ({...prev, files: ''}));
                                                    }
                                                }}
                                                className="hidden"
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mp3"
                                            />
                                        </div>

                                        {formErrors.files && (
                                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                                <XCircle className="h-4 w-4" />
                                                <span>{formErrors.files}</span>
                                            </div>
                                        )}

                                        {files.length > 0 && (
                                            <div className="space-y-2 mt-4">
                                                <p className="text-sm font-medium">
                                                    Lampiran File:
                                                </p>
                                                {files.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200 hover:bg-gray-100/80 transition-all duration-200"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {getFileIcon(file)}
                                                            <span className="text-sm truncate">
                                                                {file.name}
                                                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {(
                                                                    file.size /
                                                                    1024 /
                                                                    1024
                                                                ).toFixed(
                                                                    1
                                                                )}{" "}
                                                                MB
                                                            </Badge>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeFile(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary text-white font-semibold py-3 shadow-md hover:shadow-lg transition-all duration-200"
                                        disabled={
                                            isUploading ||
                                            !title.trim() ||
                                            !description.trim() ||
                                            !content.trim() ||
                                            !categoryId
                                        }
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Mengupload...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2 " />
                                                Upload Materi
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200/80 bg-white/80 backdrop-blur-sm h-full flex flex-col">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center justify-between text-gray-800">
                                    <span>Materi yang Diupload</span>
                                    {materials.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            {materials.length} Materi
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Kelola materi pembelajaran yang telah
                                    diupload
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1  overflow-y-auto relative course-list-scroll">
                                {/* Scroll indicator gradient */}
                                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent pointer-events-none z-10" style={{display: materials.length > 3 ? 'block' : 'none'}}></div>

                                {materials.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Belum ada materi yang diupload</p>
                                    </div>
                                ) : (
                                    <>
                                        {materials.length > 3 && (
                                            <div className="text-xs text-gray-500 mb-3 flex items-center justify-center gap-2 bg-blue-50/50 py-2 rounded-md">
                                                <span>Scroll untuk melihat lebih banyak</span>
                                                <svg className="w-3 h-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="space-y-4 pr-2 pb-6">
                                            {materials.map((material) => (
                                            <div
                                                key={material.id}
                                                className="p-5 border border-gray-200 rounded-lg bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
                                            >
                                                {editingId === material.id ? (
                                                    <div className="space-y-4">
                                                        <Input
                                                            value={editTitle}
                                                            name="editTitle"
                                                            onChange={(e) =>
                                                                setEditTitle(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Judul materi..."
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                        />
                                                        <Textarea
                                                            value={
                                                                editDescription
                                                            }
                                                            name="editDescription"
                                                            onChange={(e) =>
                                                                setEditDescription(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Deskripsi..."
                                                            rows={2}
                                                            className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                        />
                                                        <div className="space-y-2">
                                                            <Label htmlFor="editCategory">
                                                                Kategori Lomba
                                                            </Label>
                                                            <select
                                                                id="editCategory"
                                                                name="editCategory"
                                                                value={editCategoryId || ""}
                                                                onChange={(e) =>
                                                                    setEditCategoryId(e.target.value ? parseInt(e.target.value) : null)
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                            >
                                                                <option value="">
                                                                    Pilih
                                                                    kategori
                                                                    lomba...
                                                                </option>
                                                                {competitionCategories.map(
                                                                    (cat) => (
                                                                        <option
                                                                            key={cat.id}
                                                                            value={cat.id}
                                                                        >
                                                                            {cat.name}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="editVideoUrl">
                                                                Link Video
                                                                (Opsional)
                                                            </Label>
                                                            <Input
                                                                id="editVideoUrl"
                                                                name="editVideoUrl"
                                                                value={
                                                                    editVideoUrl
                                                                }
                                                                onChange={(e) =>
                                                                    setEditVideoUrl(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="https://youtube.com/watch?v=... atau https://vimeo.com/..."
                                                                className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id="editIsSemifinal"
                                                                    name="editIsSemifinal"
                                                                    checked={editIsSemifinal}
                                                                    onChange={(e) =>
                                                                        setEditIsSemifinal(e.target.checked)
                                                                    }
                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                                                />
                                                                <Label
                                                                    htmlFor="editIsSemifinal"
                                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                                >
                                                                    untuk Peserta Lolos Tahap Semifinal
                                                                </Label>
                                                            </div>
                                                        </div>
                                                        <Textarea
                                                            value={editContent}
                                                            name="editContent"
                                                            onChange={(e) =>
                                                                setEditContent(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Konten lengkap..."
                                                            rows={4}
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() =>
                                                                    confirmUpdate(
                                                                        material.id
                                                                    )
                                                                }
                                                                disabled={isUpdating}
                                                            >
                                                                {isUpdating ? (
                                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                                                                ) : (
                                                                    <Save className="w-4 h-4 mr-1" />
                                                                )}
                                                                {isUpdating ? "Menyimpan..." : "Simpan"}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={
                                                                    cancelEdit
                                                                }
                                                                disabled={isUpdating}
                                                            >
                                                                <Cancel className="w-4 h-4 mr-1" />
                                                                Batal
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-start gap-3">
                                                                {material.coverImage && (
                                                                    <img
                                                                        src={
                                                                            material.coverImage
                                                                        }
                                                                        alt={
                                                                            material.title
                                                                        }
                                                                        className="w-16 h-16 object-cover rounded-lg"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <h3 className="font-semibold text-foreground">
                                                                        {
                                                                            material.title
                                                                        }
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            material.description
                                                                        }
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-xs"
                                                                        >
                                                                            <Tag className="w-3 h-3 mr-1" />
                                                                            {
                                                                                material.category
                                                                            }
                                                                        </Badge>
                                                                        {material.videoUrl && (
                                                                            <div className="flex items-center gap-1">
                                                                                <Play className="w-3 h-3 text-blue-500" />
                                                                                <span className="text-xs text-blue-600">
                                                                                    Dengan
                                                                                    Video
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs"
                                                                >
                                                                    <Check className="w-3 h-3 mr-1" />
                                                                    Dipublikasi
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {previewId ===
                                                            material.id && (
                                                            <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                                                                <h4 className="font-medium mb-2">
                                                                    Preview
                                                                    Konten:
                                                                </h4>
                                                                <div className="text-sm text-foreground max-h-32 overflow-y-auto">
                                                                    {
                                                                        material.content
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}

                                                        {material.files.length >
                                                            0 && (
                                                            <div className="space-y-2 mb-3">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {material.files.map(
                                                                        (
                                                                            file,
                                                                            index
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    index
                                                                                }
                                                                                variant="secondary"
                                                                                className="text-xs"
                                                                            >
                                                                                {getFileIcon(
                                                                                    file
                                                                                )}
                                                                                <span className="ml-1">
                                                                                    {
                                                                                        file.name
                                                                                    }
                                                                                </span>
                                                                            </Badge>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs text-muted-foreground">
                                                                Upload oleh
                                                                Admin •{" "}
                                                                {new Date(
                                                                    material.createdAt
                                                                ).toLocaleDateString(
                                                                    "id-ID",
                                                                    {
                                                                        day: "numeric",
                                                                        month: "long",
                                                                        year: "numeric",
                                                                    }
                                                                )}
                                                            </p>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        setPreviewId(
                                                                            previewId ===
                                                                                material.id
                                                                                ? null
                                                                                : material.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    {previewId ===
                                                                    material.id
                                                                        ? "Tutup"
                                                                        : "Preview"}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        startEdit(
                                                                            material
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        confirmDelete(
                                                                            material.id
                                                                        )
                                                                    }
                                                                    disabled={isDeleting}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    {isDeleting ? (
                                                                        <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="w-4 h-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Update Confirmation Dialog */}
            <AlertDialog open={!!updateConfirmOpen} onOpenChange={() => setUpdateConfirmOpen(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Perubahan</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menyimpan perubahan pada materi ini? 
                            Pastikan semua informasi sudah benar sebelum menyimpan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUpdating}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => updateConfirmOpen && saveEdit(updateConfirmOpen)}
                            disabled={isUpdating}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isUpdating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Perubahan"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteConfirmOpen} onOpenChange={() => setDeleteConfirmOpen(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Materi</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus materi ini? 
                            Tindakan ini tidak dapat dibatalkan dan semua data terkait akan hilang permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={() => deleteConfirmOpen && deleteMaterial(deleteConfirmOpen)}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    Menghapus...
                                </>
                            ) : (
                                "Hapus Materi"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}

