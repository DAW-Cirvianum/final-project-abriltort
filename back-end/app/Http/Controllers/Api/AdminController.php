<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function users()
    {
        return response()->json([
            'status' => true,
            'data' => User::all(),
        ]);
    }
}
