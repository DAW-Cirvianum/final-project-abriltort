<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Portfoli;

/**
 * @OA\Tag(
 *     name="Portfoli",
 *     description="Gestió de portfolis"
 * )
 */
class PortfoliController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/portfolis",
     *     summary="Obtenir tots els portfolis (admin o test)",
     *     tags={"Portfoli"},
     *     @OA\Response(
     *         response=200,
     *         description="Llista de portfolis",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Portfoli")
     *             )
     *         )
     *     )
     * )
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
     * @OA\Get(
     *     path="/api/portfolis/{userId}",
     *     summary="Obtenir el portfoli d'un usuari",
     *     tags={"Portfoli"},
     *     @OA\Parameter(
     *         name="userId",
     *         in="path",
     *         description="ID de l'usuari",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Portfoli de l'usuari",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Portfoli")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="No s’ha trobat el portfoli",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function showPortfoliUser($userId)
    {
        // Busquem el portfoli amb el user_id corresponent
        $portfoli = Portfoli::where('usuari_id', $userId)->with('albums')->first();

        if (!$portfoli) {
            return response()->json([
                'success' => false,
                'message' => 'No s’ha trobat el portfoli'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $portfoli
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/portfolis",
     *     summary="Crear un portfoli per l'usuari autenticat",
     *     tags={"Portfoli"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="titol", type="string"),
     *             @OA\Property(property="descripcio", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Portfoli creat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Portfoli")
     *         )
     *     )
     * )
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
     * @OA\Get(
     *     path="/api/portfolis/{portfoli}/show",
     *     summary="Mostrar un portfoli amb albums",
     *     tags={"Portfoli"},
     *     @OA\Parameter(
     *         name="portfoli",
     *         in="path",
     *         description="ID del portfoli",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dades del portfoli amb albums",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Portfoli")
     *         )
     *     )
     * )
     */
    public function show(Portfoli $portfoli)
    {
        // Comprovem que l'usuari és el propietari
        if ($portfoli->usuari_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tens permisos per veure aquest portfoli.'
            ], 403);
        }

        $portfoli->load('albums');

        return response()->json([
            'success' => true,
            'data' => $portfoli
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/portfolis/{portfoli}",
     *     summary="Actualitzar un portfoli específic",
     *     tags={"Portfoli"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="portfoli",
     *         in="path",
     *         description="ID del portfoli",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="titol", type="string"),
     *             @OA\Property(property="descripcio", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Portfoli actualitzat correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Portfoli")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Sense permisos per actualitzar aquest portfoli",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function update(Request $request, Portfoli $portfoli)
    {
        if ($portfoli->usuari_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tens permisos per actualitzar aquest portfoli.'
            ], 403);
        }

        $request->validate([
            'titol' => 'sometimes|string|max:255',
            'descripcio' => 'nullable|string',
        ]);

        $portfoli->update($request->only('titol', 'descripcio'));

        return response()->json([
            'success' => true,
            'data' => $portfoli
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/portfolis/{portfoli}",
     *     summary="Eliminar un portfoli",
     *     tags={"Portfoli"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="portfoli",
     *         in="path",
     *         description="ID del portfoli",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Portfoli eliminat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string", example="Portfoli eliminat")
     *         )
     *     )
     * )
     */
    public function destroy(Portfoli $portfoli)
    {
        $portfoli->delete();

        return response()->json([
            'success' => true,
            'message' => 'Portfoli eliminat'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/portfoli/my",
     *     summary="Mostrar el portfoli de l'usuari autenticat",
     *     tags={"Portfoli"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Portfoli de l'usuari autenticat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Portfoli")
     *         )
     *     )
     * )
     */
    public function myPortfoli()
    {
        $user = Auth::user();
        $portfoli = Portfoli::where('usuari_id', $user->id)->with('albums')->first();

        return response()->json([
            'success' => true,
            'data' => $portfoli
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/portfoli/my",
     *     summary="Crear el portfoli de l'usuari autenticat (si no existeix)",
     *     tags={"Portfoli"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="titol", type="string"),
     *             @OA\Property(property="descripcio", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Portfoli creat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Portfoli")
     *         )
     *     )
     * )
     */
    public function createSelf(Request $request)
    {
        $user = Auth::user();

        // Comprovem si ja existeix
        $existing = Portfoli::where('usuari_id', $user->id)->first();
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Ja tens un portfoli.'
            ], 400);
        }

        $request->validate([
            'titol' => 'required|string|max:255',
            'descripcio' => 'nullable|string',
        ]);
        $portfoli = Portfoli::create([
            'usuari_id' => $user->id,
            'titol' => $request->titol,
            'descripcio' => $request->descripcio
        ]);

        return response()->json([
            'success' => true,
            'data' => $portfoli
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/portfoli/my",
     *     summary="Actualitzar el portfoli de l'usuari autenticat",
     *     tags={"Portfoli"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="titol", type="string"),
     *             @OA\Property(property="descripcio", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Portfoli actualitzat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Portfoli")
     *         )
     *     )
     * )
     */
    public function updateSelf(Request $request)
    {
        $user = Auth::user();
        $portfoli = Portfoli::where('usuari_id', $user->id)->first();

        if (!$portfoli) {
            return response()->json([
                'success' => false,
                'message' => 'No tens cap portfoli per actualitzar.'
            ], 404);
        }

        $request->validate([
            'titol' => 'required|string|max:255',
            'descripcio' => 'nullable|string',
        ]);

        $portfoli->update([
            'titol' => $request->titol,
            'descripcio' => $request->descripcio
        ]);

        return response()->json([
            'success' => true,
            'data' => $portfoli
        ]);
    }
}
