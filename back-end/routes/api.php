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
Route::post('/register', [AuthController::class, 'register']);

// Rutes protegides amb Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Usuari autenticat (per veure / editar el seu perfil)
    Route::get('/user/profile', [UserController::class, 'showSelf']);
    Route::put('/user/profile', [UserController::class, 'updateSelf']);

    // Rutes admin
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::get('/admin/users', [AdminController::class, 'users']);
    });

    // Altres resources
    Route::apiResource('obres', ObraController::class);
    Route::apiResource('portfolis', PortfoliController::class);
    Route::apiResource('albums', AlbumController::class);
    Route::apiResource('categories', CategoriaController::class);
    Route::apiResource('tags', TagController::class);

    // Visualitzacions (registren tant si hi ha usuari com no)
    Route::post('/visualitzacions', [VisualitzacioController::class, 'store']);
});
