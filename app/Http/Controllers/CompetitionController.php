<?php

namespace App\Http\Controllers;

use App\Models\TeamRegistration;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CompetitionController extends Controller
{
    /**
     * Show registration success page
     */
    public function success($registrationId)
    {
        $registration = TeamRegistration::with('category')
            ->where('id', $registrationId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Competition/RegistrationSuccess', [
            'registration' => $registration,
            'category' => $registration->category,
        ]);
    }
}
