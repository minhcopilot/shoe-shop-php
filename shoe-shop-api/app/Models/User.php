<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'cart'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'cart' => 'array',
        'is_admin' => 'boolean'
    ];

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }
    
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
