<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Album;
use App\Models\Portfoli;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Album",
 *     description="Gestió d'àlbums"
 * )
 */
class AlbumController extends Controller
{
   /**
     * @OA\Get(
     *     path="/api/albums",
     *     summary="Obtenir tots els àlbums de l'usuari autenticat",
     *     tags={"Album"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Llista d'àlbums",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Album")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $userId = auth()->id();

        $albums = Album::with('portfoli')
            ->whereHas('portfoli', function ($q) use ($userId) {
                $q->where('usuari_id', $userId);
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $albums
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/albums",
     *     summary="Crear un nou àlbum",
     *     tags={"Album"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="portfoli_id", type="integer"),
     *             @OA\Property(property="nom", type="string"),
     *             @OA\Property(property="descripcio", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Àlbum creat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Album")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="No tens permís"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ja existeix un àlbum amb aquest nom"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'portfoli_id' => 'required|exists:portfolis,id',
            'nom' => 'required|string|max:255',
            'descripcio' => 'nullable|string',
        ]);

        $portfoli = Portfoli::where('id', $request->portfoli_id)
            ->where('usuari_id', Auth::id())
            ->first();

        if (!$portfoli) {
            return response()->json([
                'success' => false,
                'message' => 'No tens permís per crear àlbums en aquest portfoli'
            ], 403);
        }

        // Comprovem si ja existeix un àlbum amb el mateix nom dins del portfoli
        $existing = Album::where('portfoli_id', $request->portfoli_id)
            ->where('nom', $request->nom)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Ja existeix un àlbum amb aquest nom en aquest portfoli.'
            ], 422);
        }

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
     * @OA\Get(
     *     path="/api/albums/{album}",
     *     summary="Mostrar un àlbum específic",
     *     tags={"Album"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="album",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dades de l'àlbum",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Album")
     *         )
     *     )
     * )
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
     * @OA\Put(
     *     path="/api/albums/{album}",
     *     summary="Actualitzar un àlbum",
     *     tags={"Album"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="album",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="nom", type="string"),
     *             @OA\Property(property="descripcio", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Àlbum actualitzat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Album")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ja existeix un àlbum amb aquest nom"
     *     )
     * )
     */
    public function update(Request $request, Album $album)
    {
        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'descripcio' => 'nullable|string',
        ]);

        // Comprovem si el nou nom ja existeix en un altre àlbum del mateix portfoli
        if ($request->has('nom')) {
            $duplicate = Album::where('portfoli_id', $album->portfoli_id)
                ->where('nom', $request->nom)
                ->where('id', '!=', $album->id)
                ->first();

            if ($duplicate) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ja existeix un àlbum amb aquest nom en aquest portfoli.'
                ], 422);
            }
        }

        $album->update(
            $request->only('nom', 'descripcio')
        );

        return response()->json([
            'success' => true,
            'data' => $album
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/albums/{album}",
     *     summary="Eliminar un àlbum",
     *     tags={"Album"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="album",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Àlbum eliminat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string", example="Àlbum eliminat")
     *         )
     *     )
     * )
     */
    public function destroy(Album $album)
    {
        $album->delete();

        return response()->json([
            'success' => true,
            'message' => 'Àlbum eliminat'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/albums/{album}/obres",
     *     summary="Obtenir totes les obres d'un àlbum",
     *     tags={"Album"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="album",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Llista d'obres",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Obra")
     *             )
     *         )
     *     )
     * )
     */
    public function obres(Album $album)
    {
        // Carrega les obres relacionades
        $obres = $album->obres()
            ->with('album.portfoli')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $obres
        ]);
    }
}
