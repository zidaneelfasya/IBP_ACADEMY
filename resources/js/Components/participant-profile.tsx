"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Progress } from "@/Components/ui/progress";
import {
    CheckCircle,
    Clock,
    Circle,
    ChevronDown,
    ChevronRight,
    FileText,
    Calendar,
    Users,
    GraduationCap,
    Trophy,
    User,
    Crown,
    Mail,
    Building,
    BookOpen,
    Download,
    Eye,
} from "lucide-react";

const teamData = {
    team_name: "Tech Innovators",
    university: "Stanford University",
    study_program: "Computer Science",
    faculty: "School of Engineering",
    leader_name: "Sarah Chen",
    leader_nim: "CS2021001",
    member1_name: "Alex Rodriguez",
    member1_nim: "CS2021045",
    member2_name: "Maya Patel",
    member2_nim: "CS2021078",
    member3_name: "David Kim",
    member3_nim: "CS2021092",
    email: "sarah.chen@stanford.edu",
    status: "Active",
    overall_progress: 65,
    rank: 12,
    total_teams: 150,
};

const stages = [
    {
        id: 1,
        name: "Registration",
        status: "completed",
        description: "Team registration and document submission",
        progress: 100,
        documents: [
            {
                name: "Team Registration Form",
                status: "submitted",
                date: "2024-01-15",
            },
            {
                name: "University Endorsement Letter",
                status: "submitted",
                date: "2024-01-16",
            },
            {
                name: "Team Member ID Cards",
                status: "submitted",
                date: "2024-01-16",
            },
        ],
        deadlines: [
            {
                task: "Complete Team Registration",
                date: "2024-01-20",
                status: "completed",
            },
        ],
        sessions: [
            {
                title: "Team Orientation Session",
                date: "2024-01-22",
                status: "attended",
            },
        ],
    },
    {
        id: 2,
        name: "Preliminary Round",
        status: "completed",
        description: "Initial team assessment and project proposal",
        progress: 100,
        documents: [
            {
                name: "Team Project Proposal",
                status: "submitted",
                date: "2024-02-10",
            },
            {
                name: "Technical Specification",
                status: "submitted",
                date: "2024-02-12",
            },
        ],
        deadlines: [
            {
                task: "Submit Team Project Proposal",
                date: "2024-02-15",
                status: "completed",
            },
        ],
        sessions: [
            {
                title: "Team Mentoring Session #1",
                date: "2024-02-05",
                status: "attended",
            },
        ],
    },
    {
        id: 3,
        name: "Semifinal",
        status: "in-progress",
        description: "Advanced development and team presentation",
        progress: 60,
        documents: [
            {
                name: "Team Progress Report",
                status: "submitted",
                date: "2024-03-01",
            },
            { name: "Prototype Demo Video", status: "pending", date: "-" },
        ],
        deadlines: [
            {
                task: "Team Prototype Presentation",
                date: "2024-03-15",
                status: "pending",
            },
        ],
        sessions: [
            {
                title: "Presentation Skills Workshop",
                date: "2024-03-10",
                status: "scheduled",
            },
        ],
    },
    {
        id: 4,
        name: "Final",
        status: "not-started",
        description: "Final team presentation and judging",
        progress: 0,
        documents: [
            { name: "Final Team Report", status: "not-submitted", date: "-" },
        ],
        deadlines: [
            {
                task: "Final Team Presentation",
                date: "2024-04-10",
                status: "pending",
            },
        ],
        sessions: [
            {
                title: "Final Team Mentoring Session",
                date: "2024-03-25",
                status: "scheduled",
            },
        ],
    },
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case "completed":
            return (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            );
        case "in-progress":
            return (
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            );
        default:
            return (
                <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            );
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "completed":
            return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
        case "in-progress":
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
        default:
            return "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
};

