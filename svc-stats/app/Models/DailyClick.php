<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyClick extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'date',
        'clicks',
    ];

    protected $casts = [
        'date' => 'date',
        'clicks' => 'integer',
    ];

    // The primary key is composite (code, date)
    protected $primaryKey = ['code', 'date'];
    public $incrementing = false;

    /**
     * Set the keys for a save update query.
     */
    protected function setKeysForSaveQuery($query)
    {
        $keys = $this->getKeyName();
        if (!is_array($keys)) {
            return parent::setKeysForSaveQuery($query);
        }

        foreach ($keys as $keyName) {
            $query->where($keyName, '=', $this->getKeyForSaveQuery($keyName));
        }

        return $query;
    }

    /**
     * Get the value of the model's primary key.
     */
    protected function getKeyForSaveQuery($keyName = null)
    {
        if (is_null($keyName)) {
            $keyName = $this->getKeyName();
        }

        if (isset($this->original[$keyName])) {
            return $this->original[$keyName];
        }

        return $this->getAttribute($keyName);
    }

    /**
     * Increment clicks for a specific code and date
     */
    public static function incrementClicks($code, $date = null)
    {
        $date = $date ?: now()->toDateString();
        
        return self::updateOrCreate(
            ['code' => $code, 'date' => $date],
            ['clicks' => 0]
        )->increment('clicks');
    }

    /**
     * Get daily stats for a code within a date range
     */
    public static function getDailyStats($code, $from, $to)
    {
        return self::where('code', $code)
            ->whereBetween('date', [$from, $to])
            ->orderBy('date', 'asc')
            ->get(['date', 'clicks']);
    }
}
