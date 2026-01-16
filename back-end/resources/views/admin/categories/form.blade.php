<div class="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ $mode }} categoria</h1>

    @if($errors->any())
        <div class="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded">
            <ul class="list-disc pl-5">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ $action }}" method="POST" class="space-y-4">
        @csrf
        @if($method === 'PUT') @method('PUT') @endif

        {{-- Nom --}}
        <div>
            <label class="block text-gray-700 mb-1">Nom</label>
            <input type="text" name="nom" value="{{ old('nom', $category->nom ?? '') }}"
                   class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-gray-400" required>
        </div>

        {{-- Descripció --}}
        <div>
            <label class="block text-gray-700 mb-1">Descripció</label>
            <textarea name="descripcio" rows="4"
                      class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-gray-400"
                      required>{{ old('descripcio', $category->descripcio ?? '') }}</textarea>
        </div>

        {{-- Botons --}}
        <div class="flex justify-end gap-4">
            <a href="{{ route('admin.categories.index') }}" class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">Cancel·lar</a>
            <button class="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700">Guardar</button>
        </div>
    </form>
</div>
