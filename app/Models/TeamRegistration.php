<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class TeamRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'competition_category_id',
        'registration_number',
        'tim_name',
        'leader_name',
        'leader_nim',
        'leader_email',
        'leader_phone',
        'leader_univ',
        'leader_fakultas',
        'member1_name',
        'member1_nim',
        'member1_email',
        'member1_phone',
        'member1_univ',
        'member1_fakultas',
        'member2_name',
        'member2_nim',
        'member2_email',
        'member2_phone',
        'member2_univ',
        'member2_fakultas',
        'link_berkas',
        'status',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
        'registered_at',
        'cancelled_at'
    ];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->uuid = Str::uuid();
        });
    }
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    public function progress()
    {
        return $this->hasMany(ParticipantProgress::class, 'participant_id');
    }
    /**
     * Get the user that owns the team registration
     */

    public function assignmentSubmissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the competition category
     */
    public function competitionCategory(): BelongsTo
    {
        return $this->belongsTo(CompetitionCategory::class);
    }

    /**
     * Alias for competitionCategory for consistency
     */
    public function category(): BelongsTo
    {
        return $this->competitionCategory();
    }

    /**
     * Get all team members as array
     */
    public function getTeamMembersAttribute(): array
    {
        return [
            'leader' => [
                'name' => $this->leader_name,
                'nim' => $this->leader_nim,
                'email' => $this->leader_email,
                'phone' => $this->leader_phone,
                'role' => 'Leader'
            ],
            'member1' => [
                'name' => $this->member1_name,
                'nim' => $this->member1_nim,
                'email' => $this->member1_email,
                'phone' => $this->member1_phone,
                'role' => 'Member 1'
            ],
            'member2' => [
                'name' => $this->member2_name,
                'nim' => $this->member2_nim,
                'email' => $this->member2_email,
                'phone' => $this->member2_phone,
                'role' => 'Member 2'
            ],
            'member3' => [
                'name' => $this->member3_name,
                'nim' => $this->member3_nim,
                'email' => $this->member3_email,
                'phone' => $this->member3_phone,
                'role' => 'Member 3'
            ]
        ];
    }

    /**
     * Check if registration is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if registration is verified
     */
    public function isVerified(): bool
    {
        return $this->status === 'verified';
    }

    /**
     * Check if registration is rejected
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Scope for filtering by status
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by category
     */
    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('competition_category_id', $categoryId);
    }
}
