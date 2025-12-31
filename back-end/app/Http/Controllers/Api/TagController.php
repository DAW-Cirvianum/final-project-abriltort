<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tag;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tags = Tag::all();

        return response()->json([
            'success' => true,
            'data' => $tags
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $tag = Tag::create([
            'nom' => $request->nom,
        ]);

        return response()->json([
            'success' => true,
            'data' => $tag
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag)
    {
        // carregar obres relacionades
        $tag->load('obres');

        return response()->json([
            'success' => true,
            'data' => $tag
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
         $request->validate([
            'nom' => 'sometimes|string|max:255',
        ]);

        $tag->update(
            $request->only('nom')
        );

        return response()->json([
            'success' => true,
            'data' => $tag
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tag eliminat'
        ]);
    }
}
