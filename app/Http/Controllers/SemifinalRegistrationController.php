<?php

namespace App\Http\Controllers;

use App\Models\TeamRegistration;
use App\Models\Payment;
use App\Models\ParticipantProgress;
use App\Models\CompetitionStage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SemifinalRegistrationController extends Controller
{
    public function create()
{
    $team = TeamRegistration::with(['competitionCategory'])
        ->where('user_id', Auth::id())
        ->where('status', 'approved')
        ->first();

    if (!$team) {
        return redirect()
            ->route('dashboard.user')
            ->with('error', 'You do not have an approved team to register for the semifinal.');
    }

    /* 1 record payment terakhir (bisa null) */
    $payment = Payment::where('team_registration_id', $team->id)
                      ->latest('id')
                      ->first();



    /* kirim semua dalam 1 prop */
    return inertia('User/SemifinalRegistration', [
        'team'          => $team,
        'bankOptions'   => [   // hard-coded sesuai Anda
            ['id' => 'bca',    'name' => 'BCA',    'account_number' => '1662614763', 'account_holder' => 'MOCHAMMAD ARYASATYA'],
            ['id' => 'mandiri','name' => 'Mandiri','account_number' => '1290013105313','account_holder' => 'MOCHAMMAD ARYASATYA'],
            ['id' => 'bni',    'name' => 'BNI',    'account_number' => '1765217609', 'account_holder' => 'MOCHAMMAD ARYASATYA NUGRAHA'],
        ],
        'fixedAmount'   => 170_000,
        
        'payment'       => $payment?->only(['id','status','admin_notes']), // <-- ini

    ]);
}
    public function store(Request $request)
    {
        $request->validate([
            'team_id'               => 'required|exists:team_registrations,id',
            'bank_name'             => 'required|string|max:255',
            'account_number'        => 'required|string|max:255',
            'account_holder'        => 'required|string|max:255',
            'sender_account_number' => 'required|string|max:255',
            'sender_account_holder' => 'required|string|max:255',
            'payment_proof'         => 'required|file|mimes:jpeg,png,jpg,pdf|max:10240',
        ]);

        $proofPath = $request->file('payment_proof')->store('payment-proofs', 'public');

        Payment::create([
            'team_registration_id'  => $request->team_id,
            'bank_name'             => $request->bank_name,
            'account_number'        => $request->account_number,
            'account_holder'        => $request->account_holder,
            'sender_account_number' => $request->sender_account_number,
            'sender_account_holder' => $request->sender_account_holder,
            'amount'                => 150_000,
            'payment_proof_path'    => $proofPath,
            'status'                => 'pending',
        ]);

        return redirect()->route('dashboard.user')->with('success', 'Semifinal registration successful. Waiting for admin verification.');
    }
}
