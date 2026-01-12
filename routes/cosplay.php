<?php

use App\Http\Controllers\CoserController;
use App\Http\Controllers\CoserImageController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::get('/cosplay', [CoserController::class, 'index'])->name('cosplay');

Route::get('/cosplay/browse', [CoserImageController::class, 'index'])->name('cosplay.browse');


Route::get('/cosplay/coser', [CoserController::class, 'coser']);
Route::get('/cosplay/file/{photo_set_item}', [CoserController::class, 'getFile']);

Route::get('/cosplay/coser/{coser}', [CoserController::class, 'show'])->name('coser.photo_set.index');;
Route::get('/cosplay/upload', [CoserController::class, 'uploadCoserForm']);
Route::post('/cosplay/coser/upload', [CoserController::class, 'uploadCoser']);


Route::get('/cosplay/coser/{coser}/upload', [CoserController::class, 'uploadPhotoSetForm']);
Route::post('/cosplay/coser/coser/upload', [CoserController::class, 'uploadPhotoSet']);

Route::get('cosplay/coser/{coser}/{photo_set}', [CoserController::class, 'detail'])->name('coser.photo_set.detail');
Route::get('cosplay/coser/{coser}/{photo_set}/upload', [CoserController::class, 'uploadPhotoSetItemForm']);
Route::post('cosplay/coser/{coser}/{photo_set}/upload', [CoserController::class, 'uploadPhotoSetItem']);
Route::get('cosplay/coser/{coser}/{photo_set}/video', [CoserController::class, 'detailVideo']);


Route::post('/cosplay/add-tag', [TagController::class, 'addTag'])->name('coser.photo_set_item.add_tag');
Route::delete('cosplay/remove-tag/{photo_set_item_id}/{tag_id}', [TagController::class, 'removeTag'])->name('coser.photo_set_item.remove_tag');
Route::get('/cosplay/create-tag/{name}', [TagController::class, 'createTag'])->name('coser.photo_set_item.create_tag');
