<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'descripcio',
    ];

    // Relació 1 a N amb Obres
    public function obres()
    {
        return $this->hasMany(Obra::class);
    }
}
