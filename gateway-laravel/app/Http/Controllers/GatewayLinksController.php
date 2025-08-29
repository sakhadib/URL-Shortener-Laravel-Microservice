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
}
