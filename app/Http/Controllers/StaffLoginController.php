<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffLoginController extends Controller
{
    public function login(Request $request)
    {
        $staff = DB::table('staffs')->where('username', $request->username)->first();

        if ($staff && Hash::check($request->password, $staff->password)) {

            // Ensure previous web session is logged out
            Auth::guard('web')->logout();

            // Log in staff
            Auth::guard('staff')->loginUsingId($staff->id);

            // Set status active
            DB::table('staffs')->where('id', $staff->id)->update(['status' => 'Active']);

            // Redirect based on role
            if ($staff->role === 'Admin') {
                return redirect()->route('admin.view');
            }
            return redirect()->route('staff.view');
        }

        return redirect('/StaffPage')->withErrors(['login' => 'Invalid credentials.']);
    }
}
