<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfoli_id',
        'nom',
        'descripcio',
    ];

    // Relació N a 1 amb Portfoli
    public function portfoli()
    {
        return $this->belongsTo(Portfoli::class);
    }

    // Relació 1 a N amb Obres

    public function obres()
    {
        return $this->hasMany(Obra::class);
    }
}
