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

Route::get('/admin', function () {
    return Inertia::render('Admin');
})->middleware(['auth', 'verified'])->name('dashboard')->middleware('admin');
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');



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



Route::middleware(['auth', 'verified'])->group(function () {
    // Business Plan Competition (BPC) Registration
    Route::prefix('competition/bpc')->name('competition.bpc.')->group(function () {
        Route::get('/register', [BPCRegistrationController::class, 'create'])->name('register.create');
        Route::post('/register', [BPCRegistrationController::class, 'store'])->name('register.store');
    });

    // Business Case Competition (BCC) Registration
    Route::prefix('competition/bcc')->name('competition.bcc.')->group(function () {
        Route::get('/register', [BCCRegistrationController::class, 'create'])->name('register.create');
        Route::post('/register', [BCCRegistrationController::class, 'store'])->name('register.store');
    });

    // Common Competition Routes
    Route::get('/competition/success/{registration}', [CompetitionController::class, 'success'])->name('competition.success');

    // Common Team Registration Routes (for user's own registrations)
    // Route::prefix('my-registrations')->name('competition.register.')->group(function () {
    //     Route::get('/success/{id}', [TeamRegistrationController::class, 'success'])->name('success');
    //     Route::get('/', [TeamRegistrationController::class, 'show'])->name('show');
    //     Route::put('/{id}', [TeamRegistrationController::class, 'update'])->name('update');
    //     Route::delete('/{id}', [TeamRegistrationController::class, 'destroy'])->name('destroy');
});

Route::get('/user', function () {
    return Inertia::render('User/Template');
})->middleware(['auth', 'verified', 'user'])->name('dashboard.user');

Route::get('/user/dashboard', function () {
    return Inertia::render('User/Dashboard');
})->middleware(['auth', 'verified', 'user'])->name('dashboard.user');
Route::get('/user/profile', function () {
    return Inertia::render('User/Profile');

})->middleware(['auth', 'verified', 'user'])->name('dashboard.user.profile');





// route aprove logic




require __DIR__ . '/auth.php';
