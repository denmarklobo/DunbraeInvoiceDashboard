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
    
        $validated['password'] = Hash::make($validated['password']);
    
        try {
            $user = UserLogin::create($validated);
            return response()->json($user, 201);
        } catch (\Exception $e) {
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

    // Admin Login with sending of the email Verifications
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);
    
        $user = UserLogin::where('email', $request->email)
                         ->where('role', 'admin')
                         ->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid email or password'], 401);
        }
    
        if (!$user->is_verified) {
            \Log::info('User not verified: ' . $user->email);
    
            $this->sendVerificationEmail($user);
    
            return response()->json(['message' => 'Your email is not verified. A verification email has been sent. Please check your inbox.'], 400);
        }
    
        $token = $user->createToken('AdminToken')->plainTextToken;
    
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }
    // Sending of the Verification called in the login
    public function sendVerificationEmail($user)
    {
        try {
            $verificationToken = Str::random(60);

            $user->verification_token = $verificationToken;
            $user->save();
    
            \Log::info('Sending verification email to: ' . $user->email);
    
            $verificationLink = route('verifyEmail', ['token' => $verificationToken]);

            Mail::to($user->email)->send(new VerifyEmail($verificationLink));
    
            \Log::info('Verification email sent to: ' . $user->email);
        } catch (\Exception $e) {
            \Log::error('Error sending verification email: ' . $e->getMessage());
        }
    }

    // Gives the token for the user
    public function verifyEmail($token)
    {
        $user = UserLogin::where('verification_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired verification token.'], 400);
        }

        $user->is_verified = true;
        $user->verification_token = null;
        $user->save();

        return response()->json(['message' => 'Email verified successfully.']);
    }
}
