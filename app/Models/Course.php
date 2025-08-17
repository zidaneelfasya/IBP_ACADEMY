<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'content',
        'video_url',
        'cover_image',
        'competition_category_id',
        'read_count',
        'is_active',
        'is_semifinal',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_semifinal' => 'boolean',
        'read_count' => 'integer',
    ];

    /**
     * Get the competition category that owns the course
     */
    public function competitionCategory(): BelongsTo
    {
        return $this->belongsTo(CompetitionCategory::class);
    }

    /**
     * Get the user who created this course
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the files for this course
     */
    public function files(): HasMany
    {
        return $this->hasMany(CourseFile::class);
    }

    /**
     * Increment the read count
     */
    public function incrementReadCount()
    {
        $this->increment('read_count');
    }

    /**
     * Scope to get only semifinal courses
     */
    public function scopeSemifinal($query)
    {
        return $query->where('is_semifinal', true);
    }

    /**
     * Scope to get only general courses (non-semifinal)
     */
    public function scopeGeneral($query)
    {
        return $query->where('is_semifinal', false);
    }

    /**
     * Scope to get courses based on user level
     */
    public function scopeForUserLevel($query, $isSemifinalParticipant = false)
    {
        if ($isSemifinalParticipant) {
            return $query; // Semifinal participants can see all courses
        }
        
        return $query->where('is_semifinal', false); // General participants see only non-semifinal
    }
}
