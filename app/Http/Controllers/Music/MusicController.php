<?php

namespace App\Http\Controllers\Music;

use App\Http\Controllers\Controller;
use App\Models\Music\Album;
use App\Models\Music\Artist;
use App\Models\Music\Collection;
use App\Models\Music\CollectionItem;
use App\Models\Music\Lyric;
use App\Models\Music\Track;
use getID3;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MusicController extends Controller
{
    public function index()
    {
        return Inertia::render('music/MusicListPage', [
            'random_artists' => Artist::with(['albums'])->inRandomOrder()->take(5)->get(),
            'random_tracks' => Track::with(['album', 'artist'])->inRandomOrder()->take(30)->get(),
            'random_albums' => Album::with(['artist', 'tracks'])->inRandomOrder()->take(20)->get()
        ]);
    }

    public function getTrackList()
    {
        return Inertia::render('music/TrackListPage', [
            'tracks' => Track::with(['artist', 'album'])->orderBy('title', 'asc')->paginate(20)->withQueryString()
        ]);
    }

    public function browseMusic(Request $request)
    {
        $keyword = $request->query('q');
        $tracks = [];
        $albums = [];
        if ($keyword) {
            $tracks = Track::with(['album', 'artist'])
                ->where('title', 'like', '%' . $keyword . '%')
                ->orderBy('title', 'asc')->get();

            $albums = Album::with(['tracks', 'artist'])->where('title', 'like', '%' . $keyword . '%')->orderBy('title', 'asc')->get();
        }
        return Inertia::render('music/MusicSearchPage', [
            'keyword' => $keyword,
            'tracks' => $tracks,
            'albums' => $albums
        ]);
    }

    public function showArtist(Artist $artist)
    {
        $tracks = Track::with(['artist', 'album'])->whereHas('artist', function ($q) use ($artist) {
            $q->where('name', 'like', '%' . $artist->name . '%');
        })->orWhereHas('album', function ($q) use ($artist) {
            $q->where('title', 'like', '%' . $artist->name . '%');
        })->orderBy('title', 'asc')->get();

        $albums = Album::withCount('tracks')->whereHas('artist', function ($q) use ($artist) {
            $q->where('name', 'like', '%' . $artist->name . '%');
        })->orWhereHas('tracks', function ($q) use ($artist) {
            $q->where('artist_id', $artist->id);
        })->orderBy('title', 'asc')->get();

        return Inertia::render('music/ArtistDetailPage', [
            'artist' => $artist,
            'albums' => $albums,
            'tracks' => $tracks
        ]);
    }

    public function showAlbum(Album $album)
    {
        return Inertia::render('music/AlbumDetailPage', [
            'album' => $album->load([
                'artist',
                'tracks' => fn($tracks) => $tracks->with(['artist', 'album', 'genre'])->orderBy('disc_number', 'asc')->orderBy('track_number', 'asc')
            ])
        ]);
    }

    public function getAlbumList(Request $request)
    {
        $page = (int) $request->query('page', 1);
        // return Album::with(['artist'])->orderBy('title', 'ASC')->paginate(20)->withQueryString();

        return Inertia::render('music/AlbumListPage', [
            'albums' => Album::with(['artist'])->orderBy('title', 'ASC')->paginate(
                perPage: 20 * $page,
                page: 1
            ),
            'page' => $page,
        ]);
    }




    // Collections controllers

    public function getCollectionList()
    {
        return Collection::with(['tracks' => fn($tracks) => $tracks->with(['album', 'artist'])])->get();
    }

    public function showCollection(Collection $collection)
    {
        return Inertia::render('music/CollectionDetailPage', [
            'collection' => $collection->load((['tracks' => fn($tracks) => $tracks->with(['album', 'artist'])]))
        ]);
    }

    public function createCollection(Request $request)
    {
        return "baka";
    }

    public function addTracksToCollection(Request $request)
    {
        $id = "";
        $track_hashes = [];
        $data = collect($track_hashes)
            ->map(fn($track_hash) => [
                'collection_id' => $id,
                'item_hash' => $track_hash
            ])
            ->chunk(1000);

        DB::transaction(function () use ($data) {
            foreach ($data as $chunk) {
                CollectionItem::insert($chunk->toArray());
            }
        });
    }

    public function deleteTracksFromCollection()
    {
        $pairs = [];
        DB::transaction(function () use ($pairs) {
            CollectionItem::where(function ($q) use ($pairs) {
                foreach ($pairs as $pair) {
                    $q->orWhere(function ($q) use ($pair) {
                        $q->where('collection_id', $pair['collection_id'])
                            ->where('item_hash', $pair['item_hash']);
                    });
                }
            })->delete();
        });
    }






    // Lyrics Controllers

    public function addLyric(Request $request)
    {
        Lyric::create([
            'text' => $request->text,
            'timestamp' => $request->timestamp,
            'track_id' => $request->track_id
        ]);
    }
    public function updateLyric(Request $request, string $id)
    {
        $lyric = Lyric::find($id);
        $lyric->update($request->all());
    }

    public function upload(Request $request)
    {
        $files = $request->file('files');
        $tracks_information = [];

        foreach ($files as $file) {

            $track_information = $this->getTrackInformation($file);



            if (Track::where('title', $track_information['track_title'])->whereHas(
                'artist',
                function ($q) use ($track_information) {
                    $q->where('name', $track_information['artist_name']);
                }
            )->first()) continue;

            $artist = $track_information['artist_name'] ? Artist::where('name', $track_information['artist_name'])->first() ?? Artist::create(['name' => $track_information['artist_name']]) : Artist::where('name', 'Unknown')->first();
            $album = $track_information['album_title'] ?
                (Album::where('title', $track_information['album_title'])->first() ?? Album::create(['title' => $track_information['album_title'], 'artist_id' => $artist->id]))
                : Album::where('title', 'Unknown')->first();

            $cleaned_album_title = str_replace('"', "", str_replace("/", "-", $album->title));
            $cover_path = null;
            if ($track_information['image_data']) {
                Storage::disk('public')->put("musics/covers/{$cleaned_album_title}/{$track_information['image_filename']}", $track_information['image_data']);
                $cover_path = Storage::url("musics/covers/{$cleaned_album_title}/{$track_information['image_filename']}");
            }

            $track_path = $file->storeAs("musics/tracks/{$cleaned_album_title}", $file->getClientOriginalName(), 'public');


            $track = Track::create([
                'title' => $track_information['track_title'] ?? $file->getClientOriginalName(),
                'album_id' => $album->id,
                'artist_id' => $artist->id,
                'track_number' => $track_information['track_tracknumber'],
                'disk_number' => $track_information['track_discnumber'],
                'cover' => $cover_path,
                'track_path' => Storage::url($track_path),
                'track_filename' => $file->getClientOriginalName()
            ]);
            array_push($tracks_information, [
                'track_title' => $track_information['track_title'],
                'album_title' => $track_information['album_title'],
                'artist_name' => $track_information['artist_name'],
                'track_tracknumber' => $track_information['track_tracknumber'],
                'track_discnumber' => $track_information['track_discnumber'],
                'image_filename' => $track_information['image_filename'],
                'image_mime' => $track_information['image_mime'],
                'image_data' => base64_encode($track_information['image_data'])
            ]);
        }

        return back()->with('trackInfo', $tracks_information);
    }


    public function getTrackArtwork(string $album_id)
    {
        $path = "E:/Musics/Artworks/{$album_id}";
        abort_unless(file_exists($path), 404);
        return response()->file($path);
    }


    public function getTrackAudio(string $filename)
    {
        $track = Track::find(
            explode(".", $filename)[0]
        );

        $path = $track->filepath;
        $size = filesize($path);
        $mime = mime_content_type($path);

        $start = 0;
        $end = $size - 1;

        $headers = [
            'Content-Type'  => $mime,
            'Accept-Ranges' => 'bytes',
        ];

        if (request()->hasHeader('Range')) {
            preg_match('/bytes=(\d+)-(\d+)?/', request()->header('Range'), $matches);

            $start = (int) $matches[1];
            if (isset($matches[2])) {
                $end = (int) $matches[2];
            }

            $headers['Content-Range']  = "bytes $start-$end/$size";
            $headers['Content-Length'] = ($end - $start) + 1;

            return response()->stream(function () use ($path, $start, $end) {
                $fp = fopen($path, 'rb');
                fseek($fp, $start);

                while (!feof($fp) && ftell($fp) <= $end) {
                    echo fread($fp, 8192);
                    flush();
                }

                fclose($fp);
            }, 206, $headers);
        }

        $headers['Content-Length'] = $size;

        return response()->stream(function () use ($path) {
            readfile($path);
        }, 200, $headers);
    }


    public function getLyrics(Track $track)
    {
        // return $track->load(['lyrics' => fn($track) => $track->orderBy('timestamp')]);
        return Inertia::render('music/LyricsManagerPage', ['track' => $track->load(['lyrics' => fn($track) => $track->orderBy('timestamp')])]);
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
        $image_mime = null;


        if (!empty($info['id3v2']['APIC'][0]['data']) || !empty($info['comments']['picture'][0]['data'])) {
            $image_data = $info['id3v2']['APIC'][0]['data'] ?? $info['comments']['picture'][0]['data'] ?? null;
            $image_mime =  $info['id3v2']['APIC'][0]['image_mime'] ?? $info['comments']['picture'][0]['image_mime'];
            $extension = explode('/', $image_mime)[1];
            $image_filename =  $file->getClientOriginalName() . '.' . $extension;
        }

        return [
            'track_title' => $track_title,
            'album_title' => $album_title,
            'artist_name' => $artist_name,
            'track_tracknumber' => $track_tracknumber,
            'track_discnumber' => $track_discnumber,
            'image_filename' => $image_filename,
            'image_mime' => $image_mime,
            'image_data' => $image_data
        ];
    }
}
