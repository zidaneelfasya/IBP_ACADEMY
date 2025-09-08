<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\ParticipantProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentManagementController extends Controller
{
    public function index(Request $request)
    {
        $searchTerm = $request->input('search', '');

        $payments = Payment::with(['teamRegistration.competitionCategory'])
            ->when($searchTerm, fn($q) =>
                $q->whereHas('teamRegistration', fn($q2) =>
                    $q2->where('tim_name', 'like', "%{$searchTerm}%"))
                ->orWhere('bank_name', 'like', "%{$searchTerm}%")
                ->orWhere('sender_account_holder', 'like', "%{$searchTerm}%")
            )
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'team_name' => $p->teamRegistration->tim_name,
                'competition_category' => $p->teamRegistration->competitionCategory->name,
                'bank_name' => $p->bank_name,
                'account_number' => $p->account_number,
                'account_holder' => $p->account_holder,
                'sender_account_number' => $p->sender_account_number,
                'sender_account_holder' => $p->sender_account_holder,
                'amount' => (int) $p->amount,
                'payment_proof_path' => asset('storage/' . $p->payment_proof_path),
                'progress_status' => optional($p->teamRegistration->progress()
                    ->where('competition_stage_id', 3)->first())->status ?? 'not_started',
            ]);

        $stats = [
            'need_review' => $payments->where('progress_status', 'not_started')->count(),
            'in_progress' => $payments->where('progress_status', 'in_progress')->count(),
            'rejected'    => $payments->where('progress_status', 'rejected')->count(),
        ];

        return Inertia::render('admin/Payment/Index', [
            'payments' => $payments,
            'stats'    => $stats,
            'filters'  => ['search' => $searchTerm],
        ]);
    }

    public function approve($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update(['status' => 'approved', 'verified_at' => now()]);

        ParticipantProgress::updateOrCreate(
            [
                'participant_id'       => $payment->teamRegistration->id,
                'competition_stage_id' => 3, // SEMIFINAL
            ],
            [
                'status'      => 'in_progress',
                'submitted_at'=> now(),
                'approved_at' => now(),
            ]
        );

        return redirect()->back()->with('success', 'Pembayaran disetujui.');
    }

    public function reject($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update(['status' => 'rejected', 'verified_at' => now()]);

        ParticipantProgress::updateOrCreate(
            [
                'participant_id'       => $payment->teamRegistration->id,
                'competition_stage_id' => 3,
            ],
            [
                'status'      => 'rejected',
                'submitted_at'=> null,
                'approved_at' => null,
            ]
        );

        return redirect()->back()->with('success', 'Pembayaran ditolak.');
    }

    public function downloadProof($id)
    {
        $payment = Payment::findOrFail($id);
        return response()->download(storage_path('app/public/' . $payment->payment_proof_path));
    }
}
