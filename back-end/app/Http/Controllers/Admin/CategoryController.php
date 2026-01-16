<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categoria;

class CategoryController extends Controller
{
    public function index()
    {
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
            'nom' => 'required|string|max:255|unique:categories,nom',
            'descripcio' => 'nullable|string|max:1000',
        ]);

        Categoria::create([
            'nom' => $request->nom,
            'descripcio' => $request->descripcio,
        ]);

        return redirect()->route('admin.categories.index')
                         ->with('success', 'Categoria creada correctament');
    }

    public function edit(Categoria $category)
    {
        return view('admin.categories.edit', compact('category'));
    }

    public function update(Request $request, Categoria $category)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:categories,nom,' . $category->id,
            'descripcio' => 'nullable|string|max:1000',
        ]);

        $category->update([
            'nom' => $request->nom,
            'descripcio' => $request->descripcio,
        ]);

        return redirect()->route('admin.categories.index')
                         ->with('success', 'Categoria actualitzada correctament');
    }

    public function destroy(Categoria $category)
    {
        $category->delete();

        return redirect()->route('admin.categories.index')
                         ->with('success', 'Categoria eliminada correctament');
    }
}
