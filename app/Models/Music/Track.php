<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Track extends Model
{
    use HasUuids;
    protected $connection = "music";
    protected $table = 'tracks';

    protected $guarded = ['id'];
    public $timestamps = false;

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class, 'album_id');
    }
    public function artist(): BelongsTo
    {
        return $this->belongsTo(Artist::class, 'artist_id');
    }
}
