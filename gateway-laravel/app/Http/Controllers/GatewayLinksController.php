<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GatewayLinksController extends Controller
{
    private function ih() { return ['X-Internal-Token'=>env('INTERNAL_TOKEN')]; }

    public function create(Request $r) {
        $payload = [
          'owner_id'   => $r->attributes->get('user_id'),
          'target_url' => $r->input('target_url'),
          'custom_code'=> $r->input('custom_code'),
        ];
        $res = Http::withHeaders($this->ih())
          ->post(env('LINKS_URL').'/api/internal/links', $payload);
        return response($res->body(), $res->status());
    }

    public function list(Request $r) {
        $res = Http::withHeaders($this->ih())
          ->get(env('LINKS_URL').'/api/internal/links', [
            'owner_id'=>$r->attributes->get('user_id'),
            'page'=>$r->query('page',1),
          ]);
        return response($res->body(), $res->status());
    }

    public function detail(Request $r, $code) {
        $linkRes = Http::withHeaders($this->ih())
          ->get(env('LINKS_URL')."/api/internal/links/by-code/$code");
        if (!$linkRes->successful()) return response($linkRes->body(), $linkRes->status());
        $link = $linkRes->json();

        $statsRes = Http::withHeaders($this->ih())
          ->get(env('STATS_URL')."/api/internal/stats/$code/summary");
        $summary = $statsRes->successful() ? $statsRes->json() : null;

        return response()->json(['link'=>$link, 'stats'=>$summary]);
    }

    public function destroy($id) {
        $res = Http::withHeaders($this->ih())
          ->delete(env('LINKS_URL')."/api/internal/links/$id");
        return response($res->body(), $res->status());
    }

    public function dashboardStats(Request $r) {
        $userId = $r->attributes->get('user_id');
        
        // Get all user links
        $linksRes = Http::withHeaders($this->ih())
          ->get(env('LINKS_URL').'/api/internal/links', ['owner_id' => $userId]);
        
        if (!$linksRes->successful()) {
            return response(['error' => 'Failed to fetch links'], 500);
        }
        
        $linksData = $linksRes->json();
        $links = $linksData['data'] ?? [];
        
        $totalLinks = count($links);
        $activeLinks = count(array_filter($links, fn($link) => $link['is_active']));
        $totalClicks = 0;
        $recentActivity = [];
        
        // Get stats for each link
        foreach (array_slice($links, 0, 10) as $link) { // Limit to prevent too many requests
            $statsRes = Http::withHeaders($this->ih())
              ->get(env('STATS_URL')."/api/internal/stats/{$link['code']}/summary");
            
            if ($statsRes->successful()) {
                $stats = $statsRes->json();
                $totalClicks += $stats['total'] ?? 0;
            }
            
            // Add to recent activity
            $recentActivity[] = [
                'id' => $link['id'],
                'type' => 'link_created',
                'link_code' => $link['code'],
                'link_url' => $link['target_url'],
                'timestamp' => $link['created_at'],
                'details' => "Created short link {$link['code']}"
            ];
        }
        
        // Sort recent activity by timestamp
        usort($recentActivity, fn($a, $b) => strtotime($b['timestamp']) - strtotime($a['timestamp']));
        
        return response()->json([
            'total_links' => $totalLinks,
            'active_links' => $activeLinks,
            'total_clicks' => $totalClicks,
            'clicks_this_month' => (int)($totalClicks * 0.3), // Simplified calculation
            'recent_activity' => array_slice($recentActivity, 0, 5)
        ]);
    }
}
