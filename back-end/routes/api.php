<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ObraController;
use App\Http\Controllers\Api\PortfoliController;
use App\Http\Controllers\Api\AlbumController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\VisualitzacioController;
use App\Http\Controllers\Api\UserController;

// Ruta de login pública
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/obres/public', [ObraController::class, 'publicIndex']);
Route::get('/artistes/public', [UserController::class, 'publicArtistes']);
Route::get('/artistes', [UserController::class, 'paginatedArtistes']);
Route::get('/portfolis/{userId}', [PortfoliController::class, 'showPortfoliUser']);
Route::get('/albums/{album}/obres', [AlbumController::class, 'obres']);
Route::get('/obres/{obra}', [ObraController::class, 'showWithAlbum']);
Route::apiResource('categories', CategoriaController::class);
Route::get('/obres/public/all', [ObraController::class, 'publicAll']);
Route::get('/tags', [TagController::class, 'index']);
Route::get('/tags/{tag}', [TagController::class, 'show']);

// Rutes protegides amb Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Usuari autenticat
    Route::get('/user/profile', [UserController::class, 'showSelf']);
    Route::put('/user/profile', [UserController::class, 'updateSelf']);
    Route::get('/portfoli/my', [PortfoliController::class, 'myPortfoli']);
    Route::post('/portfoli/my', [PortfoliController::class, 'createSelf']);
    Route::put('/portfoli/my', [PortfoliController::class, 'updateSelf']);
    // Rutes admin
    Route::middleware('role:admin')->group(function () {
        // Route::apiResource('users', UserController::class);
        Route::get('/admin/users', [AdminController::class, 'users']);
    });

    // Altres resources
    Route::apiResource('obres', ObraController::class);
    Route::apiResource('portfolis', PortfoliController::class);
    Route::apiResource('albums', AlbumController::class);
    Route::apiResource('tags', TagController::class)->except(['index', 'show']);
    Route::apiResource('categories', CategoriaController::class)->except(['index', 'show']);

    // Visualitzacions
    Route::post('/visualitzacions', [VisualitzacioController::class, 'store']);
});
