<?php

namespace App\Http\Controllers;

use App\Models\UserLogin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmail;


class UserLoginController extends Controller
{
    public function index()
    {
        return response()->json(UserLogin::all());
    }

    public function show($id)
    {
        $user = UserLogin::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'email' => 'required|string|email|unique:userlogin',
            'password' => 'required|string|min:6',
            'role' => 'required|in:user,admin',
        ]);
    
        // Hash the password before storing
        $validated['password'] = Hash::make($validated['password']);
    
        try {
            // Create a new user record in the database
            $user = UserLogin::create($validated);
            return response()->json($user, 201); // Return success response with created user
        } catch (\Exception $e) {
            // Return error response if something goes wrong
            return response()->json([
                'message' => 'Error creating user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    public function update(Request $request, $id)
    {
        $user = UserLogin::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:userlogin,email,' . $id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:user,admin',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = UserLogin::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
    public function adminLogin(Request $request)
    {
        // Validate the input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
    
        // Find the user (admin in this case)
        $user = UserLogin::where('email', $request->email)
                         ->where('role', 'admin')
                         ->first();
    
        // Check if user exists and password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }
    
        // Check if the email has already been verified
        if (!$user->is_verified) {
            \Log::info('User not verified: ' . $user->email);
    
            // Always send verification email if the user is not verified
            $this->sendVerificationEmail($user);
    
            return response()->json(['message' => 'Your email is not verified. A verification email has been sent. Please check your inbox.'], 400);
        }
    
        // Generate a token for API login (if using Laravel Sanctum for authentication)
        $token = $user->createToken('AdminToken')->plainTextToken;
    
        // Return the response with the token and user data
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function sendVerificationEmail($user)
    {
        try {
            // Generate a new verification token
            $verificationToken = Str::random(60);
    
            // Save the token to the user
            $user->verification_token = $verificationToken;
            $user->save();
    
            \Log::info('Sending verification email to: ' . $user->email);
    
            // Generate the correct verification link
            $verificationLink = route('verifyEmail', ['token' => $verificationToken]);
    
            // Send the verification email
            Mail::to($user->email)->send(new VerifyEmail($verificationLink));
    
            \Log::info('Verification email sent to: ' . $user->email);
        } catch (\Exception $e) {
            \Log::error('Error sending verification email: ' . $e->getMessage());
        }
    }


    public function verifyEmail($token)
    {
        // Find the user by the verification token
        $user = UserLogin::where('verification_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired verification token.'], 400);
        }

        // Mark the user as verified
        $user->is_verified = true;
        $user->verification_token = null; // Clear the verification token
        $user->save();

        return response()->json(['message' => 'Email verified successfully.']);
    }
}
