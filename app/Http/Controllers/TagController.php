<?php

namespace App\Http\Controllers;

use App\Models\PhotoSetItemTag;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function createTag(Request $request, string $name)
    {
        if (!Tag::where('name', $name)->exists()) {
            $tag = Tag::create([
                'name' => $name
            ]);
            return $tag;
        } else {
            return 'it exists.';
        }
    }


    public function addTag(Request $request)
    {
        if (!PhotoSetItemTag::where('photo_set_item_id', $request->photo_set_item_id)->where('tag_id', $request->tag_id)->exists()) {
            $photo_set_item = PhotoSetItemTag::create([
                'photo_set_item_id' => $request->photo_set_item_id,
                'tag_id' => $request->tag_id
            ]);
        }

        // return back();
    }
    public function removeTag(Request $request, string $photo_set_item_id, string $tag_id)
    {
        PhotoSetItemTag::where('photo_set_item_id', $photo_set_item_id)->where('tag_id', $tag_id)->first()->delete();

        // return back();
    }
}
