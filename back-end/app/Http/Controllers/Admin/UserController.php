<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Llista usuaris
    public function index()
    {
        $users = User::all();
        return view('admin.users.index', compact('users'));
    }

    // Mostrar formulari per crear
    public function create()
    {
        return view('admin.users.create');
    }

    // Guardar usuari nou
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:users',
            'email' => 'required|email|unique:users',
            'rol' => 'required|in:admin,user',
            'password' => 'nullable|string|min:6',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'rol' => $request->rol,
            'password' => bcrypt($request->password ?? 'password'),
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Usuari creat correctament.');
    }

    // Mostrar formulari per editar
    public function edit(User $user)
    {
        return view('admin.users.edit', compact('user'));
    }

    // Actualitzar usuari
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:users,name,' . $user->id,
            'email' => 'required|email|unique:users,email,' . $user->id,
            'rol' => 'required|in:admin,user',
        ]);

        $user->update($request->only('name', 'email', 'rol'));

        return redirect()->route('admin.users.index')->with('success', 'Usuari actualitzat correctament.');
    }

    // Eliminar usuari
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Usuari eliminat.');
    }
}
