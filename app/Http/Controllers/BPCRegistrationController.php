<?php

namespace App\Http\Controllers;

use App\Models\CompetitionCategory;
use App\Models\TeamRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BPCRegistrationController extends Controller
{
    /**
     * Show BPC registration form
     */
    public function create()
    {
        // Get BPC category
        $category = CompetitionCategory::where('name', 'BPC')->first();

        if (!$category) {
            return redirect()->back()->with('error', 'Kategori Business Plan Competition tidak ditemukan.');
        }

        // Check if user already registered for BPC
        $existingRegistration = TeamRegistration::where('user_id', Auth::id())
            ->where('competition_category_id', $category->id)
            ->first();

        // If user already registered, redirect back to BPC page with modal trigger
        if ($existingRegistration) {
            return redirect()->route('business-plan-competition', [
                'showModal' => 'true',
                'regId' => $existingRegistration->id
            ]);
        }

        return Inertia::render('Competition/BPCRegistration', [
            'category' => $category,
            'existingRegistration' => null,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Store BPC registration
     */
    public function store(Request $request)
    {
        Log::info('BPC Registration attempt', ['user_id' => Auth::id(), 'data' => $request->all()]);

        // Get BPC category
        $category = CompetitionCategory::where('name', 'BPC')->firstOrFail();

        // Check if user already registered
        $existingRegistration = TeamRegistration::where('user_id', Auth::id())
            ->where('competition_category_id', $category->id)
            ->first();

        if ($existingRegistration) {
            return back()->withErrors([
                'general' => 'Anda sudah terdaftar untuk kompetisi Business Plan Competition dengan tim "' . $existingRegistration->tim_name . '". Silakan lihat detail pendaftaran Anda.'
            ]);
        }

        // Validate input
        $validated = $request->validate([
            // Team Information
            'tim_name' => [
                'required',
                'string',
                'min:3',
                'max:100',
                Rule::unique('team_registrations')
                    ->where('competition_category_id', $category->id)
            ],
            'asal_universitas' => 'required|string|min:5|max:200',
            'prodi_fakultas' => 'required|string|min:3|max:200',

            // Leader Information
            'leader_name' => 'required|string|min:3|max:100',
            'leader_nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                Rule::unique('team_registrations')
                    ->where('competition_category_id', $category->id)
            ],
            'leader_email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('team_registrations')
                    ->where('competition_category_id', $category->id)
            ],
            'leader_phone' => 'required|string|min:10|max:15',

            // Member 1 Information
            'member1_name' => 'required|string|min:3|max:100',
            'member1_nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                'different:leader_nim',
                Rule::unique('team_registrations')
                    ->where('competition_category_id', $category->id)
            ],
            'member1_email' => [
                'required',
                'email',
                'max:100',
                'different:leader_email',
                Rule::unique('team_registrations')
                    ->where('competition_category_id', $category->id)
            ],
            'member1_phone' => 'required|string|min:10|max:15|different:leader_phone',

            // Member 2 Information
            'member2_name' => 'required|string|min:3|max:100',
            'member2_nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                'different:leader_nim,member1_nim',
                Rule::unique('team_registrations')
                    ->where('competition_category_id', $category->id)
            ],
            'member2_email' => [
                'required',
                'email',
                'max:100',
                'different:leader_email,member1_email',
                Rule::unique('team_registrations')
                    ->where('competition_category_id', $category->id)
            ],
            'member2_phone' => 'required|string|min:10|max:15|different:leader_phone,member1_phone',

            // Member 3 Information
            'member3_name' => 'required|string|min:3|max:100',
            'member3_nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                'different:leader_nim,member1_nim,member2_nim',
                Rule::unique('team_registrations')
                    ->where('competition_category_id', $category->id)
            ],
            'member3_email' => [
                'required',
                'email',
                'max:100',
                'different:leader_email,member1_email,member2_email',
                Rule::unique('team_registrations')
                    ->where('competition_category_id', $category->id)
            ],
            'member3_phone' => 'required|string|min:10|max:15|different:leader_phone,member1_phone,member2_phone',

            // Documents
            'link_berkas' => 'required|url|max:500',
        ], [
            // Custom error messages
            'tim_name.unique' => 'Nama tim sudah digunakan untuk kompetisi BPC.',
            'leader_nim.unique' => 'NIM ketua sudah terdaftar di kompetisi BPC.',
            'leader_email.unique' => 'Email ketua sudah terdaftar di kompetisi BPC.',
            'member1_nim.unique' => 'NIM anggota 1 sudah terdaftar di kompetisi BPC.',
            'member1_email.unique' => 'Email anggota 1 sudah terdaftar di kompetisi BPC.',
            'member2_nim.unique' => 'NIM anggota 2 sudah terdaftar di kompetisi BPC.',
            'member2_email.unique' => 'Email anggota 2 sudah terdaftar di kompetisi BPC.',
            'member3_nim.unique' => 'NIM anggota 3 sudah terdaftar di kompetisi BPC.',
            'member3_email.unique' => 'Email anggota 3 sudah terdaftar di kompetisi BPC.',
        ]);

        try {
            DB::beginTransaction();

            // Generate registration number
            $registrationNumber = $this->generateRegistrationNumber($category->id);

            // Create registration
            $registration = TeamRegistration::create([
                'user_id' => Auth::id(),
                'competition_category_id' => $category->id, // Auto-set to BPC
                'registration_number' => $registrationNumber,
                'tim_name' => $validated['tim_name'],
                'asal_universitas' => $validated['asal_universitas'],
                'prodi_fakultas' => $validated['prodi_fakultas'],

                'leader_name' => $validated['leader_name'],
                'leader_nim' => $validated['leader_nim'],
                'leader_email' => $validated['leader_email'],
                'leader_phone' => $validated['leader_phone'],

                'member1_name' => $validated['member1_name'],
                'member1_nim' => $validated['member1_nim'],
                'member1_email' => $validated['member1_email'],
                'member1_phone' => $validated['member1_phone'],

                'member2_name' => $validated['member2_name'],
                'member2_nim' => $validated['member2_nim'],
                'member2_email' => $validated['member2_email'],
                'member2_phone' => $validated['member2_phone'],

                'member3_name' => $validated['member3_name'],
                'member3_nim' => $validated['member3_nim'],
                'member3_email' => $validated['member3_email'],
                'member3_phone' => $validated['member3_phone'],

                'link_berkas' => $validated['link_berkas'],

                'status' => 'pending',
                'registered_at' => now(),
            ]);

            DB::commit();

            Log::info('BPC Registration successful', [
                'user_id' => Auth::id(),
                'registration_id' => $registration->id,
                'team_name' => $validated['tim_name'],
                'registration_number' => $registrationNumber
            ]);

            return redirect()->route('competition.success', $registration->id)
                ->with('success', 'Pendaftaran Business Plan Competition berhasil! Nomor registrasi Anda: ' . $registrationNumber);
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('BPC Registration failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'general' => 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
            ]);
        }
    }

    /**
     * Generate unique registration number for BPC
     */
    private function generateRegistrationNumber($categoryId)
    {
        $year = date('Y');
        $month = date('m');

        // Count existing registrations for this month and category
        $count = TeamRegistration::where('competition_category_id', $categoryId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('BPC%s%s%04d', $year, $month, $count);
    }

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
            'category' => $registration->category,
            'registration' => $registration
        ]);
    }
}
