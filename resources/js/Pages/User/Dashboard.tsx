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
    ChevronRight,
    ClipboardList,
} from "lucide-react";

interface CompetitionStage {
    id: number;
    name: string;
    order: number;
    start_date: string;
    end_date: string;
    days_left: number;
    is_urgent: boolean;
}

interface ParticipantProgress {
    id: number;
    competition_stage_id: number;
    status: "not_started" | "pending" | "submitted" | "approved" | "rejected";
    stage?: CompetitionStage;
}

interface DashboardProps {
    stages: CompetitionStage[];
    currentProgress: ParticipantProgress[];
    team: {
        id: number;
        name: string;
        category_id: number;
        category_name: string;
    };
    urgentSubmissions: CompetitionStage[];
}

export default function Dashboard({
    stages,
    currentProgress,
    team,
    urgentSubmissions,
}: DashboardProps) {
    // Approved stages calculation
    const approvedStages = currentProgress.filter(
        (p) => p.status === "approved"
    );
    const completionText = `${approvedStages.length}/${stages.length} Stages Completed`;
    const completionPercentage = Math.min(
        100,
        Math.max(0, (approvedStages.length / stages.length) * 100)
    );

    // Current stage determination
    const currentStageIndex = stages.findIndex(
        (stage) =>
            !approvedStages.some((p) => p.competition_stage_id === stage.id)
    );
    const currentStage =
        currentStageIndex >= 0
            ? stages[currentStageIndex]
            : stages[stages.length - 1];

    // Status icon component
    const StatusIcon = ({
        status,
        isCurrent,
    }: {
        status: string;
        isCurrent: boolean;
    }) => {
        if (status === "approved") return <CheckCircle className="h-4 w-4" />;
        if (isCurrent) return <Target className="h-4 w-4" />;
        return <Clock className="h-4 w-4" />;
    };

    return (
        <UserLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50 py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <header className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {team?.category_name || "Competition"}{" "}
                                    Dashboard
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Track your competition progress and
                                    submissions
                                </p>
                            </div>

                            {team?.name && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs md:text-sm font-medium text-blue-800">
                                        Team: {team.name}
                                    </span>
                                    {team?.category_name && (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs md:text-sm font-medium text-green-800">
                                            {team.category_name}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs md:text-sm font-medium text-purple-800">
                                        {completionText}
                                    </span>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Progress Bar */}
                    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Competition Progress
                                </span>
                                <span className="text-sm font-medium text-blue-600">
                                    {completionText}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                                    style={{
                                        width: `${completionPercentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Urgent Notifications */}
                    {urgentSubmissions.length > 0 && (
                        <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <div className="flex items-start">
                                <Bell className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-red-800">
                                        Urgent: Submission Deadline Approaching!
                                    </h3>
                                    <div className="mt-2 space-y-2">
                                        {urgentSubmissions.map((stage) => (
                                            <div
                                                key={stage.id}
                                                className="pl-1"
                                            >
                                                <p className="text-red-700 font-medium">
                                                    {stage.name} due in{" "}
                                                    {stage.days_left} day
                                                    {stage.days_left !== 1
                                                        ? "s"
                                                        : ""}
                                                </p>
                                                <p className="text-sm text-red-600">
                                                    Deadline:{" "}
                                                    {new Date(
                                                        stage.end_date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Current Stage Card */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden lg:col-span-1">
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Current Stage
                                        </h2>
                                        <p className="mt-1 text-xl font-bold text-blue-600">
                                            {currentStage.name}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <Target className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            Deadline:
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {new Date(
                                                currentStage.end_date
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center">
                                        <span className="text-3xl font-bold text-blue-600 mr-2">
                                            {currentStage.days_left}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            day
                                            {currentStage.days_left !== 1
                                                ? "s"
                                                : ""}{" "}
                                            remaining
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Requirements Card */}
                        {/* Requirements Card */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden lg:col-span-2 relative">
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-10 p-4">
                                <div className="text-center">
                                    <XCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-700 mb-1">
                                        Feature Coming Soon
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Submission Requirements feature is
                                        currently not available.
                                    </p>
                                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                        Close
                                    </button>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                                        <ClipboardList className="h-5 w-5 text-green-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Submission Requirements
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <h3 className="font-medium text-gray-800">
                                            {currentStage.name} Requirements
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {currentStage.days_left > 0
                                                ? "Prepare these documents for submission when the stage begins."
                                                : "Submission period has ended for this stage."}
                                        </p>

                                        <ul className="mt-3 space-y-2">
                                            <li className="flex items-center text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                                Business Proposal Document
                                            </li>
                                            <li className="flex items-center text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                                Team Presentation Deck
                                            </li>
                                            <li className="flex items-center text-sm text-gray-700">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                                Financial Projections
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="text-xs text-gray-400 italic">
                                        * Specific requirements and templates
                                        will be provided when the submission
                                        period opens
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Section */}
                    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-5">
                                Competition Timeline
                            </h3>

                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

                                <div className="space-y-6">
                                    {stages.map((stage, index) => {
                                        const progress = currentProgress.find(
                                            (p) =>
                                                p.competition_stage_id ===
                                                stage.id
                                        ) || { status: "not_started" };

                                        const isCurrent =
                                            stage.id === currentStage.id;
                                        const isApproved =
                                            progress.status === "approved";
                                        const isUpcoming =
                                            index >
                                            stages.findIndex(
                                                (s) => s.id === currentStage.id
                                            );
                                        const status = isApproved
                                            ? "approved"
                                            : isCurrent
                                            ? "current"
                                            : isUpcoming
                                            ? "upcoming"
                                            : "not_started";

                                        return (
                                            <div
                                                key={stage.id}
                                                className="relative pl-8"
                                            >
                                                {/* Timeline dot */}
                                                <div
                                                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-4 ${
                                                        isCurrent
                                                            ? "border-blue-500 bg-white"
                                                            : isApproved
                                                            ? "border-green-500 bg-white"
                                                            : "border-gray-300 bg-white"
                                                    }`}
                                                ></div>

                                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                        <div>
                                                            <h4
                                                                className={`font-medium ${
                                                                    isCurrent
                                                                        ? "text-blue-600"
                                                                        : isApproved
                                                                        ? "text-green-600"
                                                                        : "text-gray-600"
                                                                }`}
                                                            >
                                                                {stage.name}
                                                            </h4>
                                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                                                <span>
                                                                    {new Date(
                                                                        stage.start_date
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                                <ChevronRight className="h-3 w-3 mx-1" />
                                                                <span>
                                                                    {new Date(
                                                                        stage.end_date
                                                                    ).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                                isApproved
                                                                    ? "bg-green-100 text-green-800"
                                                                    : isCurrent
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {status
                                                                .toUpperCase()
                                                                .replace(
                                                                    "_",
                                                                    " "
                                                                )}
                                                        </span>
                                                    </div>

                                                    {stage.days_left <= 7 && (
                                                        <div className="mt-2 flex items-center text-xs font-medium text-red-500">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                                            Due in{" "}
                                                            {stage.days_left}{" "}
                                                            day
                                                            {stage.days_left !==
                                                            1
                                                                ? "s"
                                                                : ""}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
