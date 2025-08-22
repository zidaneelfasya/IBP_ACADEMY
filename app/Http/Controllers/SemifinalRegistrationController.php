<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SemifinalRegistrationController extends Controller
{
    public function index()
    {
        // Render the Inertia page for semifinal registration
        return Inertia::render('User/SemifinalRegistration');
    }
}
