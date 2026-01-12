<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Album extends Model
{
    use HasUuids;
    protected $connection = "music";
    protected $table = 'album';

    protected $guarded = ['id'];
    public $timestamps = false;

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'artist_id');
    }


    public function tracks(): HasMany
    {
        return $this->hasMany(Track::class, 'album_id');
    }
}
