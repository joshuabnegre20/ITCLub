<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class StaffSigninController extends Controller
{
    public function store(Request $request){
        DB::table('staffs')->insert(
            [
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'name' => $request->name,
                'last_name' => $request->last_name,
                'address' => $request->address,
                'gender' => $request->gender,
                'club' => $request->club,
                'created_at' => now(),
                'updated_at' => now()
            ]
            );
            return redirect('/StaffPage');
    }
}
