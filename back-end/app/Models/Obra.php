<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obra extends Model
{
    use HasFactory;

    protected $fillable = [
        'categoria_id',
        'album_id',
        'titol',
        'descripcio',
        'data',
        'fitxer_url',
    ];

    /**
     * Relació N a 1 amb Àlbum
     */
    public function album()
    {
        return $this->belongsTo(Album::class);
    }

    // Relació N a 1 amb Categoria
    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    // Relació N a N amb Tags

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'obra_tag', 'obra_id', 'tag_id');
    }

    // Relació 1 a N amb Visualitzacions

    public function visualitzacions()
    {
        return $this->hasMany(Visualitzacio::class);
    }
}
