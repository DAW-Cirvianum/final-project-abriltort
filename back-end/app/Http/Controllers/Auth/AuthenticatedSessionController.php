<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Autenticar l'usuari
    $request->authenticate();

    $user = Auth::user(); // obtenir usuari autenticat

    // Comprovar si és admin
    if (Auth::user()->rol !== 'admin') {
        Auth::logout(); // tanca la sessió si no és admin
        return redirect()->route('login')->withErrors([
            'email' => 'Només els administradors poden iniciar sessió.',
        ]);
    }

    // Comprovar si està actiu
    if (!$user->active) {
        Auth::logout();
        return redirect()->route('login')->withErrors([
            'email' => 'Aquest usuari està desactivat.',
        ]);
    }

    // Regenerar sessió i redirigir a dashboard
    $request->session()->regenerate();

    // Redirigir a l'admin dashboard
    return redirect()->intended(route('admin.dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
