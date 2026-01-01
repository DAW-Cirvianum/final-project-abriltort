<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = $request->user();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }
    public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:8|confirmed',
        'imatge' => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('imatge')) {
        $avatarPath = $request->file('imatge')->store('avatars', 'public');
    } else {
        $avatarPath = 'avatars/default.png';
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'role' => 'user',
        'imatge' => $avatarPath,
    ]);

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'success' => true,
        'user' => $user,
        'token' => $token,
    ], 201);
}

}
