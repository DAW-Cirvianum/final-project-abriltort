<x-admin-layout>
    @include('admin.categories.form', [
        'mode' => 'Crear', 
        'action' => route('admin.categories.store'), 
        'method' => 'POST', 
        'category' => null 
    ])
</x-admin-layout>