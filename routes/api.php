<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserLoginController;
use App\Http\Controllers\ExcelController;
use App\Http\Controllers\ExcelImportController;
use App\Http\Controllers\WeeklyInvoiceController;
use App\Http\Controllers\MonthlyInvoiceController;
use App\Http\Controllers\YearlyInvoiceController;

Route::prefix('v1')->middleware('api')->group(function () {
    // Admin Login Route
    Route::post('admin/login', [UserLoginController::class, 'adminLogin']);

    // YEARLY INVOICES
    Route::post('yearly-invoices/sum', [YearlyInvoiceController::class, 'sumAmount']);
    Route::post('yearly-invoices', [YearlyInvoiceController::class, 'store']);
    Route::get('yearly-invoices', [YearlyInvoiceController::class, 'index']);
    Route::get('yearly-invoices/{id}', [YearlyInvoiceController::class, 'show']);
    Route::put('yearly-invoices/{id}', [YearlyInvoiceController::class, 'update']);
    Route::delete('yearly-invoices/{id}', [YearlyInvoiceController::class, 'destroy']);

    // MONTHLY INVOICES
    Route::post('monthly-invoices/sum', [MonthlyInvoiceController::class, 'sumAmount']);
    Route::post('monthly-invoices', [MonthlyInvoiceController::class, 'store']);
    Route::get('monthly-invoices', [MonthlyInvoiceController::class, 'index']);
    Route::get('monthly-invoices/{id}', [MonthlyInvoiceController::class, 'show']);
    Route::put('monthly-invoices/{id}', [MonthlyInvoiceController::class, 'update']);
    Route::delete('monthly-invoices/{id}', [MonthlyInvoiceController::class, 'destroy']);

    // WEEKLY INVOICES
    Route::post('weekly-invoices/sum', [WeeklyInvoiceController::class, 'sumAmount']);
    Route::get('weekly-invoices', [WeeklyInvoiceController::class, 'index']);
    Route::post('weekly-invoices', [WeeklyInvoiceController::class, 'store']);
    Route::get('weekly-invoices/{id}', [WeeklyInvoiceController::class, 'show']);
    Route::put('weekly-invoices/{id}', [WeeklyInvoiceController::class, 'update']);
    Route::delete('weekly-invoices/{id}', [WeeklyInvoiceController::class, 'destroy']);

    // Excel Import Routes
    Route::get('import-excel', [ExcelImportController::class, 'showForm']);
    Route::post('import-excel', [ExcelImportController::class, 'importExcelAndSum']);

    // User Login and Registration Routes
    Route::apiResource('userlogin', UserLoginController::class);
    Route::post('userlogin/login', [UserLoginController::class, 'login']);
    Route::post('register', [UserLoginController::class, 'store']);

    // CSRF Token Route
    Route::get('/get-csrf-token', function () {
        return response()->json(['csrf_token' => csrf_token()]);
    });
});
