<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function click(Request $r) {
        $data = $r->validate([
            'code' => 'required|string|max:20',
            'ts' => 'nullable|date',
            'ip_hash' => 'nullable|string|max:64',
            'ua_hash' => 'nullable|string|max:64',
            'referrer' => 'nullable|string|max:512',
        ]);
        DB::table('clicks')->insert([
            'code'=>$data['code'],
            'ts'=>$data['ts'] ?? now(),
            'ip_hash'=>$data['ip_hash'] ?? null,
            'ua_hash'=>$data['ua_hash'] ?? null,
            'referrer'=>$data['referrer'] ?? null,
            'created_at'=>now(), 'updated_at'=>now(),
        ]);
        return response()->json(['ok'=>true], 202);
    }

    public function summary($code) {
        $row = DB::table('clicks')
            ->selectRaw('COUNT(*) as total, MIN(ts) as first_click_at, MAX(ts) as last_click_at')
            ->where('code',$code)->first();
        return $row ?: ['total'=>0,'first_click_at'=>null,'last_click_at'=>null];
    }

    public function daily(Request $r, $code) {
        $from = $r->query('from') ?: now()->subDays(14)->toDateString();
        $to   = $r->query('to')   ?: now()->toDateString();
        return DB::table('clicks')
            ->selectRaw('DATE(ts) as date, COUNT(*) as clicks')
            ->where('code',$code)
            ->whereBetween(DB::raw('DATE(ts)'), [$from, $to])
            ->groupBy(DB::raw('DATE(ts)'))
            ->orderBy('date','asc')
            ->get();
    }
}
