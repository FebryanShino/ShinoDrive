<?php

use App\Http\Controllers\Anime\AnimeController;
use App\Models\Anime\AnimeSeries;
use Illuminate\Support\Facades\Route;

Route::get('/anime', [AnimeController::class, 'index']);

Route::get('/anime/form', [AnimeController::class, 'uploadAnimeForm']);
Route::post('/anime/upload/', [AnimeController::class, 'uploadAnime']);
Route::get('/anime/id/{mal_id}', [AnimeController::class, 'showAnime']);
Route::get('/anime/file/{episode}', [AnimeController::class, 'streamAnime']);
