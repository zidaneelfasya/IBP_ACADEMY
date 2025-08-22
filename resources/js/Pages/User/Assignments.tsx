import React from "react";
import { Head } from "@inertiajs/react";
import { SiteHeaderLMS } from "@/Components/site-header-lms";
import {
    Calendar,
    Clock,
    Users,
    FileText,
    AlertCircle,
    CheckCircle,
    ExternalLink,
    BookOpen,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

interface Assignment {
    uuid: string;
    title: string;
    description: string;
    instructions: string;
    deadline: string;
    deadline_formatted: string;
    time_remaining: string;
    is_overdue: boolean;
    is_open: boolean;
    stage_name: string;
    created_by: string;
    is_submitted: boolean;
    submission_date?: string;
}

interface Team {
    id: number;
    name: string;
    leader: string;
    registration_number: string;
}

interface Stage {
    id: number;
    name: string;
}

interface AssignmentsProps {
    assignments: Assignment[];
    team: Team;
    stage: Stage;
}

export default function Assignments({
    assignments,
    team,
    stage,
}: AssignmentsProps) {
    const getStatusBadge = (assignment: Assignment) => {
        if (assignment.is_submitted) {
            return (
                <Badge
                    variant="default"
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
                >
                    <CheckCircle className="w-3 h-3" />
                    Submitted
                </Badge>
            );
        } else if (assignment.is_overdue) {
            return (
                <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                >
                    <AlertCircle className="w-3 h-3" />
                    Overdue
                </Badge>
            );
        } else if (assignment.is_open) {
            return (
                <Badge
                    variant="default"
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
                >
                    <CheckCircle className="w-3 h-3" />
                    Open
                </Badge>
            );
        } else {
            return (
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Closed
                </Badge>
            );
        }
    };

    const getCardStyle = (assignment: Assignment) => {
        if (assignment.is_submitted) {
            return "border-blue-200 bg-blue-50/50 hover:bg-blue-50 border-2";
        } else if (assignment.is_overdue) {
            return "border-red-200 bg-red-50/50 hover:bg-red-50";
        } else if (assignment.is_open) {
            return "border-green-200 bg-green-50/50 hover:bg-green-50 hover:shadow-lg hover:scale-[1.02]";
        } else {
            return "border-gray-200 bg-gray-50/50 hover:bg-gray-50";
        }
    };

    return (
        <>
            <Head title="Assignments" />
            <SiteHeaderLMS />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container px-4 py-8 mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Assignments
                                </h1>
                                <p className="text-gray-600">
                                    Complete your assignments for {stage.name}
                                </p>
                            </div>
                        </div>

                        {/* Team Info Card */}
                        <Card className="text-white border-0 bg-gradient-to-r from-blue-500 to-purple-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Users className="w-8 h-8" />
                                        <div>
                                            <h3 className="text-xl font-semibold">
                                                {team.name}
                                            </h3>
                                            <p className="text-blue-100">
                                                Leader: {team.leader} •
                                                Registration:{" "}
                                                {team.registration_number}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="text-white bg-white/20 border-white/30"
                                    >
                                        {stage.name}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Assignments Grid */}
                    {assignments.length === 0 ? (
                        <Card className="py-12 text-center">
                            <CardContent>
                                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                    No Assignments Available
                                </h3>
                                <p className="text-gray-600">
                                    There are no active assignments for{" "}
                                    {stage.name} at the moment.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {assignments.map((assignment) => (
                                <Card
                                    key={assignment.uuid}
                                    className={`transition-all duration-200 ${getCardStyle(
                                        assignment
                                    )}`}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                                {assignment.title}
                                            </CardTitle>
                                            {getStatusBadge(assignment)}
                                        </div>
                                        <CardDescription className="text-gray-600 line-clamp-3">
                                            {assignment.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="space-y-3">
                                            {/* Deadline Info */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-600">
                                                    Due:{" "}
                                                    {
                                                        assignment.deadline_formatted
                                                    }
                                                </span>
                                            </div>

                                            {/* Time Remaining */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span
                                                    className={`font-medium ${
                                                        assignment.is_overdue
                                                            ? "text-red-600"
                                                            : assignment.is_open
                                                            ? "text-green-600"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {assignment.time_remaining}
                                                </span>
                                            </div>

                                            {/* Created By */}
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>
                                                    By: {assignment.created_by}
                                                </span>
                                            </div>

                                            {/* Action Button */}
                                            <div className="pt-3">
                                                <Button
                                                    asChild
                                                    className={`w-full ${
                                                        assignment.is_open
                                                            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                                            : assignment.is_overdue
                                                            ? "bg-red-400 hover:bg-red-500"
                                                            : "bg-gray-400 hover:bg-gray-500"
                                                    }`}
                                                    disabled={
                                                        !assignment.is_open
                                                    }
                                                >
                                                    <a
                                                        href={`/user/assignments/${assignment.uuid}`}
                                                        className="flex items-center justify-center gap-2"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        {assignment.is_open
                                                            ? "View Assignment"
                                                            : assignment.is_overdue
                                                            ? "Deadline Passed"
                                                            : "Assignment Closed"}
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Statistics Section */}
                    {assignments.length > 0 && (
                        <div className="grid gap-4 mt-12 md:grid-cols-3">
                            <Card className="text-center">
                                <CardContent className="p-6">
                                    <div className="mb-2 text-3xl font-bold text-blue-600">
                                        {assignments.length}
                                    </div>
                                    <div className="text-gray-600">
                                        Total Assignments
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="text-center">
                                <CardContent className="p-6">
                                    <div className="mb-2 text-3xl font-bold text-green-600">
                                        {
                                            assignments.filter((a) => a.is_open)
                                                .length
                                        }
                                    </div>
                                    <div className="text-gray-600">
                                        Open for Submission
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="text-center">
                                <CardContent className="p-6">
                                    <div className="mb-2 text-3xl font-bold text-red-600">
                                        {
                                            assignments.filter(
                                                (a) => a.is_overdue
                                            ).length
                                        }
                                    </div>
                                    <div className="text-gray-600">Overdue</div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
