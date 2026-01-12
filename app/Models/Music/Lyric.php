<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lyric extends Model
{
    use HasUuids;
    protected $connection = "music";
    protected $table = 'lyric';

    protected $guarded = ['id'];
    public $timestamps = false;


    public function track(): BelongsTo
    {
        return $this->belongsTo(Track::class, 'track_id');
    }
}
