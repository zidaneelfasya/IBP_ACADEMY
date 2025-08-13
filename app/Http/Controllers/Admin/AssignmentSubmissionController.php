<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AssignmentSubmissionController extends Controller
{
    /**
     * Display submissions for an assignment
     */
    public function index(Request $request, Assignment $assignment)
    {
        $query = $assignment->submissions()
            ->with(['team', 'grader'])
            ->orderBy('submitted_at', 'desc');

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Search by team name
        if ($request->search) {
            $query->whereHas('team', function ($q) use ($request) {
                $q->where('tim_name', 'like', '%' . $request->search . '%')
                  ->orWhere('leader_name', 'like', '%' . $request->search . '%');
            });
        }

        $submissions = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/Assignment/Submissions/Index', [
            'assignment' => $assignment->load('competitionStage'),
            'submissions' => $submissions,
            'filters' => $request->only(['status', 'search'])
        ]);
    }

    /**
     * Show a specific submission
     */
    public function show(Assignment $assignment, AssignmentSubmission $submission)
    {
        $submission->load(['team', 'grader', 'assignment.competitionStage']);

        return Inertia::render('admin/Assignment/Submissions/Show', [
            'submission' => $submission
        ]);
    }

    /**
     * Grade a submission
     */
    public function grade(Request $request, Assignment $assignment, AssignmentSubmission $submission)
    {
        $validated = $request->validate([
            'grade' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string'
        ]);

        $submission->update([
            'grade' => $validated['grade'],
            'feedback' => $validated['feedback'],
            'status' => 'graded',
            'graded_by' => Auth::id(),
            'graded_at' => now()
        ]);

        return back()->with('success', 'Submission graded successfully.');
    }

    /**
     * Bulk grade submissions
     */
    public function bulkGrade(Request $request, Assignment $assignment)
    {
        $validated = $request->validate([
            'submissions' => 'required|array',
            'submissions.*.id' => 'required|exists:assignment_submissions,id',
            'submissions.*.grade' => 'required|numeric|min:0|max:100',
            'submissions.*.feedback' => 'nullable|string'
        ]);

        foreach ($validated['submissions'] as $submissionData) {
            AssignmentSubmission::where('id', $submissionData['id'])
                ->update([
                    'grade' => $submissionData['grade'],
                    'feedback' => $submissionData['feedback'],
                    'status' => 'graded',
                    'graded_by' => Auth::id(),
                    'graded_at' => now()
                ]);
        }

        return back()->with('success', 'Submissions graded successfully.');
    }

    /**
     * Export submissions as CSV
     */
    public function export(Assignment $assignment)
    {
        $submissions = $assignment->submissions()
            ->with(['team', 'grader'])
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="assignment_submissions_' . $assignment->id . '.csv"',
        ];

        $callback = function () use ($submissions) {
            $file = fopen('php://output', 'w');
            
            // Headers
            fputcsv($file, [
                'Team Name',
                'Leader Name',
                'Submission Link',
                'Submitted At',
                'Status',
                'Grade',
                'Is Late',
                'Graded By',
                'Graded At'
            ]);

            // Data
            foreach ($submissions as $submission) {
                fputcsv($file, [
                    $submission->team->tim_name,
                    $submission->team->leader_name,
                    $submission->submission_link,
                    $submission->submitted_at->format('Y-m-d H:i:s'),
                    $submission->status,
                    $submission->grade ?? 'Not graded',
                    $submission->isLate() ? 'Yes' : 'No',
                    $submission->grader->name ?? 'Not graded',
                    $submission->graded_at ? $submission->graded_at->format('Y-m-d H:i:s') : 'Not graded'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}