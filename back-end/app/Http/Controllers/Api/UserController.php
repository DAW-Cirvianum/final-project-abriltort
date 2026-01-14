<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 *     name="User",
 *     description="Gestió d'usuaris i artistes"
 * )
 */
class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/artistes/public",
     *     summary="Obtenir artistes públics",
     *     tags={"User"},
     *     @OA\Parameter(
     *         name="limit",
     *         in="query",
     *         description="Número màxim d'artistes a retornar",
     *         required=false,
     *         @OA\Schema(type="integer", default=4)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Llista d'artistes",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function publicArtistes(Request $request)
    {
        $userId = Auth::id();
        return User::where('rol', 'user')
            ->where('id', '!=', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($request->limit ?? 4)
            ->get();
    }

    /**
     * @OA\Get(
     *     path="/api/artistes",
     *     summary="Obtenir artistes amb paginació",
     *     tags={"User"},
     *     @OA\Parameter(
     *         name="limit",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer", default=4)
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Artistes paginats",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/User")
     *             ),
     *             @OA\Property(
     *                 property="meta",
     *                 type="object",
     *                 @OA\Property(property="current_page", type="integer"),
     *                 @OA\Property(property="last_page", type="integer"),
     *                 @OA\Property(property="per_page", type="integer"),
     *                 @OA\Property(property="total", type="integer")
     *             )
     *         )
     *     )
     * )
     */
    public function paginatedArtistes(Request $request)
    {
        $limit = $request->limit ?? 4;
        $page = $request->page ?? 1;
        // id de l'usuari loguejat
        $userId = auth()->id(); 

        $query = User::where('rol', 'user');

        // Excloure l'usuari loguejat si està autenticat
        if ($userId) {
            $query->where('id', '!=', $userId);
        }

        $artistes = $query
            ->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $artistes->items(),
            'meta' => [
                'current_page' => $artistes->currentPage(),
                'last_page' => $artistes->lastPage(),
                'per_page' => $artistes->perPage(),
                'total' => $artistes->total(),
            ]
        ]);
    }
    /**
     * @OA\Get(
     *     path="/api/artistes/{id}",
     *     summary="Mostrar informació pública d'un artista",
     *     tags={"User"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID de l'artista",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dades de l'artista",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="data", ref="#/components/schemas/User")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Artista no trobat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="error", type="string", example="Artista no trobat")
     *         )
     *     )
     * )
     */
    public function showPublic($id)
    {
        $user = User::with(['portfoli.albums'])->find($id);

        if (!$user) {
            return response()->json(['error' => 'Artista no trobat'], 404);
        }

        return response()->json(['data' => $user]);
    }

    /**
     * @OA\Get(
     *     path="/api/users",
     *     summary="Obtenir tots els usuaris",
     *     tags={"User"},
     *     @OA\Response(
     *         response=200,
     *         description="Llista d'usuaris",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/User")
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $users = User::all();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/users",
     *     summary="Crear un nou usuari",
     *     tags={"User"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="role", type="string", example="user")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuari creat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'sometimes|string|in:admin,user'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $request->role ?? 'usuari',
        ]);

        return response()->json([
            'success' => true,
            'data' => $user
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/users/{user}",
     *     summary="Mostrar un usuari específic",
     *     tags={"User"},
     *     @OA\Parameter(
     *         name="user",
     *         in="path",
     *         description="ID de l'usuari",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Dades de l'usuari",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function show(User $user)
    {
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/users/{user}",
     *     summary="Actualitzar un usuari",
     *     tags={"User"},
     *     @OA\Parameter(
     *         name="user",
     *         in="path",
     *         description="ID de l'usuari",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="rol", type="string", example="user")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuari actualitzat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255|unique:users,name,' . $user->id,
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'rol' => 'sometimes|string|in:admin,user'
        ]);

        $data = $request->only('name', 'email', 'rol');

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * @OA\Delete(
     *     path="/api/users/{user}",
     *     summary="Eliminar un usuari",
     *     tags={"User"},
     *     @OA\Parameter(
     *         name="user",
     *         in="path",
     *         description="ID de l'usuari",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Usuari eliminat correctament",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string", example="Usuari eliminat")
     *         )
     *     )
     * )
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuari eliminat'
        ]);
    }

    /**
     * @OA\Get(
     *     path="/api/user/profile",
     *     summary="Mostrar perfil de l'usuari autenticat",
     *     tags={"User"},
     *     security={{"sanctum":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Dades de l'usuari",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function showSelf()
    {
        $user = Auth::guard('sanctum')->user();
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * @OA\Put(
     *     path="/api/user/profile",
     *     summary="Actualitzar perfil de l'usuari autenticat",
     *     tags={"User"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=false,
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="imatge", type="string", format="binary")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Perfil actualitzat",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/User")
     *         )
     *     )
     * )
     */
    public function updateSelf(Request $request)
    {
    // Recuperem l'usuari autenticat amb Sanctum
        /** @var \App\Models\User $user */
        $user = Auth::guard('sanctum')->user();

        // Comprovem si hi ha usuari
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuari no autenticat'
            ], 401);
        }

        // Validació de dades que poden ser actualitzades
        $request->validate([
            'name' => 'sometimes|string|max:255|unique:users,name,' . $user->id,
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'imatge' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048', // nova validació
        ]);

        $data = $request->only(['name', 'email']);

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        // Guardar la imatge si s'ha pujat
        if ($request->hasFile('imatge')) {
            $path = $request->file('imatge')->store('avatars', 'public');
            $data['imatge'] = $path;
        }

        $user->update($data);

        // Retornem l'usuari actualitzat
        return response()->json([
            'success' => true,
            'message' => 'Perfil actualitzat correctament',
            'data' => $user
        ]);
    }
}
