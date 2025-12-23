<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfoli extends Model
{
     use HasFactory;

    protected $fillable = [
        'titol',
        'descripcio',
        'usuari_id',
    ];

    // Relació 1 a 1 amb User
    public function usuari()
    {
        return $this->belongsTo(User::class, 'usuari_id');
    }

    // Relació 1 a N amb Àlbums
    public function albums()
    {
        return $this->hasMany(Album::class);
    }
}
