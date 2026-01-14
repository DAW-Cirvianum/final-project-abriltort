<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Visualitzacio;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Visualitzacio",
 *     description="Gestió de visualitzacions d'obres"
 * )
 */
class VisualitzacioController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/visualitzacions",
     *     summary="Llistar totes les visualitzacions",
     *     tags={"Visualitzacio"},
     *     @OA\Response(
     *         response=200,
     *         description="Llista de visualitzacions",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Visualitzacio")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $visualitzacions = Visualitzacio::all();

        return response()->json([
            'success' => true,
            'data' => $visualitzacions
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/visualitzacions",
     *     summary="Crear una nova visualització",
     *     tags={"Visualitzacio"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="obra_id", type="integer", description="ID de l'obra que es visualitza")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Visualització creada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Visualitzacio")
     *         )
     *     )
     * )
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
     * @OA\Get(
     *     path="/api/visualitzacions/{id}",
     *     summary="Mostrar una visualització específica",
     *     tags={"Visualitzacio"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Visualització trobada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Visualitzacio")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Visualització no trobada")
     * )
     */
    public function show(int $id)
    {
        $visualitzacio = Visualitzacio::find($id);

        if (!$visualitzacio) {
            return response()->json(['success' => false, 'message' => 'Visualització no trobada'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $visualitzacio
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/visualitzacions/{id}",
     *     summary="Actualitzar una visualització",
     *     tags={"Visualitzacio"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="obra_id", type="integer"),
     *             @OA\Property(property="usuari_id", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Visualització actualitzada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Visualitzacio")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Visualització no trobada")
     * )
     */
    public function update(Request $request, int $id)
    {
        $visualitzacio = Visualitzacio::find($id);

        if (!$visualitzacio) {
            return response()->json(['success' => false, 'message' => 'Visualització no trobada'], 404);
        }

        $request->validate([
            'obra_id' => 'sometimes|exists:obres,id',
            'usuari_id' => 'sometimes|exists:users,id',
        ]);

        $visualitzacio->update($request->only(['obra_id', 'usuari_id']));

        return response()->json([
            'success' => true,
            'data' => $visualitzacio
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/visualitzacions/{id}",
     *     summary="Eliminar una visualització",
     *     tags={"Visualitzacio"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Visualització eliminada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(response=404, description="Visualització no trobada")
     * )
     */
    public function destroy(int $id)
    {
        $visualitzacio = Visualitzacio::find($id);

        if (!$visualitzacio) {
            return response()->json(['success' => false, 'message' => 'Visualització no trobada'], 404);
        }

        $visualitzacio->delete();

        return response()->json([
            'success' => true,
            'message' => 'Visualització eliminada'
        ]);
    }
}
