<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;

class CategoryController extends Controller
{
    public function index()
    {
        // Obté totes les categories
        $categories = Categoria::all();
        return view('admin.categories.index', compact('categories'));
    }

    public function create()
    {
        return view('admin.categories.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            // Validació: nom obligatori i únic
            'nom' => 'required|string|max:255|unique:categories,nom',
            'descripcio' => 'nullable|string|max:1000',
        ]);

        Categoria::create([
            'nom' => $request->nom,
            'descripcio' => $request->descripcio,
        ]);

        return redirect()->route('admin.categories.index')
            // Redirigeix amb missatge d'èxit
            ->with('success', 'Categoria creada correctament');
    }

    public function edit(Categoria $category)
    {
        return view('admin.categories.edit', compact('category'));
    }

    public function update(Request $request, Categoria $category)
    {
        $request->validate([
            // Validació: nom únic excepte el mateix
            'nom' => 'required|string|max:255|unique:categories,nom,' . $category->id,
            'descripcio' => 'nullable|string|max:1000',
        ]);

        $category->update([
            'nom' => $request->nom,
            'descripcio' => $request->descripcio,
        ]);

        return redirect()->route('admin.categories.index')
            // Redirigeix amb missatge d'èxit
            ->with('success', 'Categoria actualitzada correctament');
    }

    public function destroy(Categoria $category)
    {
        // Elimina la categoria
        $category->delete();

        return redirect()->route('admin.categories.index')
            // Redirigeix amb missatge d'èxit
            ->with('success', 'Categoria eliminada correctament');
    }
}
