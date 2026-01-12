<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;


Route::get('/', function () {
    return Inertia::render('Homepage');
})->name('homepage');

// Route::get('/funny', function () {
//     exec('"E:\Videos\Whiwa goes brrrr compressed.mp4"');
//     return "yeah";
// });


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


require __DIR__ . '/anime.php';
require __DIR__ . '/cosplay.php';
require __DIR__ . '/music.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
