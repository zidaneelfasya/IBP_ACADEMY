<?php

use App\Http\Controllers\AllParticipantController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FinalParticipantController;
use App\Http\Controllers\PreliminaryParticipantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SemifinalParticipantController;
use App\Http\Controllers\TeamRegistrationController;
use App\Models\TeamRegistration;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/landing', function () {
    return Inertia::render('Landing', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/user/dashboard', function () {
    return Inertia::render('User/Template', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('dashboard.user')->middleware(['auth', 'verified'])->middleware('user');

Route::get('/user/dashboard', function () {
    return Inertia::render('User/Template', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('dashboard.user')->middleware(['auth', 'verified'])->middleware('user');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
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

    });
});

Route::get('/admin', function () {
    return Inertia::render('Admin');
})->middleware(['auth', 'verified'])->name('dashboard')->middleware('admin');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/business-plan-competition', function () {
    return Inertia::render('BusinessPlanCompetition');
})->name('contact');

Route::get('/business-case-competition', function () {
    return Inertia::render('BusinessCaseCompetition');
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



// route User

Route::get('/user', function () {
    return Inertia::render('User/Template');
})->middleware(['auth', 'verified', 'user'])->name('dashboard.user');
Route::get('/user/dashboard', function () {
    return Inertia::render('User/Template');
})->middleware(['auth', 'verified', 'user'])->name('dashboard.user');
Route::get('/user/profile', function () {
    return Inertia::render('User/Profile');
})->middleware(['auth', 'verified', 'user'])->name('dashboard.user');



// route aprove logic
use App\Http\Controllers\Admin\ParticipantProgressController;

Route::post('/admin/progress/{progress}/approve', [ParticipantProgressController::class, 'approve']);




require __DIR__ . '/auth.php';
