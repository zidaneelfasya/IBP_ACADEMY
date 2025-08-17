<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ParticipantProgress;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\TeamRegistration;

class UserCourseController extends Controller
{
   public function index()
    {
        $user = Auth::user();

        // Get team registration for current user
        $teamRegistration = TeamRegistration::where('user_id', $user->id)->first();

        if (!$teamRegistration) {
            return Inertia::render('User/Course', [
                'generalCourses' => [],
                'semifinalCourses' => [],
                'isSemifinalist' => false,
                'message' => 'You are not registered in any competition yet.'
            ]);
        }

        // Get participant progress
        $participantProgress = ParticipantProgress::where('participant_id', $teamRegistration->id)->first();

        if (!$participantProgress) {
            return Inertia::render('User/Course', [
                'generalCourses' => [],
                'semifinalCourses' => [],
                'isSemifinalist' => false,
                'message' => 'No progress record found.'
            ]);
        }

        // Get competition category from team registration
        $competitionCategoryId = $teamRegistration->competition_category_id;

        // Check if user is semifinalist (based on competition stage)
        $isSemifinalist = $participantProgress->competition_stage_id >= 2; // Sesuaikan dengan stage semifinal Anda

       $generalCourses = Course::query()
    ->where('competition_category_id', $competitionCategoryId)
    ->where('is_semifinal', false)
    ->where('is_active', true)
    ->get()
    ->map(function ($course) {
        return [
            'id' => $course->id,
            'title' => $course->title,
            'description' => $course->description,
            'thumbnail' => $course->cover_image
                ? asset('storage/' . $course->cover_image) // Konversi ke full URL
                : asset('image/course/default.jpg'), // Fallback jika tidak ada
        ];
    });

        // Get semifinal courses if user is semifinalist
        $semifinalCourses = collect([]);
        if ($isSemifinalist) {
            $semifinalCourses = Course::query()
                ->where('competition_category_id', $competitionCategoryId)
                ->where('is_semifinal', true)
                ->where('is_active', true)
                ->select(['id', 'title', 'description', 'cover_image', 'competition_category_id'])
                ->get()
                ->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'title' => $course->title,
                        'description' => $course->description,
                        'thumbnail' => $course->cover_image,
                    ];
                });
        }

        return Inertia::render('User/Course', [
            'generalCourses' => $generalCourses,
            'semifinalCourses' => $semifinalCourses,
            'isSemifinalist' => $isSemifinalist,
        ]);
    }
}
