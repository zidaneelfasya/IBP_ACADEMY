<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SimpleBPCController;
use App\Http\Controllers\CompetitionController;
use App\Http\Controllers\DashboardUserController;
use App\Http\Controllers\AllParticipantController;
use App\Http\Controllers\BCCRegistrationController;
use App\Http\Controllers\BPCRegistrationController;
use App\Http\Controllers\FinalParticipantController;
use App\Http\Controllers\TeamRegistrationController;
use App\Http\Controllers\ParticipantProfileController;
use App\Http\Controllers\SemifinalParticipantController;
use App\Http\Controllers\PreliminaryParticipantController;
use App\Http\Controllers\Admin\ParticipantProgressController;
use App\Http\Controllers\Admin\AssignmentController as AdminAssignmentController;
use App\Http\Controllers\Admin\AssignmentSubmissionController;
use App\Http\Controllers\Participant\AssignmentController as ParticipantAssignmentController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Landing', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/about', function () {
    return Inertia::render('About', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/timeline', function () {
    return Inertia::render('TimelinePage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');
    Route::get('/admin', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');
    Route::prefix('/admin/dashboard')->group(function () {
        Route::get('/', [AllParticipantController::class, 'index'])->name('team.index');

        Route::get('/participant', [AllParticipantController::class, 'index'])->name('team.index');

        Route::get('/export/team-registrations', [ExportController::class, 'exportTeamRegistrations'])
            ->name('export.team-registrations');
        Route::get('/export/team-registrations-simple', [ExportController::class, 'exportTeamRegistrationsSimple'])
            ->name('export.team-registrations-simple');
        Route::get('/registrasi-awal', [TeamRegistrationController::class, 'index'])->name('team.registration.index');
        Route::get('/preliminary', [PreliminaryParticipantController::class, 'index'])->name('team.preliminary.index');
        Route::get('/semifinal', [SemifinalParticipantController::class, 'index'])->name('team.preliminary.semifinal.index');
        Route::get('/final', [FinalParticipantController::class, 'index'])->name('team.preliminary.final.index');
        Route::put('/teams/{team}/status', [TeamRegistrationController::class, 'updateStatus'])
            ->name('team.update-status');
        Route::put('/teams/{team}', [TeamRegistrationController::class, 'update'])
            ->name('team.update');
        Route::put('/teams/{team}/reject', [TeamRegistrationController::class, 'updateStatusReject'])
            ->name('team.update-status-reject');
        Route::delete('/teams/{team}', [TeamRegistrationController::class, 'destroy'])
            ->name('team.destroy');
        Route::post('/admin/progress/{progress}/status', [TeamRegistrationController::class, 'updateStatus'])->name('progress.update-status');

        Route::post('/admin/progress/{progress}/approve', [ParticipantProgressController::class, 'approve'])->name('progress.approve');
        Route::post('/admin/progress/{progress}/reject', [TeamRegistrationController::class, 'updateStatusReject'])->name('progress.update-status-reject');
        
        // Course Management Routes - Manual
        Route::get('courses', [\App\Http\Controllers\Admin\CourseController::class, 'index'])->name('courses.index');
        Route::get('courses/create', [\App\Http\Controllers\Admin\CourseController::class, 'create'])->name('courses.create');
        Route::post('courses', [\App\Http\Controllers\Admin\CourseController::class, 'store'])->name('courses.store');
        Route::get('courses/{course}', [\App\Http\Controllers\Admin\CourseController::class, 'show'])->name('courses.show');
        Route::get('courses/{course}/edit', [\App\Http\Controllers\Admin\CourseController::class, 'edit'])->name('courses.edit');
        Route::put('courses/{course}', [\App\Http\Controllers\Admin\CourseController::class, 'update'])->name('courses.update');
        Route::delete('courses/{course}', [\App\Http\Controllers\Admin\CourseController::class, 'destroy'])->name('courses.destroy');
        Route::delete('courses/{course}/files/{file}', [\App\Http\Controllers\Admin\CourseController::class, 'deleteFile'])
            ->name('courses.files.destroy');
    });
});




Route::get('/business-plan-competition', function (Request $request) {
    $data = [];

    // Check if modal should be shown
    if ($request->get('showModal') === 'true' && $request->get('regId')) {
        $registration = \App\Models\TeamRegistration::with('category')
            ->where('id', $request->get('regId'))
            ->where('user_id', Auth::id())
            ->first();

        if ($registration) {
            $data['flash'] = [
                'showRegistrationModal' => true,
                'existingRegistration' => $registration->toArray(),
                'category' => $registration->category->toArray()
            ];
        }
    }

    return Inertia::render('BusinessPlanCompetition', $data);
})->name('business-plan-competition');

Route::get('/business-case-competition', function (Request $request) {
    $data = [];

    // Check if modal should be shown
    if ($request->get('showModal') === 'true' && $request->get('regId')) {
        $registration = \App\Models\TeamRegistration::with('category')
            ->where('id', $request->get('regId'))
            ->where('user_id', Auth::id())
            ->first();

        if ($registration) {
            $data['flash'] = [
                'showRegistrationModal' => true,
                'existingRegistration' => $registration->toArray(),
                'category' => $registration->category->toArray()
            ];
        }
    }

    return Inertia::render('BusinessCaseCompetition', $data);
})->name('business-case-competition');
Route::middleware('admin.code.access')->group(function () {
    Route::get('/register/admin', function () {
        return inertia('admin/Register'); // React form buat admin
    })->name('admin.register');
});

Route::get('/admin-code', function () {
    return inertia('AdminCode'); // Inertia + React Page
})->name('admin-code.form');

Route::post('/admin-code/verify', function (Request $request) {
    $request->validate([
        'code' => 'required|string',
    ]);
    if ($request->code === session('admin_access_code')) {
        session(['admin_code_verified' => true]);
        return redirect()->route('admin.register');
    }
    return back()->withErrors(['code' => 'Kode salah. Silakan cek email.']);
})->name('admin-code.verify');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



Route::middleware(['auth', 'verified', 'user', 'no-registration'])->group(function () {
    // Team Registration Routes
    Route::prefix('competition/bpc')->name('competition.bpc.')->group(function () {
        Route::get('/register', [BPCRegistrationController::class, 'create'])->name('register.create');
        Route::post('/register', [BPCRegistrationController::class, 'store'])->name('register.store');
    });

    // Business Case Competition (BCC) Registration
    Route::prefix('competition/bcc')->name('competition.bcc.')->group(function () {
        Route::get('/register', [BCCRegistrationController::class, 'create'])->name('register.create');
        Route::post('/register', [BCCRegistrationController::class, 'store'])->name('register.store');
    });

    // Route::get('/competition/success/{registration:uuid}', [CompetitionController::class, 'success'])
    //     ->name('competition.success');
});
Route::middleware(['auth', 'verified', 'user'])->group(function () {
 Route::get('/competition/success/{registration:uuid}', [CompetitionController::class, 'success'])
        ->name('competition.success');
});




Route::middleware(['auth', 'verified', 'user'])->prefix('user')->group(function () {
    Route::get('/', [DashboardUserController::class, 'index'])
        ->name('dashboard.user');
    Route::get('/dashboard', [DashboardUserController::class, 'index'])
        ->name('dashboard.user.dashboard');
    Route::get('/assignments', [\App\Http\Controllers\User\AssignmentController::class, 'index'])
        ->name('dashboard.user.tugas');
    Route::get('/assignments/{uuid}', [\App\Http\Controllers\User\AssignmentController::class, 'show'])
        ->name('dashboard.user.assignment.show')
        ->where('uuid', '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}');
    Route::get('/profile', [ParticipantProfileController::class, 'show'])
        ->name('dashboard.user.profile');
    Route::get('/course', [\App\Http\Controllers\Admin\CourseController::class, 'getUserCourses'])
        ->name('dashboard.user.course');
});

Route::fallback(function () {
    return inertia('Error/404', [
        'status' => 404,
        'message' => 'Halaman tidak ditemukan'
    ]);
});


//route assignment
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Assignment Management - Individual CRUD Routes
    Route::get('assignments', [AdminAssignmentController::class, 'index'])
        ->name('assignments.index');
    Route::get('assignments/create', [AdminAssignmentController::class, 'create'])
        ->name('assignments.create');
    Route::post('assignments', [AdminAssignmentController::class, 'store'])
        ->name('assignments.store');
    Route::get('assignments/{assignment}', [AdminAssignmentController::class, 'show'])
        ->name('assignments.show');
    Route::get('assignments/{assignment}/edit', [AdminAssignmentController::class, 'edit'])
        ->name('assignments.edit');
    Route::put('assignments/{assignment}', [AdminAssignmentController::class, 'update'])
        ->name('assignments.update');
    Route::delete('assignments/{assignment}', [AdminAssignmentController::class, 'destroy'])
        ->name('assignments.destroy');
    Route::patch('assignments/{assignment}/toggle-status', [AdminAssignmentController::class, 'toggleStatus'])
        ->name('assignments.toggle-status');
    Route::get('assignments-by-stage', [AdminAssignmentController::class, 'getByStage'])
        ->name('assignments.by-stage');

    // Assignment Submissions
    Route::prefix('assignments/{assignment}')->name('assignments.')->group(function () {
        Route::get('submissions', [AssignmentSubmissionController::class, 'index'])
            ->name('submissions.index');
        Route::get('submissions/{submission}', [AssignmentSubmissionController::class, 'show'])
            ->name('submissions.show');
        Route::patch('submissions/{submission}/grade', [AssignmentSubmissionController::class, 'grade'])
            ->name('submissions.grade');
        Route::post('submissions/bulk-grade', [AssignmentSubmissionController::class, 'bulkGrade'])
            ->name('submissions.bulk-grade');
        Route::get('submissions/export', [AssignmentSubmissionController::class, 'export'])
            ->name('submissions.export');
    });
});

// // Participant Routes for Assignments
// Route::middleware(['auth', 'verified'])->prefix('participant')->name('participant.')->group(function () {
//     Route::get('assignments', [ParticipantAssignmentController::class, 'index'])
//         ->name('assignments.index');
//     Route::get('assignments/{assignment}', [ParticipantAssignmentController::class, 'show'])
//         ->name('assignments.show');
//     Route::post('assignments/{assignment}/submit', [ParticipantAssignmentController::class, 'submit'])
//         ->name('assignments.submit');
//     Route::get('assignments/{assignment}/submission', [ParticipantAssignmentController::class, 'submission'])
//         ->name('assignments.submission');
// });






require __DIR__ . '/auth.php';
