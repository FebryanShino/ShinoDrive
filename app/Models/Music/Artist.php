<?php

namespace App\Models\Music;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Artist extends Model
{
    use HasUuids;
    protected $connection = "music";
    protected $table = 'artists';

    protected $guarded = ['id'];
    public $timestamps = false;
}
