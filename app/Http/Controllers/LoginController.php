<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;



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

    return redirect('/')->withErrors([
        'login' => 'Invalid username or password.',
    ]);
}


}
