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
    
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function progresses()
    {
        return $this->hasMany(ParticipantProgress::class, 'competition_stage_id');
    }

    /**
     * Get assignments for this stage
     */
    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    /**
     * Get active assignments for this stage
     */
    public function activeAssignments()
    {
        return $this->hasMany(Assignment::class)->where('is_active', true);
    }
}
