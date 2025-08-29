<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RedirectController extends Controller
{
    public function go(Request $r, string $code) {
        $linkRes = Http::withHeaders(['X-Internal-Token'=>env('INTERNAL_TOKEN')])
            ->get(env('LINKS_URL')."/api/internal/links/by-code/{$code}");
        if (!$linkRes->successful()) abort(404);
        $link = $linkRes->json();

        try {
            Http::timeout(0.7)
              ->withHeaders(['X-Internal-Token'=>env('INTERNAL_TOKEN')])
              ->post(env('STATS_URL').'/api/internal/events/click', [
                'code'=>$code,
                'ts'=>now()->toIso8601String(),
                'ip_hash'=>hash('sha256', $r->ip() ?? ''),
                'ua_hash'=>hash('sha256', $r->userAgent() ?? ''),
                'referrer'=>$r->headers->get('referer', ''),
              ]);
        } catch (\Throwable $e) { /* ignore */ }

        return redirect()->away($link['target_url'], 302);
    }
}
