<?php

use App\Http\Controllers\Music\MusicController;
use Illuminate\Support\Facades\Route;

Route::get('/audio/{filename}', [MusicController::class, 'getTrackAudio']);
Route::get('music/artwork/{album_id}', [MusicController::class, 'getTrackArtwork']);
Route::get('/music', [MusicController::class, 'index']);
Route::get('/music/search', [MusicController::class, 'browseMusic'])->name('music.browse');
// Route::get('/music/{track}/lyrics', [MusicController::class, 'getLyrics'])->name('lyrics.index');
Route::post('/upload', [MusicController::class, 'upload'])->name('upload');
Route::post('/lyrics', [MusicController::class, 'addLyric'])->name('lyrics.add');
Route::post('/lyrics/{id}', [MusicController::class, 'updateLyric'])->name('lyrics.update');
Route::get('/idk', [MusicController::class, 'album']);
