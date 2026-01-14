<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tag;


/**
 * @OA\Tag(
 *     name="Tag",
 *     description="Gestió de Tags"
 * )
 */
class TagController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/tags",
     *     summary="Llistar tots els tags",
     *     tags={"Tag"},
     *     @OA\Response(
     *         response=200,
     *         description="Llista de tags",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Tag")
     *             )
     *         )
     *     )
     * )
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
     * @OA\Post(
     *     path="/api/tags",
     *     summary="Crear un nou tag",
     *     tags={"Tag"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="nom", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Tag creat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Tag")
     *         )
     *     )
     * )
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
     * @OA\Get(
     *     path="/api/tags/{tag}",
     *     summary="Mostrar un tag específic",
     *     tags={"Tag"},
     *     @OA\Parameter(
     *         name="tag",
     *         in="path",
     *         description="ID del tag",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dades del tag",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Tag")
     *         )
     *     )
     * )
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
     * @OA\Put(
     *     path="/api/tags/{tag}",
     *     summary="Actualitzar un tag",
     *     tags={"Tag"},
     *     @OA\Parameter(
     *         name="tag",
     *         in="path",
     *         description="ID del tag",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="nom", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tag actualitzat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Tag")
     *         )
     *     )
     * )
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
     * @OA\Delete(
     *     path="/api/tags/{tag}",
     *     summary="Eliminar un tag",
     *     tags={"Tag"},
     *     @OA\Parameter(
     *         name="tag",
     *         in="path",
     *         description="ID del tag",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Tag eliminat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string", example="Tag eliminat")
     *         )
     *     )
     * )
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
