<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

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

    public function index()
    {
      return Inertia::render('admin/team-management');
    }
}
