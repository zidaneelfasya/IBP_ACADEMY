<?php

use App\Http\Controllers\AllParticipantController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FinalParticipantController;
use App\Http\Controllers\PreliminaryParticipantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SemifinalParticipantController;
use App\Http\Controllers\TeamRegistrationController;
use App\Http\Controllers\BPCRegistrationController;
use App\Http\Controllers\BCCRegistrationController;
use App\Http\Controllers\CompetitionController;
use App\Http\Controllers\SimpleBPCController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ParticipantProgressController;
use App\Http\Controllers\ParticipantProfileController;

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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');
    Route::prefix('/admin/dashboard')->group(function () {
        Route::get('/', [AllParticipantController::class, 'index'])->name('team.index');
        Route::get('/export/team-registrations', [ExportController::class, 'exportTeamRegistrations'])
            ->name('export.team-registrations');
        Route::get('/registrasi-awal', [TeamRegistrationController::class, 'index'])->name('team.registration.index');
        Route::get('/preliminary', [PreliminaryParticipantController::class, 'index'])->name('team.preliminary.index');
        Route::get('/semifinal', [SemifinalParticipantController::class, 'index'])->name('team.preliminary.semifinal.index');
        Route::get('/final', [FinalParticipantController::class, 'index'])->name('team.preliminary.final.index');
        Route::put('/teams/{team}/status', [TeamRegistrationController::class, 'updateStatus'])
            ->name('team.update-status');
        Route::post('/admin/progress/{progress}/status', [TeamRegistrationController::class, 'updateStatus'])->name('progress.update-status');
        Route::post('/admin/progress/{progress}/approve', [ParticipantProgressController::class, 'approve'])-> name('progress.approve');



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



Route::middleware(['auth', 'verified', 'user'])->group(function () {
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


    Route::get('/competition/success/{registration}', [CompetitionController::class, 'success'])->name('competition.success');

    // Common Team Registration Routes (for user's own registrations)
    // Route::prefix('my-registrations')->name('competition.register.')->group(function () {
    //     Route::get('/success/{id}', [TeamRegistrationController::class, 'success'])->name('success');
    //     Route::get('/', [TeamRegistrationController::class, 'show'])->name('show');
    //     Route::put('/{id}', [TeamRegistrationController::class, 'update'])->name('update');
    //     Route::delete('/{id}', [TeamRegistrationController::class, 'destroy'])->name('destroy');
});


Route::middleware(['auth', 'verified', 'user'])->prefix('user')->group(function () {
    Route::get('/', fn() => Inertia::render('User/Template'))->name('dashboard.user');
    Route::get('/dashboard', fn() => Inertia::render('User/Dashboard'))->name('dashboard.user.dashboard');
    Route::get('/tugas', fn() => Inertia::render('User/Tugas'))->name('dashboard.user.tugas');
    Route::get('/profile', [ParticipantProfileController::class, 'show'])
        ->name('dashboard.user.profile');
});











require __DIR__ . '/auth.php';
