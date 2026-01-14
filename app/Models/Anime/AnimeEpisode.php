<?php

namespace App\Models\Anime;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnimeEpisode extends Model
{
    use HasUuids;
    protected $connection = "anime";
    protected $table = 'anime_episodes';

    protected $guarded = ['id'];
    public $timestamps = false;

    public function series(): BelongsTo
    {
        return $this->belongsTo(AnimeSeries::class, 'anime_series_id');
    }
}
