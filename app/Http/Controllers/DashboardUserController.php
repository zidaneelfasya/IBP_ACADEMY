<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CompetitionStage;
use App\Models\TeamRegistration;
use App\Models\Assignment;
use App\Models\Payment;               // ➕ tambahkan
use Illuminate\Support\Facades\Auth;
use App\Models\ParticipantProgress;
use Illuminate\Support\Facades\Log;

class DashboardUserController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        try {
            $team = TeamRegistration::with(['competitionCategory', 'progress.stage'])
                ->where('user_id', $user->id)
                ->first();

            if (!$team) {
                return Inertia::render('User/NoTeam', [
                    'bpcRoute' => route('competition.bpc.register.create'),
                    'bccRoute' => route('competition.bcc.register.create'),
                ]);
            }

            $stages       = CompetitionStage::orderBy('order')->get();
            $currentDate  = now();
            $stageStatuses= [];
            $rejectedStages=[];
            $approvedStages=[];

            foreach ($team->progress as $progress) {
                $sid = $progress->competition_stage_id;
                if (!isset($stageStatuses[$sid])) {
                    $stageStatuses[$sid]=[
                        'status'     => $progress->status,
                        'created_at' => $progress->created_at,
                        'feedback'   => $progress->feedback,
                    ];
                    if ($progress->status==='rejected') {
                        $rejectedStages[$sid]=['name'=>$progress->stage->name,'feedback'=>$progress->feedback];
                    } elseif ($progress->status==='approved') {
                        $approvedStages[$sid] =['name'=>$progress->stage->name,'feedback'=>$progress->feedback];
                    }
                }
            }

            $currentStage = $stages->first(fn($s)=>
                !isset($stageStatuses[$s->id]) ||
                $stageStatuses[$s->id]['status'] !== 'approved'
            ) ?? $stages->last();

            $processedStages = $stages->map(function ($stage) use ($currentDate,$stageStatuses,$currentStage) {
                $end   = new \DateTime($stage->end_date);
                $daysL = $currentDate > $end ? 0 : $currentDate->diff($end)->days;
                return [
                    ...$stage->toArray(),
                    'days_left'  => $daysL,
                    'is_urgent'  => $daysL <= 7 && $daysL >= 0,
                    'status'     => $stageStatuses[$stage->id]['status'] ?? 'not_started',
                    'is_current' => $stage->id === $currentStage->id,
                ];
            });

            /* 1. cek pembayaran terverifikasi */
            $paymentVerified = Payment::where('team_registration_id', $team->id)
                                      ->where('status', 'verified')
                                      ->exists();

            /* 2. daftar grup WA (semua stage) */
            $whatsappGroups = [
                1 => ['bpc'=>'https://chat.whatsapp.com/FIyeNmB7LIR6tJc3IGJmk5',
                      'bcc'=>'https://chat.whatsapp.com/FjxPVlMWAqW1nqdHZtEJcs'],
                 2 => [
        'bpc' => 'https://chat.whatsapp.com/FZhRwyoGwTB5I4RGu7S10A?mode=ems_copy_t',
        'bcc' => 'https://chat.whatsapp.com/CFLswvxGMHqLogcPL2az1U?mode=ems_copy_t',
    ],
                3 => ['bpc'=>'https://chat.whatsapp.com/EXAMPLE_BPC_LINK_3',
                      'bcc'=>'https://chat.whatsapp.com/EXAMPLE_BCC_LINK_3'],
                4 => ['bpc'=>'https://chat.whatsapp.com/EXAMPLE_BPC_LINK_4',
                      'bcc'=>'https://chat.whatsapp.com/EXAMPLE_BCC_LINK_4'],
            ];

            /* 3. hilangkan grup stage-2 kalau belum verified */
            if (!$paymentVerified) {
                unset($whatsappGroups[2]);
            }

            /* 4. tugas yang aktif di stage berjalan */
            $submittedIds = \App\Models\AssignmentSubmission::where('team_registration_id', $team->id)
                                ->pluck('assignment_id')
                                ->toArray();

            $assignments = Assignment::where('is_active', true)
                ->where('competition_stage_id', $currentStage->id)
                ->where(function ($q) use ($team) {
                    $q->where('competition_category_id', $team->competition_category_id)
                      ->orWhereNull('competition_category_id');
                })
                ->get()
                ->map(fn ($a) => [
                    'id'                    => $a->id,
                    'competition_stage_id'  => $a->competition_stage_id,
                    'competition_category_id'=>$a->competition_category_id,
                    'title'                 => $a->title,
                    'description'           => $a->description,
                    'instructions'          => $a->instructions,
                    'deadline'              => $a->deadline,
                    'deadline_formatted'    => $a->deadline->format('M d, Y H:i'),
                    'is_active'             => $a->is_active,
                    'is_submitted'          => in_array($a->id, $submittedIds),
                ]);


            $payment = Payment::where('team_registration_id', $team->id)
                               ->latest('id')
                               ->first();

            return Inertia::render('User/Dashboard', [
                'stages'            => $processedStages,
                'currentProgress'   => $team->progress,
                'team'              => [
                    'id'              => $team->id,
                    'name'            => $team->team_name,
                    'category_id'     => $team->competition_category_id,
                    'category_name'   => $team->competitionCategory?->name ?? 'Unknown Category',
                    'rejected_stages' => $rejectedStages,
                    'approved_stages' => $approvedStages,
                    'current_stage_id'=> $currentStage->id,
                ],
                'urgentSubmissions' => $processedStages->filter(fn($s) => $s['is_urgent'])->values(),
                'whatsapp_groups'   => $whatsappGroups,
                'assignments'       => $assignments,
                'payment'           => $payment?->only(['status','admin_notes']),



            ]);
        } catch (\Exception $e) {
            Log::error('DashboardUserController@index: '.$e->getMessage());
            return Inertia::render('Error', ['message' => 'Failed to load dashboard.']);
        }
    }
}
