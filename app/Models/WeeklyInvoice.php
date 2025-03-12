<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeeklyInvoice extends Model
{
    use HasFactory;

    protected $table = 'weekly_invoice'; // Ensure the model is linked to the correct table

    protected $fillable = [
        'edit_id',
        'user_id',
        'week_total',
        'week_target',
    ];
}
