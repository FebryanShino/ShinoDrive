<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Collection extends Model
{
    use HasUuids;
    protected $connection = "music";
    protected $table = 'collections';

    protected $guarded = ['id'];
    public function tracks(): BelongsToMany
    {
        return $this->belongsToMany(
            Track::class,
            'collection_items',
            'collection_id',
            'item_hash',
            'id',
            'hash_hex',
        );
    }
}
