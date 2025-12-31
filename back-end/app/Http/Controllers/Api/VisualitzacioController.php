<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Visualitzacio;
use Illuminate\Support\Facades\Auth;

class VisualitzacioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'obra_id' => 'required|exists:obres,id',
        ]);

        // Agafem l'usuari només si hi ha token de Sanctum
        $usuari = Auth::guard('sanctum')->user();
        $usuariId = $usuari?->id; // null si no hi ha token

        $visualitzacio = Visualitzacio::create([
            'obra_id' => $request->obra_id,
            'usuari_id' => $usuariId,
        ]);

        return response()->json([
            'success' => true,
            'data' => $visualitzacio,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
