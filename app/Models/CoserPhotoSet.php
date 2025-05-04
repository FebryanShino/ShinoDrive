<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class CoserPhotoSet extends Model
{
    use HasUuids;
    protected $connection = "cosers";
    protected $table = 'photo_sets';
    public $timestamps = false;

    protected $guarded = ['id'];

    public function coser(): BelongsTo
    {
        return $this->belongsTo(Coser::class, 'coser_id');
    }
    public function photoSetItem(): HasMany
    {
        return $this->hasMany(CoserPhotoSetItem::class, 'photo_set_id');
    }

    public function tags(): HasManyThrough
    {
        return $this->hasManyThrough(PhotoSetItemTag::class, CoserPhotoSetItem::class, 'photo_set_id', 'photo_set_item_id');
    }
}
