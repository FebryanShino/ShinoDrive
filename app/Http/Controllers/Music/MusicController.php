<?php

namespace App\Http\Controllers\Music;

use App\Http\Controllers\Controller;
use App\Models\Music\Album;
use App\Models\Music\Artist;
use App\Models\Music\Track;
use getID3;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MusicController extends Controller
{
    public function index()
    {
        // return Track::with(['album', 'artist'])->get();
        return Inertia::render('music/MusicListPage', [
            'tracks' => Track::with(['album', 'artist'])->orderBy('title')->get()
        ]);
    }

    public function upload(Request $request)
    {
        $files = $request->file('files');

        foreach ($files as $file) {

            $track_information = $this->getTrackInformation($file);

            if (Track::where('title', $track_information['track_title'])->whereHas(
                'artist',
                function ($q) use ($track_information) {
                    $q->where('name', $track_information['artist_name']);
                }
            )->first()) continue;

            $artist = Artist::where('name', $track_information['artist_name'])->first() ?? Artist::create(['name' => $track_information['artist_name']]);
            $album = $track_information['album_title'] ?
                (Album::where('title', $track_information['album_title'])->first() ?? Album::create(['title' => $track_information['album_title'], 'artist_id' => $artist->id]))
                : Album::where('title', 'Unknown')->first();

            $cleaned_album_title = str_replace("/", "-", $album->title);
            $cover_path = null;
            if ($track_information['image_data']) {
                Storage::disk('public')->put("musics/covers/{$cleaned_album_title}/{$track_information['image_filename']}", $track_information['image_data']);
                $cover_path = Storage::url("musics/covers/{$cleaned_album_title}/{$track_information['image_filename']}");
            }

            $track_path = $file->storeAs("musics/tracks/{$cleaned_album_title}", $file->getClientOriginalName(), 'public');


            $track = Track::create([
                'title' => $track_information['track_title'],
                'album_id' => $album->id,
                'artist_id' => $artist->id,
                'track_number' => $track_information['track_tracknumber'],
                'disk_number' => $track_information['track_discnumber'],
                'cover' => $cover_path,
                'track_path' => Storage::url($track_path),
                'track_filename' => $file->getClientOriginalName()
            ]);
        }


        return back();
    }

    private function getTrackInformation($file)
    {

        $getID3 = new getID3;

        $info = $getID3->analyze($file->getPathname());

        $track_title = $info['tags']['id3v2']['title'][0] ?? $info['tags']['vorbiscomment']['title'][0] ?? null;
        $album_title = $info['tags']['id3v2']['album'][0] ?? $info['tags']['vorbiscomment']['album'][0] ?? null;
        $artist_name = $info['tags']['id3v2']['artist'][0] ?? $info['tags']['vorbiscomment']['artist'][0] ?? null;
        $track_tracknumber = $info['tags']['id3v2']['track_number'][0] ?? $info['tags']['vorbiscomment']['tracknumber'][0] ?? 0;
        $track_discnumber = $info['tags']['id3v2']['part_of_a_set'][0] ?? $info['tags']['vorbiscomment']['discnumber'][0] ?? 0;
        $image_filename = null;
        $image_data = null;


        if (!empty($info['id3v2']['APIC'][0]['data']) || !empty($info['comments']['picture'][0]['data'])) {
            $image_data = $info['id3v2']['APIC'][0]['data'] ?? $info['comments']['picture'][0]['data'];
            $extension = explode('/', $info['id3v2']['APIC'][0]['image_mime'] ?? $info['comments']['picture'][0]['image_mime'])[1];
            $image_filename =  $file->getClientOriginalName() . '.' . $extension;
        }

        return [
            'track_title' => $track_title,
            'album_title' => $album_title,
            'artist_name' => $artist_name,
            'track_tracknumber' => $track_tracknumber,
            'track_discnumber' => $track_discnumber,
            'image_filename' => $image_filename,
            'image_data' => $image_data
        ];
    }
}
