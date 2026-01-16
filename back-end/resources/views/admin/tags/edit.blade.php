<x-admin-layout>
    @include('admin.tags.form', [
        'mode' => 'Editar',
        'action' => route('admin.tags.update', $tag),
        'method' => 'PUT',
        'tag' => $tag
    ])
</x-admin-layout>
