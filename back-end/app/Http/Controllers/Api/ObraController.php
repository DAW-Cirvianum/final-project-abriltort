<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Obra;

class ObraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $obres = Obra::with(['album', 'categoria', 'tags'])->get();

        return response()->json([
            'success' => true,
            'data' => $obres
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titol' => 'required|string|max:255',
            'descripcio' => 'nullable|string',
            'album_id' => 'required|exists:albums,id',
            'categoria_id' => 'required|exists:categories,id',
            'fitxer_url' => 'required|url',
            'tags' => 'array'
        ]);

        $obra = Obra::create([
            'titol' => $request->titol,
            'descripcio' => $request->descripcio,
            'album_id' => $request->album_id,
            'categoria_id' => $request->categoria_id,
            'fitxer_url' => $request->fitxer_url,
        ]);

        if ($request->has('tags')) {
            $obra->tags()->sync($request->tags);
        }

        return response()->json([
            'success' => true,
            'message' => 'Obra creada correctament',
            'data' => $obra
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Obra $obre)
    {
        // Carregar les relacions
        $obre->load(['categoria', 'album', 'tags']);

        return response()->json([
            'success' => true,
            'data' => $obre,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Obra $obre)
    {
        $request->validate([
            'titol' => 'sometimes|string|max:255',
            'descripcio' => 'nullable|string',
            'album_id' => 'sometimes|exists:albums,id',
            'categoria_id' => 'sometimes|exists:categories,id',
            'fitxer_url' => 'sometimes|url',
            'tags' => 'array'
        ]);

        $obre->update($request->only([
            'titol',
            'descripcio',
            'album_id',
            'categoria_id',
            'fitxer_url'
        ]));

        if ($request->has('tags')) {
            $obre->tags()->sync($request->tags);
        }

        return response()->json([
            'success' => true,
            'message' => 'Obra actualitzada',
            'data' => $obre
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Obra $obre)
    {
        $obre->delete();

        return response()->json([
            'success' => true,
            'message' => 'Obra eliminada'
        ]);
    }
}
