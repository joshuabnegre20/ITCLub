<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class HomeController extends Controller

 

{

    

   public function index()
{
    if (!Auth::check()) {
        return redirect('/');
    }

    $user = DB::table('user_db')->where('id', Auth::id())->first();

    $userClub = $user->club;

    $selectedAct = DB::table('sent_activities')->select('activity_id', 'status')->where('student_id', Auth::id())->get();

    $selectAct = DB::table('activities')->where('club', $userClub)
        ->select('id', 'activity')
        ->get()
        ->toArray();

        $projects = DB::table('projects')->where('club', $userClub)->select('id','user_id','name', 'club', 'project_type', 'title', 'place', 'date', 'time', 'description', 'status', 'created_at' )->get();

            $activeStaff = DB::table('staffs')->select('id','name','last_name', 'status')->where('club', $userClub)->get();

            $getPostedData = DB :: table('post_db')->select('id','name','likes', 'caption', 'picture', 'created_at', 'club')->get();
        $getAdmin = DB::table('user_db')->where('role', 'Admin')->select('name','last_name', 'status')->get();
            $students = DB::table('user_db')->where('role', '!=', "Admin")->select('id','name', 'last_name','club', 'status')->get();
             $notifications = DB::table('notification')->select('id','user_id','name','club','notification', 'created_at', 'caption')->get();
             $team = DB::table('user_db')->where('role', '!=', 'Admin')->where('role', '!=', 'Adviser')->where('id', '!=', $user->id)->select('name','last_name', 'status')->get();
             $studentPost = DB::table('post_db')->where('user_id', $user->id)->select('id','name','club','caption', 'picture', 'created_at')->get();
            $comments = DB::table('comments_column')->where('postID', )->select('comments','userId');
            $getUsername = DB::table('user_db')->where('id' ,$user->id)->value('username');
          //   $getPassworde = DB::table('user_db')->where('id' ,$user->id)->value('password');
        
          $likes = DB::table('post_db')->value('likes');

    return Inertia::render('HomePage', [
        'username'     => $user->name,
        'lastName'     => $user->last_name,
        'club'         => $user->club,
        'studentId'    => $user->id,
        'verification' => $user->Verification,
        'selectAct'    => $selectAct,
        'selectedAct' => $selectedAct ?? [],
        'projects' => $projects ?? [],
        'activeStaffs' => $activeStaff ?? [],
        'getPostedData' => $getPostedData ?? [],
        'students' => $students ?? [],
        'notifications' => $notifications ?? [],
        'admin' => $getAdmin ?? [],
        'team' => $team ?? [],
        'studentPost' => $studentPost ?? [],
        'usernameP' =>$getUsername,
        'likes' =>$likes
        ]);
}
public function selectActivity(Request $request)
    {
        $request->validate([
            'activity_id' => 'required|integer',
            'student_id'  => 'required|integer',
            'name'        => 'required|string',
            'last_name'   => 'required|string',
            'club'        => 'required|string',
            'link'        => 'required|string|max:500',
        ]);

        DB::table('sent_activities')->insert([
            'student_id'  => $request->student_id,
            'activity_id' => $request->activity_id,
            'name'        => $request->name,
            'last_name'   => $request->last_name,
            'club'        => $request->club,
            'links'        => $request->link,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        return back()->with('success', 'Activity selected successfully!');
    }

    public function JoinProject(Request $request){

        DB::table('joined_project')->insert([
            'student_id'=> $request->student_id,
            'name' => $request->name,
            'club' => $request->club,
            'joined_project_id' => $request->joined_project_id,
            'project_type' => $request->project_type,
            'title' => $request->title,
            'joined_at' => now()
        ]);
    }

    public function Posted(Request $request){


        $request->validate([
            
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $path = null;

        if($request->hasFile('picture')){

            $path = $request->file('picture')->store('uploads', 'public');
        }

        DB ::table('post_db')->insert([

            'user_id' => $request->userid,
            'name' => $request->name,
            'club' => $request->club,
            'caption' => $request->description,
            'picture' => $path,
            'created_at' => now()
        ]);

       

       

        DB::table('notification')->insert([
            'user_id' =>$request->userid,
            'name' =>$request->name,
            'club' => $request->club,
            'notification' => 'Just posted something you may like',
            'caption' => $request->description,
            'created_at' =>now()
        ]);
    }

      public function update(Request $request){

        $request->validate([
            'name' => 'nullable|string',
             'lastName' => 'nullable|string',
             'club' => 'nullable|string'
        ]);

        DB::table('user_db')->where('id', $request->studentId)->update([
            'name'=> $request->name, 
            'last_name' => $request->lastName,
            'club' => $request->club,
            'updated_at' => now()
        ]);
            
        }

        public function UpdatePrivacy(Request $request){
            
            DB::table('user_db')->where('id', $request->studentId )->update([
                
                'password' => Hash::make($request->password),
                'updated_at' => now()
            ]);
        }

        public function Delete($id){

            DB::table('post_db')->where('id', $id)->delete();

        }

}
