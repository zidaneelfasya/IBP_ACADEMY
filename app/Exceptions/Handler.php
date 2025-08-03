<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
   public function register(): void
    {
        $this->renderable(function (Throwable $e, $request) {
            if ($e instanceof HttpException && $e->getStatusCode() === 403) {
                if ($request->wantsJson()) {
                    return response()->json([
                        'message' => $e->getMessage() ?: 'Forbidden'
                    ], 403);
                }

                return Inertia::render('Error/403', [
                    'status' => 403,
                    'message' => $e->getMessage() ?: 'You are not authorized to access this page.'
                ])->toResponse($request)->setStatusCode(403);
            }
        });

        $this->reportable(function (Throwable $e) {
            //
        });
    }
}
