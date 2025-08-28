<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Carbon\Carbon;

class Assignment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'uuid',
        'competition_stage_id',
        'competition_category_id',
        'title',
        'description',
        'instructions',
        'deadline',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();
        
        // Cascade delete submissions when assignment is deleted
        static::deleting(function ($assignment) {
            $assignment->submissions()->delete();
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    /**
     * Get the columns that should receive a unique identifier.
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Get the competition stage that owns the assignment
     */
    public function competitionStage()
    {
        return $this->belongsTo(CompetitionStage::class, 'competition_stage_id');
    }

    /**
     * Get the competition category that owns the assignment
     */
    public function competitionCategory()
    {
        return $this->belongsTo(CompetitionCategory::class, 'competition_category_id');
    }

    /**
     * Alias for competitionStage for consistency
     */
    public function competition_stage()
    {
        return $this->competitionStage();
    }

    /**
     * Alias for competitionCategory for consistency
     */
    public function competition_category()
    {
        return $this->competitionCategory();
    }

    /**
     * Get the admin who created the assignment
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all submissions for this assignment
     */
    public function submissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    /**
     * Check if assignment is overdue
     */
    public function isOverdue(): bool
    {
        return $this->deadline < now();
    }

    /**
     * Check if assignment is still open for submission
     */
    public function isOpen(): bool
    {
        return $this->is_active && !$this->isOverdue();
    }

    /**
     * Get time remaining until deadline
     */
    public function getTimeRemainingAttribute(): string
    {
        if ($this->isOverdue()) {
            return 'Overdue';
        }

        return $this->deadline->diffForHumans();
    }

    /**
     * Scope for active assignments
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for assignments by stage and category
     */
    public function scopeByStageAndCategory($query, $stageId, $categoryId = null)
    {
        $query->where('competition_stage_id', $stageId);
        
        if ($categoryId) {
            $query->where('competition_category_id', $categoryId);
        }
        
        return $query;
    }

    /**
     * Scope for assignments by category
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('competition_category_id', $categoryId);
    }
}
