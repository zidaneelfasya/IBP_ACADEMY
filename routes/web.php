<?php

use App\Http\Controllers\ExportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeamRegistrationController;
use App\Models\TeamRegistration;
use Illuminate\Foundation\Application;
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

Route::get('/user', function () {
    return Inertia::render('User/Template', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::put('/teams/{team}/status', [TeamRegistrationController::class, 'updateStatus'])
    ->name('team.update-status');

    Route::prefix('dashboard/team')->group(function () {

        Route::get('/', [TeamRegistrationController::class, 'index'])->name('team.index');
        Route::get('/export/team-registrations', [ExportController::class, 'exportTeamRegistrations'])
            ->name('export.team-registrations');
        // Route::put('/{team}', [TeamRegistrationController::class, 'updateStatus'])->name('team.edit');

        // Route::get('/create', [TeamController::class, 'create'])->name('team.create');
        // Route::post('/', [TeamController::class, 'store'])->name('team.store');
        // Route::put('/{team}', [TeamController::class, 'update'])->name('team.update');
        // Route::delete('/{team}', [TeamController::class, 'destroy'])->name('team.destroy');
    });
});

Route::get('/admin', function () {
    return Inertia::render('Admin');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
