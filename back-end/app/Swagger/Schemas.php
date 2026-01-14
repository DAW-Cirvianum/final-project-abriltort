<?php

namespace App\Swagger;

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string"),
 *     @OA\Property(property="rol", type="string"),
 *     @OA\Property(property="imatge", type="string")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Portfoli",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="titol", type="string"),
 *     @OA\Property(property="descripcio", type="string"),
 *     @OA\Property(property="usuari_id", type="integer"),
 *     @OA\Property(
 *         property="albums",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/Album")
 *     )
 * )
 */

/**
 * @OA\Schema(
 *     schema="Album",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="nom", type="string"),
 *     @OA\Property(property="portfoli_id", type="integer")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Categoria",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="nom", type="string")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Tag",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="nom", type="string")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Obra",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="titol", type="string"),
 *     @OA\Property(property="descripcio", type="string"),
 *     @OA\Property(property="fitxer_url", type="string"),
 *     @OA\Property(property="categoria", ref="#/components/schemas/Categoria"),
 *     @OA\Property(property="album", ref="#/components/schemas/Album"),
 *     @OA\Property(
 *         property="tags",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/Tag")
 *     )
 * )
 */

/**
 * @OA\Schema(
 *     schema="Visualitzacio",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="obra_id", type="integer"),
 *     @OA\Property(property="usuari_id", type="integer"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
