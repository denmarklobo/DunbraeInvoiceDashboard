<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateYearlyInvoiceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('yearly_invoice', function (Blueprint $table) {
            $table->id();
            $table->decimal('year_total', 10, 2);  // year_total as a decimal with 2 decimal places
            $table->decimal('year_target', 10, 2); // year_target as a decimal with 2 decimal places
            $table->timestamps(); // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('yearly_invoice');
    }
}
