<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CoserPhotoSetItem extends Model
{
    use HasUuids;
    protected $connection = "cosers";
    protected $table = 'coser_items';

    protected $guarded = ['id'];
    public $timestamps = false;

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'photo_set_item_tags', 'photo_set_item_id', 'tag_id');
    }
    public function coser(): BelongsTo
    {
        return $this->belongsTo(Coser::class, 'coser_id');
    }
    public function photoSet(): BelongsTo
    {
        return $this->belongsTo(CoserPhotoSet::class, 'photo_set_id');
    }
}
