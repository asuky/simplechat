<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDefaultToColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->integer('status')->default(0)->change();
            $table->string('room_name')->default('')->change();
            $table->string('a_nick')->default('')->change();
            $table->text('a_sdp')->nullable()->change();
            $table->string('b_nick')->default('')->change();
            $table->text('b_sdp')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->integer('status')->default(NULL)->change();
            $table->string('room_name')->default(NULL)->change();
            $table->string('a_nick')->default(NULL)->change();
            $table->text('a_sdp')->default(NULL)->change();
            $table->string('b_nick')->default(NULL)->change();
            $table->text('b_sdp')->default(NULL)->change();
            
        });
    }
}
