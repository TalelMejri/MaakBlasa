<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $guarded=[];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trajet()
    {
        return $this->belongsTo(trajet::class);
    }

    protected $primaryKey = 'id';


}
