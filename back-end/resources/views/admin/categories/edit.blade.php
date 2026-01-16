<x-admin-layout>
    @include('admin.categories.form', [
        'mode' => 'Editar',
        'action' => route('admin.categories.update', $category),
        'method' => 'PUT', 
        'category' => $category 
    ])
</x-admin-layout>