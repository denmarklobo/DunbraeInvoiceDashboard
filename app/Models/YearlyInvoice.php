<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YearlyInvoice extends Model
{
    use HasFactory;

    // Table name (optional if different from the default plural name)
    protected $table = 'yearly_invoice';

    // Specify the fillable fields
    protected $fillable = [
        'year_total',
        'year_target',
    ];

    // Optional: Define date format for timestamps
    protected $dates = [
        'created_at',
        'updated_at',
    ];
}
