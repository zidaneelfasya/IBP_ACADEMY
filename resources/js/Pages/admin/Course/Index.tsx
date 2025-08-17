import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
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
} from "lucide-react";

interface Material {
    id: string;
    title: string;
    description: string;
    content: string;
    videoUrl?: string;
    coverImage?: string;
    category: string;
    files: File[];
    readCount: number;
    createdAt: Date;
}

interface Props {
    materials: Material[];
}

export default function AdminPage({ materials: initialMaterials }: Props) {
    const [materials, setMaterials] = useState<Material[]>(
        initialMaterials || []
    );
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [category, setCategory] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editVideoUrl, setEditVideoUrl] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [previewId, setPreviewId] = useState<string | null>(null);

    const categories = [
        "Lomba Desain",
        "Lomba Programming",
        "Lomba Video",
        "Lomba Fotografi",
        "Lomba Karya Tulis",
        "Lomba Presentasi",
        "Lomba Inovasi",
        "Lomba Startup",
    ];

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !title.trim() ||
            !description.trim() ||
            !content.trim() ||
            !category.trim()
        )
            return;

        setIsUploading(true);

        // In a real Laravel app, you would submit this to your backend
        // For now we'll simulate it
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("content", content);
        formData.append("category", category);
        if (videoUrl) formData.append("videoUrl", videoUrl);
        if (coverImage) formData.append("coverImage", coverImage);
        files.forEach((file) => formData.append("files[]", file));

        try {
            // This would be your actual API call in Laravel
            // await axios.post('/admin/materials', formData)

            // Simulate API response delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const newMaterial: Material = {
                id: Date.now().toString(),
                title: title.trim(),
                description: description.trim(),
                content: content.trim(),
                videoUrl: videoUrl.trim() || undefined,
                coverImage: coverImagePreview || undefined,
                category: category.trim(),
                files: [...files],
                readCount: Math.floor(Math.random() * 50) + 1,
                createdAt: new Date(),
            };

            setMaterials((prev) => [newMaterial, ...prev]);
            setTitle("");
            setDescription("");
            setContent("");
            setVideoUrl("");
            setCategory("");
            setCoverImage(null);
            setCoverImagePreview("");
            setFiles([]);
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
        setEditCategory(material.category);
    };

    const saveEdit = (id: string) => {
        setMaterials((prev) =>
            prev.map((material) =>
                material.id === id
                    ? {
                          ...material,
                          title: editTitle,
                          description: editDescription,
                          content: editContent,
                          videoUrl: editVideoUrl.trim() || undefined,
                          category: editCategory,
                      }
                    : material
            )
        );
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const deleteMaterial = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
            setMaterials((prev) =>
                prev.filter((material) => material.id !== id)
            );
        }
    };

    const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverImage(file);
            setCoverImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Panel" />

            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
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

                    <div className="grid lg:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    Upload Materi Baru
                                </CardTitle>
                                <CardDescription>
                                    Tambahkan materi pembelajaran dengan
                                    deskripsi dan lampiran
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            Judul Materi
                                        </Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Masukkan judul materi..."
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Deskripsi
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            placeholder="Deskripsi singkat tentang materi ini..."
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">
                                            Kategori Lomba
                                        </Label>
                                        <select
                                            id="category"
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                            required
                                        >
                                            <option value="">
                                                Pilih kategori lomba...
                                            </option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="coverImage">
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
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={
                                                        handleCoverImageUpload
                                                    }
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
                                            {coverImagePreview && (
                                                <div className="relative inline-block">
                                                    <img
                                                        src={coverImagePreview}
                                                        alt="Preview cover"
                                                        className="w-32 h-32 object-cover rounded-lg border"
                                                    />
                                                    <Badge className="absolute -top-2 -right-2 text-xs">
                                                        {coverImage?.name}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="content">
                                            Konten Lengkap
                                        </Label>
                                        <Textarea
                                            id="content"
                                            value={content}
                                            onChange={(e) =>
                                                setContent(e.target.value)
                                            }
                                            placeholder="Tulis konten materi lengkap di sini..."
                                            rows={8}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="videoUrl">
                                            Link Video (Opsional)
                                        </Label>
                                        <Input
                                            id="videoUrl"
                                            value={videoUrl}
                                            onChange={(e) =>
                                                setVideoUrl(e.target.value)
                                            }
                                            placeholder="https://youtube.com/watch?v=... atau https://vimeo.com/..."
                                        />
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

                                    <div className="space-y-4">
                                        <Label>Lampiran File</Label>

                                        <div
                                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                                dragActive
                                                    ? "border-accent bg-accent/5"
                                                    : "border-border hover:border-accent/50"
                                            }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Seret & lepas file di sini atau
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <label
                                                    htmlFor="file-upload"
                                                    className="cursor-pointer"
                                                >
                                                    Pilih File
                                                </label>
                                            </Button>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                multiple
                                                onChange={handleFileInput}
                                                className="hidden"
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mp3"
                                            />
                                        </div>

                                        {files.length > 0 && (
                                            <div className="space-y-2 mt-4">
                                                <p className="text-sm font-medium">
                                                    Lampiran File:
                                                </p>
                                                {files.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
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
                                        className="w-full bg-accent hover:bg-accent/90"
                                        disabled={
                                            isUploading ||
                                            !title.trim() ||
                                            !description.trim() ||
                                            !content.trim() ||
                                            !category.trim()
                                        }
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Mengupload...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload Materi
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Materi yang Diupload</CardTitle>
                                <CardDescription>
                                    Kelola materi pembelajaran yang telah
                                    diupload
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {materials.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>Belum ada materi yang diupload</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {materials.map((material) => (
                                            <div
                                                key={material.id}
                                                className="p-4 border rounded-lg"
                                            >
                                                {editingId === material.id ? (
                                                    <div className="space-y-4">
                                                        <Input
                                                            value={editTitle}
                                                            onChange={(e) =>
                                                                setEditTitle(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Judul materi..."
                                                        />
                                                        <Textarea
                                                            value={
                                                                editDescription
                                                            }
                                                            onChange={(e) =>
                                                                setEditDescription(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Deskripsi..."
                                                            rows={2}
                                                        />
                                                        <div className="space-y-2">
                                                            <Label htmlFor="editCategory">
                                                                Kategori Lomba
                                                            </Label>
                                                            <select
                                                                id="editCategory"
                                                                value={
                                                                    editCategory
                                                                }
                                                                onChange={(e) =>
                                                                    setEditCategory(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                                            >
                                                                <option value="">
                                                                    Pilih
                                                                    kategori
                                                                    lomba...
                                                                </option>
                                                                {categories.map(
                                                                    (cat) => (
                                                                        <option
                                                                            key={
                                                                                cat
                                                                            }
                                                                            value={
                                                                                cat
                                                                            }
                                                                        >
                                                                            {
                                                                                cat
                                                                            }
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
                                                            />
                                                        </div>
                                                        <Textarea
                                                            value={editContent}
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
                                                                    saveEdit(
                                                                        material.id
                                                                    )
                                                                }
                                                            >
                                                                <Save className="w-4 h-4 mr-1" />
                                                                Simpan
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={
                                                                    cancelEdit
                                                                }
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
                                                                        deleteMaterial(
                                                                            material.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

