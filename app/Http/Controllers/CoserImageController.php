<?php

namespace App\Http\Controllers;

use App\Models\CoserPhotoSetItem;
use App\Models\PhotoSetItemTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CoserImageController extends Controller
{
    public function index(Request $request)
    {
        $tags = explode(',', $request->query('search'));


        $photo_set_items = CoserPhotoSetItem::orderBy('name')->with('tags')->where('height', '!=', -1);
        if ($request->query('search')) {
            foreach ($tags as $tag) {
                $photo_set_items->whereHas('tags', function ($q) use ($tag) {
                    $q->where('name', str_replace(' ', '', $tag));
                });
            }
        }

        return Inertia::render('cosplay/CoserBrowserPage', [
            'photo_set_items' => $photo_set_items->paginate()->withQueryString(),
            'tags' => Tag::all()
        ]);
    }
}
