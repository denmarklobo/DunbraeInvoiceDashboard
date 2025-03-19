<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\UserLoginController;
use App\Http\Controllers\ExcelController;
use App\Http\Controllers\ExcelImportController;
use App\Http\Controllers\WeeklyInvoiceController;
use App\Http\Controllers\MonthlyInvoiceController;
use App\Http\Controllers\YearlyInvoiceController;
use App\Http\Controllers\HomeController;


// Custom route for email verification
Route::get('verify/{token}', [UserLoginController::class, 'verifyEmail'])->name('verifyEmail');


// Ensure the user is authenticated and their email is verified
Route::get('/home', [HomeController::class, 'index'])->middleware(['auth', 'verified']);

//Ensure Mail facade is used cor rectly
Route::get('/send-test-email', function () {
    Mail::raw('This is a test email.', function ($message) {
        $message->to('denmarklobo1@gmail.com') 
                ->subject('Test Email from Laravel');
    });

    return response()->json(['message' => 'Test email sent!']);
});

Route::get('/admin/verify/{token}', [UserLoginController::class, 'verifyEmail'])->name('admin.verify');

Route::post('/admin/login', [UserLoginController::class, 'adminLogin']);
Route::post('/admin/resend-verification', [UserLoginController::class, 'sendVerificationEmail']);
Route::get('/admin/verify-email/{token}', [UserLoginController::class, 'verifyEmail']);

Route::prefix('v1')->middleware('api')->group(function () {

    // Admin Login Route
    Route::post('admin/login', [UserLoginController::class, 'adminLogin']);

    // YEARLY INVOICES
    Route::post('yearly-invoices/sum', [YearlyInvoiceController::class, 'sumAmount']);
    Route::get('yearly-latest', [YearlyInvoiceController::class, 'getLatestYearTotal']);
    Route::get('yearly-bargraph', [YearlyInvoiceController::class, 'dashboardYear']);
    Route::get('yearly-target', [YearlyInvoiceController::class, 'getLatestYearTarget']);
    Route::post('yearly-invoices', [YearlyInvoiceController::class, 'store']);
    Route::get('yearly-invoices', [YearlyInvoiceController::class, 'index']);
    Route::get('yearly-invoices/{id}', [YearlyInvoiceController::class, 'show']);
    Route::put('yearly-invoices/{id}', [YearlyInvoiceController::class, 'update']);
    Route::delete('yearly-invoices/{id}', [YearlyInvoiceController::class, 'destroy']);

    // MONTHLY INVOICES
    Route::post('monthly-invoices/sum', [MonthlyInvoiceController::class, 'sumAmount']);
    Route::get('monthly-latest', [MonthlyInvoiceController::class, 'getLatestMonthTotal']);
    Route::get('monthly-target', [MonthlyInvoiceController::class, 'getLatestMonthTarget']);
    Route::get('monthly-chart', [MonthlyInvoiceController::class, 'calculateRevenueByMonth']);
    Route::post('monthly-invoices', [MonthlyInvoiceController::class, 'store']);
    Route::get('monthly-invoices', [MonthlyInvoiceController::class, 'index']);
    Route::get('monthly-invoices/{id}', [MonthlyInvoiceController::class, 'show']);
    Route::put('monthly-invoices/{id}', [MonthlyInvoiceController::class, 'update']);
    Route::delete('monthly-invoices/{id}', [MonthlyInvoiceController::class, 'destroy']);

    // WEEKLY INVOICES
    Route::post('weekly-invoices/sum', [WeeklyInvoiceController::class, 'sumWeekTotal']);
    Route::get('weekly-latest', [WeeklyInvoiceController::class, 'getLatestWeekTotal']);
    Route::get('weekly-target', [WeeklyInvoiceController::class, 'getLatestWeekTarget']);
    Route::get('weekly-invoices', [WeeklyInvoiceController::class, 'index']);
    Route::post('weekly-invoices', [WeeklyInvoiceController::class, 'store']);
    Route::get('weekly-invoices/{id}', [WeeklyInvoiceController::class, 'show']);
    Route::put('weekly-invoices/{id}', [WeeklyInvoiceController::class, 'update']);
    Route::delete('weekly-invoices/{id}', [WeeklyInvoiceController::class, 'destroy']);

    // User Login and Registration Routes
    Route::apiResource('userlogin', UserLoginController::class);
    Route::post('userlogin/login', [UserLoginController::class, 'login']);
    Route::post('register', [UserLoginController::class, 'store']);

    // CSRF Token Route
    Route::get('/get-csrf-token', function () {
        return response()->json(['csrf_token' => csrf_token()]);
    });
});
