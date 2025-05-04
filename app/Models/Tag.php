<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Tag extends Model
{
    use HasUuids;

    protected $connection = "cosers";
    protected $guarded = ['id'];
    public $timestamps = false;

    public function photoSetItem(): BelongsToMany
    {
        return $this->belongsToMany(CoserPhotoSetItem::class, 'photo_set_item_tags', 'tag_id', 'photo_set_item_id');
    }
}
