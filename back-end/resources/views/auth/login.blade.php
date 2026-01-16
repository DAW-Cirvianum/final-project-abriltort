<x-guest-layout>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <h1 class="text-2xl font-bold text-gray-900 text-center mb-6">Inicia sessió</h1>

            <!-- Session Status -->
            <x-auth-session-status class="mb-4" :status="session('status')" />

            <form method="POST" action="{{ route('login') }}" class="space-y-4">
                @csrf

                <!-- Email -->
                <div>
                    <x-input-label for="email" :value="__('Email')" class="mb-1" />
                    <x-text-input id="email" class="block w-full border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-500 focus:outline-none" 
                                  type="email" name="email" :value="old('email')" required autofocus />
                    <x-input-error :messages="$errors->get('email')" class="mt-1 text-red-600 text-sm" />
                </div>

                <!-- Password -->
                <div>
                    <x-input-label for="password" :value="__('Password')" class="mb-1" />
                    <x-text-input id="password" class="block w-full border-gray-300 rounded px-3 py-2 focus:ring focus:ring-indigo-500 focus:outline-none"
                                  type="password" name="password" required />
                    <x-input-error :messages="$errors->get('password')" class="mt-1 text-red-600 text-sm" />
                </div>

                <div class="flex items-center justify-between">
                    <button type="submit" class="w-full bg-gray-900 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition">
                        {{ __('Iniciar sessió') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</x-guest-layout>
