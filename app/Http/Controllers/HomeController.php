<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use Illuminate\Http\Request;

Auth::routes(['verify' => true]);

class HomeController extends Controllers
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware(['auth', 'verified']); // Ensures only authenticated and verified users can access
    }

    /**
     * Show the application dashboard.
     */
    public function index()
    {
        return view('home'); // Loads the 'home' view
    }
}
