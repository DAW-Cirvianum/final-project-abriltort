<x-admin-layout>
    @include('admin.users.form', [
        'mode' => 'Crear',
        'action' => route('admin.users.store'),
        'method' => 'POST',
        'user' => null
    ])
</x-admin-layout>
