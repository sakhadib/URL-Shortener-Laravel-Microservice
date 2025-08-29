<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RedirectController extends Controller
{
    public function go(Request $r, string $code) {
        $linkRes = Http::withHeaders(['X-Internal-Token'=>env('INTERNAL_TOKEN')])
            ->get(env('LINKS_URL')."/api/internal/links/by-code/{$code}");
        if (!$linkRes->successful()) abort(404);
        $link = $linkRes->json();

        try {
            $statsRes = Http::timeout(0.7)
              ->withHeaders(['X-Internal-Token'=>env('INTERNAL_TOKEN')])
              ->post(env('STATS_URL').'/api/internal/events/click', [
                    'code'=>$code,
                    'ts'=>now()->toIso8601String(),
                    'ip_hash'=>hash('sha256', $r->ip() ?? ''),
                    'ua_hash'=>hash('sha256', $r->userAgent() ?? ''),
                    'referrer'=>$r->headers->get('referer', ''),
              ]);
            
            $statsData = $statsRes->json();
            if (!isset($statsData['ok']) || $statsData['ok'] !== true) {
                return response()->json(['error'=>'Stats service error', 'msg' => $statsData['data'] ?? 'Unknown error', 'errors' => $statsData['errors'] ?? []], 503); 
            }
        } catch (\Throwable $e) {
            return response()->json(['error'=>'Stats service unreachable', 'details' => $e->getMessage()], 503);
        }

        return redirect()->away($link['target_url'], 302);
    }
}
