<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- @vite(['resources/css/app.css', 'resources/js/app.js']) -->

    <head>
        ...
        <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    </head>
</head>

<body class="bg-gray-100 text-gray-900 font-sans">

    <!-- Barra de navegació -->
    <nav class="bg-gray-900 text-white shadow-md">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="{{ route('dashboard') }}" class="font-bold text-lg">Admin Panel</a>
            <div class="flex space-x-4">
                <a href="{{ route('admin.users.index') }}" class="hover:text-gray-300">Usuaris</a>
                <a href="{{ route('profile.edit') }}" class="hover:text-gray-300">Perfil</a>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="hover:text-gray-300">Tancar sessió</button>
                </form>
            </div>
        </div>
    </nav>

    <!-- Contingut principal -->
    <main class="mt-6 max-w-7xl mx-auto px-4">
        {{ $slot }}
    </main>

</body>

</html>