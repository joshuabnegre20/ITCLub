<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Xml\Project;

class AdminViewController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return redirect('/');
        }
        $username = DB::table('user_db')->where('role', 'Admin')->value('name');
        $totalUsers = DB::table('user_db')->where('role','User')->count();
        $totalStaffs = DB::table('staffs')->count();
        $activeUser = DB::table('user_db')->where('status','Active')->count();
        $activeStaffs = DB::table('staffs')->where('status','Active')->count();
        $totalActives = $activeStaffs+$activeUser;
        $users = DB::table('user_db')->select('id','name','last_name', 'address', 'gender', 'club', 'status','role','Verification')->where('role','!=','Admin')->get();
        $staffs = DB::table('staffs')->select('id','name','last_name', 'address', 'gender', 'club', 'status','role','Verification')->where('role', '!=', "Staff")->get();
        $lastname = DB::table('user_db')->where('role', 'Admin')->value('last_name');
        $user_id = DB::table('user_db')->where('role', 'Admin')->value('id');
        $verifiedUsers = DB::table('user_db')->where('Verification', 'Verified')->count();
        $activities= DB::table("activities")->select('id','activity', 'club', 'created_by', 'role', 'created_at')->get();
        $projectList = DB::table('projects')->select('id','user_id','name','club','project_type', 'title', 'place', 'date','time','description', 'status', 'created_at')->get();
        $sentActivities = DB::table('sent_activities')->select('id','student_id','activity_id', 'name', 'club','links','status')->get();
        $joinedProject = DB::table('joined_project')->select('id','student_id', 'name', 'club', 'joined_project_id', 'project_type', 'title', 'joined_at')->get();
       
        $all = $users->merge($staffs);

        return Inertia::render('AdminView', [
            'username' =>$username,
            'totalUsers' => $totalUsers,
            'totalStaffs' => $totalStaffs,
            'totalActives' => $totalActives,
            'verifiedUsers' => $verifiedUsers,
            'users' => $all ?? [],
            'activities' => $activities ?? [],
            'sentActivities' => $sentActivities ?? [],
            'lastName' => $lastname,
            'user_id' => $user_id,
            'projectList' => $projectList ?? [],
            'joinedProject' => $joinedProject ?? []
            
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

    function SetDone($id){

            DB::table('projects')->where('id', $id)->update([
                'status' => 'Done'
            ]);
    }
    function Cancel($id){

            DB::table('projects')->where('id', $id)->update([
                'status' => 'Canceled'
            ]);
    }
}
