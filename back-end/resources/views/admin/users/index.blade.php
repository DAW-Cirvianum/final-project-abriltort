<x-admin-layout>
    @if(session('success'))
    <div class="mb-6 bg-green-100 text-green-900 px-4 py-3 rounded">
        {{ session('success') }}
    </div>
    @endif

    @if(session('error'))
    <div class="mb-6 bg-red-100 text-red-900 px-4 py-3 rounded">
        {{ session('error') }}
    </div>
    @endif

    <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Usuaris</h1>

            <a href="{{ route('admin.users.create') }}"
                class="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-700">
                + Crear usuari
            </a>
        </div>

        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-100 text-left text-gray-700">
                    <th class="p-3">ID</th>
                    <th class="p-3">Nom</th>
                    <th class="p-3">Email</th>
                    <th class="p-3">Rol</th>
                    <th class="p-3">Estat</th>
                    <th class="p-3 text-right">Accions</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-3">{{ $user->id }}</td>
                    <td class="p-3">{{ $user->name }}</td>
                    <td class="p-3">{{ $user->email }}</td>
                    <td class="p-3 capitalize">{{ $user->rol }}</td>

                    {{-- Estat --}}
                    <td class="p-3">
                        @if($user->active)
                        <span class="text-green-600 font-semibold">Actiu</span>
                        @else
                        <span class="text-red-600 font-semibold">Inactiu</span>
                        @endif
                    </td>

                    {{-- Accions --}}
                    <td class="p-3 text-right space-x-3">
                        <a href="{{ route('admin.users.edit', $user) }}"
                            class="text-gray-700 hover:text-black">
                            Editar
                        </a>

                        {{-- Activar / Desactivar --}}
                        <form method="POST"
                            action="{{ route('admin.users.toggle', $user) }}"
                            class="inline">
                            @csrf
                            @method('PATCH')
                            <button
                                class="text-sm font-semibold
                                {{ $user->active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800' }}">
                                {{ $user->active ? 'Desactivar' : 'Activar' }}
                            </button>
                        </form>

                        {{-- Eliminar --}}
                        <form action="{{ route('admin.users.destroy', $user) }}"
                            method="POST" class="inline">
                            @csrf
                            @method('DELETE')
                            <button class="text-gray-500 hover:text-black">
                                Eliminar
                            </button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</x-admin-layout>