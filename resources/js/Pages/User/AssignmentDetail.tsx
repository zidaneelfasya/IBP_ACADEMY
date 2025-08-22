import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
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
    Eye,
    MessageCircle,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

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
    submission_link?: string;
    notes?: string;
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
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [submissionLink, setSubmissionLink] = useState(
        submission?.submission_link || ""
    );
    const [submissionNotes, setSubmissionNotes] = useState(
        submission?.notes || ""
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmission = async () => {
        if (!submissionLink.trim()) {
            alert("Please provide a submission link");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(
                `/user/assignments/${assignment.uuid}/submit`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN":
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content") || "",
                    },
                    body: JSON.stringify({
                        submission_link: submissionLink,
                        notes: submissionNotes,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setIsSubmissionModalOpen(false);
                router.visit("/user/assignments", {
                    data: { success: data.message },
                });
            } else {
                alert(data.error || "Failed to submit assignment");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred while submitting");
        } finally {
            setIsSubmitting(false);
        }
    };
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

                                            {submission.submission_link && (
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-500" />
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <a
                                                            href={
                                                                submission.submission_link
                                                            }
                                                            target="_blank"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Submission
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

                                            {submission.notes && (
                                                <div className="p-4 rounded-lg bg-gray-50">
                                                    <h4 className="mb-2 font-semibold text-gray-800">
                                                        Your Notes
                                                    </h4>
                                                    <p className="text-gray-700">
                                                        {submission.notes}
                                                    </p>
                                                </div>
                                            )}

                                            {assignment.is_open ? (
                                                <Dialog
                                                    open={isSubmissionModalOpen}
                                                    onOpenChange={
                                                        setIsSubmissionModalOpen
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        >
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            Edit Submission
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle className="flex items-center gap-2">
                                                                <Upload className="w-5 h-5 text-blue-600" />
                                                                Edit Submission
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Update your
                                                                assignment
                                                                submission
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid items-center grid-cols-4 gap-4">
                                                                <Label
                                                                    htmlFor="edit-submission-link"
                                                                    className="text-right"
                                                                >
                                                                    Link *
                                                                </Label>
                                                                <Input
                                                                    id="edit-submission-link"
                                                                    value={
                                                                        submissionLink
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setSubmissionLink(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="https://drive.google.com/..."
                                                                    className="col-span-3"
                                                                />
                                                            </div>
                                                            <div className="grid items-start grid-cols-4 gap-4">
                                                                <Label
                                                                    htmlFor="edit-submission-notes"
                                                                    className="pt-2 text-right"
                                                                >
                                                                    Notes
                                                                </Label>
                                                                <Textarea
                                                                    id="edit-submission-notes"
                                                                    value={
                                                                        submissionNotes
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setSubmissionNotes(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Additional notes (optional)"
                                                                    className="col-span-3"
                                                                    rows={3}
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    setIsSubmissionModalOpen(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                onClick={
                                                                    handleSubmission
                                                                }
                                                                disabled={
                                                                    isSubmitting ||
                                                                    !submissionLink.trim()
                                                                }
                                                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                                            >
                                                                {isSubmitting
                                                                    ? "Updating..."
                                                                    : "Update Submission"}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            ) : (
                                                <div className="p-4 mt-4 text-center border border-red-200 rounded-lg bg-red-50">
                                                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
                                                    <p className="text-sm font-medium text-red-800">
                                                        {assignment.is_overdue
                                                            ? "Deadline has passed - submissions no longer accepted"
                                                            : "Assignment is closed for submissions"}
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
                                                    <Dialog
                                                        open={
                                                            isSubmissionModalOpen
                                                        }
                                                        onOpenChange={
                                                            setIsSubmissionModalOpen
                                                        }
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                                                                <Upload className="w-4 h-4 mr-2" />
                                                                Submit
                                                                Assignment
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle className="flex items-center gap-2">
                                                                    <Upload className="w-5 h-5 text-blue-600" />
                                                                    Submit
                                                                    Assignment
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Submit your
                                                                    assignment
                                                                    by providing
                                                                    a link to
                                                                    your work
                                                                    (Google
                                                                    Drive,
                                                                    OneDrive,
                                                                    etc.)
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                <div className="grid items-center grid-cols-4 gap-4">
                                                                    <Label
                                                                        htmlFor="submission-link"
                                                                        className="text-right"
                                                                    >
                                                                        Link *
                                                                    </Label>
                                                                    <Input
                                                                        id="submission-link"
                                                                        value={
                                                                            submissionLink
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setSubmissionLink(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="https://drive.google.com/..."
                                                                        className="col-span-3"
                                                                    />
                                                                </div>
                                                                <div className="grid items-start grid-cols-4 gap-4">
                                                                    <Label
                                                                        htmlFor="submission-notes"
                                                                        className="pt-2 text-right"
                                                                    >
                                                                        Notes
                                                                    </Label>
                                                                    <Textarea
                                                                        id="submission-notes"
                                                                        value={
                                                                            submissionNotes
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setSubmissionNotes(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="Additional notes (optional)"
                                                                        className="col-span-3"
                                                                        rows={3}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        setIsSubmissionModalOpen(
                                                                            false
                                                                        )
                                                                    }
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    onClick={
                                                                        handleSubmission
                                                                    }
                                                                    disabled={
                                                                        isSubmitting ||
                                                                        !submissionLink.trim()
                                                                    }
                                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                                                >
                                                                    {isSubmitting
                                                                        ? "Submitting..."
                                                                        : "Submit"}
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            ) : (
                                                <div>
                                                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                                        {assignment.is_overdue
                                                            ? "Deadline Has Passed"
                                                            : "Assignment Closed"}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {assignment.is_overdue
                                                            ? "The submission deadline has passed and no new submissions are being accepted."
                                                            : "This assignment is no longer accepting submissions."}
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
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
                                    >
                                        <a
                                            href="https://wa.me/6282167027236"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Contact Support
                                        </a>
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
