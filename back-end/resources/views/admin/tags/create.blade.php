<x-admin-layout>
    @include('admin.tags.form', [
        'mode' => 'Crear',
        'action' => route('admin.tags.store'),
        'method' => 'POST',
        'tag' => null
    ])
</x-admin-layout>
