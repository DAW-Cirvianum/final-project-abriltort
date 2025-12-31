<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Portfoli;

class PortfoliController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $portfolis = Portfoli::with('albums')->get();
        return response()->json([
            'success' => true,
            'data' => $portfolis
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
        ]);

        $portfoli = Portfoli::create([
            'titol' => $request->titol,
            'descripcio' => $request->descripcio,
            'usuari_id' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $portfoli
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Portfoli $portfoli)
    {
        $portfoli->load('albums');

        return response()->json([
            'success' => true,
            'data' => $portfoli
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Portfoli $portfoli)
    {
        $request->validate([
            'titol' => 'sometimes|string|max:255',
            'descripcio' => 'nullable|string',
        ]);

        $portfoli->update(
            $request->only('titol', 'descripcio')
        );

        return response()->json([
            'success' => true,
            'data' => $portfoli
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Portfoli $portfoli)
    {
        $portfoli->delete();

        return response()->json([
            'success' => true,
            'message' => 'Portfoli eliminat'
        ]);
    }
}
