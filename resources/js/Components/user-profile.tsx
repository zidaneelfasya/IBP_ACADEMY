"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/Components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Separator } from "@/Components/ui/separator"
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
} from "lucide-react"

// Sample team data
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
  file_link: "https://drive.google.com/file/d/1234567890",
}

const stages = [
  {
    id: 1,
    name: "Registration",
    status: "completed",
    description: "Team registration and document submission",
    documents: [
      { name: "Team Registration Form", status: "submitted", date: "2024-01-15" },
      { name: "University Endorsement Letter", status: "submitted", date: "2024-01-16" },
      { name: "Team Member ID Cards", status: "submitted", date: "2024-01-16" },
    ],
    deadlines: [{ task: "Complete Team Registration", date: "2024-01-20", status: "completed" }],
    sessions: [{ title: "Team Orientation Session", date: "2024-01-22", duration: "2 hours" }],
  },
  {
    id: 2,
    name: "Preliminary Round",
    status: "completed",
    description: "Initial team assessment and project proposal",
    documents: [
      { name: "Team Project Proposal", status: "submitted", date: "2024-02-10" },
      { name: "Technical Specification", status: "submitted", date: "2024-02-12" },
      { name: "Team Work Distribution Plan", status: "submitted", date: "2024-02-13" },
    ],
    deadlines: [
      { task: "Submit Team Project Proposal", date: "2024-02-15", status: "completed" },
      { task: "Team Peer Review", date: "2024-02-20", status: "completed" },
    ],
    sessions: [
      { title: "Team Mentoring Session #1", date: "2024-02-05", duration: "1.5 hours" },
      { title: "Technical Workshop", date: "2024-02-18", duration: "3 hours" },
    ],
  },
  {
    id: 3,
    name: "Semifinal",
    status: "in-progress",
    description: "Advanced development and team presentation",
    documents: [
      { name: "Team Progress Report", status: "submitted", date: "2024-03-01" },
      { name: "Prototype Demo Video", status: "pending", date: "-" },
      { name: "Team Presentation Slides", status: "pending", date: "-" },
    ],
    deadlines: [
      { task: "Submit Team Progress Report", date: "2024-03-05", status: "completed" },
      { task: "Team Prototype Presentation", date: "2024-03-15", status: "pending" },
    ],
    sessions: [
      { title: "Team Mentoring Session #2", date: "2024-02-28", duration: "2 hours" },
      { title: "Presentation Skills Workshop", date: "2024-03-10", duration: "2 hours" },
    ],
  },
  {
    id: 4,
    name: "Final",
    status: "not-started",
    description: "Final team presentation and judging",
    documents: [
      { name: "Final Team Report", status: "not-submitted", date: "-" },
      { name: "Final Presentation Slides", status: "not-submitted", date: "-" },
      { name: "Team Reflection Document", status: "not-submitted", date: "-" },
    ],
    deadlines: [
      { task: "Submit Final Team Report", date: "2024-04-01", status: "pending" },
      { task: "Final Team Presentation", date: "2024-04-10", status: "pending" },
    ],
    sessions: [{ title: "Final Team Mentoring Session", date: "2024-03-25", duration: "1 hour" }],
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-6 w-6 text-emerald-500" />
    case "in-progress":
      return <Clock className="h-6 w-6 text-amber-500" />
    default:
      return <Circle className="h-6 w-6 text-gray-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "in-progress":
      return "bg-amber-100 text-amber-800 border-amber-200"
    default:
      return "bg-gray-100 text-gray-600 border-gray-200"
  }
}

