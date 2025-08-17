<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseFile;
use App\Models\CompetitionCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
// use Illuminate\Support\Facades\Log;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::with(['files', 'creator', 'competitionCategory'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $competitionCategories = CompetitionCategory::active()->get();

        // Transform courses to match frontend expectations
        $materials = $courses->items();
        $formattedMaterials = collect($materials)->map(function ($course) {
            return [
                'id' => (string) $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'content' => $course->content,
                'videoUrl' => $course->video_url,
                'coverImage' => $course->cover_image ? asset('storage/' . $course->cover_image) : null,
                'category' => $course->competitionCategory ? $course->competitionCategory->name : 'Unknown',
                'competition_category_id' => $course->competition_category_id,
                'readCount' => $course->read_count,
                'isSemifinal' => $course->is_semifinal,
                'files' => $course->files->map(function ($file) {
                    return [
                        'id' => $file->id,
                        'name' => $file->original_name,
                        'type' => $file->file_type,
                        'size' => $file->file_size,
                        'path' => asset('storage/' . $file->file_path),
                    ];
                })->toArray(),
                'createdAt' => $course->created_at,
            ];
        });

        return Inertia::render('admin/Course/Index', [
            'materials' => $formattedMaterials->toArray(),
            'competitionCategories' => $competitionCategories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $competitionCategories = CompetitionCategory::active()->get();

        return Inertia::render('admin/Course/Create', [
            'competitionCategories' => $competitionCategories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'content' => 'required|string',
        'competition_category_id' => 'required|exists:competition_categories,id',
        'video_url' => 'nullable|url',
        'cover_image' => 'nullable|image|max:2048',
        'is_semifinal' => 'required|boolean',
        'files.*' => 'nullable|file|max:10240'
    ], [
            'title.required' => 'Judul materi harus diisi',
            'title.max' => 'Judul materi maksimal 255 karakter',
            'description.required' => 'Deskripsi harus diisi',
            'content.required' => 'Konten materi harus diisi',
            'competition_category_id.required' => 'Kategori lomba harus dipilih',
            'competition_category_id.exists' => 'Kategori lomba yang dipilih tidak valid',
            'video_url.url' => 'URL video harus valid',
            'cover_image.image' => 'File cover harus berupa gambar',
            'cover_image.max' => 'Ukuran cover maksimal 2MB',
            'files.*.max' => 'Ukuran file maksimal 10MB',
        ]);

        // Log::debug('Validated data:', $validated);

    DB::beginTransaction();



    try {
        $course = Course::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'content' => $validated['content'],
            'competition_category_id' => $validated['competition_category_id'],
            'video_url' => $validated['video_url'] ?? null,
            'is_semifinal' => $validated['is_semifinal'],
            'created_by' => auth()->id(),
            'is_active' => true,
            'slug' => \Illuminate\Support\Str::slug($validated['title']) . '-' . \Illuminate\Support\Str::random(6), 
            'read_count' => 0

        ]);

        // Log::debug('Course created:', $course->toArray());

        // Handle cover image
        if ($request->hasFile('cover_image')) {
            $coverImagePath = $request->file('cover_image')->store('courses/covers', 'public');
            $course->update(['cover_image' => $coverImagePath]);
            // Log::debug('Cover image stored at:', [$coverImagePath]);
        }

        // Handle files
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filePath = $file->store('courses/' . $course->id . '/files', 'public');

                $courseFile = CourseFile::create([
                    'course_id' => $course->id,
                    'original_name' => $file->getClientOriginalName(),
                    'file_name' => basename($filePath),
                    'file_path' => $filePath,
                    'file_type' => $this->getFileType($file->getMimeType()),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize()
                ]);

                // Log::debug('File stored:', $courseFile->toArray());
            }
        }

        DB::commit();

        return redirect()->route('courses.index')
            ->with('success', 'Course berhasil dibuat!');

    } catch (\Exception $e) {
        DB::rollBack();
        // Log::error('Error storing course: ' . $e->getMessage());
        // Log::error($e->getTraceAsString());

        return back()->withErrors([
            'error' => 'Terjadi kesalahan saat menyimpan course: ' . $e->getMessage()
        ]);
    }
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $course->load(['files', 'creator']);
        $course->incrementReadCount();

        return Inertia::render('admin/Course/Show', [
            'course' => $course
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        $course->load(['files', 'competitionCategory']);
        $competitionCategories = CompetitionCategory::active()->get();

        return Inertia::render('admin/Course/Edit', [
            'course' => $course,
            'competitionCategories' => $competitionCategories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'competition_category_id' => 'required|exists:competition_categories,id',
            'video_url' => 'nullable|url',
            'cover_image' => 'nullable|image|max:2048',
            'files.*' => 'nullable|file|max:10240',
            'is_semifinal' => 'boolean',
            'is_active' => 'boolean'
        ], [
            'title.required' => 'Judul materi harus diisi',
            'title.max' => 'Judul materi maksimal 255 karakter',
            'description.required' => 'Deskripsi harus diisi',
            'content.required' => 'Konten materi harus diisi',
            'competition_category_id.required' => 'Kategori lomba harus dipilih',
            'competition_category_id.exists' => 'Kategori lomba yang dipilih tidak valid',
            'video_url.url' => 'URL video harus valid',
            'cover_image.image' => 'File cover harus berupa gambar',
            'cover_image.max' => 'Ukuran cover maksimal 2MB',
            'files.*.max' => 'Ukuran file maksimal 10MB',
        ]);

        try {
            DB::beginTransaction();

            // Update course
            $course->update([
                'title' => $request->title,
                'description' => $request->description,
                'content' => $request->content,
                'competition_category_id' => $request->competition_category_id,
                'video_url' => $request->video_url,
                'is_semifinal' => $request->boolean('is_semifinal', false),
                'is_active' => $request->boolean('is_active', true)
            ]);

            // Handle cover image
            if ($request->hasFile('cover_image')) {
                // Delete old cover image
                if ($course->cover_image) {
                    Storage::disk('public')->delete($course->cover_image);
                }

                $coverImagePath = $request->file('cover_image')->store('courses/covers', 'public');
                $course->update(['cover_image' => $coverImagePath]);
            }

            // Handle new files
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $filePath = $file->store('courses/' . $course->id . '/files', 'public');

                    CourseFile::create([
                        'course_id' => $course->id,
                        'original_name' => $file->getClientOriginalName(),
                        'file_name' => basename($filePath),
                        'file_path' => $filePath,
                        'file_type' => $this->getFileType($file->getMimeType()),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize()
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('courses.index')
                ->with('success', 'Course berhasil diupdate!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat mengupdate course.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        try {
            DB::beginTransaction();

            // Delete cover image
            if ($course->cover_image) {
                Storage::disk('public')->delete($course->cover_image);
            }

            // Delete all files
            foreach ($course->files as $file) {
                Storage::disk('public')->delete($file->file_path);
                $file->delete();
            }

            // Delete course directory
            Storage::disk('public')->deleteDirectory('courses/' . $course->id);

            $course->delete();

            DB::commit();

            return redirect()->route('courses.index')
                ->with('success', 'Course berhasil dihapus!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus course.']);
        }
    }

    /**
     * Delete a specific file from course
     */
    public function deleteFile(CourseFile $file)
    {
        try {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();

            return back()->with('success', 'File berhasil dihapus!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus file.']);
        }
    }

    /**
     * Get courses for user interface (public view)
     */
    public function getUserCourses(Request $request)
    {
        $user = $request->user();

        // Check if user is semifinal participant
        $isSemifinalParticipant = $this->checkSemifinalStatus($user);

        $query = Course::where('is_active', true);

        // Filter courses based on user level
        if ($isSemifinalParticipant) {
            // Semifinal participants can see all courses
        } else {
            // General participants can only see non-semifinal courses
            $query->where('is_semifinal', false);
        }

        $courses = $query->orderBy('created_at', 'desc')->get();

        // Transform courses for user view
        $materials = $courses->map(function ($course) {
            return [
                'id' => (string) $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'isCompleted' => false, // TODO: Implement user progress tracking
                'thumbnail' => $course->cover_image ? asset('storage/' . $course->cover_image) : null,
                'fileTypes' => $course->files->pluck('file_type')->unique()->values()->toArray(),
            ];
        });

        return Inertia::render('User/Course', [
            'materials' => $materials,
        ]);
    }

    /**
     * Check if user is a semifinal participant
     */
    private function checkSemifinalStatus($user)
    {
        // Check if user has a team registration and has reached semifinal stage
        $teamRegistration = \App\Models\TeamRegistration::where('user_id', $user->id)
            ->where('status', 'approved')
            ->first();

        if (!$teamRegistration) {
            return false;
        }

        // Check if team has reached semifinal stage (order >= 3)
        $hasReachedSemifinal = \App\Models\ParticipantProgress::where('participant_id', $teamRegistration->id)
            ->whereHas('stage', function($q) {
                $q->where('order', '>=', 3); // Assuming stage 3+ is semifinal
            })
            ->where('status', 'approved')
            ->exists();

        return $hasReachedSemifinal;
    }

    /**
     * Get file type based on mime type
     */
    private function getFileType($mimeType)
    {
        if (strpos($mimeType, 'image/') === 0) {
            return 'image';
        } elseif (strpos($mimeType, 'video/') === 0) {
            return 'video';
        } elseif (in_array($mimeType, [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ])) {
            return 'document';
        } else {
            return 'other';
        }
    }
}
