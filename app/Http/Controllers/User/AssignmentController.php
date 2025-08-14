<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\CompetitionStage;
use App\Models\ParticipantProgress;
use App\Models\TeamRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get user's team registration
        $teamRegistration = TeamRegistration::where('user_id', $user->id)
            ->where('status', 'approved')
            ->first();

        if (!$teamRegistration) {
            return $this->renderLockedPage('You need to register for a competition first.');
        }

        // Check if user has reached preliminary stage
        $preliminaryStage = CompetitionStage::where('name', 'LIKE', '%preliminary%')
            ->orWhere('name', 'LIKE', '%Preliminary%')
            ->first();

        if (!$preliminaryStage) {
            return $this->renderLockedPage('Preliminary stage not found. Please contact administrator.');
        }

        // Check participant progress for preliminary stage
        $progress = ParticipantProgress::where('participant_id', $teamRegistration->id)
            ->where('competition_stage_id', $preliminaryStage->id)
            ->where('status', 'approved')
            ->first();

        if (!$progress) {
            return $this->renderLockedPage(
                'You have not reached the preliminary stage yet. Complete the registration process first.',
                $teamRegistration
            );
        }

        // User has access, get assignments for preliminary stage
        $assignments = Assignment::with(['competitionStage', 'creator'])
            ->where('competition_stage_id', $preliminaryStage->id)
            ->where('is_active', true)
            ->orderBy('deadline', 'asc')
            ->get()
            ->map(function ($assignment) {
                return [
                    'uuid' => $assignment->uuid,
                    'title' => $assignment->title,
                    'description' => $assignment->description,
                    'instructions' => $assignment->instructions,
                    'deadline' => $assignment->deadline,
                    'deadline_formatted' => $assignment->deadline->format('M d, Y H:i'),
                    'time_remaining' => $assignment->time_remaining,
                    'is_overdue' => $assignment->isOverdue(),
                    'is_open' => $assignment->isOpen(),
                    'stage_name' => $assignment->competitionStage->name,
                    'created_by' => $assignment->creator->name ?? 'System',
                ];
            });

        return Inertia::render('User/Assignments', [
            'assignments' => $assignments,
            'team' => [
                'id' => $teamRegistration->id,
                'name' => $teamRegistration->tim_name,
                'leader' => $teamRegistration->leader_name,
                'registration_number' => $teamRegistration->registration_number,
            ],
            'stage' => [
                'id' => $preliminaryStage->id,
                'name' => $preliminaryStage->name,
            ]
        ]);
    }

    private function renderLockedPage(string $message, $teamRegistration = null)
    {
        return Inertia::render('User/AssignmentsLocked', [
            'message' => $message,
            'team' => $teamRegistration ? [
                'name' => $teamRegistration->tim_name,
                'status' => $teamRegistration->status,
                'registration_number' => $teamRegistration->registration_number,
            ] : null,
        ]);
    }

    public function show(Request $request, $uuid)
    {
        $user = $request->user();

        // Same access check as index
        $teamRegistration = TeamRegistration::where('user_id', $user->id)
            ->where('status', 'approved')
            ->first();

        if (!$teamRegistration) {
            return redirect()->route('dashboard.user.tugas')->with('error', 'Access denied.');
        }

        $preliminaryStage = CompetitionStage::where('name', 'LIKE', '%preliminary%')
            ->orWhere('name', 'LIKE', '%Preliminary%')
            ->first();

        $progress = ParticipantProgress::where('participant_id', $teamRegistration->id)
            ->where('competition_stage_id', $preliminaryStage->id)
            ->where('status', 'approved')
            ->first();

        if (!$progress) {
            return redirect()->route('dashboard.user.tugas')->with('error', 'Access denied.');
        }

        // Get assignment details by UUID
        $assignment = Assignment::with(['competitionStage', 'creator', 'submissions'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        // Check if assignment belongs to preliminary stage
        if ($assignment->competition_stage_id !== $preliminaryStage->id) {
            return redirect()->route('dashboard.user.tugas')->with('error', 'Assignment not found.');
        }

        // Get user's submission if exists
        $userSubmission = $assignment->submissions()
            ->where('team_registration_id', $teamRegistration->id)
            ->first();

        return Inertia::render('User/AssignmentDetail', [
            'assignment' => [
                'uuid' => $assignment->uuid,
                'title' => $assignment->title,
                'description' => $assignment->description,
                'instructions' => $assignment->instructions,
                'deadline' => $assignment->deadline,
                'deadline_formatted' => $assignment->deadline->format('M d, Y H:i'),
                'time_remaining' => $assignment->time_remaining,
                'is_overdue' => $assignment->isOverdue(),
                'is_open' => $assignment->isOpen(),
                'stage_name' => $assignment->competitionStage->name,
                'created_by' => $assignment->creator->name ?? 'System',
            ],
            'submission' => $userSubmission ? [
                'id' => $userSubmission->id,
                'submitted_at' => $userSubmission->submitted_at,
                'status' => $userSubmission->status,
                'feedback' => $userSubmission->feedback,
                'file_path' => $userSubmission->submission_link,
            ] : null,
            'team' => [
                'id' => $teamRegistration->id,
                'name' => $teamRegistration->tim_name,
            ],
        ]);
    }
}
