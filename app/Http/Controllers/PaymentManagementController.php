<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\ParticipantProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentManagementController extends Controller
{
    /* ----------  LIST DATA  ---------- */
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
                'status' => $p->status,
                'admin_notes' => $p->admin_notes,
                'verified_at' => $p->verified_at ?
        (is_string($p->verified_at) ?
            \Carbon\Carbon::parse($p->verified_at)->format('Y-m-d H:i') :
            $p->verified_at->format('Y-m-d H:i')
        ) : null
            ]);

        $stats = [
            'pending'  => $payments->where('status', 'pending')->count(),
            'verified' => $payments->where('status', 'verified')->count(),
            'rejected' => $payments->where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/Payment/Index', [
            'payments' => $payments,
            'stats'    => $stats,
            'filters'  => ['search' => $searchTerm],
        ]);
    }

    /* ----------  VERIFIKASI  ---------- */
    public function approve($id)
    {
        $payment = Payment::findOrFail($id);

        // 1. update payment
        $payment->update([
            'status'      => 'verified',
            'verified_at' => now(),
            'verified_by' => auth()->id(),
        ]);

        // 2. catat progress (supaya tahap tercatap)
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

        return redirect()->back()->with('success', 'Pembayaran terverifikasi.');
    }

    /* ----------  TOLAK  ---------- */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'admin_notes' => 'nullable|string|max:500',
        ]);

        $payment = Payment::findOrFail($id);

        // 1. hanya update payment + catat alasan
        $payment->update([
            'status'      => 'rejected',
            'admin_notes' => $request->admin_notes,
            'verified_at' => now(),
            'verified_by' => auth()->id(),
        ]);



        return redirect()->back()->with('success', 'Pembayaran ditolak.');
    }

    /* ----------  DOWNLOAD BUKTI  ---------- */
    public function downloadProof($id)
    {
        $payment = Payment::findOrFail($id);
        return response()->download(storage_path('app/public/' . $payment->payment_proof_path));
    }
}
