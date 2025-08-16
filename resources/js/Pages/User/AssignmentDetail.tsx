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
    ArrowLeft,
    Upload,
    Download,
    User,
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
}

interface Submission {
    id: number;
    submitted_at: string;
    status: string;
    feedback?: string;
    file_path?: string;
}

interface Team {
    id: number;
    name: string;
}

interface AssignmentDetailProps {
    assignment: Assignment;
    submission?: Submission | null;
    team: Team;
}

export default function AssignmentDetail({
    assignment,
    submission,
    team,
}: AssignmentDetailProps) {
    const getStatusBadge = (assignment: Assignment) => {
        if (assignment.is_overdue) {
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

    const getSubmissionStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge
                        variant="secondary"
                        className="text-yellow-800 bg-yellow-100 border-yellow-300"
                    >
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                    </Badge>
                );
            case "graded":
                return (
                    <Badge
                        variant="default"
                        className="text-green-800 bg-green-100 border-green-300"
                    >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Graded
                    </Badge>
                );
            case "late":
                return (
                    <Badge
                        variant="destructive"
                        className="text-red-800 bg-red-100 border-red-300"
                    >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Late Submission
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title={`${assignment.title} - Assignment Detail`} />
            <SiteHeaderLMS />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container px-4 py-8 mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Button asChild variant="outline" className="mb-2">
                                <a
                                    href="/user/assignments"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Assignments
                                </a>
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {assignment.title}
                                </h1>
                                <p className="text-gray-600">
                                    {assignment.stage_name} • Created by{" "}
                                    {assignment.created_by}
                                </p>
                            </div>
                            {getStatusBadge(assignment)}
                        </div>

                        {/* Team Info */}
                        <Card className="mb-6 text-white border-0 bg-gradient-to-r from-blue-500 to-purple-600">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5" />
                                    <span className="font-medium">
                                        Team: {team.name}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Assignment Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Assignment Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Assignment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">
                                            Description
                                        </h3>
                                        <p className="leading-relaxed text-gray-700">
                                            {assignment.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900">
                                            Instructions
                                        </h3>
                                        <div className="p-4 rounded-lg bg-blue-50">
                                            <pre className="font-sans text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                                                {assignment.instructions}
                                            </pre>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submission Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        Your Submission
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {submission ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Submitted on:{" "}
                                                    {new Date(
                                                        submission.submitted_at
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </span>
                                                {getSubmissionStatusBadge(
                                                    submission.status
                                                )}
                                            </div>

                                            {submission.file_path && (
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-500" />
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <a
                                                            href={
                                                                submission.file_path
                                                            }
                                                            target="_blank"
                                                        >
                                                            <Download className="w-4 h-4 mr-2" />
                                                            Download Submission
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}

                                            {submission.feedback && (
                                                <div className="p-4 rounded-lg bg-green-50">
                                                    <h4 className="mb-2 font-semibold text-green-800">
                                                        Feedback
                                                    </h4>
                                                    <p className="text-green-700">
                                                        {submission.feedback}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center">
                                            {assignment.is_open ? (
                                                <div>
                                                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                                        No Submission Yet
                                                    </h3>
                                                    <p className="mb-4 text-gray-600">
                                                        You haven't submitted
                                                        this assignment yet.
                                                    </p>
                                                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                                        <Upload className="w-4 h-4 mr-2" />
                                                        Submit Assignment
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                                        Assignment Closed
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        This assignment is no
                                                        longer accepting
                                                        submissions.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Deadline Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Calendar className="w-5 h-5" />
                                        Deadline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {assignment.deadline_formatted}
                                            </div>
                                            <div
                                                className={`text-sm font-medium ${
                                                    assignment.is_overdue
                                                        ? "text-red-600"
                                                        : assignment.is_open
                                                        ? "text-green-600"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {assignment.time_remaining}
                                            </div>
                                        </div>

                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div
                                                className={`h-2 rounded-full ${
                                                    assignment.is_overdue
                                                        ? "bg-red-500"
                                                        : assignment.is_open
                                                        ? "bg-green-500"
                                                        : "bg-gray-500"
                                                }`}
                                                style={{
                                                    width: assignment.is_overdue
                                                        ? "100%"
                                                        : assignment.is_open
                                                        ? "60%"
                                                        : "100%",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Assignment Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <User className="w-5 h-5" />
                                        Assignment Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Stage:
                                        </span>
                                        <span className="font-medium">
                                            {assignment.stage_name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Created by:
                                        </span>
                                        <span className="font-medium">
                                            {assignment.created_by}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Status:
                                        </span>
                                        {getStatusBadge(assignment)}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Help Card */}
                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="text-lg text-blue-800">
                                        Need Help?
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-3 text-sm text-blue-700">
                                        If you have questions about this
                                        assignment, contact our support team.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
                                    >
                                        Contact Support
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
