<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
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
     * Store a newly created resource in storage.
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
            'role' => $request->role ?? 'user',
        ]);

        return response()->json([
            'success' => true,
            'data' => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
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
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuari eliminat'
        ]);
    }

    // Mostrar perfil propi
    public function showSelf()
    {
        $user = Auth::guard('sanctum')->user(); // Usant guard de Sanctum
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    // Actualitzar perfil propi
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
        'name' => 'sometimes|string|max:255',
        'email' => 'sometimes|email|unique:users,email,' . $user->id,
        'password' => 'sometimes|string|min:8',
    ]);

    // Preparem les dades per actualitzar només els camps existents
    $data = $request->only(['name', 'email']);

    if ($request->filled('password')) {
        $data['password'] = bcrypt($request->password);
    }

    // Actualitzem l'usuari
    $user->update($data);

    // Retornem l'usuari actualitzat
    return response()->json([
        'success' => true,
        'message' => 'Perfil actualitzat correctament',
        'data' => $user
    ]);
}

}