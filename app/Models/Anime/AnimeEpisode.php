<?php

namespace App\Models\Anime;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class AnimeEpisode extends Model
{
    use HasUuids;
    protected $connection = "anime";
    protected $table = 'anime_episodes';

    protected $guarded = ['id'];
    public $timestamps = false;
}
