<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtUser
{
    public function handle($request, Closure $next)
    {
        $bearer = $request->bearerToken();
        if (!$bearer) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $decoded = (array) JWT::decode($bearer, new Key(env('JWT_SECRET'), 'HS256'));
            // subject (user id) is in "sub"
            $request->attributes->set('user_id', $decoded['sub'] ?? null);
            if (!$request->attributes->get('user_id')) {
                return response()->json(['message' => 'Invalid token (no sub)'], 401);
            }
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Invalid token', 'error' => $e->getMessage()], 401);
        }

        return $next($request);
    }
}
