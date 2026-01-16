<x-admin-layout>
    @if(session('success'))
        <div class="mb-6 bg-gray-200 text-gray-900 px-4 py-3 rounded">
            {{ session('success') }}
        </div>
    @endif

    <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
            <a href="{{ route('admin.categories.create') }}" class="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700">
                + Crear categoria
            </a>
        </div>

        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-100 text-left text-gray-700">
                    <th class="p-3">ID</th>
                    <th class="p-3">Nom</th>
                    <th class="p-3">Descripcio</th>
                    <th class="p-3 text-right">Accions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($categories as $category)
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-3">{{ $category->id }}</td>
                    <td class="p-3">{{ $category->nom }}</td>
                    <td class="p-3">{{ $category->descripcio }}</td>
                    <td class="p-3 text-right space-x-3">
                        <a href="{{ route('admin.categories.edit', $category) }}" class="text-gray-700 hover:text-black">Editar</a>
                        <form action="{{ route('admin.categories.destroy', $category) }}" method="POST" class="inline">
                            @csrf
                            @method('DELETE')
                            <button class="text-gray-500 hover:text-black">Eliminar</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</x-admin-layout>
