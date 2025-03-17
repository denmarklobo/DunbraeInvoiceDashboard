<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserLoginController;
use App\Http\Controllers\ExcelImportController;
use App\Http\Controllers\ExcelController;
use App\Http\Controllers\WeeklyInvoiceController;
use App\Http\Controllers\MonthlyInvoiceController;
use App\Http\Controllers\YearlyInvoiceController;
use App\Http\Controllers\HomeController;


// Custom route for email verification
Route::get('verify/{token}', [UserLoginController::class, 'verifyEmail'])->name('verifyEmail');

// Ensure the user is authenticated and their email is verified
Route::get('/home', [HomeController::class, 'index'])->middleware(['auth', 'verified']);

Route::get('/send-test-email', function () {
    \Illuminate\Support\Facades\Mail::raw('This is a test email.', function ($message) {
        $message->to('ryanentrolezo@gmail.com')   // Change this to your recipient's email
                ->subject('Test Email from Laravel');
    });

    return 'Test email sent!';
});

Route::get('/verify/{token}', [UserLoginController::class, 'verifyEmail'])->name('admin.verify');


use App\Models\UserLogin;

Route::get('/force-verify/{email}', function ($email) {
    $user = UserLogin::where('email', $email)->first();

    if ($user) {
        $user->sendEmailVerificationNotification();
        return 'Verification email sent!';
    }

    return 'User not found.';
});

    
// Adding the prefix 'v1' to all routes in this group
Route::middleware('api')->prefix('v1')->get('/data', function () {

    //YEARLY INVOICES
    Route::post('yearly-invoices/sum', [YearlyInvoiceController::class, 'sumAmount']);
    Route::post('yearly-invoices', [YearlyInvoiceController::class, 'store']);
    Route::get('yearly-invoices', [YearlyInvoiceController::class, 'index']);
    Route::get('yearly-invoices/{id}', [YearlyInvoiceController::class, 'show']);
    Route::put('yearly-invoices/{id}', [YearlyInvoiceController::class, 'update']);
    Route::delete('yearly-invoices/{id}', [YearlyInvoiceController::class, 'destroy']);

    //MONTHLY INVOICES
    Route::post('monthly-invoices/sum', [MonthlyInvoiceController::class, 'sumAmount']);
    Route::post('monthly-invoices', [MonthlyInvoiceController::class, 'store']);
    Route::get('monthly-invoices', [MonthlyInvoiceController::class, 'index']);
    Route::get('monthly-invoices/{id}', [MonthlyInvoiceController::class, 'show']);
    Route::put('monthly-invoices/{id}', [MonthlyInvoiceController::class, 'update']);
    Route::delete('monthly-invoices/{id}', [MonthlyInvoiceController::class, 'destroy']);

    //WEEKLY INVOICES
    Route::post('weekly-invoices/sum', [WeeklyInvoiceController::class, 'sumAmount']);
    Route::get('weekly-invoices', [WeeklyInvoiceController::class, 'index']);
    Route::post('weekly-invoices', [WeeklyInvoiceController::class, 'store']);
    Route::get('weekly-invoices/{id}', [WeeklyInvoiceController::class, 'show']);
    Route::put('weekly-invoices/{id}', [WeeklyInvoiceController::class, 'update']);
    Route::delete('weekly-invoices/{id}', [WeeklyInvoiceController::class, 'destroy']);

    //USER LOGIN
    Route::apiResource('userlogin', UserLoginController::class);
    Route::post('admin/login', [UserLoginController::class, 'adminLogin']);

    Route::post('userlogin/login', [UserLoginController::class, 'login']);
    Route::post('register', [UserLoginController::class, 'store']);

    Route::get('/get-csrf-token', function () {
        return response()->json(['csrf_token' => csrf_token()]);
    });
    
    return response()->json(['message' => 'No CSRF token required for this API']);
});
   
Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});
