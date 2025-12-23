<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
     use HasFactory;

    protected $fillable = [
        'nom',
    ];

    // Relació N a N amb Obres
    public function obres()
    {
        return $this->belongsToMany(Obra::class, 'obra_tag', 'tag_id', 'obra_id');
    }
}
