<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParticipantProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'participant_id',
        'competition_stage_id',
        'status',
        'notes',
        'submitted_at',
        'approved_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function participant()
    {
        return $this->belongsTo(TeamRegistration::class, 'participant_id');
    }

    public function stage()
    {
        return $this->belongsTo(CompetitionStage::class, 'competition_stage_id');
    }
}
