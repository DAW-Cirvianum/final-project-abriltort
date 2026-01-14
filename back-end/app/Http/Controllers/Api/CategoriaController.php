<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;

/**
 * @OA\Tag(
 *     name="Categoria",
 *     description="Gestió de categories"
 * )
 */
class CategoriaController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/categories",
     *     summary="Obtenir totes les categories",
     *     tags={"Categoria"},
     *     @OA\Response(
     *         response=200,
     *         description="Llista de categories",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Categoria")
     *             )
     *         )
     *     )
     * )
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
     * @OA\Post(
     *     path="/api/categories",
     *     summary="Crear una nova categoria",
     *     tags={"Categoria"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="nom", type="string"),
     *             @OA\Property(property="descripcio", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Categoria creada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Categoria")
     *         )
     *     )
     * )
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
     * @OA\Get(
     *     path="/api/categories/{category}",
     *     summary="Mostrar una categoria específica",
     *     tags={"Categoria"},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         description="ID de la categoria",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dades de la categoria",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Categoria")
     *         )
     *     )
     * )
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
     * @OA\Put(
     *     path="/api/categories/{category}",
     *     summary="Actualitzar una categoria",
     *     tags={"Categoria"},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         description="ID de la categoria",
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
     *         description="Categoria actualitzada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Categoria")
     *         )
     *     )
     * )
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
     * @OA\Delete(
     *     path="/api/categories/{category}",
     *     summary="Eliminar una categoria",
     *     tags={"Categoria"},
     *     @OA\Parameter(
     *         name="category",
     *         in="path",
     *         description="ID de la categoria",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Categoria eliminada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string", example="Categoria eliminada")
     *         )
     *     )
     * )
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
