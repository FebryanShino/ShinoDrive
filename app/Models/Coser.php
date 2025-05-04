<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coser extends Model
{
    use HasUuids;
    protected $connection = "cosers";
    protected $table = 'cosers';

    protected $guarded = ['id'];
    public $timestamps = false;


    public function photoSet(): HasMany
    {
        return $this->hasMany(CoserPhotoSet::class, 'coser_id');
    }
    public function photoSetItem(): HasMany
    {
        return $this->hasMany(CoserPhotoSetItem::class, 'coser_id');
    }
}
