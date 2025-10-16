<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\TeamRegistration;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get user's team registration
        $team = TeamRegistration::with(['competitionCategory'])
            ->where('user_id', $user->id)
            ->first();

        if (!$team) {
            return Inertia::render('User/Invoices', [
                'team' => null,
                'payments' => []
            ]);
        }

        // Get all payments for this team, ordered by most recent first
        $payments = Payment::where('team_registration_id', $team->id)
            ->with(['verifier'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'bank_name' => $payment->bank_name,
                    'account_number' => $payment->account_number,
                    'account_holder' => $payment->account_holder,
                    'sender_account_number' => $payment->sender_account_number,
                    'sender_account_holder' => $payment->sender_account_holder,
                    'amount' => $payment->amount,
                    'payment_proof_path' => $payment->payment_proof_path ? asset('storage/' . $payment->payment_proof_path) : null,
                    'status' => $payment->status,
                    'admin_notes' => $payment->admin_notes,
                    'verified_at' => $payment->verified_at ? $payment->verified_at : null, // Already formatted if cast
                    'created_at' => $payment->created_at, // Already formatted if cast
                    'verifier_name' => $payment->verifier ? $payment->verifier->name : null
                ];
            });

        return Inertia::render('User/Invoices', [
            'team' => [
                'id' => $team->id,
                'tim_name' => $team->tim_name,
                'registration_number' => $team->registration_number,
                'leader_name' => $team->leader_name,
                'leader_nim' => $team->leader_nim,
                'leader_email' => $team->leader_email,
                'leader_phone' => $team->leader_phone,
                'leader_univ' => $team->leader_univ,
                'leader_fakultas' => $team->leader_fakultas,
                'member1_name' => $team->member1_name,
                'member1_nim' => $team->member1_nim,
                'member1_email' => $team->member1_email,
                'member1_phone' => $team->member1_phone,
                'member1_univ' => $team->member1_univ,
                'member1_fakultas' => $team->member1_fakultas,
                'member2_name' => $team->member2_name,
                'member2_nim' => $team->member2_nim,
                'member2_email' => $team->member2_email,
                'member2_phone' => $team->member2_phone,
                'member2_univ' => $team->member2_univ,
                'member2_fakultas' => $team->member2_fakultas,
                'competition_category' => [
                    'id' => $team->competitionCategory->id,
                    'name' => $team->competitionCategory->name,
                    'full_name' => $team->competitionCategory->full_name ?? $team->competitionCategory->name
                ]
            ],
            'payments' => $payments
        ]);
    }
}