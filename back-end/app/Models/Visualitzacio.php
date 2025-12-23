<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visualitzacio extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuari_id',
        'obra_id',
        'data_visualitzacio',
    ];

    // Relació N a 1 amb Usuari
    public function usuari()
    {
        return $this->belongsTo(User::class);
    }

    // Relació N a 1 amb Obra
    public function obra()
    {
        return $this->belongsTo(Obra::class);
    }
}
