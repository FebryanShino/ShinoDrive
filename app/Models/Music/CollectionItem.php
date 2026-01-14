<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CollectionItem extends Model
{
    use HasUuids;
    protected $connection = 'music';
    protected $table = 'collection_items';
    protected $guarded = ['id'];

    protected $hidden = ['item_hash'];
    public $timestamps = false;

    public function track(): BelongsTo
    {
        return $this->belongsTo(Track::class, 'file_hash', 'item_hash');
    }
}
