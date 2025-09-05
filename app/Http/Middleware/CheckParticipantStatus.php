<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\TeamRegistration;
use App\Models\ParticipantProgress;
use Inertia\Inertia;

class CheckParticipantStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Hanya berlaku untuk user yang sudah login dan bukan admin
        if (!Auth::check() || Auth::user()->role === 'admin') {
            return $next($request);
        }

        $user = Auth::user();

        // Cari team registration user ini
        $teamRegistration = TeamRegistration::where('leader_email', $user->email)
            ->orWhere('member1_email', $user->email)
            ->orWhere('member2_email', $user->email)
            ->first();

        // dd($user->email);

        // Jika tidak ada team registration, lanjutkan
        if (!$teamRegistration) {
            return $next($request);
        }

        // Ambil status progress terbaru (berdasarkan stage order tertinggi)
        $latestProgress = ParticipantProgress::where('participant_id', $teamRegistration->id)
            ->join('competition_stages', 'participant_progress.competition_stage_id', '=', 'competition_stages.id')
            ->orderBy('competition_stages.order', 'desc')
            ->select('participant_progress.status')
            ->first();

        // Jika status terbaru adalah 'rejected', redirect ke halaman notPassed
        if ($latestProgress && $latestProgress->status === 'rejected') {
            return Inertia::render('User/notPassed');
        }

        return $next($request);
    }
}
