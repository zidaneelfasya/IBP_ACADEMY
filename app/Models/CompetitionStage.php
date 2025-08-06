<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompetitionStage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'order',
        'start_date',
        'end_date',
    ];

    public function progresses()
    {
        return $this->hasMany(ParticipantProgress::class, 'competition_stage_id');
    }
}
