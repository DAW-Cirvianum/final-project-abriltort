<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 text-gray-900 min-h-screen">

    {{-- Navbar --}}
    <nav class="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <a href="{{ route('admin.dashboard') }}" class="font-bold text-lg">Admin Dashboard</a>
        <div class="flex items-center gap-6">
            <a href="{{ route('admin.users.index') }}" class="hover:underline">Usuaris</a>
            <a href="{{ route('admin.categories.index') }}" class="hover:underline">Categories</a>
            <a href="{{ route('admin.tags.index') }}" class="hover:underline">Tags</a>
            <form action="{{ route('logout') }}" method="POST" class="inline">
                @csrf
                <button type="submit" class="hover:underline">Sortir</button>
            </form>
        </div>
    </nav>

    {{-- Contingut --}}
    <main class="p-6">
        {{ $slot }}
    </main>

</body>
</html>

