"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    LinkIcon,
    Plus,
} from "lucide-react";
import Link from "next/link";

interface LinkAttachment {
    id: string;
    title: string;
    url: string;
    type: "video" | "document" | "link";
}

interface Material {
    id: string;
    title: string;
    description: string;
    content: string;
    coverImage?: string;
    files: File[];
    links: LinkAttachment[];
    readCount: number;
    createdAt: Date;
}

export default function AdminPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [links, setLinks] = useState<LinkAttachment[]>([]);
    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [linkType, setLinkType] = useState<"video" | "document" | "link">(
        "link"
    );
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editContent, setEditContent] = useState("");
    const [previewId, setPreviewId] = useState<string | null>(null);

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

    const addLink = () => {
        if (!linkTitle.trim() || !linkUrl.trim()) return;

        const newLink: LinkAttachment = {
            id: Date.now().toString(),
            title: linkTitle.trim(),
            url: linkUrl.trim(),
            type: linkType,
        };

        setLinks((prev) => [...prev, newLink]);
        setLinkTitle("");
        setLinkUrl("");
        setLinkType("link");
    };

    const removeLink = (id: string) => {
        setLinks((prev) => prev.filter((link) => link.id !== id));
    };

    const getLinkIcon = (type: string) => {
        switch (type) {
            case "video":
                return <Video className="w-4 h-4" />;
            case "document":
                return <FileText className="w-4 h-4" />;
            default:
                return <LinkIcon className="w-4 h-4" />;
        }
    };

    const detectLinkType = (url: string): "video" | "document" | "link" => {
        if (
            url.includes("youtube.com") ||
            url.includes("youtu.be") ||
            url.includes("vimeo.com")
        ) {
            return "video";
        }
        if (
            url.includes(".pdf") ||
            url.includes(".doc") ||
            url.includes("drive.google.com")
        ) {
            return "document";
        }
        return "link";
    };

    const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCoverImage = () => {
        setCoverImage(null);
        setCoverImagePreview("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !content.trim()) return;

        setIsUploading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const newMaterial: Material = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim(),
            content: content.trim(),
            coverImage: coverImagePreview || undefined,
            files: [...files],
            links: [...links],
            readCount: Math.floor(Math.random() * 50) + 1,
            createdAt: new Date(),
        };

        setMaterials((prev) => [newMaterial, ...prev]);
        setTitle("");
        setDescription("");
        setContent("");
        setCoverImage(null);
        setCoverImagePreview("");
        setFiles([]);
        setLinks([]);
        setIsUploading(false);
    };

    const startEdit = (material: Material) => {
        setEditingId(material.id);
        setEditTitle(material.title);
        setEditDescription(material.description);
        setEditContent(material.content);
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
                      }
                    : material
            )
        );
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setEditContent("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setEditContent("");
    };

    const deleteMaterial = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus materi ini?")) {
            setMaterials((prev) =>
                prev.filter((material) => material.id !== id)
            );
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/user">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Materi
                        </Button>
                    </Link>
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
                                Tambahkan materi pembelajaran dengan deskripsi
                                dan lampiran
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Judul Materi</Label>
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
                                                    onClick={removeCoverImage}
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    Hapus
                                                </Button>
                                            )}
                                        </div>
                                        {coverImagePreview && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={
                                                        coverImagePreview ||
                                                        "/placeholder.svg"
                                                    }
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

                                <div className="space-y-4">
                                    <Label>Lampiran</Label>

                                    <div className="space-y-4">
                                        <div className="p-4 border rounded-lg bg-muted/30">
                                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                                <LinkIcon className="w-4 h-4" />
                                                Tambah Lampiran Link
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                <Input
                                                    value={linkTitle}
                                                    onChange={(e) =>
                                                        setLinkTitle(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Judul link (contoh: 'Video Tutorial', 'Dokumen Referensi')"
                                                />
                                                <Input
                                                    value={linkUrl}
                                                    onChange={(e) => {
                                                        setLinkUrl(
                                                            e.target.value
                                                        );
                                                        setLinkType(
                                                            detectLinkType(
                                                                e.target.value
                                                            )
                                                        );
                                                    }}
                                                    placeholder="https://example.com/video atau https://drive.google.com/..."
                                                />
                                                <div className="flex gap-2">
                                                    <select
                                                        value={linkType}
                                                        onChange={(e) =>
                                                            setLinkType(
                                                                e.target
                                                                    .value as
                                                                    | "video"
                                                                    | "document"
                                                                    | "link"
                                                            )
                                                        }
                                                        className="px-3 py-2 border rounded-md text-sm"
                                                    >
                                                        <option value="link">
                                                            Link Umum
                                                        </option>
                                                        <option value="video">
                                                            Video
                                                        </option>
                                                        <option value="document">
                                                            Dokumen
                                                        </option>
                                                    </select>
                                                    <Button
                                                        type="button"
                                                        onClick={addLink}
                                                        size="sm"
                                                        disabled={
                                                            !linkTitle.trim() ||
                                                            !linkUrl.trim()
                                                        }
                                                    >
                                                        <Plus className="w-4 h-4 mr-1" />
                                                        Tambah Link
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {links.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">
                                                    Lampiran Link:
                                                </p>
                                                {links.map((link) => (
                                                    <div
                                                        key={link.id}
                                                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {getLinkIcon(
                                                                link.type
                                                            )}
                                                            <div>
                                                                <span className="text-sm font-medium">
                                                                    {link.title}
                                                                </span>
                                                                <p className="text-xs text-muted-foreground truncate max-w-xs">
                                                                    {link.url}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs capitalize"
                                                            >
                                                                {link.type}
                                                            </Badge>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removeLink(
                                                                    link.id
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
                                                            ).toFixed(1)}{" "}
                                                            MB
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeFile(index)
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
                                        !content.trim()
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
                                Kelola materi pembelajaran yang telah diupload
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
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Judul materi..."
                                                    />
                                                    <Textarea
                                                        value={editDescription}
                                                        onChange={(e) =>
                                                            setEditDescription(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Deskripsi..."
                                                        rows={2}
                                                    />
                                                    <Textarea
                                                        value={editContent}
                                                        onChange={(e) =>
                                                            setEditContent(
                                                                e.target.value
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
                                                            onClick={cancelEdit}
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
                                                                        material.coverImage ||
                                                                        "/placeholder.svg"
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
                                                                Preview Konten:
                                                            </h4>
                                                            <div className="text-sm text-foreground max-h-32 overflow-y-auto">
                                                                {
                                                                    material.content
                                                                }
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(material.files.length >
                                                        0 ||
                                                        material.links.length >
                                                            0) && (
                                                        <div className="space-y-2 mb-3">
                                                            {material.files
                                                                .length > 0 && (
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
                                                            )}
                                                            {material.links
                                                                .length > 0 && (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {material.links.map(
                                                                        (
                                                                            link
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    link.id
                                                                                }
                                                                                variant="outline"
                                                                                className="text-xs"
                                                                            >
                                                                                {getLinkIcon(
                                                                                    link.type
                                                                                )}
                                                                                <span className="ml-1">
                                                                                    {
                                                                                        link.title
                                                                                    }
                                                                                </span>
                                                                            </Badge>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs text-muted-foreground">
                                                            Upload oleh Admin •{" "}
                                                            {material.createdAt.toLocaleDateString(
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
    );
}
