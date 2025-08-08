<?php

namespace App\Http\Middleware;

use App\Models\TeamRegistration;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTeamRegistration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Check if user already has a team registration
        if ($user && $user->teamRegistration()->exists()) {
            return redirect('/user');
        }

        return $next($request);
    }
}