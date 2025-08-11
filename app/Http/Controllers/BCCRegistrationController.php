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

class BCCRegistrationController extends Controller
{
    /**
     * Show BCC registration form
     */
     public function create()
    {
        $category = CompetitionCategory::where('name', 'BCC')->firstOrFail();

        $existingRegistration = TeamRegistration::where('user_id', Auth::id())
            ->where('competition_category_id', $category->id)
            ->first();

        if ($existingRegistration) {
            return redirect()->route('business-case-competition', [
                'showModal' => 'true',
                'regId' => $existingRegistration->id
            ]);
        }

       return Inertia::render('Competition/BCCRegistration', [
            'category' => $category,
            'existingRegistration' => null,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    /**
     * Store BPC registration
     */
    public function store(Request $request)
    {
          Log::info('BCC Registration attempt', ['user_id' => Auth::id()]);

        $category = CompetitionCategory::where('name', 'BCC')->firstOrFail();
        $bccCategory = CompetitionCategory::where('name', 'BCC')->firstOrFail();
        $bpcCategory = CompetitionCategory::where('name', 'BPC')->firstOrFail();

        // Check if user already registered
        $existingRegistration = TeamRegistration::where('user_id', Auth::id())
        ->whereIn('competition_category_id', [$bccCategory->id, $bpcCategory->id])
        ->first();

    if ($existingRegistration) {
        $competitionName = $existingRegistration->competitionCategory->name;
        return back()->withErrors([
            'general' => "You are already registered for $competitionName and cannot register for both BCC and BPC"
        ]);
    }

        // Validation rules matching frontend structure
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

            // Leader Information
            'leader_name' => 'required|string|min:3|max:100',
            'leader_nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                Rule::unique('team_registrations', 'leader_nim')
                    ->where('competition_category_id', $category->id)
            ],
            'leader_email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('team_registrations', 'leader_email')
                    ->where('competition_category_id', $category->id)
            ],
            'leader_phone' => 'required|string|min:10|max:15',
            'leader_univ' => 'required|string|min:5|max:200',
            'leader_fakultas' => 'required|string|min:3|max:200', // Added leader faculty

            // Members Information
            'member1.name' => 'required|string|min:3|max:100',
            'member1.nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                Rule::unique('team_registrations', 'member1_nim')
                    ->where('competition_category_id', $category->id)
            ],
            'member1.email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('team_registrations', 'member1_email')
                    ->where('competition_category_id', $category->id)
            ],
            'member1.phone' => 'required|string|min:10|max:15',
            'member1.univ' => 'required|string|min:5|max:200',
            'member1.fakultas' => 'required|string|min:3|max:200', // Added member1 faculty

