<?php

namespace App\Http\Middleware;

use App\Models\CompetitionStage;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;

class CheckRegistrationDeadline
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get registration stage
        $registrationStage = CompetitionStage::where('name', 'Registration')
            ->where('order', 1)
            ->first();

        // If no registration stage found, allow access (fallback)
        if (!$registrationStage) {
            return $next($request);
        }

        // Check if registration deadline has passed
        $now = Carbon::now();
        $deadline = Carbon::parse($registrationStage->end_date);

        if ($now->greaterThan($deadline)) {
            // Registration deadline has passed
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Registration deadline has passed',
                    'deadline' => $deadline->format('d M Y, H:i'),
                    'current_time' => $now->format('d M Y, H:i')
                ], 403);
            }

            // For web requests, redirect with deadline info to show modal
            $redirectRoute = 'business-case-competition'; // default

            // Determine appropriate redirect route based on current request
            if (str_contains($request->path(), 'bpc')) {
                $redirectRoute = 'business-plan-competition';
            } elseif (str_contains($request->path(), 'bcc')) {
                $redirectRoute = 'business-case-competition';
            }

            return redirect()->route($redirectRoute)
                ->with('deadline_expired', [
                    'deadline' => $deadline->format('d M Y, H:i'),
                    'current_time' => $now->format('d M Y, H:i'),
                    'message' => 'Registration deadline has passed'
                ]);
        }

        return $next($request);
    }
}
