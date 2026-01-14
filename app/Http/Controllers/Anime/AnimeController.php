<?php

namespace App\Http\Controllers\Anime;

use App\Http\Controllers\Controller;
use App\Models\Anime\AnimeEpisode;
use App\Models\Anime\AnimeSeries;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AnimeController extends Controller
{
    public function index()
    {
        return Inertia::render('anime/AnimeLandingPage', [
            'animeList' => AnimeSeries::orderBy('name', 'asc')->get()
        ]);
    }



    public function showAnime(string $mal_id)
    {
        $anime = AnimeSeries::where('mal_id', $mal_id)->with('episodes')->first();
        if (!$anime) return false;

        return Inertia::render('anime/AnimeDetailPage', [
            'anime' => $anime
        ]);
    }

    public function uploadAnimeForm(Request $request)
    {
        return Inertia::render('anime/form/AnimeUploadFormPage');
    }

    public function uploadAnime(Request $request)
    {

        $series = AnimeSeries::where('name', $request->input('title'))->first() ?? AnimeSeries::create([
            'name' => $request->input('title'),
            'mal_id' => $request->input('mal_id'),
            'cover' => $request->input('cover'),
        ]);

        $safe_name = preg_replace('/[\\\\\/:*?"<>|.]/', '', $request->input('title'));


        foreach ($request->all()['episodes'] as $episode) {
            $file = $episode['file'];
            $originalName = $file->getClientOriginalName();
            $path = $file->storeAs('/' . $safe_name, $originalName, 'anime');
            AnimeEpisode::create([
                'number' => $episode['episodeNumber'],
                'path' => $path,
                'file_extension' => $file->getClientOriginalExtension(),
                'anime_series_id' => $series->id
            ]);
        }
    }


    public function showEpisode(string $mal_id, string $number)
    {
        $episode = AnimeEpisode::with(['series' => fn($series) => $series->with('episodes')])->whereHas('series', function ($q) use ($mal_id) {
            $q->where('mal_id', $mal_id);
        })->where('number', $number)->first();
        if (!$episode) return false;

        return Inertia::render('anime/AnimeEpisodeDetailPage', ['episode' => $episode]);
    }



    public function streamAnime(string $filename)
    {
        $disk = Storage::disk('anime');
        $episode = AnimeEpisode::find(
            explode(".", $filename)[0]
        );

        if (!$disk->exists($episode->path)) {
            abort(404);
        }

        $path = $disk->path($episode->path);
        $size = $disk->size($episode->path);
        $mime =  mime_content_type($path);

        $start = 0;
        $end = $size - 1;

        $headers = [
            'Content-Type' => $mime,
            'Accept-Ranges' => 'bytes',
        ];

        if (request()->header('Range')) {
            preg_match('/bytes=(\d+)-(\d+)?/', request()->header('Range'), $matches);

            $start = intval($matches[1]);
            if (isset($matches[2])) {
                $end = intval($matches[2]);
            }

            $headers['Content-Range'] = "bytes $start-$end/$size";
            $headers['Content-Length'] = ($end - $start) + 1;

            return response()->stream(function () use ($path, $start, $end) {
                $stream = fopen($path, 'rb');
                fseek($stream, $start);

                while (!feof($stream) && ftell($stream) <= $end) {
                    echo fread($stream, 8192);
                    flush();
                }

                fclose($stream);
            }, 206, $headers);
        }

        $headers['Content-Length'] = $size;

        return response()->stream(function () use ($path) {
            readfile($path);
        }, 200, $headers);
    }
}
