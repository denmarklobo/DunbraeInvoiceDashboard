<?php

namespace App\Http\Controllers;

use App\Models\UserLogin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

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
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
    
        $user = UserLogin::where('email', $credentials['email'])->first();
    
        // Check if user exists, password matches, and the role is "admin"
        if (!$user || !Hash::check($credentials['password'], $user->password) || $user->role !== 'admin') {
            return response()->json(['message' => 'Invalid credentials or you do not have admin access'], 401);
        }
    
        return response()->json(['message' => 'Login successful', 'user' => $user]);
    }
    
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = UserLogin::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['message' => 'Login successful', 'user' => $user]);
    }
}
