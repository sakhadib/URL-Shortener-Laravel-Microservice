<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Click extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'ts',
        'ip_hash',
        'ua_hash',
        'referrer',
    ];

    protected $casts = [
        'ts' => 'datetime',
    ];

    /**
     * Get summary statistics for a specific code
     */
    public static function getSummary($code)
    {
        return self::where('code', $code)
            ->selectRaw('COUNT(*) as total, MIN(ts) as first_click_at, MAX(ts) as last_click_at')
            ->first();
    }

    /**
     * Get daily click statistics for a specific code within a date range
     */
    public static function getDailyStats($code, $from, $to)
    {
        return self::where('code', $code)
            ->selectRaw('DATE(ts) as date, COUNT(*) as clicks')
            ->whereBetween(DB::raw('DATE(ts)'), [$from, $to])
            ->groupBy(DB::raw('DATE(ts)'))
            ->orderBy('date', 'asc')
            ->get();
    }
}
