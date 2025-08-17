import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
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
import { BookOpen, Search, ArrowLeft, BookMarked } from "lucide-react";

interface Course {
    id: string;
    slug: string; // ← tambahkan ini
    title: string;
    description: string;
    thumbnail: string;
    category: string;
}

interface Props {
    generalCourses: Course[];
    semifinalCourses: Course[];
    isSemifinalist: boolean;
    hasTeam: boolean;
}

export default function UserCourses({
    generalCourses = [],
    semifinalCourses = [],
    isSemifinalist,
    hasTeam,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");

    const filterCourses = (courses: Course[]) =>
        courses.filter(
            (c) =>
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const filteredGeneral = filterCourses(generalCourses);
    const filteredSemifinal = filterCourses(semifinalCourses);

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

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* General Courses */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">
                            General Courses
                        </h2>
                        {filteredGeneral.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredGeneral.map((c) => (
                                    <CourseCard key={c.id} course={c} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState />
                        )}
                    </section>

                    {/* Semifinal Courses */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">
                            Semifinal Courses
                        </h2>
                        {isSemifinalist ? (
                            filteredSemifinal.length ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredSemifinal.map((c) => (
                                        <CourseCard key={c.id} course={c} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState />
                            )
                        ) : (
                            <MotivationMessage />
                        )}
                    </section>
                </div>
            </div>
        </UserLayout>
    );
}

function CourseCard({ course }: { course: Course }) {
    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = "/placeholder.svg";
    };

    return (
        <Card className="group hover:shadow-lg transition-shadow">
            <div className="relative">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-md"
                    onError={handleImgError}
                    loading="lazy"
                />
                <Badge className="absolute top-2 right-2 bg-primary/80 text-white">
                    {course.category}
                </Badge>
            </div>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">
                    {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                    {course.description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href={`/user/material/${course.slug}`} className="w-full">
                    <Button size="sm" className="w-full">
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
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search.</p>
        </div>
    );
}

function MotivationMessage() {
    return (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6 text-center">
                <BookMarked className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                    Keep Going, You're Almost There! 🚀
                </h3>
                <p className="text-sm text-amber-700">
                    Qualify for the semifinals to unlock exclusive courses.
                </p>
            </CardContent>
        </Card>
    );
}
