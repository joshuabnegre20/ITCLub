<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SignInController extends Controller
{
    public function store(Request $request){

        DB::table('user_db')->insert(
            [ 
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'name' => $request->name,
                'last_name' => $request->last_name,
                'address' => $request-> address,
                'gender' => $request-> gender,
                'club' => $request->club,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
        
       return redirect('/');
    }
}
