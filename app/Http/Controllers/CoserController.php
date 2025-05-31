<?php

namespace App\Http\Controllers;

use App\Models\Coser;
use App\Models\CoserPhotoSet;
use App\Models\CoserPhotoSetItem;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Nette\Utils\FileInfo;

class CoserController extends Controller
{
    public function index()
    {
        $random_images = CoserPhotoSetItem::with(['coser', 'photoSet'])->where('extension', '.jpeg')
            ->orWhere('extension', '.jpg')
            ->orWhere('extension', '.png')
            ->get()->shuffle()->take(8);

        $top_cosers = Coser::with('photoSetItem')->withCount('photoSetItem')->orderBy('photo_set_item_count', 'desc')->get()->take(5);
        return Inertia::render('cosplay/CoserLandingPage', [
            'randomImages' => $random_images,
            'topCosers' => $top_cosers
        ]);
    }

    public function coser(Request $request)
    {
        $cosers = Coser::with(['photoSetItem', 'photoSet'])->orderBy('name', 'asc')->paginate(8);
        // return $cosers;
        return Inertia::render('cosplay/CoserListPage', [
            'cosers' => $cosers
        ]);
    }

    public function show(Request $request, Coser $coser)
    {
        // return $coser->load(
        //     [
        //         'photoSet' => fn($photo_set) => $photo_set->orderBy('name')->with([
        //             'tags.tag' => fn($tag) => $tag->withCount('photoSetItem'),
        //             'photoSetItem'
        //         ])
        //     ]
        // );
        // return CoserPhotoSet::with('photoSetItem')->where('coser_id', $coser->id)->get();
        return Inertia::render('cosplay/CoserDetailPage', [
            'coser' => $coser->load([
                'photoSet' => fn($photo_set) => $photo_set->orderBy('name')->with([
                    'tags.tag' => fn($tag) => $tag->withCount('photoSetItem'),
                    'photoSetItem'
                ])
            ])

        ]);
    }

    public function detail(Request $request, string $coser, CoserPhotoSet $photo_set)
    {
        $photo_set_item = $photo_set->photoSetItem();
        $images = $photo_set_item->orderBy('name', 'ASC')->get()->load(['tags' => fn($tags) => $tags->orderBy('name')])->where('width', '!=', '-1')->values();
        $tags = Tag::orderBy('name', 'asc')->get();
        // return fake()->name();

        return Inertia::render('cosplay/CoserPhotoSetDetailPage', [
            'photo_set' => $photo_set->load('coser'),
            'images' => $images,
            'tags' => $tags
        ]);
    }

    public function detailVideo(Request $request, string $coser, CoserPhotoSet $photo_set)
    {
        $photo_set_item = $photo_set->photoSetItem();
        $videos = $photo_set_item->get()->where('width', -1)->values();
        return Inertia::render('cosplay/CoserPhotoSetVideoPage', [
            'photo_set' => $photo_set->load('coser'),
            'videos' => $videos,

        ]);
    }

    public function uploadCoserForm(Request $request)
    {
        // return 'jfsdlafjkkjdsf';
        return Inertia::render('cosplay/form/CoserFormPage', [
            'cosers' => Coser::all()
        ]);
    }
    public function uploadCoser(Request $request)
    {
        $coser = Coser::create($request->only(['name', 'translation', 'description']));
        return redirect(route('coser.photo_set.index', ['coser' => $coser->id]));
    }



    public function uploadPhotoSetForm(Request $request, Coser $coser)
    {
        return Inertia::render('cosplay/form/CoserPhotoSetFormPage', [
            'coser' => $coser->load(['photoSet'])
        ]);
    }

    public function uploadPhotoSet(Request $request)
    {
        $photo_set = $this->updatePhotoSetAndImages($request);
        return redirect(route('coser.photo_set.detail', ['coser' => $photo_set->coser->id, 'photo_set' => $photo_set->id]));
    }

    public function uploadPhotoSetItemForm(Request $request, string $coser, CoserPhotoSet $photo_set)
    {
        return Inertia::render('cosplay/form/CoserPhotoSetItemFormPage', [
            'photo_set' => $photo_set->load(['coser', 'photoSetItem'])
        ]);
    }
    public function uploadPhotoSetItem(Request $request)
    {
        $photo_set = $this->updatePhotoSetAndImages($request);

        return redirect(route('coser.photo_set.detail', ['coser' => $photo_set->coser->id, 'photo_set' => $photo_set->id]));
    }


    private function updatePhotoSetAndImages(Request $request)
    {
        $STORAGE_PATH = 'E:/shino-drive/storage/app/public/';
        $files = $request->file('files');

        $photo_set_path = $STORAGE_PATH . 'cosers/' . $request->coser . '/' . $request->name;

        $photo_set = CoserPhotoSet::where('name', $request->name)->first() ?? CoserPhotoSet::create([
            'name' => $request->name,
            'coser_id' => $request->coser_id,
            'path' => $photo_set_path
        ]);


        $idk = [];
        if ($files) {
            foreach ($files as $file) {
                $height = -1;
                $width = -1;
                $images = '';
                $originalName = $file->getClientOriginalName();
                $extension = strtolower('.' . $file->getClientOriginalExtension());
                $path = $file->storeAs('cosers/' . $request->coser . '/' . $request->name, $originalName, 'public');
                $full_path = $STORAGE_PATH . $path;

                $temporary_path = $file->getPathname(); // temporary file path
                $images = getimagesize($temporary_path);
                if ($images) {
                    $width = $images['0'];
                    $height = $images['1'];
                }

                $file_exists = CoserPhotoSetItem::where('name', $originalName)->where('photo_set_id', $photo_set->id)->exists();
                if (!$file_exists) {
                    CoserPhotoSetItem::create([
                        'coser_id' => $request->coser_id,
                        'extension' => $extension,
                        'name' => $originalName,
                        'width' => $width,
                        'height' => $height,
                        'path' => $full_path,
                        'photo_set_id' => $photo_set->id,
                        'size' => $file->getSize(),
                    ]);
                }
            }
        }
        return $photo_set;
    }
}
