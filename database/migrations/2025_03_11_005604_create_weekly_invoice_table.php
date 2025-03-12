<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWeeklyInvoiceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('weekly_invoice', function (Blueprint $table) {
            $table->id();
            $table->decimal('week_total', 10, 2);
            $table->decimal('week_target', 10, 2);
            $table->timestamps();

            // Foreign key constraints if necessary
            
            // $table->foreign('edit_id')->references('id')->on('some_table')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('weekly_invoice');
    }
}
