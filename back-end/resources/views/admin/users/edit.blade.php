<x-app-layout>
    <div class="container mx-auto p-6">
        <h1 class="text-2xl font-bold mb-4">Editar Usuari</h1>

        @if ($errors->any())
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <ul class="list-disc pl-5">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('admin.users.update', $user) }}" method="POST" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            @csrf
            @method('PUT')

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Nom</label>
                <input id="name" name="name" type="text" value="{{ old('name', $user->name) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                <input id="email" name="email" type="email" value="{{ old('email', $user->email) }}"
                       class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="rol">Rol</label>
                <select id="rol" name="rol"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                    <option value="">Selecciona un rol</option>
                    <option value="admin" {{ old('rol', $user->rol) == 'admin' ? 'selected' : '' }}>Admin</option>
                    <option value="user" {{ old('rol', $user->rol) == 'user' ? 'selected' : '' }}>Usuari</option>
                </select>
            </div>

            <div class="flex items-center justify-between">
                <button type="submit"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Actualitzar
                </button>

                <a href="{{ route('admin.users.index') }}"
                   class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                    Cancel·lar
                </a>
            </div>
        </form>
    </div>
</x-app-layout>
