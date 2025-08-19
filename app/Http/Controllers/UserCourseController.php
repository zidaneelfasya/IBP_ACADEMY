<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;

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

        $teamRegistration = TeamRegistration::where('user_id', $user->id)->first();

        if (!$teamRegistration) {
            return Inertia::render('User/NoTeam');
        }

        // Cek participant progress
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

       $isSemifinalist = ParticipantProgress::where('participant_id', $teamRegistration->id)
        ->whereHas('stage', function($query) {
            $query->where('id', 2); // Assuming stage with ID 3 is semifinal
        })
        ->where('status', 'approved')
        ->exists();


      $generalCourses = Course::query()
    ->where('competition_category_id', $competitionCategoryId)
    ->where('is_semifinal', false)
    ->where('is_active', true)
    ->get()
    ->map(fn($course) => [
        'id'        => $course->id,
        'slug'      => $course->slug,
        'title'     => $course->title,
        'description'=> $course->description,
        'thumbnail' => $course->cover_image
            ? asset('storage/' . $course->cover_image)
            : asset('image/course/default.jpg'),
        'category'  => $course->competitionCategory->name,
    ]);

        // Get semifinal courses if user is semifinalist
       $semifinalCourses = Course::query()
    ->where('competition_category_id', $competitionCategoryId)
    ->where('is_semifinal', true)
    ->where('is_active', true)
    ->get()
    ->map(fn($course) => [
        'id'        => $course->id,
        'slug'      => $course->slug,
        'title'     => $course->title,
        'description'=> $course->description,
        'thumbnail' => $course->cover_image
            ? asset('storage/' . $course->cover_image)
            : asset('image/course/default.jpg'),
        'category'  => $course->competitionCategory->name,
    ]);


        return Inertia::render('User/Course', [
            'generalCourses' => $generalCourses,
            'semifinalCourses' => $semifinalCourses,
            'isSemifinalist' => $isSemifinalist,
        ]);
    }

   public function show(string $slug)
{
    $course = Course::with(['files', 'competitionCategory'])
                    ->where('slug', $slug)
                    ->where('is_active', true)
                    ->firstOrFail();

    // optional: increment read counter
    $course->incrementReadCount();



    return Inertia::render('User/Course-detail', [
        'course' => [
            'id'            => $course->id,
            'title'         => $course->title,

            'description'   => $course->description,
            'content'       => $course->content,
            'videoUrl'      => $course->video_url,        // YouTube link or null
           'cover' => $course->cover_image
                                ? asset('storage/' . $course->cover_image)
                                : asset('image/course/default.jpg'),
            'category'      => $course->competitionCategory->name,
            'readCount'     => $course->read_count,
            'uploadedBy' => $course->creator->name,        // nama uploader
            'uploadedAt' => $course->created_at->format('d M Y, H:i'),
            'files'         => $course->files->map(fn($f) => [
                'id'    => $f->id,
                'name'  => $f->original_name,
                'type'  => $f->mime_type,
                'size'  => $f->size_for_humans,
                'url'   => Storage::url($f->file_path),
            ]),
        ],
    ]);
}
}
