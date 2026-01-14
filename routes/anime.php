<?php

use App\Http\Controllers\Anime\AnimeController;
use App\Models\Anime\AnimeSeries;
use Illuminate\Support\Facades\Route;


Route::prefix(('anime'))->group(function () {

    Route::get('/', [AnimeController::class, 'index'])->name('anime.index');

    Route::get('/form', [AnimeController::class, 'uploadAnimeForm'])->name('anime.form.upload');
    Route::post('/upload', [AnimeController::class, 'uploadAnime']);
    Route::get('/id/{mal_id}', [AnimeController::class, 'showAnime'])->name('anime.show');
    Route::get('/id/{mal_id}/episode/{number}', [AnimeController::class, 'showEpisode'])->name('anime.episode.show');
    Route::get('/file/{filename}', [AnimeController::class, 'streamAnime'])->name('anime.episode.file');
});
