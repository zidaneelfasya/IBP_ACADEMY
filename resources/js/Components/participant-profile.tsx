"use client";



import { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
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
    Eye,
    Phone,
    File,
} from "lucide-react";

interface TeamMember {
    name: string;
    nim: string;
    email: string;
    phone: string;
    univ: string;
    fakultas: string;
    isLeader?: boolean;
}

interface Stage {
    id: number;
    name: string;
    description: string;
    due_date: string;
    status: string;
    submitted_at: string;
    approved_at: string;
    progress_percentage: number;
    round_number: number;
}

interface TeamData {
    id: number;
    tim_name: string;
    registration_number: string;
    asal_universitas: string;
    prodi_fakultas: string;
    competition_category: string;
    leader_name: string;
    leader_nim: string;
    leader_email: string;
    leader_phone: string;
    leader_univ: string;
    leader_fakultas: string;
    member1_name: string;
    member1_nim: string;
    member1_email: string;
    member1_phone: string;
    member1_univ: string;
    member1_fakultas: string;
    member2_name: string;
    member2_nim: string;
    member2_email: string;
    member2_phone: string;
    member2_univ: string;
    member2_fakultas: string;
    member3_name: string;
    member3_nim: string;
    member3_email: string;
    member3_phone: string;
    member3_univ: string;
    member3_fakultas: string;
    link_berkas: string;
    status: string;
    admin_notes: string;
    registered_at: string;
    reviewed_at: string;
}

interface CompetitionOption {
    name: string;
    route: string;
    description: string;
}

