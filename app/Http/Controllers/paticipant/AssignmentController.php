<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\TeamRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AssignmentController extends Controller
{
    /**
     * Display assignments for the authenticated user's team
     */
    public function index()
    {
        // Get user's team registration
        $teamRegistration = TeamRegistration::where('user_id', Auth::id())
            ->where('status', 'approved')
            ->first();

        if (!$teamRegistration) {
            return redirect()->back()->with('error', 'You are not part of an approved team.');
        }

        // Get assignments for the team's competition category
        $assignments = Assignment::with(['competitionStage'])
            ->whereHas('competitionStage', function ($query) use ($teamRegistration) {
                // Assuming competition stages are linked to competition categories
                // You might need to adjust this based on your actual relationship
            })
            ->where('is_active', true)
            ->orderBy('deadline')
            ->get();

        // Add submission status for each assignment
        $assignments->map(function ($assignment) use ($teamRegistration) {
            $submission = AssignmentSubmission::where('assignment_id', $assignment->id)
                ->where('team_registration_id', $teamRegistration->id)
                ->first();

            $assignment->submission = $submission;
            $assignment->is_submitted = !!$submission;
            $assignment->can_submit = $assignment->isOpen() && !$submission;
            
            return $assignment;
        });

        return Inertia::render('Participant/Assignments/Index', [
            'assignments' => $assignments,
            'team' => $teamRegistration
        ]);
    }

    /**
     * Show a specific assignment
     */
    public function show(Assignment $assignment)
    {
        $teamRegistration = TeamRegistration::where('user_id', Auth::id())
            ->where('status', 'approved')
            ->first();

        if (!$teamRegistration) {
            return redirect()->back()->with('error', 'You are not part of an approved team.');
        }

        $assignment->load('competitionStage');

        // Get existing submission if any
        $submission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('team_registration_id', $teamRegistration->id)
            ->first();

        return Inertia::render('Participant/Assignments/Show', [
            'assignment' => $assignment,
            'submission' => $submission,
            'team' => $teamRegistration,
            'canSubmit' => $assignment->isOpen() && !$submission
        ]);
    }

    /**
     * Submit an assignment
     */
    public function submit(Request $request, Assignment $assignment)
    {
        $teamRegistration = TeamRegistration::where('user_id', Auth::id())
            ->where('status', 'approved')
            ->first();

        if (!$teamRegistration) {
            return back()->with('error', 'You are not part of an approved team.');
        }

        // Check if assignment is still open
        if (!$assignment->isOpen()) {
            return back()->with('error', 'This assignment is no longer accepting submissions.');
        }

        // Check if already submitted
        $existingSubmission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('team_registration_id', $teamRegistration->id)
            ->first();

        if ($existingSubmission) {
            return back()->with('error', 'You have already submitted this assignment.');
        }

        $validated = $request->validate([
            'submission_link' => 'required|url',
            'notes' => 'nullable|string|max:1000'
        ]);

        AssignmentSubmission::create([
            'assignment_id' => $assignment->id,
            'team_registration_id' => $teamRegistration->id,
            'submission_link' => $validated['submission_link'],
            'notes' => $validated['notes'],
            'status' => 'pending',
            'submitted_at' => now()
        ]);

        return redirect()->route('participant.assignments.index')
            ->with('success', 'Assignment submitted successfully.');
    }

    /**
     * Show submission details
     */
    public function submission(Assignment $assignment)
    {
        $teamRegistration = TeamRegistration::where('user_id', Auth::id())
            ->where('status', 'approved')
            ->first();

        if (!$teamRegistration) {
            return redirect()->back()->with('error', 'You are not part of an approved team.');
        }

        $submission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('team_registration_id', $teamRegistration->id)
            ->with(['assignment.competitionStage', 'grader'])
            ->first();

        if (!$submission) {
            return redirect()->route('participant.assignments.show', $assignment)
                ->with('error', 'No submission found for this assignment.');
        }

        return Inertia::render('Participant/Assignments/Submission', [
            'submission' => $submission
        ]);
    }
}