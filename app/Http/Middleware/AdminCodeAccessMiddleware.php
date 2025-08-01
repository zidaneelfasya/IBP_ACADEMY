<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class AdminCodeAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Jika sudah verifikasi, lanjut
        if (Session::get('admin_code_verified')) {
            return $next($request);
        }

        // Cek apakah sudah pernah generate
        if (!Session::has('admin_access_code')) {
            $code = Str::upper(Str::random(6)); // misalnya: AB3D9F
            Session::put('admin_access_code', $code);

            // Kirim email kode
            Mail::raw("Kode akses untuk halaman register admin: {$code}", function ($message) {
                $message->to('elfasyazidan99@gmail.com')
                        ->subject('Kode Akses Registrasi Admin');
            });
        }

        // Redirect ke halaman input kode
        return redirect()->route('admin-code.form');
    }
}