            'member2.name' => 'required|string|min:3|max:100',
            'member2.nim' => [
                'required',
                'string',
                'min:5',
                'max:20',
                Rule::unique('team_registrations', 'member2_nim')
                    ->where('competition_category_id', $category->id)
            ],
            'member2.email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('team_registrations', 'member2_email')
                    ->where('competition_category_id', $category->id)
            ],
            'member2.phone' => 'required|string|min:10|max:15',
            'member2.univ' => 'required|string|min:5|max:200',
            'member2.fakultas' => 'required|string|min:3|max:200', // Added member2 faculty

            // Documents
            'link_berkas' => 'required|url|max:500',
        ];

        // Custom error messages
        $customMessages = [
            'tim_name.unique' => 'Team name already used for BPC competition',
            'leader_nim.unique' => 'Leader NIM already registered',
            'leader_email.unique' => 'Leader email already registered',
            'member1.nim.unique' => 'Member 1 NIM already registered',
            'member1.email.unique' => 'Member 1 email already registered',
            'member2.nim.unique' => 'Member 2 NIM already registered',
            'member2.email.unique' => 'Member 2 email already registered',
        ];

        // Validate input
        $validated = $request->validate($validationRules, $customMessages);

        // Additional custom validation
        $validator = validator($request->all(), $validationRules, $customMessages);

        // Check for duplicates between leader and members
        if ($validated['member1']['nim'] === $validated['leader_nim']) {
            $validator->errors()->add('member1.nim', 'Member 1 NIM cannot be same as leader');
        }
        if ($validated['member2']['nim'] === $validated['leader_nim']) {
            $validator->errors()->add('member2.nim', 'Member 2 NIM cannot be same as leader');
        }
        if ($validated['member1']['nim'] === $validated['member2']['nim']) {
            $validator->errors()->add('member2.nim', 'Members cannot have same NIM');
        }

        // Similar checks for email and phone
        if ($validated['member1']['email'] === $validated['leader_email']) {
            $validator->errors()->add('member1.email', 'Member 1 email cannot be same as leader');
        }
        if ($validated['member2']['email'] === $validated['leader_email']) {
            $validator->errors()->add('member2.email', 'Member 2 email cannot be same as leader');
        }
        if ($validated['member1']['email'] === $validated['member2']['email']) {
            $validator->errors()->add('member2.email', 'Members cannot have same email');
        }

        if ($validated['member1']['phone'] === $validated['leader_phone']) {
            $validator->errors()->add('member1.phone', 'Member 1 phone cannot be same as leader');
        }
        if ($validated['member2']['phone'] === $validated['leader_phone']) {
            $validator->errors()->add('member2.phone', 'Member 2 phone cannot be same as leader');
        }
        if ($validated['member1']['phone'] === $validated['member2']['phone']) {
            $validator->errors()->add('member2.phone', 'Members cannot have same phone');
        }

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            DB::beginTransaction();

            // Generate registration number
            $registrationNumber = $this->generateRegistrationNumber($category->id);
            $registrasi_awal = CompetitionStage::where('order', 1)->first();

            // Create registration with member data
            $registration = TeamRegistration::create([
                'user_id' => Auth::id(),
                'competition_category_id' => $category->id,
                'registration_number' => $registrationNumber,
                'tim_name' => $validated['tim_name'],

                // Leader info
                'leader_name' => $validated['leader_name'],
                'leader_nim' => $validated['leader_nim'],
                'leader_email' => $validated['leader_email'],
                'leader_phone' => $validated['leader_phone'],
                'leader_univ' => $validated['leader_univ'],
                'leader_fakultas' => $validated['leader_fakultas'],

                // Member 1 info
                'member1_name' => $validated['member1']['name'],
                'member1_nim' => $validated['member1']['nim'],
                'member1_email' => $validated['member1']['email'],
                'member1_phone' => $validated['member1']['phone'],
                'member1_univ' => $validated['member1']['univ'],
                'member1_fakultas' => $validated['member1']['fakultas'],

                // Member 2 info
                'member2_name' => $validated['member2']['name'],
                'member2_nim' => $validated['member2']['nim'],
                'member2_email' => $validated['member2']['email'],
                'member2_phone' => $validated['member2']['phone'],
                'member2_univ' => $validated['member2']['univ'],
                'member2_fakultas' => $validated['member2']['fakultas'],

                'link_berkas' => $validated['link_berkas'],
                'status' => 'pending',
                'registered_at' => now(),
            ]);

            // Create initial progress
            ParticipantProgress::create([
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
            ]);

            return redirect()->route('competition.success', $registration->uuid)
                ->with('success', 'Registration successful! Your registration number: ' . $registrationNumber);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('BPC Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'general' => 'Registration failed. Please check your previous input and try again.'
            ])->withInput();
        }
    }

    /**
     * Generate unique registration number
     */
     private function generateRegistrationNumber($categoryId)
    {
        $year = date('Y');
        $month = date('m');

        $count = TeamRegistration::where('competition_category_id', $categoryId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('BCC%s%s%04d', $year, $month, $count);
    }
}

