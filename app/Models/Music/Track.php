<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Track extends Model
{
    use HasUuids;
    protected $connection = "music";
    protected $table = 'tracks';

    protected $guarded = ['id'];
    public $timestamps = false;

    protected $hidden = ['hash_hex'];

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class, 'album_id');
    }

    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'artist_id');
    }

    public function genre(): BelongsTo
    {
        return $this->belongsTo(Genre::class, 'genre_id');
    }

    public function lyrics(): HasMany
    {
        return $this->hasMany(Lyric::class, 'track_id');
    }
}
