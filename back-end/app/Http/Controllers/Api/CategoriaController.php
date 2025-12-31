<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categoria::all();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $request->validate([
            'nom' => 'required|string|max:255',
            'descripcio' => 'nullable|string',
        ]);

        $categoria = Categoria::create([
            'nom' => $request->nom,
            'descripcio' => $request->descripcio,
        ]);

        return response()->json([
            'success' => true,
            'data' => $categoria
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Categoria $category)
    {
         // carregar les obres relacionades
        $category->load('obres');

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Categoria $category)
    {
        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'descripcio' => 'nullable|string',
        ]);

        $category->update(
            $request->only('nom', 'descripcio')
        );

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categoria $category)
    {
         $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Categoria eliminada'
        ]);
    }
}