export default function ParticipantProfile() {
    const [openStages, setOpenStages] = useState<number[]>([3]);

    const toggleStage = (stageId: number) => {
        setOpenStages((prev) =>
            prev.includes(stageId)
                ? prev.filter((id) => id !== stageId)
                : [...prev, stageId]
        );
    };

    const teamMembers = [
        { name: teamData.member1_name, nim: teamData.member1_nim },
        { name: teamData.member2_name, nim: teamData.member2_nim },
        { name: teamData.member3_name, nim: teamData.member3_nim },
    ].filter((member) => member.name && member.nim);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="text-center py-6 relative">
                    
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            IBP Academy
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Team Competition Dashboard
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {teamData.overall_progress}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Progress
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                #{teamData.rank}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Rank
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {teamData.total_teams}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Total Teams
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-center border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                3/4
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Stages
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Team Information */}
                <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <Trophy className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                            {teamData.team_name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Team Details */}
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Building className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span>{teamData.university}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span>{teamData.study_program}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <GraduationCap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span>{teamData.faculty}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span>{teamMembers.length + 1} Members</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2 text-gray-700 dark:text-gray-300">
                                <span>Overall Progress</span>
                                <span>{teamData.overall_progress}%</span>
                            </div>
                            <Progress
                                value={teamData.overall_progress}
                                className="h-2"
                            />
                        </div>

                        {/* Team Leader */}
                        <div>
                            <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Crown className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                                Team Leader
                            </h3>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <Avatar>
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                        {teamData.leader_name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {teamData.leader_name}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        NIM: {teamData.leader_nim}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {teamData.email}
                                    </div>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                                >
                                    Leader
                                </Badge>
                            </div>
                        </div>

                        {/* Team Members */}
                        {teamMembers.length > 0 && (
                            <div>
                                <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                    Team Members
                                </h3>
                                <div className="space-y-2">
                                    {teamMembers.map((member, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                                <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                                    {member.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                                    {member.name}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                                    NIM: {member.nim}
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                                            >
                                                <User className="h-3 w-3 mr-1" />
                                                Member
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Competition Progress */}
                <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <Trophy className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                            Competition Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Progress Overview */}
                        <div className="flex items-center justify-between mb-6">
                            {stages.map((stage, index) => (
                                <div
                                    key={stage.id}
                                    className="flex items-center"
                                >
                                    <div className="flex flex-col items-center">
                                        {getStatusIcon(stage.status)}
                                        <div className="text-xs mt-1 text-center max-w-16 text-gray-600 dark:text-gray-400">
                                            {stage.name}
                                        </div>
                                    </div>
                                    {index < stages.length - 1 && (
                                        <div
                                            className={`h-0.5 w-8 mx-2 ${
                                                stage.status === "completed"
                                                    ? "bg-green-300 dark:bg-green-600"
                                                    : "bg-gray-200 dark:bg-gray-700"
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Stage Details */}
                        <div className="space-y-4">
                            {stages.map((stage) => (
                                <Collapsible
                                    key={stage.id}
                                    open={openStages.includes(stage.id)}
                                    onOpenChange={() => toggleStage(stage.id)}
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between p-4 h-auto hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(stage.status)}
                                                <div className="text-left">
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                                        {stage.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        {stage.description}
                                                    </div>
                                                    <Progress
                                                        value={stage.progress}
                                                        className="w-32 h-1 mt-1"
                                                    />
                                                </div>
                                            </div>
                                            {openStages.includes(stage.id) ? (
                                                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-4 pb-4">
                                        <div className="space-y-4 ml-8">
                                            {/* Documents */}
                                            <div>
                                                <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                                    <FileText className="h-4 w-4" />
                                                    Documents
                                                </h4>
                                                <div className="space-y-2">
                                                    {stage.documents.map(
                                                        (doc, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                                                            >
                                                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                                                    {doc.name}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge
                                                                        variant={
                                                                            doc.status ===
                                                                            "submitted"
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                        className={`text-xs ${
                                                                            doc.status ===
                                                                            "submitted"
                                                                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                                                : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                                                                        }`}
                                                                    >
                                                                        {doc.status ===
                                                                        "submitted"
                                                                            ? "Submitted"
                                                                            : "Pending"}
                                                                    </Badge>
                                                                    {doc.status ===
                                                                        "submitted" && (
                                                                        <div className="flex gap-1">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="h-6 w-6 p-0 bg-transparent border-gray-300 dark:border-gray-600"
                                                                            >
                                                                                <Eye className="h-3 w-3" />
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className="h-6 w-6 p-0 bg-transparent border-gray-300 dark:border-gray-600"
                                                                            >
                                                                                <Download className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Deadlines */}
                                            <div>
                                                <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                                    <Calendar className="h-4 w-4" />
                                                    Deadlines
                                                </h4>
                                                <div className="space-y-2">
                                                    {stage.deadlines.map(
                                                        (deadline, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                                                            >
                                                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        deadline.task
                                                                    }
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                        {
                                                                            deadline.date
                                                                        }
                                                                    </span>
                                                                    <Badge
                                                                        variant={
                                                                            deadline.status ===
                                                                            "completed"
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                        className={`text-xs ${
                                                                            deadline.status ===
                                                                            "completed"
                                                                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                                                                : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                                                                        }`}
                                                                    >
                                                                        {deadline.status ===
                                                                        "completed"
                                                                            ? "Completed"
                                                                            : "Pending"}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sessions */}
                                            <div>
                                                <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                                    <Users className="h-4 w-4" />
                                                    Sessions
                                                </h4>
                                                <div className="space-y-2">
                                                    {stage.sessions.map(
                                                        (session, index) => (
                                                            <div
                                                                key={index}
                                                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                                                            >
                                                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                                                    {
                                                                        session.title
                                                                    }
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                        {
                                                                            session.date
                                                                        }
                                                                    </span>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`text-xs border-gray-300 dark:border-gray-600 ${
                                                                            session.status ===
                                                                            "attended"
                                                                                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                                                                : session.status ===
                                                                                  "scheduled"
                                                                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                                                                : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                                        }`}
                                                                    >
                                                                        {session.status ===
                                                                        "attended"
                                                                            ? "Attended"
                                                                            : session.status ===
                                                                              "scheduled"
                                                                            ? "Scheduled"
                                                                            : "Pending"}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
