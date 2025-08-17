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
import { BookOpen, Search, ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
}

interface Props {
    generalCourses: Course[];
    semifinalCourses: Course[];
    isSemifinalist: boolean;
    message?: string;
}

export default function UserCourses({
    generalCourses = [],
    semifinalCourses = [],
    isSemifinalist,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");

    const filterCourses = (courses: Course[]) => {
        return courses.filter((course) => {
            const matchesSearch =
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    };

    const filteredGeneralCourses = filterCourses(generalCourses);
    const filteredSemifinalCourses = filterCourses(semifinalCourses);

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
                                    Explore learning materials for your
                                    competition
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
                                            {generalCourses.length}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            General Courses
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {isSemifinalist && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold">
                                                {semifinalCourses.length}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Semifinal Courses
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* General Courses Section */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">
                            General Courses
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGeneralCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {filteredGeneralCourses.length === 0 && <EmptyState />}
                    </div>

                    {/* Semifinal Courses Section */}
                    {isSemifinalist && semifinalCourses.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">
                                Course for Semifinalist
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSemifinalCourses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                    />
                                ))}
                            </div>

                            {filteredSemifinalCourses.length === 0 && (
                                <EmptyState />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}

function CourseCard({ course }: { course: Course }) {
    // Fungsi untuk handle error gambar
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = "/placeholder.svg";
        target.onerror = null; // Prevent infinite loop jika placeholder juga error
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="relative">
                <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={handleImageError}
                    loading="lazy" // Optimasi performa
                />
                {/* Fallback visual jika gambar loading */}
                {!course.thumbnail && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>

            <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2 group-hover:text-accent transition-colors">
                    {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                    {course.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <Link href={`/user/material/${course.id}`} className="w-full">
                    <Button className="w-full" size="sm">
                        View Course
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

function EmptyState() {
    return (
        <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
                Try changing your search keywords
            </p>
        </div>
    );
}
