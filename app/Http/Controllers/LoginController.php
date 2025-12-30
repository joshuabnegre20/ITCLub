<?php

namespace App\Http\Controllers;

use App\Mail\verification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;




class LoginController extends Controller
{
    
   public function login(Request $request)
{

  
    // First, check normal users
    $user = DB::table('user_db')->where('username', $request->username)->first();
 
    // If not found, check staff table
    if (!$user) {
        $user = DB::table('staffs')->where('username', $request->username)->first();
        $isStaff = true;
    } else {
        $isStaff = false;
    }

    if ($user && Hash::check($request->password, $user->password)) {
        // Log in using correct guard
        if ($isStaff) {
            Auth::guard('staff')->loginUsingId($user->id);
        } else {
            Auth::loginUsingId($user->id); // default web guard
            // Mark user as active
            DB::table('user_db')->where('id', $user->id)->update(['status'=> 'Active']);
        }

        // Redirect based on role
        if ($user->role === 'Admin') {
            return redirect()->route('admin.view');
        } elseif ($user->role === 'Staff') {
            return redirect()->route('staff.view');
        } else {
            return redirect()->route('home');
        }
    }

    return back()->withErrors([
        'login' => 'Invalid username or password.',
    ]);
}
public function getVerification(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'code' => 'required'
    ]);

    // Check if email exists
    $user = DB::table('user_db')->where('email', $request->email)->first();
    
    if (!$user) {
        return back()->withErrors([
            'email' => 'Email not found. Please check your email address.'
        ]);
    }

    try {
        Mail::to($request->email)->send(new verification($request->code));
        
        

        return back()->with('success', 'Verification code sent successfully!');
        
    } catch (\Exception $e) {
        return back()->withErrors([
            'email' => 'Failed to send verification email: ' . $e->getMessage()
        ]);
    }
}

public function newPassword(Request $request)
{
    

        
        
        $hashedPassword = Hash::make($request->password);
        

        $updated = DB::table('user_db')
            ->where('email', $request->email)
            ->update([
                'password' => $hashedPassword,
                'updated_at' => now()
            ]);

        
    }
}



