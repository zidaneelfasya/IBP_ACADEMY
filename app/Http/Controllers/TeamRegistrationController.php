<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TeamRegistration;

class TeamRegistrationController extends Controller
{
    public function create()
    {
        return view('team-registration.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'leader_name' => 'required|string|max:255',
            'leader_nim' => 'required|string|max:255',
            'member1_name' => 'nullable|string|max:255',
            'member1_nim' => 'nullable|string|max:255',
            'member2_name' => 'nullable|string|max:255',
            'member2_nim' => 'nullable|string|max:255',
            'member3_name' => 'nullable|string|max:255',
            'member3_nim' => 'nullable|string|max:255',
            'ktm_scan_link' => 'required|url',
            'formal_photo_link' => 'required|url',
            'twibbon_link' => 'required|url',
            'ig_account_link' => 'required|url',
            'email' => 'required|email',
            'ppt_link' => 'nullable|url',
            'image_link' => 'nullable|url',
        ]);

        TeamRegistrationController::create($validated);

        return redirect()->route('registration.success');
    }

    public function index(Request $request)
    {

        $search = $request->query('search');
        $status = $request->query('status', 'all');

        // Base query
        $query = TeamRegistration::query()
            ->orderBy('created_at', 'desc');

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('leader_name', 'like', "%{$search}%")
                    ->orWhere('leader_nim', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('member1_name', 'like', "%{$search}%")
                    ->orWhere('member2_name', 'like', "%{$search}%")
                    ->orWhere('member3_name', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        // Paginate
        $teams = $query->paginate(8);

        // Calculate stats
        $stats = [
            'total' => TeamRegistration::count(),
            'approved' => TeamRegistration::where('status', 'approved')->count(),
            'pending' => TeamRegistration::where('status', 'pending')->count(),
            'rejected' => TeamRegistration::where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/team-management', [
            'teams' => $teams,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'stats' => $stats,
        ]);
    }
    public function updateStatus(TeamRegistration $team, Request $request)
{
    $request->validate([
        'status' => 'required|in:pending,approved,rejected'
    ]);

    $team->update(['status' => $request->status]);

    return redirect()->back()->with('success', 'Status tim berhasil diperbarui');
}
}
