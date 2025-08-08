import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import {
    Clock,
    CheckCircle,
    XCircle,
    Target,
    Bell,
    ChevronRight,
    ClipboardList,
    X,
} from "lucide-react";

interface CompetitionStage {
    id: number;
    name: string;
    order: number;
    start_date: string;
    end_date: string;
    days_left: number;
    is_urgent: boolean;
    status?: string;
}

interface ParticipantProgress {
    id: number;
    competition_stage_id: number;
    status: "not_started" | "pending" | "submitted" | "approved" | "rejected";
    stage?: CompetitionStage;
    feedback?: string;
}

interface DashboardProps {
    stages: CompetitionStage[];
    currentProgress: ParticipantProgress[];
    team: {
        id: number;
        name: string;
        category_id: number;
        category_name: string;
        rejected_stages: Record<
            number,
            {
                name: string;
                feedback?: string;
            }
        >;
        approved_stages: Record<
            number,
            {
                name: string;
                feedback?: string;
            }
        >;
        current_stage_id: number;
    };
    urgentSubmissions: CompetitionStage[];
    whatsapp_groups: Record<
        number,
        {
            bpc: string;
            bcc: string;
        }
    >;
}

export default function Dashboard({
    stages,
    currentProgress,
    team,
    urgentSubmissions,
    whatsapp_groups,
}: DashboardProps) {

    const [dismissedRejections, setDismissedRejections] = useState<number[]>(
        []
    );
    const [dismissedApprovals, setDismissedApprovals] = useState<number[]>([]);

    // Get current stage
    const currentStage =
        stages.find((stage) => stage.id === team.current_stage_id) || stages[0];

    // Find registration stage (order = 1)
    const registrationStage = stages.find(stage => stage.order === 1);
    const registrationProgress = registrationStage 
        ? currentProgress.find(p => p.competition_stage_id === registrationStage.id)
        : null;

    // Check registration status
    const isRegistrationPending = registrationProgress?.status !== "approved";
    const isRegistrationApproved = registrationProgress?.status === "approved";


    // Approved stages calculation
    const approvedStages = currentProgress.filter(
        (p) => p.status === "approved"
    );
    const completionText = `${approvedStages.length}/${stages.length} Stages Completed`;
    const completionPercentage = Math.min(
        100,
        Math.max(0, (approvedStages.length / stages.length) * 100)
    );

    // Status icon component with rejection state
    const StatusIcon = ({
        status,
        isCurrent,
    }: {
        status: string;
        isCurrent: boolean;
    }) => {
        if (status === "approved")
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        if (status === "rejected")
            return <XCircle className="h-4 w-4 text-red-500" />;
        if (isCurrent) return <Target className="h-4 w-4 text-blue-500" />;
        return <Clock className="h-4 w-4 text-gray-400" />;
    };

    // Render stage-specific rejection modal
    const renderRejectionModal = (stageId: number) => {
        const stageInfo = team.rejected_stages[stageId];
        if (!stageInfo || dismissedRejections.includes(stageId)) return null;

        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-6 text-center">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                        Not Passed {stageInfo.name}
                    </h2>
                    <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-700 text-left">
                        <p className="font-medium">Feedback:</p>
                        <p>
                            {stageInfo.feedback ||
                                "Keep up the spirit! You can try again next time."}
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            setDismissedRejections([
                                ...dismissedRejections,
                                stageId,
                            ])
                        }
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    return (
        <UserLayout title="Dashboard">
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50 py-6">
                {/* Render rejection modals for all rejected stages */}
                {Object.keys(team.rejected_stages).map((stageId) =>
                    renderRejectionModal(Number(stageId))
                )}

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Rejection Notification Banners */}
                    {Object.entries(team.rejected_stages).map(
                        ([stageId, stageInfo]) =>
                            !dismissedRejections.includes(Number(stageId)) && (
                                <div
                                    key={stageId}
                                    className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start">
                                            <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-red-800">
                                                    Not Passed {stageInfo.name}
                                                </h3>
                                                <p className="text-red-700 mt-1">
                                                    {stageInfo.feedback ||
                                                        "Keep up the spirit for next time!"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setDismissedRejections([
                                                    ...dismissedRejections,
                                                    Number(stageId),
                                                ])
                                            }
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )
                    )}

                    {/* Approval Notification Banners */}
                    {Object.entries(team.approved_stages || {}).map(
                        ([stageId, stageInfo]) =>
                            !dismissedApprovals.includes(Number(stageId)) && (
                                <div
                                    key={stageId}
                                    className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <div className="w-full">
                                                <h3 className="text-lg font-semibold text-green-800">
                                                    Passed {stageInfo.name}!
                                                </h3>
                                                <p className="text-green-700 mb-2">
                                                    {stageInfo.feedback ||
                                                        "Congratulations! You can proceed to the next stage."}
                                                </p>

                                                {/* WhatsApp Group Information */}
                                                {whatsapp_groups[
                                                    Number(stageId)
                                                ] && (
                                                    <div className="mt-3 bg-green-100 p-3 rounded-lg">
                                                        <h4 className="font-medium text-green-800 mb-1">
                                                            WhatsApp Group for{" "}
                                                            {stageInfo.name}
                                                        </h4>
                                                        <a
                                                            href={
                                                                team.category_id ===
                                                                1
                                                                    ? whatsapp_groups[
                                                                          Number(
                                                                              stageId
                                                                          )
                                                                      ].bpc
                                                                    : whatsapp_groups[
                                                                          Number(
                                                                              stageId
                                                                          )
                                                                      ].bcc
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-3 py-1.5 bg-green-200 hover:bg-green-300 text-green-900 rounded text-sm font-medium"
                                                        >
                                                            Join WhatsApp Group
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setDismissedApprovals([
                                                    ...dismissedApprovals,
                                                    Number(stageId),
                                                ])
                                            }
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )
                    )}
                    {/* Header Section */}
                    <header className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {team?.category_name || "Competition"}{" "}
                                    Dashboard
                                </h1>
                                <p className="text-gray-500 mt-1">
                                    Monitor your participation progress
                                </p>
                                
                                {/* Registration Status Message */}
                                {isRegistrationPending && (
                                    <div className="mt-3 flex items-start bg-blue-50 rounded-lg p-3">
                                        <Clock className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-blue-800">
                                                Registration Under Review
                                            </p>
                                            <p className="text-xs text-blue-600 mt-1">
                                                Your team registration is being reviewed. 
                                                You'll get full access after approval.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                {isRegistrationApproved && (
                                    <div className="mt-3 flex items-start bg-green-50 rounded-lg p-3">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-green-800">
                                                Registration Approved!
                                            </p>
                                            <p className="text-xs text-green-600 mt-1">
                                                Your team registration has been approved. 
                                                You now have full access to all features.
                                            </p>
                                        </div>
                                    </div>
                                )}
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
                                        Important: Submission Deadline
                                        Approaching!
                                    </h3>
                                    <div className="mt-2 space-y-2">
                                        {urgentSubmissions.map((stage) => (
                                            <div
                                                key={stage.id}
                                                className="pl-1"
                                            >
                                                <p className="text-red-700 font-medium">
                                                    {stage.name} deadline in{" "}
                                                    {stage.days_left} days
                                                </p>
                                                <p className="text-sm text-red-600">
                                                    Due date:{" "}
                                                    {new Date(
                                                        stage.end_date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
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
                                            ).toLocaleDateString("en-US", {
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
                                            {currentStage.days_left} days
                                            remaining
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

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

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 text-center">
                                    <p className="text-gray-500">
                                        Requirements will be available when the
                                        submission period begins.
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
                                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

                                <div className="space-y-6">
                                    {stages.map((stage) => {
                                        const progress = currentProgress.find(
                                            (p) =>
                                                p.competition_stage_id ===
                                                stage.id
                                        ) || { status: "not_started" };

                                        const isCurrent =
                                            stage.id === currentStage.id;
                                        const isApproved =
                                            progress.status === "approved";
                                        const isRejected =
                                            progress.status === "rejected";
                                        const status = isApproved
                                            ? "approved"
                                            : isRejected
                                            ? "rejected"
                                            : isCurrent
                                            ? "current"
                                            : "not_started";

                                        return (
                                            <div
                                                key={stage.id}
                                                className="relative pl-8"
                                            >
                                                <div
                                                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-4 ${
                                                        isCurrent
                                                            ? "border-blue-500 bg-white"
                                                            : isApproved
                                                            ? "border-green-500 bg-white"
                                                            : isRejected
                                                            ? "border-red-500 bg-white"
                                                            : "border-gray-300 bg-white"
                                                    }`}
                                                ></div>

                                                <div
                                                    className={`bg-gray-50 rounded-lg p-4 border ${
                                                        isRejected
                                                            ? "border-red-200"
                                                            : "border-gray-100"
                                                    }`}
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                        <div>
                                                            <h4
                                                                className={`font-medium ${
                                                                    isCurrent
                                                                        ? "text-blue-600"
                                                                        : isApproved
                                                                        ? "text-green-600"
                                                                        : isRejected
                                                                        ? "text-red-600"
                                                                        : "text-gray-600"
                                                                }`}
                                                            >
                                                                {stage.name}
                                                            </h4>
                                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                                                <span>
                                                                    {new Date(
                                                                        stage.start_date
                                                                    ).toLocaleDateString(
                                                                        "en-US"
                                                                    )}
                                                                </span>
                                                                <ChevronRight className="h-3 w-3 mx-1" />
                                                                <span>
                                                                    {new Date(
                                                                        stage.end_date
                                                                    ).toLocaleDateString(
                                                                        "en-US"
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                                isApproved
                                                                    ? "bg-green-100 text-green-800"
                                                                    : isRejected
                                                                    ? "bg-red-100 text-red-800"
                                                                    : isCurrent
                                                                    ? "bg-blue-100 text-blue-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {status ===
                                                            "approved"
                                                                ? "PASSED"
                                                                : status ===
                                                                  "rejected"
                                                                ? "REJECTED"
                                                                : status ===
                                                                  "current"
                                                                ? "CURRENT"
                                                                : "NOT STARTED"}
                                                        </span>
                                                    </div>

                                                    {stage.days_left <= 7 && (
                                                        <div className="mt-2 flex items-center text-xs font-medium text-red-500">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                                            Due in{" "}
                                                            {stage.days_left}{" "}
                                                            days
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