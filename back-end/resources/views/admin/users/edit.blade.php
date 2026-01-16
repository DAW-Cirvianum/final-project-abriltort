<x-admin-layout>
    @include('admin.users.form', [
        'mode' => 'Editar',
        'action' => route('admin.users.update', $user),
        'method' => 'PUT',
        'user' => $user
    ])
</x-admin-layout>
