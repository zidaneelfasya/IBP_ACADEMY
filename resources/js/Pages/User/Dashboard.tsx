import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import {
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Target,
    Bell,
    FileText,
} from "lucide-react";

export default function Dashboard() {
    // Sample data - replace with real data from your backend
    const currentRound = {
        name: "Penyisihan",
        status: "active",
        deadline: "2024-02-15",
        daysLeft: 7,
        submitted: false,
    };

    const taskReminders = [
        {
            id: 1,
            title: "Business Proposal Submission",
            description:
                "Submit your complete business proposal for elimination round",
            deadline: "2024-02-15",
            daysLeft: 7,
            status: "pending",
            priority: "high",
            requirements: [
                "Executive Summary",
                "Business Model Canvas",
                "Market Analysis",
                "Financial Projections",
                "Implementation Plan",
            ],
        },
        {
            id: 2,
            title: "Proposal Presentation (if qualified)",
            description: "Present your business proposal to the judges",
            deadline: "2024-02-25",
            daysLeft: 17,
            status: "locked",
            priority: "medium",
        },
    ];

    const timeline = [
        {
            round: "Penyisihan",
            period: "1 Feb - 15 Feb 2024",
            status: "active",
            description: "Submit business proposal",
            tasks: [
                {
                    name: "Business Proposal",
                    status: "pending",
                    deadline: "15 Feb",
                    type: "submission",
                },
                {
                    name: "Proposal Review",
                    status: "locked",
                    deadline: "20 Feb",
                    type: "review",
                },
                {
                    name: "Results Announcement",
                    status: "locked",
                    deadline: "22 Feb",
                    type: "announcement",
                },
            ],
        },
        {
            round: "Semifinal",
            period: "25 Feb - 15 Mar 2024",
            status: "locked",
            description: "Pitch presentation & Q&A session",
            tasks: [
                {
                    name: "Pitch Presentation",
                    status: "locked",
                    deadline: "25 Feb",
                    type: "presentation",
                },
                {
                    name: "Q&A Session",
                    status: "locked",
                    deadline: "25 Feb",
                    type: "qa",
                },
                {
                    name: "Business Plan Refinement",
                    status: "locked",
                    deadline: "10 Mar",
                    type: "submission",
                },
            ],
        },
        {
            round: "Final",
            period: "20 Mar - 30 Mar 2024",
            status: "locked",
            description: "Final pitch & business simulation",
            tasks: [
                {
                    name: "Final Pitch",
                    status: "locked",
                    deadline: "20 Mar",
                    type: "presentation",
                },
                {
                    name: "Business Simulation",
                    status: "locked",
                    deadline: "25 Mar",
                    type: "simulation",
                },
                {
                    name: "Investor Panel",
                    status: "locked",
                    deadline: "30 Mar",
                    type: "panel",
                },
            ],
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
            case "submitted":
                return "text-green-600 bg-green-50";
            case "pending":
                return "text-yellow-600 bg-yellow-50";
            case "not_started":
                return "text-red-600 bg-red-50";
            case "locked":
                return "text-gray-600 bg-gray-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
            case "submitted":
                return CheckCircle;
            case "pending":
                return Clock;
            case "not_started":
                return AlertTriangle;
            case "locked":
                return XCircle;
            default:
                return Clock;
        }
    };

    const getTaskTypeIcon = (type: string) => {
        switch (type) {
            case "submission":
                return "📄";
            case "presentation":
                return "🎤";
            case "review":
                return "👀";
            case "announcement":
                return "📢";
            case "qa":
                return "❓";
            case "simulation":
                return "🎯";
            case "panel":
                return "👥";
            default:
                return "📋";
        }
    };

    const urgentTasks = taskReminders.filter(
        (task) => task.daysLeft <= 7 && task.status !== "submitted"
    );

    return (
        <UserLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">
                            Business Competition Dashboard
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Track your business proposal submission and
                            competition progress
                        </p>
                    </div>

                    {/* Current Round Status */}
                    <div className="mb-8">
                        <div className="overflow-hidden rounded-lg bg-card shadow border-l-4 border-l-blue-500">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground">
                                            Current Round: {currentRound.name}
                                        </h2>
                                        <p className="mt-1 text-muted-foreground">
                                            Business Proposal Deadline:{" "}
                                            {new Date(
                                                currentRound.deadline
                                            ).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {currentRound.daysLeft}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            days left
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Urgent Reminders */}
                    {urgentTasks.length > 0 && (
                        <div className="mb-8">
                            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                                <div className="flex items-center">
                                    <Bell className="h-5 w-5 text-red-600 mr-2" />
                                    <h3 className="text-lg font-medium text-red-800">
                                        Urgent: Proposal Submission Due Soon!
                                    </h3>
                                </div>
                                <div className="mt-4 space-y-3">
                                    {urgentTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200"
                                        >
                                            <div>
                                                <p className="font-medium text-red-800">
                                                    {task.title}
                                                </p>
                                                <p className="text-sm text-red-600">
                                                    Due in {task.daysLeft} days
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                {task.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Task Reminders */}
                        <div className="overflow-hidden rounded-lg bg-card shadow">
                            <div className="p-6">
                                <h3 className="text-lg font-medium leading-6 text-foreground mb-6">
                                    Submission Requirements
                                </h3>
                                <div className="space-y-4">
                                    {taskReminders.map((task) => {
                                        const StatusIcon = getStatusIcon(
                                            task.status
                                        );
                                        return (
                                            <div
                                                key={task.id}
                                                className="border border-border rounded-lg p-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3">
                                                        <StatusIcon
                                                            className={`h-5 w-5 mt-0.5 ${
                                                                getStatusColor(
                                                                    task.status
                                                                ).split(" ")[0]
                                                            }`}
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-medium text-foreground">
                                                                {task.title}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {
                                                                    task.description
                                                                }
                                                            </p>

                                                            {/* Requirements List */}
                                                            {task.requirements && (
                                                                <div className="mt-3">
                                                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                                                        Required
                                                                        Components:
                                                                    </p>
                                                                    <ul className="space-y-1">
                                                                        {task.requirements.map(
                                                                            (
                                                                                req,
                                                                                index
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="flex items-center text-xs text-muted-foreground"
                                                                                >
                                                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                                                                    {
                                                                                        req
                                                                                    }
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                                                                <span>
                                                                    Deadline:{" "}
                                                                    {new Date(
                                                                        task.deadline
                                                                    ).toLocaleDateString(
                                                                        "id-ID"
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end space-y-2">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                                task.status
                                                            )}`}
                                                        >
                                                            {task.status ===
                                                            "submitted"
                                                                ? "Submitted"
                                                                : task.status ===
                                                                  "pending"
                                                                ? "Pending"
                                                                : task.status ===
                                                                  "not_started"
                                                                ? "Not Started"
                                                                : "Locked"}
                                                        </span>
                                                        {task.status !==
                                                            "submitted" &&
                                                            task.status !==
                                                                "locked" && (
                                                                <span
                                                                    className={`text-xs font-medium ${
                                                                        task.daysLeft <=
                                                                        3
                                                                            ? "text-red-600"
                                                                            : task.daysLeft <=
                                                                              7
                                                                            ? "text-yellow-600"
                                                                            : "text-green-600"
                                                                    }`}
                                                                >
                                                                    {
                                                                        task.daysLeft
                                                                    }{" "}
                                                                    days left
                                                                </span>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Competition Timeline */}
                        <div className="overflow-hidden rounded-lg bg-card shadow">
                            <div className="p-6">
                                <h3 className="text-lg font-medium leading-6 text-foreground mb-6">
                                    Competition Timeline
                                </h3>
                                <div className="space-y-6">
                                    {timeline.map((round, index) => (
                                        <div
                                            key={round.round}
                                            className="relative"
                                        >
                                            {index !== timeline.length - 1 && (
                                                <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200"></div>
                                            )}
                                            <div className="flex items-start space-x-4">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                        round.status ===
                                                        "active"
                                                            ? "bg-blue-500 text-white"
                                                            : round.status ===
                                                              "completed"
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-300 text-gray-600"
                                                    }`}
                                                >
                                                    <Target className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4
                                                            className={`text-sm font-medium ${
                                                                round.status ===
                                                                "active"
                                                                    ? "text-blue-600"
                                                                    : round.status ===
                                                                      "completed"
                                                                    ? "text-green-600"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {round.round}
                                                        </h4>
                                                        <span
                                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                round.status ===
                                                                "active"
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : round.status ===
                                                                      "completed"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {round.status ===
                                                            "active"
                                                                ? "Active"
                                                                : round.status ===
                                                                  "completed"
                                                                ? "Completed"
                                                                : "Locked"}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {round.period}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground italic">
                                                        {round.description}
                                                    </p>
                                                    <div className="mt-3 space-y-2">
                                                        {round.tasks.map(
                                                            (
                                                                task,
                                                                taskIndex
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        taskIndex
                                                                    }
                                                                    className="flex items-center justify-between text-xs"
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-sm">
                                                                            {getTaskTypeIcon(
                                                                                task.type
                                                                            )}
                                                                        </span>
                                                                        <span
                                                                            className={
                                                                                task.status ===
                                                                                "locked"
                                                                                    ? "text-gray-400"
                                                                                    : "text-foreground"
                                                                            }
                                                                        >
                                                                            {
                                                                                task.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span
                                                                            className={
                                                                                task.status ===
                                                                                "locked"
                                                                                    ? "text-gray-400"
                                                                                    : "text-muted-foreground"
                                                                            }
                                                                        >
                                                                            {
                                                                                task.deadline
                                                                            }
                                                                        </span>
                                                                        <div
                                                                            className={`w-2 h-2 rounded-full ${
                                                                                task.status ===
                                                                                "completed"
                                                                                    ? "bg-green-500"
                                                                                    : task.status ===
                                                                                      "pending"
                                                                                    ? "bg-yellow-500"
                                                                                    : "bg-gray-300"
                                                                            }`}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="overflow-hidden rounded-lg bg-card shadow">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <FileText className="h-8 w-8 text-blue-500" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-foreground">
                                            0
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Proposals Submitted
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-card shadow">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Clock className="h-8 w-8 text-yellow-500" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-foreground">
                                            7
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Days Until Deadline
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg bg-card shadow">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Target className="h-8 w-8 text-green-500" />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-2xl font-bold text-foreground">
                                            1/3
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Competition Rounds
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
