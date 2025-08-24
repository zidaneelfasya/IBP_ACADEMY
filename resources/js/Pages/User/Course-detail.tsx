"use client";

import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ArrowLeft,
    Download,
    FileText,
    Video,
    ImageIcon,
    File,
} from "lucide-react";
import { useEffect, useRef } from "react";

interface Attachment {
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    content: string;
    videoUrl?: string;
    cover: string;
    category: string;
    files: Attachment[];
    readCount: number;
    uploadedBy: string; // nama uploader
    uploadedAt: string; // tanggal upload
}

interface Props {
    course: Course;
}

export default function CourseShow({ course }: Props) {
    // ---- YouTube embed helper ----
    const embed = (url?: string) => {
        if (!url) return null;
        const match = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
        );
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    const embedUrl = embed(course.videoUrl);

    const icon = (type: string) => {
        if (type.includes("pdf"))
            return <FileText className="w-4 h-4 text-red-500" />;
        if (type.includes("video"))
            return <Video className="w-4 h-4 text-blue-500" />;
        if (type.includes("image"))
            return <ImageIcon className="w-4 h-4 text-green-500" />;
        return <File className="w-4 h-4 text-gray-500" />;
    };

    return (
        <UserLayout>
            <Head title={course.title} />
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Back button */}
                    <div className="mb-6">
                        <Link href="/user/course">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to courses
                            </Button>
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Cover & title */}
                            <Card>
                                <CardContent className="p-6">
                                    <img
                                        src={course.cover}
                                        alt={course.title}
                                        className="w-full h-64 object-cover rounded-lg mb-4"
                                    />
                                    <h1 className="text-3xl font-bold mb-2">
                                        {course.title}
                                    </h1>
                                    <p className="text-muted-foreground mb-1">
                                        {course.description}
                                    </p>
                                    <span className="text-xs bg-slate-200 px-2 py-1 rounded">
                                        {course.category}
                                    </span>
                                </CardContent>
                            </Card>

                            {/* Video */}
                            {embedUrl && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Video</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <iframe
                                            src={embedUrl}
                                            className="w-full aspect-video rounded"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {/* Content */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Material</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <article
                                        className="prose prose-gray dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: course.content,
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar: attachments */}
                        <div className="space-y-6">
                            {/* Upload Info Card */}
                            <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                        Upload Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                Uploaded by:
                                            </span>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {course.uploadedBy}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">
                                                Uploaded at:
                                            </span>
                                            <span className="text-slate-600 dark:text-slate-400">
                                                {new Date(
                                                    course.uploadedAt
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Attachments Card */}
                            <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800/50 dark:to-slate-900/50">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                        Attachments
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 dark:text-slate-400">
                                        Download supporting files for this
                                        material
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {course.files.length > 0 ? (
                                        course.files.map((f) => (
                                            <a
                                                key={f.id}
                                                href={f.url}
                                                download={`${course.title} - ${f.name}`}
                                                className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                                            >
                                                <div className="flex-shrink-0 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                                    {icon(f.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-800 dark:text-slate-100 truncate">
                                                        {f.name}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {f.size}
                                                    </p>

                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </Button>
                                            </a>
                                        ))
                                    ) : (
                                        <div className="py-6 text-center text-slate-500 dark:text-slate-400">
                                            No attachments available
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
