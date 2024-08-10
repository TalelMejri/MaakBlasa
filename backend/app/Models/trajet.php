<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class trajet extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function option()
    {
        return $this->hasMany(Option::class);
    }

    public function requests()
    {
        return $this->hasMany(Request::class);
    }
}
