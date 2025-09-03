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
}

