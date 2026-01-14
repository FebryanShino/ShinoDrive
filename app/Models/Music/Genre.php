<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    use HasUuids;
    protected $connection = "music";
    protected $table = 'genres';

    protected $guarded = ['id'];
    public $timestamps = false;
}
