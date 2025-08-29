<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Click;
use App\Models\DailyClick;

class StatsController extends Controller
{
    public function click(Request $r) {
        // try {
        //     $data = $r->validate([
        //         'code' => 'required|string|max:20',
        //         'ts' => 'nullable',
        //         'ip_hash' => 'nullable|string',
        //         'ua_hash' => 'nullable|string',
        //         'referrer' => 'nullable|string',
        //     ]);
        // } catch (\Illuminate\Validation\ValidationException $e) {
        //     return response()->json(['ok' => false, 'errors' => $e->errors()], 422);
        // }
        $data = $r->only(['code','ts','ip_hash','ua_hash','referrer']);
        $res = 'data received';
        // return response()->json(['ok'=>false, 'data'=>$res], 202);

        // Create click record using the model
        Click::create([
            'code' => $data['code'],
            'ts' => $data['ts'] ?? now(),
            'ip_hash' => $data['ip_hash'] ?? null,
            'ua_hash' => $data['ua_hash'] ?? null,
            'referrer' => $data['referrer'] ?? null,
        ]);

        // Also update daily stats
        $clickDate = isset($data['ts']) ? 
            \Carbon\Carbon::parse($data['ts'])->toDateString() : 
            now()->toDateString();
        DailyClick::incrementClicks($data['code'], $clickDate);

        return response()->json(['ok'=>true, 'data'=>$res], 202);
    }

    public function summary($code) {
        $row = Click::getSummary($code);
        return $row ?: ['total'=>0,'first_click_at'=>null,'last_click_at'=>null];
    }

    public function daily(Request $r, $code) {
        $from = $r->query('from') ?: now()->subDays(14)->toDateString();
        $to   = $r->query('to')   ?: now()->toDateString();
        
        // Try to get data from daily_clicks table first (aggregated data)
        $dailyStats = DailyClick::getDailyStats($code, $from, $to);
        
        // If no aggregated data exists, fall back to calculating from clicks table
        if ($dailyStats->isEmpty()) {
            return Click::getDailyStats($code, $from, $to);
        }
        
        return $dailyStats;
    }
}