export default function ParticipantProfile() {
  const [openStages, setOpenStages] = useState<number[]>([3]) // Semifinal open by default

  const toggleStage = (stageId: number) => {
    setOpenStages((prev) => (prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]))
  }

  // Get team members (excluding leader)
  const teamMembers = [
    { name: teamData.member1_name, nim: teamData.member1_nim },
    { name: teamData.member2_name, nim: teamData.member2_nim },
    { name: teamData.member3_name, nim: teamData.member3_nim },
  ].filter((member) => member.name && member.nim)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter']">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E3A8A]">IBP Academy</h1>
          </div>
        </div>

        {/* Team Profile Card */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Team Name */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[#1E3A8A] mb-2 flex items-center gap-3">
                <Trophy className="h-8 w-8 text-[#EAB308]" />
                {teamData.team_name}
              </h2>
              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{teamData.university}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{teamData.study_program}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{teamData.faculty}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-[#EAB308] text-[#1E3A8A] hover:bg-[#EAB308]/90 font-medium">
                  <Trophy className="h-3 w-3 mr-1" />
                  {teamData.status} Team
                </Badge>
                <Badge variant="outline" className="border-[#1E3A8A] text-[#1E3A8A]">
                  {teamMembers.length + 1} Members
                </Badge>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Team Leader */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-[#EAB308]" />
                Team Leader
              </h3>
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#1E3A8A]/5 to-[#EAB308]/5 p-4 rounded-lg border border-[#EAB308]/20">
                <Avatar className="h-16 w-16 border-3 border-[#EAB308] shadow-lg">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt={teamData.leader_name} />
                  <AvatarFallback className="bg-[#1E3A8A] text-white text-lg font-semibold">
                    {teamData.leader_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#1E3A8A]">{teamData.leader_name}</h4>
                  <p className="text-gray-600 font-mono text-sm">NIM: {teamData.leader_nim}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{teamData.email}</span>
                  </div>
                </div>
                <Badge className="bg-[#EAB308] text-[#1E3A8A] font-medium">
                  <Crown className="h-3 w-3 mr-1" />
                  Leader
                </Badge>
              </div>
            </div>

            {/* Team Members */}
            {teamMembers.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </h3>
                <div className="grid gap-3">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border">
                      <Avatar className="h-12 w-12 border-2 border-gray-300">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={member.name} />
                        <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#1E3A8A]">{member.name}</h4>
                        <p className="text-gray-600 font-mono text-sm">NIM: {member.nim}</p>
                      </div>
                      <Badge variant="outline" className="border-gray-300 text-gray-600">
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

        {/* Progress Tracker */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-[#1E3A8A] flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#EAB308]" />
              Team Competition Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Stepper */}
            <div className="relative">
              <div className="flex justify-between items-center mb-8">
                {stages.map((stage, index) => (
                  <div key={stage.id} className="flex flex-col items-center relative z-10">
                    <div className="flex items-center justify-center mb-2">{getStatusIcon(stage.status)}</div>
                    <div className="text-center">
                      <div className="font-semibold text-sm text-[#1E3A8A] mb-1">{stage.name}</div>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(stage.status)}`}>
                        {stage.status === "completed"
                          ? "Completed"
                          : stage.status === "in-progress"
                            ? "In Progress"
                            : "Not Started"}
                      </Badge>
                    </div>

                    {/* Connection Line */}
                    {index < stages.length - 1 && (
                      <div className="absolute top-3 left-6 w-full h-0.5 bg-gray-200 -z-10 hidden md:block">
                        <div
                          className={`h-full transition-all duration-500 ${
                            stage.status === "completed"
                              ? "bg-emerald-500 w-full"
                              : stage.status === "in-progress"
                                ? "bg-amber-500 w-1/2"
                                : "w-0"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                      className="w-full justify-between p-4 h-auto hover:bg-[#1E3A8A]/5 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(stage.status)}
                        <div className="text-left">
                          <div className="font-semibold text-[#1E3A8A]">{stage.name}</div>
                          <div className="text-sm text-gray-600">{stage.description}</div>
                        </div>
                      </div>
                      {openStages.includes(stage.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-2">
                    <div className="bg-gray-50 rounded-lg p-4 ml-4 space-y-4">
                      {/* Documents */}
                      <div>
                        <h4 className="font-semibold text-[#1E3A8A] mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Team Documents
                        </h4>
                        <div className="space-y-2">
                          {stage.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                              <span className="text-sm">{doc.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={doc.status === "submitted" ? "default" : "secondary"}
                                  className={doc.status === "submitted" ? "bg-emerald-100 text-emerald-800" : ""}
                                >
                                  {doc.status === "submitted"
                                    ? "Submitted"
                                    : doc.status === "pending"
                                      ? "Pending"
                                      : "Not Submitted"}
                                </Badge>
                                {doc.date !== "-" && <span className="text-xs text-gray-500">{doc.date}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Deadlines */}
                      <div>
                        <h4 className="font-semibold text-[#1E3A8A] mb-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Team Deadlines
                        </h4>
                        <div className="space-y-2">
                          {stage.deadlines.map((deadline, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                              <span className="text-sm">{deadline.task}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{deadline.date}</span>
                                <Badge
                                  variant={deadline.status === "completed" ? "default" : "secondary"}
                                  className={deadline.status === "completed" ? "bg-emerald-100 text-emerald-800" : ""}
                                >
                                  {deadline.status === "completed" ? "Completed" : "Pending"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Mentoring Sessions */}
                      <div>
                        <h4 className="font-semibold text-[#1E3A8A] mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Team Mentoring Sessions
                        </h4>
                        <div className="space-y-2">
                          {stage.sessions.map((session, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                              <span className="text-sm">{session.title}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{session.date}</span>
                                <Badge variant="outline" className="text-xs">
                                  {session.duration}
                                </Badge>
                              </div>
                            </div>
                          ))}
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
  )
}
