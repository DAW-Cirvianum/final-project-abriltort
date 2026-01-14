<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Obra;
use App\Models\Album;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="Obres",
 *     description="Gestió d'obres i visualitzacions"
 * )
 */
class ObraController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/obres/public",
     *     summary="Obtenir obres públiques més vistes",
     *     tags={"Obres"},
     *     @OA\Parameter(
     *         name="limit",
     *         in="query",
     *         description="Nombre màxim d'obres a retornar",
     *         required=false,
     *         @OA\Schema(type="integer", default=4)
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
    public function publicIndex(Request $request)
    {
        $limit = $request->get('limit', 4);

        $obres = Obra::withCount('visualitzacions')
            ->orderBy('visualitzacions_count', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $obres
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/obres/public/all",
     *     summary="Obtenir totes les obres públiques amb filtres",
     *     tags={"Obres"},
     *     @OA\Parameter(
     *         name="category_id",
     *         in="query",
     *         description="Filtrar per categoria",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="tag_id",
     *         in="query",
     *         description="Filtrar per etiqueta",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Llista d'obres filtrades",
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
    public function publicAll(Request $request)
    {
        $query = Obra::with(['categoria', 'tags'])
            ->withCount('visualitzacions');

        if ($request->filled('category_id')) {
            $query->where('categoria_id', $request->category_id);
        }

        if ($request->filled('tag_id')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tags.id', $request->tag_id);
            });
        }

        $data = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/obres",
     *     summary="Llistar totes les obres (privat)",
     *     tags={"Obres"},
     *     security={{"sanctum":{}}},
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
    public function index()
    {
        $obres = Obra::with(['album', 'categoria', 'tags'])->get();

        return response()->json([
            'success' => true,
            'data' => $obres
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/obres",
     *     summary="Crear una nova obra",
     *     tags={"Obres"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="titol", type="string"),
     *             @OA\Property(property="descripcio", type="string"),
     *             @OA\Property(property="album_id", type="integer"),
     *             @OA\Property(property="categoria_id", type="integer"),
     *             @OA\Property(property="fitxer", type="string", format="binary"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="integer"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Obra creada correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Obra")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'titol' => 'required|string|max:255',
            'descripcio' => 'nullable|string',
            'album_id' => 'required|exists:albums,id',
            'categoria_id' => 'required|exists:categories,id',
            'fitxer' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);

        $album = Album::with('portfoli')->find($request->album_id);

        // Comprovació de l'usuari
        if ($album->portfoli->usuari_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'No tens permís per afegir obres a aquest àlbum'
            ], 403);
        }

        // Guardem fitxer al directori públic
        $fitxerPath = $request->file('fitxer')->store('obres', 'public');

        $obra = $album->obres()->create([
            'categoria_id' => $request->categoria_id,
            'titol' => $request->titol,
            'descripcio' => $request->descripcio,
            // Afegim el /storage/ davant per tenir la URL pública
            'fitxer_url' => '/storage/' . $fitxerPath,
        ]);

        // Tags si venen
        if ($request->has('tags')) {
            $obra->tags()->sync($request->tags);
        }

        $obra->load(['categoria', 'album', 'tags']);

        return response()->json([
            'success' => true,
            'message' => 'Obra creada correctament',
            'data' => $obra
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/obres/{obra}",
     *     summary="Mostrar una obra específica",
     *     tags={"Obres"},
     *     @OA\Parameter(
     *         name="obra",
     *         in="path",
     *         description="ID de l'obra",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dades de l'obra",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Obra")
     *         )
     *     )
     * )
     */
    public function show(Obra $obra)
    {
        $obra->load(['album.portfoli', 'categoria', 'tags']);

        return response()->json([
            'success' => true,
            'data' => $obra
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/obres/{obra}",
     *     summary="Actualitzar una obra",
     *     tags={"Obres"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="obra",
     *         in="path",
     *         description="ID de l'obra",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="titol", type="string"),
     *             @OA\Property(property="descripcio", type="string"),
     *             @OA\Property(property="album_id", type="integer"),
     *             @OA\Property(property="categoria_id", type="integer"),
     *             @OA\Property(property="fitxer", type="string", format="binary"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="integer"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Obra actualitzada",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/Obra")
     *         )
     *     )
     * )
     */
    public function update(Request $request, Obra $obre)
    {
        $request->validate([
            'titol' => 'sometimes|string|max:255',
            'descripcio' => 'nullable|string',
            'album_id' => 'sometimes|exists:albums,id',
            'categoria_id' => 'sometimes|exists:categories,id',
            'fitxer' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'tags' => 'array'
        ]);

        $obre->titol = $request->titol ?? $obre->titol;
        $obre->descripcio = $request->descripcio ?? $obre->descripcio;
        $obre->album_id = $request->album_id ?? $obre->album_id;
        $obre->categoria_id = $request->categoria_id ?? $obre->categoria_id;

        if ($request->hasFile('fitxer')) {
            $fitxerPath = $request->file('fitxer')->store('obres', 'public');
            $obre->fitxer_url = '/storage/' . $fitxerPath;
        }

        $obre->save();

        if ($request->has('tags')) {
            $obre->tags()->sync($request->tags);
        }

        $obre->load(['categoria', 'album', 'tags']);

        return response()->json([
            'success' => true,
            'message' => 'Obra actualitzada',
            'data' => $obre
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/obres/{obra}",
     *     summary="Eliminar una obra",
     *     tags={"Obres"},
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="obra",
     *         in="path",
     *         description="ID de l'obra",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Obra eliminada correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string", example="Obra eliminada")
     *         )
     *     )
     * )
     */
    public function destroy(Obra $obre)
    {
        $obre->delete();

        return response()->json([
            'success' => true,
            'message' => 'Obra eliminada'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/obres/{obra}/with-album",
     *     summary="Mostrar obra amb l'àlbum i incrementar visualitzacions",
     *     tags={"Obres"},
     *     @OA\Parameter(
     *      name="obra",
     *      in="path",
     *      required=true,
     *      @OA\Schema(type="integer")
     *      ),
     *     @OA\Response(
     *         response=200,
     *         description="Dades de l'obra amb àlbum i visualitzacions",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/Obra")
     *         )
     *     )
     * )
     */
    public function showWithAlbum(Obra $obra)
    {
        // Crear una visualització
        $obra->visualitzacions()->create();

        $obra->load([
            'album.obres' => function ($query) {
                $query->orderBy('id');
            }
        ])->loadCount('visualitzacions');

        return response()->json([
            'success' => true,
            'data' => $obra
        ]);
    }
}
