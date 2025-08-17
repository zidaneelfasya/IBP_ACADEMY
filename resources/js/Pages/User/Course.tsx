import UserLayout from "@/Layouts/UserLayout";
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
import { Badge } from "@/Components/ui/badge";
import {
    ArrowLeft,
    Search,
    BookOpen,
    CheckCircle,
    FileText,
    ImageIcon,
    Video,
    File,
} from "lucide-react";
import { Link } from "@inertiajs/react";

interface Material {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    thumbnail: string;
    fileTypes: string[];
}

interface Props {
    materials?: Material[];
}

export default function UserPage({ materials: initialMaterials = [] }: Props) {
    const [materials, setMaterials] = useState<Material[]>(
        initialMaterials.length ? initialMaterials : mockMaterials
    );
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMaterials = materials.filter((material) => {
        const matchesSearch =
            material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getFileTypeIcon = (type: string) => {
        switch (type) {
            case "video":
                return <Video className="w-3 h-3" />;
            case "pdf":
                return <FileText className="w-3 h-3" />;
            case "image":
                return <ImageIcon className="w-3 h-3" />;
            default:
                return <File className="w-3 h-3" />;
        }
    };

    const toggleCompletion = (materialId: string) => {
        setMaterials((prev) =>
            prev.map((material) => {
                if (material.id === materialId) {
                    const updatedMaterial = {
                        ...material,
                        isCompleted: !material.isCompleted,
                    };

                    // In a real app, you would make an API call here to update the completion status
                    // axios.patch(`/materials/${materialId}/toggle-completion`)

                    return updatedMaterial;
                }
                return material;
            })
        );
    };

    const completedCount = materials.filter((m) => m.isCompleted).length;

    return (
        <UserLayout>
            <Head title="Learning Portal" />

            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    Learning Portal
                                </h1>
                                <p className="text-muted-foreground">
                                    Explore learning materials and track your
                                    progress
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-accent/10 rounded-lg">
                                        <BookOpen className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {materials.length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Total Materials
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {completedCount}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Complete Read
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search learning materials..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Materials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMaterials.map((material) => (
                            <Card
                                key={material.id}
                                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            material.thumbnail ||
                                            "/placeholder.svg"
                                        }
                                        alt={material.title}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    {material.isCompleted && (
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-green-500 text-white">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Completed
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg line-clamp-2 group-hover:text-accent transition-colors">
                                            {material.title}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="line-clamp-2">
                                        {material.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                {material.fileTypes.map(
                                                    (type, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {getFileTypeIcon(
                                                                type
                                                            )}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Link
                                                href={`/user/material/${material.id}`}
                                                className="flex-1"
                                            >
                                                <Button
                                                    className="w-full"
                                                    size="sm"
                                                >
                                                    View Material
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCompletion(
                                                        material.id
                                                    );
                                                }}
                                            >
                                                {material.isCompleted ? (
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredMaterials.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">
                                No materials found
                            </h3>
                            <p className="text-muted-foreground">
                                Try changing your search keywords
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}

// Mock data (can be removed when using real data from Laravel)
const mockMaterials: Material[] = [
    {
        id: "1",
        title: "Introduction to React Fundamentals",
        description:
            "Learn React basics from scratch to advanced level. This material covers components, props, state, and lifecycle methods.",
        isCompleted: false,
        thumbnail: "/react-course-thumbnail.png",
        fileTypes: ["video", "pdf", "code"],
    },
    {
        id: "2",
        title: "Advanced JavaScript Concepts",
        description:
            "Deep dive into advanced JavaScript concepts like closures, promises, async/await, and design patterns.",
        isCompleted: true,
        thumbnail: "/javascript-advanced-course.png",
        fileTypes: ["video", "pdf", "exercise"],
    },
    {
        id: "3",
        title: "UI/UX Design Principles",
        description:
            "Learn good design principles, user research, wireframing, and prototyping to create optimal user experiences.",
        isCompleted: false,
        thumbnail: "/ui-ux-course-interface.png",
        fileTypes: ["video", "pdf", "figma"],
    },
    {
        id: "4",
        title: "Database Design & SQL",
        description:
            "Understand relational database concepts, normalization, and query optimization using SQL.",
        isCompleted: false,
        thumbnail: "/database-sql-learning.png",
        fileTypes: ["video", "pdf", "sql"],
    },
    {
        id: "5",
        title: "Mobile App Development with React Native",
        description:
            "Build cross-platform mobile applications using React Native. From setup to deployment to app stores.",
        isCompleted: false,
        thumbnail: "/react-native-app-dev.png",
        fileTypes: ["video", "pdf", "code"],
    },
    {
        id: "6",
        title: "Digital Marketing Fundamentals",
        description:
            "Modern digital marketing strategies including SEO, social media marketing, content marketing, and analytics.",
        isCompleted: true,
        thumbnail: "/digital-marketing-social-media.png",
        fileTypes: ["video", "pdf", "template"],
    },
];
