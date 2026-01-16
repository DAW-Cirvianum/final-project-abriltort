<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tag;

class TagController extends Controller
{
    // Mostrar tots els tags
    public function index()
    {
        $tags = Tag::all();
        return view('admin.tags.index', compact('tags'));
    }

    // Formulari per crear un nou tag
    public function create()
    {
        return view('admin.tags.create');
    }

    // Guardar un nou tag
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:tags,nom',
        ]);

        Tag::create([
            'nom' => $request->nom
        ]);

        return redirect()->route('admin.tags.index')
                         ->with('success', 'Tag creat correctament');
    }

    // Formulari per editar un tag existent
    public function edit(Tag $tag)
    {
        return view('admin.tags.edit', compact('tag'));
    }

    // Actualitzar un tag existent
    public function update(Request $request, Tag $tag)
    {
        $request->validate([
            'nom' => 'required|string|max:255|unique:tags,nom,' . $tag->id,
        ]);

        $tag->update([
            'nom' => $request->nom
        ]);

        return redirect()->route('admin.tags.index')
                         ->with('success', 'Tag actualitzat correctament');
    }

    // Eliminar un tag
    public function destroy(Tag $tag)
    {
        $tag->delete();

        return redirect()->route('admin.tags.index')
                         ->with('success', 'Tag eliminat correctament');
    }
}
