<?php

namespace App\Http\Controllers;

use App\Models\CompetitionCategory;
use App\Models\CompetitionStage;
use App\Models\ParticipantProgress;
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
                'general' => 'Anda sudah terdaftar untuk kompetisi Business Case Competition dengan tim "' . $existingRegistration->tim_name . '". Silakan lihat detail pendaftaran Anda.'
            ]);
        }

        // Prepare validation rules
        $validationRules = [
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

            // Members Information
            'members' => 'required|array|min:1|max:3', // Minimum 1 member (leader is separate), max 3 total (leader + 2 members)
            'members.*.name' => 'required|string|min:3|max:100',
            'members.*.nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                Rule::unique('team_registrations', 'leader_nim')
                    ->where('competition_category_id', $category->id)
            ],
            'members.*.email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('team_registrations', 'leader_email')
                    ->where('competition_category_id', $category->id)
            ],
            'members.*.phone' => 'required|string|min:10|max:15',

            // Documents
            'link_berkas' => 'required|url|max:500',
        ];

        // Custom error messages
        $customMessages = [
            'tim_name.unique' => 'Nama tim sudah digunakan untuk kompetisi BPC.',
            'leader_nim.unique' => 'NIM ketua sudah terdaftar di kompetisi BPC.',
            'leader_email.unique' => 'Email ketua sudah terdaftar di kompetisi BPC.',
            'members.*.nim.unique' => 'NIM anggota sudah terdaftar di kompetisi BPC.',
            'members.*.email.unique' => 'Email anggota sudah terdaftar di kompetisi BPC.',
        ];

        // Validate input
        $validated = $request->validate($validationRules, $customMessages);

        // Additional validation for unique NIMs, emails, and phones among members and leader
        $validator = validator($request->all(), $validationRules, $customMessages);

        // Check for duplicate NIMs among members
        $nims = array_map(function ($member) {
            return $member['nim'];
        }, $validated['members']);
        
        if (count($nims) !== count(array_unique($nims))) {
            $validator->errors()->add('members', 'NIM anggota tidak boleh sama dengan anggota lainnya');
        }

        // Check for duplicate emails among members
        $emails = array_map(function ($member) {
            return $member['email'];
        }, $validated['members']);
        
        if (count($emails) !== count(array_unique($emails))) {
            $validator->errors()->add('members', 'Email anggota tidak boleh sama dengan anggota lainnya');
        }

        // Check for duplicate phones among members
        $phones = array_map(function ($member) {
            return $member['phone'];
        }, $validated['members']);
        
        if (count($phones) !== count(array_unique($phones))) {
            $validator->errors()->add('members', 'Nomor telepon anggota tidak boleh sama dengan anggota lainnya');
        }

        // Check if any member NIM/email/phone matches leader's
        foreach ($validated['members'] as $index => $member) {
            if ($member['nim'] === $validated['leader_nim']) {
                $validator->errors()->add("members.$index.nim", 'NIM anggota tidak boleh sama dengan NIM ketua');
            }
            if ($member['email'] === $validated['leader_email']) {
                $validator->errors()->add("members.$index.email", 'Email anggota tidak boleh sama dengan email ketua');
            }
            if ($member['phone'] === $validated['leader_phone']) {
                $validator->errors()->add("members.$index.phone", 'Nomor telepon anggota tidak boleh sama dengan nomor telepon ketua');
            }
        }

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            DB::beginTransaction();

            // Generate registration number
            $registrationNumber = $this->generateRegistrationNumber($category->id);
            $registrasi_awal = CompetitionStage::where('order', 1)->first();

            // Prepare member data
            $memberData = [];
            foreach ($validated['members'] as $index => $member) {
                $memberNumber = $index + 1;
                $memberData["member{$memberNumber}_name"] = $member['name'];
                $memberData["member{$memberNumber}_nim"] = $member['nim'];
                $memberData["member{$memberNumber}_email"] = $member['email'];
                $memberData["member{$memberNumber}_phone"] = $member['phone'];
            }

            // Fill empty member slots with empty strings
            for ($i = count($validated['members']) + 1; $i <= 3; $i++) {
                $memberData["member{$i}_name"] = '';
                $memberData["member{$i}_nim"] = '';
                $memberData["member{$i}_email"] = '';
                $memberData["member{$i}_phone"] = '';
            }

            // Create registration
            $registration = TeamRegistration::create(array_merge([
                'user_id' => Auth::id(),
                'competition_category_id' => $category->id,
                'registration_number' => $registrationNumber,
                'tim_name' => $validated['tim_name'],
                'asal_universitas' => $validated['asal_universitas'],
                'prodi_fakultas' => $validated['prodi_fakultas'],

                'leader_name' => $validated['leader_name'],
                'leader_nim' => $validated['leader_nim'],
                'leader_email' => $validated['leader_email'],
                'leader_phone' => $validated['leader_phone'],

                'link_berkas' => $validated['link_berkas'],

                'status' => 'pending',
                'registered_at' => now(),
            ], $memberData));

            $progress = ParticipantProgress::create([
                'participant_id' => $registration->id,
                'competition_stage_id' => $registrasi_awal->id,
                'status' => 'in_progress',
            ]);

            DB::commit();

            Log::info('BPC Registration successful', [
                'user_id' => Auth::id(),
                'registration_id' => $registration->id,
                'team_name' => $validated['tim_name'],
                'registration_number' => $registrationNumber,
                'progress_id' => $progress->id,
            ]);

            
            return redirect()->route('competition.success', $registration->uuid)
            ->with('success', 'Pendaftaran Business Case Competition berhasil! Nomor registrasi Anda: ' . $registrationNumber);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('BPC Registration failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'general' => 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.'
            ])->withInput();
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
