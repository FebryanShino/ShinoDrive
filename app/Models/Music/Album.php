<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasUuids;
    protected $connection = "music";
    protected $table = 'albums';

    protected $guarded = ['id'];
    public $timestamps = false;
}
