<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLogin extends Model
{
    use HasFactory;

    // Specify the correct table name
    protected $table = 'userlogin';

    // Define the fillable fields to allow mass assignment
    protected $fillable = ['name', 'position', 'email', 'password', 'role'];
}
