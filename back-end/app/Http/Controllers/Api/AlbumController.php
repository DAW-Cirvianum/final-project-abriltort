<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Album;

class AlbumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $albums = Album::with('obres')->get();

        return response()->json([
            'success' => true,
            'data' => $albums
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'portfoli_id' => 'required|exists:portfolis,id',
            'nom' => 'required|string|max:255',
            'descripcio' => 'nullable|string',
        ]);

        $album = Album::create([
            'portfoli_id' => $request->portfoli_id,
            'nom' => $request->nom,
            'descripcio' => $request->descripcio,
        ]);

        return response()->json([
            'success' => true,
            'data' => $album
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Album $album)
    {
        $album->load('obres');

        return response()->json([
            'success' => true,
            'data' => $album
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Album $album)
    {
        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'descripcio' => 'nullable|string',
        ]);

        $album->update(
            $request->only('nom', 'descripcio')
        );

        return response()->json([
            'success' => true,
            'data' => $album
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Album $album)
    {
         $album->delete();

        return response()->json([
            'success' => true,
            'message' => 'Àlbum eliminat'
        ]);
    }
}
