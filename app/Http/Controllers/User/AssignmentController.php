<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
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

    /* ---------- validasi awal tetap sama ---------- */
    $teamRegistration = TeamRegistration::where('user_id', $user->id)
        ->where('status', 'approved')
        ->first();

    if (!$teamRegistration) {
        return $this->renderLockedPage('You need to register for a competition first.');
    }

    $preliminaryStage = CompetitionStage::where('name', 'LIKE', '%preliminary%')
        ->orWhere('name', 'LIKE', '%Preliminary%')
        ->first();

    $progress = ParticipantProgress::where('participant_id', $teamRegistration->id)
        ->where('competition_stage_id', $preliminaryStage->id)
        ->first();

    if (!$progress) {
        return $this->renderLockedPage(
            'You have not reached the preliminary stage yet. Complete the registration process first.',
            $teamRegistration
        );
    }

    $latestProgress = ParticipantProgress::where('participant_id', $teamRegistration->id)
        ->join('competition_stages', 'participant_progress.competition_stage_id', '=', 'competition_stages.id')
        ->orderBy('competition_stages.order', 'desc')
        ->select('participant_progress.*', 'competition_stages.name as current_stage_name')
        ->first();

    $currentStageId = $latestProgress ? $latestProgress->competition_stage_id : $progress->competition_stage_id;

    /* ---------- cek payment HANYA untuk stage 3 ---------- */
    if ($currentStageId == 3) {
        $payment = \App\Models\Payment::where('team_registration_id', $teamRegistration->id)
            ->where('status', 'verified')
            ->first();

        if (!$payment) {
            return $this->renderLockedPage(
                'Payment verification is required to access semifinal assignments.',
                $teamRegistration
            );
        }
    }

    /* ---------- ambil assignment untuk stage & kategori peserta ---------- */
    $assignments = Assignment::with(['competitionStage', 'competitionCategory', 'creator', 'submissions'])
        ->where('competition_stage_id', $currentStageId)
        ->where('competition_category_id', $teamRegistration->competition_category_id)
        ->where('is_active', true)
        ->orderBy('deadline', 'asc')
        ->get()
        ->map(function ($assignment) use ($teamRegistration) {
            $userSubmission = $assignment->submissions()
                ->where('team_registration_id', $teamRegistration->id)
                ->first();

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
                'is_submitted' => (bool) $userSubmission,
                'submission_date' => optional($userSubmission)->submitted_at?->format('M d, Y H:i'),
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
            'id' => $currentStageId,
            'name' => $latestProgress ? $latestProgress->current_stage_name : $preliminaryStage->name,
            'is_latest' => (bool) $latestProgress,
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
            ->first();

        if (!$progress) {
            return redirect()->route('dashboard.user.tugas')->with('error', 'Access denied.');
        }

        // Get user's latest competition stage from participant_progress
        $latestProgress = ParticipantProgress::where('participant_id', $teamRegistration->id)
            ->join('competition_stages', 'participant_progress.competition_stage_id', '=', 'competition_stages.id')
            ->orderBy('competition_stages.order', 'desc')
            ->select('participant_progress.*')
            ->first();

        // Use the latest stage for assignment validation, fallback to preliminary
        $currentStageId = $latestProgress ? $latestProgress->competition_stage_id : $progress->competition_stage_id;

        // Check if current stage is semifinal (competition_stage_id = 3) and validate payment
        if ($currentStageId == 3) {
            $payment = \App\Models\Payment::where('team_registration_id', $teamRegistration->id)
                ->where('status', 'verified')
                ->first();

            if (!$payment) {
                return redirect()->route('dashboard.user.tugas')->with('error', 'Payment verification required to access semifinal assignments.');
            }
        }

        // Get assignment details by UUID
        $assignment = Assignment::with(['competitionStage', 'competitionCategory', 'creator', 'submissions'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        // Check if assignment belongs to user's current stage and category
        if (
            $assignment->competition_stage_id !== $currentStageId ||
            $assignment->competition_category_id !== $teamRegistration->competition_category_id
        ) {
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
                'submission_link' => $userSubmission->submission_link,
                'notes' => $userSubmission->notes,
            ] : null,
            'team' => [
                'id' => $teamRegistration->id,
                'name' => $teamRegistration->tim_name,
            ],
        ]);
    }


    public function submitAssignment(Request $request, $uuid)
    {
        $user = $request->user();

        // Validate input
        $request->validate([
            'submission_link' => 'required|string|max:500',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Get team registration
        $teamRegistration = TeamRegistration::where('user_id', $user->id)
            ->where('status', 'approved')
            ->first();

        if (!$teamRegistration) {
            return response()->json(['error' => 'Access denied.'], 403);
        }

        // Get assignment
        $assignment = Assignment::where('uuid', $uuid)->firstOrFail();

        // Get user's latest competition stage from participant_progress for validation
        $latestProgress = ParticipantProgress::where('participant_id', $teamRegistration->id)
            ->join('competition_stages', 'participant_progress.competition_stage_id', '=', 'competition_stages.id')
            ->orderBy('competition_stages.order', 'desc')
            ->select('participant_progress.*')
            ->first();

        // Verify assignment belongs to user's current stage and category
        $currentStageId = $latestProgress ? $latestProgress->competition_stage_id : null;

        if (
            !$currentStageId ||
            $assignment->competition_stage_id !== $currentStageId ||
            $assignment->competition_category_id !== $teamRegistration->competition_category_id
        ) {
            return response()->json(['error' => 'Assignment not found.'], 404);
        }

        // Check if current stage is semifinal (competition_stage_id = 3) and validate payment
        if ($currentStageId == 3) {
            $payment = \App\Models\Payment::where('team_registration_id', $teamRegistration->id)
                ->where('status', 'verified')
                ->first();

            if (!$payment) {
                return response()->json(['error' => 'Payment verification required to submit semifinal assignments.'], 403);
            }
        }

        // Check if assignment is still open
        if (!$assignment->isOpen()) {
            if ($assignment->isOverdue()) {
                return response()->json([
                    'error' => 'Assignment deadline has passed. Submissions are no longer accepted.'
                ], 400);
            } else {
                return response()->json([
                    'error' => 'Assignment submission is closed.'
                ], 400);
            }
        }

        // Check if submission already exists
        $existingSubmission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('team_registration_id', $teamRegistration->id)
            ->first();

        if ($existingSubmission) {
            // Update existing submission
            $existingSubmission->update([
                'submission_link' => $request->submission_link,
                'notes' => $request->notes,
                'submitted_at' => now(),
                'status' => 'pending'
            ]);

            return response()->json([
                'message' => 'Assignment submission updated successfully!',
                'submission' => $existingSubmission
            ]);
        } else {
            // Create new submission
            $submission = AssignmentSubmission::create([
                'assignment_id' => $assignment->id,
                'team_registration_id' => $teamRegistration->id,
                'submission_link' => $request->submission_link,
                'notes' => $request->notes,
                'submitted_at' => now(),
                'status' => 'pending'
            ]);

            return response()->json([
                'message' => 'Assignment submitted successfully!',
                'submission' => $submission
            ]);
        }
    }
}
