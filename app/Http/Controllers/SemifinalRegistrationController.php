<?php

namespace App\Http\Controllers;

use App\Models\TeamRegistration;
use App\Models\Payment;
use App\Models\ParticipantProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SemifinalRegistrationController extends Controller
{

public function create()
{
    // 1. eager-load relasi agar tidak undefined di frontend
    $team = TeamRegistration::with('competitionCategory')
        ->where('user_id', Auth::id())
        ->where('status', 'approved')        // pastikan konsisten dengan status tim
        ->first();

    if (!$team) {
        return redirect()
            ->route('dashboard.user')
            ->with('error', 'Anda tidak memiliki tim yang sudah disetujui untuk mendaftar semifinal.');
    }

    // 2. cek apakah tim sudah pernah mengirim pembayaran semifinal
    $alreadyRegistered = Payment::where('team_registration_id', $team->id)->exists();
    if ($alreadyRegistered) {
        return redirect()
            ->route('dashboard.user')
            ->with('info', 'Tim Anda sudah terdaftar untuk semifinal.');
    }

    // 3. kirim data ke Inertia
    return inertia('User/SemifinalRegistration', [
        'team'        => $team,
        'bankOptions' => [
            [
                'id'            => 'bca',
                'name'          => 'BCA',
                'account_number'=> '1662614763',
                'account_holder'=> 'MOCHAMMAD ARYASATYA',
            ],
            [
                'id'            => 'mandiri',
                'name'          => 'Mandiri',
                'account_number'=> '1290013105313',
                'account_holder'=> 'MOCHAMMAD ARYASATYA',
            ],
            [
                'id'            => 'bni',
                'name'          => 'BNI',
                'account_number'=> '1765217609',
                'account_holder'=> 'MOCHAMMAD ARYASATYA NUGRAHA',
            ],
        ],
        'fixedAmount' => 150_000,
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'team_id' => 'required|exists:team_registrations,id',
            'bank_name' => 'required|string',
            'account_number' => 'required|string',
            'account_holder' => 'required|string',
            'payment_proof' => 'required|file|mimes:jpeg,png,jpg,pdf|max:10240'
        ]);

        // Cek apakah tim sudah mendaftar semifinal
        $existingPayment = Payment::where('team_registration_id', $request->team_id)->first();
        if ($existingPayment) {
            return redirect()->back()->with('error', 'Tim ini sudah terdaftar untuk semifinal.');
        }

        // Upload bukti pembayaran
        $proofPath = $request->file('payment_proof')->store('payment-proofs', 'public');

        // Simpan data pembayaran
        $payment = Payment::create([
            'team_registration_id' => $request->team_id,
            'bank_name' => $request->bank_name,
            'account_number' => $request->account_number,
            'account_holder' => $request->account_holder,
            'amount' => 150000, // Amount tetap
            'payment_proof_path' => $proofPath,
            'status' => 'pending'
        ]);

        return redirect()->route('dashboard')->with('success', 'Pendaftaran semifinal berhasil. Menunggu verifikasi admin.');
    }
}
