<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use \Intervention\Image\Drivers\Gd\Driver;

class CoserPhotoSetItem extends Model
{
    use HasUuids;
    protected $connection = "cosers";
    protected $table = 'coser_items';

    protected $guarded = ['id'];
    public $timestamps = false;
    // protected $appends = ['compressed'];

    // public function getCompressedAttribute()
    // {
    //     $path = str_replace('E:/shino-drive/storage/app/public/', '', $this->path); // replace with your actual image path column
    //     // if (!$path || !Storage::exists($path)) {
    //     //     return null;
    //     // }

    //     $imageContent = Storage::disk('public')->get($path);;

    //     // // Use Intervention Image v3
    //     $manager = new ImageManager(new Driver()); // or new Imagick\Driver()

    //     $image = $manager->read($imageContent)
    //         ->scale(width: 600) // maintains aspect ratio by default
    //         ->toJpeg(); // returns an EncodedImage instance

    //     $base64 = base64_encode($image->toString());

    //     return 'data:image/jpeg;base64,' . $base64;
    // }

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
