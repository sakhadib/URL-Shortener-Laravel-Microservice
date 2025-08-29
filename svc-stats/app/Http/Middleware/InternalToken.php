<?php

namespace App\Http\Middleware;

use Closure;

class InternalToken
{
    public function handle($request, Closure $next)
    {
        if ($request->header('X-Internal-Token') !== config('app.internal_token')) {
            return response()->json(['message'=>'Forbidden'], 403);
        }
        return $next($request);
    }
}
