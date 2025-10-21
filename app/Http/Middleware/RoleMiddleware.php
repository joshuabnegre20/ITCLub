<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next, $role)
    {
        if (!Auth::check()) {
            return redirect('/logger'); // not logged in
        }

        if (Auth::user()->role !== $role) {
            return redirect('/HomePage'); // redirect if wrong role
        }

        return $next($request);
    }
}
