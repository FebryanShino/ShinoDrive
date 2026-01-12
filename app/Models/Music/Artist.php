<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Artist extends Model
{
    use HasUuids;
    protected $connection = "music";
    protected $table = 'artist';

    protected $guarded = ['id'];
    public $timestamps = false;

    public function tracks(): HasMany
    {
        return $this->hasMany(Track::class, 'artist_id');
    }

    public function albums(): HasMany
    {
        return $this->hasMany(Album::class, 'artist_id');
    }
}
