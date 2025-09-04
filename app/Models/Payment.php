<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
    'team_registration_id',
    'bank_name',
    'account_number',
    'account_holder',
    'sender_account_number',
    'sender_account_holder',
    'amount',
    'payment_proof_path',
    'status',
    'admin_notes',
    'verified_at',
    'verified_by',
];

    public function teamRegistration()
    {
        return $this->belongsTo(TeamRegistration::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
    // app/Models/Payment.php
public function syncProgress()
{
    $statusMap = [
        'approved' => 'in_progress',
        'rejected' => 'rejected',
        'pending'  => 'not_started',
    ];

    \App\Models\ParticipantProgress::updateOrCreate(
        [
            'participant_id'       => $this->teamRegistration->id,
            'competition_stage_id' => 3,
        ],
        [
            'status'      => $statusMap[$this->status],
            'submitted_at'=> $this->status === 'pending' ? null : now(),
            'approved_at' => $this->status === 'approved' ? now() : null,
        ]
    );
}
}

