<?php

namespace App\Models\Anime;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnimeSeries extends Model
{
    use HasUuids;
    protected $connection = "anime";
    protected $table = 'anime_series';

    protected $guarded = ['id'];
    public $timestamps = false;


    public function episodes(): HasMany
    {
        return $this->hasMany(AnimeEpisode::class, 'anime_series_id');
    }
}
