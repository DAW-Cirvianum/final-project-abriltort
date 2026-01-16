<div class="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">
        {{ $mode }} usuari
    </h1>

    @if ($errors->any())
    <div class="mb-4 bg-red-100 text-red-900 px-4 py-3 rounded">
        <ul class="list-disc pl-5">
            @foreach ($errors->all() as $error)
            <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
    @endif

    <form method="POST" action="{{ $action }}" class="space-y-4" enctype="multipart/form-data">
        @csrf
        @if($method === 'PUT')
        @method('PUT')
        @endif

        {{-- Nom --}}
        <div>
            <label class="block text-gray-700 mb-1">Nom</label>
            <input type="text" name="name"
                value="{{ old('name', $user->name ?? '') }}"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-gray-400"
                required>
        </div>

        {{-- Email --}}
        <div>
            <label class="block text-gray-700 mb-1">Email</label>
            <input type="email" name="email"
                value="{{ old('email', $user->email ?? '') }}"
                class="w-full border border-gray-300 rounded px-3 py-2"
                required>
        </div>

        <!-- Password -->
        <div>
            <label class="block text-gray-700 mb-1">Contrasenya</label>
            <input type="password" name="password"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-gray-400"
                {{ $mode === 'create' ? 'required' : '' }}>
        </div>

        <!-- Confirm Password -->
        <div>
            <label class="block text-gray-700 mb-1">Confirma contrasenya</label>
            <input type="password" name="password_confirmation"
                class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-gray-400"
                {{ $mode === 'create' ? 'required' : '' }}>
        </div>
        {{-- Foto de perfil --}}
        <div>
            <label class="block text-gray-700 mb-1">Foto de perfil</label>
            <input type="file" name="imatge"
                class="w-full border border-gray-300 rounded px-3 py-2">
            @if(isset($user) && $user->imatge)
            <img src="{{ asset('storage/' . $user->imatge) }}" alt="Avatar" class="mt-2 w-20 h-20 rounded-full object-cover">
            @endif
        </div>

        {{-- Rol --}}
        <div>
            <label class="block text-gray-700 mb-1">Rol</label>
            <select name="rol"
                class="w-full border border-gray-300 rounded px-3 py-2"
                required>
                <option value="">Selecciona un rol</option>
                <option value="admin" {{ old('rol', $user->rol ?? '') == 'admin' ? 'selected' : '' }}>Admin</option>
                <option value="user" {{ old('rol', $user->rol ?? '') == 'user' ? 'selected' : '' }}>Usuari</option>
            </select>
        </div>

        {{-- Botons --}}
        <div class="flex justify-end gap-4">
            <a href="{{ route('admin.users.index') }}"
                class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
                Cancel·lar
            </a>

            <button class="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700">
                Guardar
            </button>
        </div>
    </form>
</div>