export default function ParticipantProfile() {
    const { props } = usePage<{
        team: TeamData | null;
        stages: Stage[];
        competitionOptions?: CompetitionOption[];
        hasTeam: boolean;
    }>();

    const { team, stages, competitionOptions = [], hasTeam } = props;
    const [openStages, setOpenStages] = useState<number[]>([]);
    const [progressPercentage, setProgressPercentage] = useState(0);

    const roundDates = [
        " 8-21 August 2025",
        " 8-31 August 2025",
        " 9-23 August 2025",
        " 1-25 August 2025",

    ];

    useEffect(() => {
        if (!hasTeam) return;

        const currentStage = stages.find(
            (stage) =>
                stage.status === "in-progress" ||
                (stage.status === "not-started" &&
                    new Date(stage.due_date) > new Date())
        );
        if (currentStage) setOpenStages([currentStage.id]);

        const calculateProgress = () => {
            const statusValues: Record<string, number> = {
                approved: 1,
                completed: 0.8,
                "in-progress": 0.5,
                "not-started": 0,
            };

            const total = stages.reduce((sum, stage) => {
                return sum + (statusValues[stage.status] || 0);
            }, 0);

            const maxPossible = stages.length;
            return maxPossible > 0
                ? Math.round((total / maxPossible) * 100)
                : 0;
        };

        setProgressPercentage(calculateProgress());
    }, [stages, hasTeam]);

    const toggleStage = (stageId: number) => {
        setOpenStages((prev) =>
            prev.includes(stageId)
                ? prev.filter((id) => id !== stageId)
                : [...prev, stageId]
        );
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "completed":
                return <CheckCircle className="h-5 w-5 text-green-400" />;
            case "in-progress":
                return <Clock className="h-5 w-5 text-amber-600" />;
            default:
                return <Circle className="h-5 w-5 text-gray-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-800";
            case "completed":
                return "bg-green-50 text-green-700";
            case "in-progress":
                return "bg-amber-100 text-amber-800";
            case "verified":
                return "bg-blue-100 text-blue-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

     if (!hasTeam || !team) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto p-4 space-y-6">
                    <div className="text-center py-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <GraduationCap className="h-6 w-6 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">
                                Team Registration Dashboard
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            You haven't registered a team yet
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                Register Your Team
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                {competitionOptions.map((option) => (
                                    <Card key={option.name}>
                                        <CardHeader>
                                            <CardTitle>{option.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-gray-600">
                                                {option.description}
                                            </p>
                                            <Button asChild className="w-full">
                                                <Link href={option.route}>
                                                    Register Now
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

   const teamMembers: TeamMember[] = [
       {
           name: team!.leader_name,
           nim: team!.leader_nim,
           email: team!.leader_email,
           phone: team!.leader_phone,
           univ: team!.leader_univ,
           fakultas: team!.leader_fakultas,
           isLeader: true,
       },
       {
           name: team!.member1_name,
           nim: team!.member1_nim,
           email: team!.member1_email,
           phone: team!.member1_phone,
           univ: team!.member1_univ,
           fakultas: team!.member1_fakultas,
       },
       {
           name: team!.member2_name,
           nim: team!.member2_nim,
           email: team!.member2_email,
           phone: team!.member2_phone,
           univ: team!.member2_univ,
           fakultas: team!.member2_fakultas,
       },
       {
           name: team!.member3_name,
           nim: team!.member3_nim,
           email: team!.member3_email,
           phone: team!.member3_phone,
           univ: team!.member3_univ,
           fakultas: team!.member3_fakultas,
       },
   ].filter((member) => member.name);

    const completedStages = stages.filter(
        (stage) => stage.status === "completed" || stage.status === "approved"
    ).length;
    const totalStages = stages.length;

    const lastApprovedStageIndex = stages.reduce((maxIndex, stage, index) => {
        return stage.status === "approved" ? index : maxIndex;
    }, -1);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="text-center py-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">
                            Team Registration Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        {team.asal_universitas} - {team.prodi_fakultas}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">
                                {progressPercentage}%
                            </div>
                            <div className="text-sm text-gray-600">
                                Progress
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold">
                                <Badge
                                    className={`${getStatusBadge(team.status)}`}
                                >
                                    {team.status}
                                </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                                Status
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">
                                {teamMembers.length}
                            </div>
                            <div className="text-sm text-gray-600">
                                Team Members
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Team Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            {team.tim_name}
                            <Badge variant="outline" className="ml-auto">
                                {team.registration_number}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Team Details */}
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-gray-500" />
                                <span>{team.competition_category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>Registered: {team.registered_at}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Overall Progress</span>
                                <span>
                                    {progressPercentage}% ({completedStages}/
                                    {totalStages} stages)
                                </span>
                            </div>
                            <Progress
                                value={progressPercentage}
                                className="h-2"
                            />
                        </div>

                        {/* Team Leader */}
                        <div className="space-y-4">
                            {/* Team Leader */}
                            <div>
                                <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-800">
                                    <Crown className="h-4 w-4 text-amber-500" />
                                    Team Leader
                                </h3>
                                <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                            {team.leader_name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {team.leader_name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                NIM: {team.leader_nim}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <Building className="h-4 w-4 text-gray-400" />
                                                {team.leader_univ}
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <GraduationCap className="h-4 w-4 text-gray-400" />
                                                {team.leader_fakultas}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                {team.leader_email}
                                            </p>
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                {team.leader_phone}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className="bg-amber-100 text-amber-800 h-fit">
                                        Leader
                                    </Badge>
                                </div>
                            </div>

                            {/* Team Members */}
                            {teamMembers.filter((m) => !m.isLeader).length >
                                0 && (
                                <div>
                                    <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-800">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        Team Members (
                                        {
                                            teamMembers.filter(
                                                (m) => !m.isLeader
                                            ).length
                                        }
                                        )
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {teamMembers
                                            .filter((m) => !m.isLeader)
                                            .map((member, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                                                >
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="text-xs bg-gray-100 text-gray-700 font-medium">
                                                            {member.name
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-medium text-sm text-gray-900">
                                                                    {
                                                                        member.name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-600">
                                                                    NIM:{" "}
                                                                    {member.nim}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                <User className="h-3 w-3 mr-1" />
                                                                Member{" "}
                                                                {index + 1}
                                                            </Badge>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-xs text-gray-600 flex items-center gap-2">
                                                                <Building className="h-3 w-3 text-gray-400" />
                                                                {member.univ}
                                                            </p>
                                                            <p className="text-xs text-gray-600 flex items-center gap-2">
                                                                <GraduationCap className="h-3 w-3 text-gray-400" />
                                                                {
                                                                    member.fakultas
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-xs text-gray-600 flex items-center gap-2">
                                                                <Mail className="h-3 w-3 text-gray-400" />
                                                                {member.email}
                                                            </p>
                                                            <p className="text-xs text-gray-600 flex items-center gap-2">
                                                                <Phone className="h-3 w-3 text-gray-400" />
                                                                {member.phone}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Documents */}
                        {team.link_berkas && (
                            <div>
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                    <File className="h-4 w-4" />
                                    Submission Documents
                                </h3>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span>
                                                Team Registration Documents
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <a
                                                    href={team.link_berkas}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center"
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View Document
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Competition Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Competition Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Progress Timeline */}
                        <div className="relative mb-8">
                            <div className="flex justify-between items-center w-full">
                                {stages.map((stage, index) => {
                                    const isApproved =
                                        stage.status === "approved";
                                    const isCompleted =
                                        stage.status === "completed";
                                    const isCurrent =
                                        stage.status === "in-progress";

                                    return (
                                        <div
                                            key={stage.id}
                                            className="flex flex-col items-center z-10"
                                        >
                                            <div
                                                className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                                                    isApproved
                                                        ? "bg-green-500 border-green-600 text-white"
                                                        : isCompleted
                                                        ? "bg-green-300 border-green-400 text-white"
                                                        : isCurrent
                                                        ? "bg-amber-300 border-amber-400 text-white"
                                                        : "bg-gray-100 border-gray-300 text-gray-600"
                                                }`}
                                            >
                                                {stage.round_number ||
                                                    index + 1}
                                            </div>
                                            <div className="text-xs mt-2 text-center max-w-16">
                                                {stage.name}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {roundDates[index] ||
                                                    stage.due_date}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
                            <div
                                className="absolute top-4 left-0 h-1 bg-green-500 z-0 transition-all duration-500 ease-in-out"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>

                        {/* Stage Details */}
                        <div className="space-y-4">
                            {stages.map((stage, index) => (
                                <Collapsible
                                    key={stage.id}
                                    open={openStages.includes(stage.id)}
                                    onOpenChange={() => toggleStage(stage.id)}
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between p-4 h-auto hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(stage.status)}
                                                <div className="text-left">
                                                    <div className="font-medium">
                                                        Round{" "}
                                                        {stage.round_number ||
                                                            index + 1}
                                                        : {stage.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {stage.description}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Date:{" "}
                                                        {roundDates[index] ||
                                                            stage.due_date}
                                                    </div>
                                                </div>
                                            </div>
                                            {openStages.includes(stage.id) ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-4 pb-4">
                                        <div className="space-y-4 ml-8">
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-sm">
                                                    Status
                                                </span>
                                                <Badge
                                                    className={`text-xs ${getStatusBadge(
                                                        stage.status
                                                    )}`}
                                                >
                                                    {stage.status.replace(
                                                        "-",
                                                        " "
                                                    )}
                                                </Badge>
                                            </div>

                                            {stage.approved_at && (
                                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <span className="text-sm">
                                                        Approved at
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(
                                                            stage.approved_at
                                                        ).toLocaleString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                                hour: "numeric",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            )}
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

