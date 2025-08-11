<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\CompetitionStage;
use App\Models\AssignmentSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AssignmentController extends Controller
{
    /**
     * Display a listing of assignments
     */
    public function index(Request $request)
    {
        $query = Assignment::with(['competitionStage', 'creator', 'submissions'])
            ->orderBy('created_at', 'desc');

        // Filter by stage
        if ($request->stage_id && $request->stage_id !== 'all') {
            $query->where('competition_stage_id', $request->stage_id);
        }

        // Filter by status
        if ($request->status && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $assignments = $query->paginate(10)->withQueryString();

        // Add submission statistics to each assignment
        $assignments->getCollection()->transform(function ($assignment) {
            $assignment->submission_count = $assignment->submissions->count();
            $assignment->pending_count = $assignment->submissions->where('status', 'pending')->count();
            $assignment->graded_count = $assignment->submissions->where('status', 'graded')->count();
            return $assignment;
        });

        $stages = CompetitionStage::orderBy('order')->get();

        // Calculate stats
        $stats = [
            'total' => Assignment::count(),
            'active' => Assignment::where('is_active', true)->count(),
            'inactive' => Assignment::where('is_active', false)->count(),
            'overdue' => Assignment::where('deadline', '<', now())->count(),
        ];

        return Inertia::render('admin/Assignment/Index', [
            'assignments' => $assignments,
            'stages' => $stages,
            'filters' => [
                'stage_id' => $request->stage_id ?? 'all',
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ],
            'stats' => $stats
        ]);
    }

    /**
     * Show the form for creating a new assignment
     */
    public function create()
    {
        $stages = CompetitionStage::orderBy('order')->get();

        return Inertia::render('admin/Assignment/Create', [
            'stages' => $stages
        ]);
    }

    /**
     * Store a newly created assignment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'competition_stage_id' => 'required|exists:competition_stages,id',
            'title' => 'required|string|min:5|max:255',
            'description' => 'required|string|min:10|max:1000',
            'instructions' => 'nullable|string|max:2000',
            'deadline' => 'required|date|after:now',
            'is_active' => 'boolean'
        ], [
            'competition_stage_id.required' => 'Tahap kompetisi harus dipilih',
            'competition_stage_id.exists' => 'Tahap kompetisi tidak valid',
            'title.required' => 'Judul tugas harus diisi',
            'title.min' => 'Judul tugas minimal 5 karakter',
            'title.max' => 'Judul tugas maksimal 255 karakter',
            'description.required' => 'Deskripsi tugas harus diisi',
            'description.min' => 'Deskripsi tugas minimal 10 karakter',
            'description.max' => 'Deskripsi tugas maksimal 1000 karakter',
            'instructions.max' => 'Instruksi maksimal 2000 karakter',
            'deadline.required' => 'Tenggat waktu harus diisi',
            'deadline.date' => 'Format tenggat waktu tidak valid',
            'deadline.after' => 'Tenggat waktu harus setelah waktu sekarang',
        ]);

        $validated['created_by'] = Auth::id();

        Assignment::create($validated);

        return redirect()->route('admin.assignments.index')
            ->with('success', 'Assignment created successfully.');
    }

    /**
     * Display the specified assignment
     */
    public function show(Assignment $assignment)
    {
        $assignment->load([
            'competitionStage',
            'creator',
            'submissions.team',
            'submissions.grader'
        ]);

        // Get submission statistics
        $submissionStats = [
            'total' => $assignment->submissions->count(),
            'pending' => $assignment->submissions->where('status', 'pending')->count(),
            'graded' => $assignment->submissions->where('status', 'graded')->count(),
            'late' => $assignment->submissions->filter(function ($submission) use ($assignment) {
                return $submission->submitted_at > $assignment->deadline;
            })->count(),
        ];

        return Inertia::render('Admin/Assignments/Show', [
            'assignment' => $assignment,
            'submissionStats' => $submissionStats
        ]);
    }

    /**
     * Show the form for editing the assignment
     */
    public function edit(Assignment $assignment)
    {
        $stages = CompetitionStage::orderBy('order')->get();

        return Inertia::render('Admin/Assignments/Edit', [
            'assignment' => $assignment,
            'stages' => $stages
        ]);
    }

    /**
     * Update the specified assignment
     */
    public function update(Request $request, Assignment $assignment)
    {
        $validated = $request->validate([
            'competition_stage_id' => 'required|exists:competition_stages,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'instructions' => 'nullable|string',
            'deadline' => 'required|date',
            'is_active' => 'boolean'
        ]);

        $assignment->update($validated);

        return redirect()->route('admin.assignments.index')
            ->with('success', 'Assignment updated successfully.');
    }

    /**
     * Remove the specified assignment
     */
    public function destroy(Assignment $assignment)
    {
        $assignment->delete();

        return redirect()->route('admin.assignments.index')
            ->with('success', 'Assignment deleted successfully.');
    }

    /**
     * Toggle assignment active status
     */
    public function toggleStatus(Assignment $assignment)
    {
        $assignment->update([
            'is_active' => !$assignment->is_active
        ]);

        $status = $assignment->is_active ? 'activated' : 'deactivated';

        return back()->with('success', "Assignment {$status} successfully.");
    }

    /**
     * Get assignments by stage (for AJAX)
     */
    public function getByStage(Request $request)
    {
        $assignments = Assignment::where('competition_stage_id', $request->stage_id)
            ->where('is_active', true)
            ->orderBy('deadline')
            ->get(['id', 'title', 'deadline']);

        return response()->json($assignments);
    }
}
