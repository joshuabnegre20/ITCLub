<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StaffViewController extends Controller
{
    public function index(){
        // Check staff guard instead of default web guard
        if(!Auth::guard('staff')->check()){
            return redirect('/StaffPage');
        }

        $username = DB::table('staffs')
            ->where('id', Auth::guard('staff')->id())
            ->value('name');

            $club = DB::table('staffs')->where('id', Auth::id() )->value('club');

            $students = DB::table('user_db')->where('club', $club)->where('role', 'User')->select('id','name','last_name','gender','address', 'status', 'Verification')->get();
            $last_name = DB::table('staffs')->where('id', Auth::id())->value('last_name');
            $activityList = DB::table('activities')->where('club', $club)->select('id','activity','club','created_by','role','created_at')->get();
            $countStudent = DB::table('user_db')->where('role', 'User')->where('club', $club)->count();
            $actives = DB::table('user_db')->where('status', 'Active')->count();
            $user_id = DB::table('staffs')->where('id', Auth::id())->value('id');
            $sentActivities = DB::table('sent_activities')->where('club', $club)->select('id','student_id','name', 'activity_id','last_name','links', 'status')->get();
            $projectList = DB::table('projects')->where('club', $club)->select('id', 'title','user_id','name','club','description','project_type', 'place','date','time','created_at', 'status')->get();

        return Inertia::render('StaffView', [
            'username'=> $username,
            'students' => $students ?? [],
            'countStudent' => $countStudent,
            'actives' => $actives,
            'activityList' => $activityList ?? [],
            'club' => $club,
            'last_name' => $last_name,
            'sentActivities' => $sentActivities ?? [],
            'user_id' =>$user_id,
            'projectList' => $projectList ?? [],

        ]);
    }

    public function GenerateActivity(Request $request){


        
        DB::table('activities')->insert([
            'activity' => $request->activity,
            'club' => $request->club,
            'created_by' => $request->name,
            'role' => $request->club.' '. 'Adviser',
            'created_at' => now()
        

        ]);

    }

    function AddProject(Request $request){
        DB::table('projects')->insert([
            'user_id' => $request->user_id,
            'name' => $request->name,
            'club' => $request->club,
            'project_type' => $request->project_type,
            'title' => $request->title,
            'place' => $request->place,
            'date' => $request->date,
            'time' => $request->time,
            'description' =>$request->description,
            'created_at' => now()
        ]);
    }

}

