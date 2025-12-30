<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use app\Mail\Verification;

class UserController extends Controller
{
    // Activity

   

    public function GenerateActivity(Request $request)
    {
        $request->validate([
            'activity' => 'required|string|max:65535'
        ]);

        DB::table('activities')->insert([
            'activity'   => $request->activity,
            'club'       => $request->category,
            'created_by' => $request->name,
            'role'       => $request->role,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return redirect()->back()->with('success', 'Activity created successfully!');
    }

    // For Admin
    public function promote($id)
    {
        // Get user data from user_db
        $user = DB::table('user_db')->where('id', $id)->first();

        if (!$user) {
            return redirect()->back()->with('error', 'User not found!');
        }

        // Insert into staffs table
        DB::table('staffs')->insert([
            'id'        => $user->id,
            'name'      => $user->name,
            'last_name' => $user->last_name,
            'address'   => $user->address,
            'gender'    => $user->gender,
            'club'      => $user->club,
            'username'  => $user->username,
            'password'  => $user->password,
            'role'      => 'Staff',
            'email'     => $user->email
        ]);

        DB::table('user_db')->where('id', $id)->update([
            'role' => 'Adviser',
            'Verification' => 'Verified'
        ]);

        return redirect()->back()->with('success', 'User promoted to Staff successfully!');
    }

    public function verify($id)
    {
        DB::table('user_db')->where('id', $id)->update(['Verification' => "Verified"]);
        DB::table('staffs')->where('id', $id)->update(['Verification' => "Verified"]);

        return redirect()->back()->with('success', 'User verified successfully!');
    }

    public function delete($id)
    {
        DB::table('user_db')->where('id', $id)->delete();

        return redirect()->back()->with('success', 'User deleted successfully!');
    }

    // For Student
    public function SelectAct($id)
    {
        $selectAct = DB::table('activities')
            ->select('id', 'activity')
            ->where('id', $id)
            ->get()->toArray();

        return Inertia::render('HomePage', [
            'selectAct' => $selectAct ?? []
        ]);
    }
    public function SubmittedAct($id){

         DB::table('sent_activities')->where('activity_id',$id)->update(['status'=> 'Done']);
        
    }
    public function Reject($id){

        DB::table('sent_activities')->where('activity_id',$id)->update(['status' => 'Rejected']);

    }
   public function PlusLike($id, $studentId){
   
    DB::table('likes')->insert([
        'postId' => $id,
        'userId' =>$studentId,
        
    ]);

    $totalLikes = DB::table('post_db')->where('id',$id)->value('likes');

    DB::table('post_db')->where('id', $id)->update([
        'likes' => $totalLikes+1
    ]);
}

public function AddComment(Request $request, $id,$studentId){

    DB::table('comments_column')->insert([
        'comment' => $request->comment,
        'userId' => $studentId,
        'postId' => $id,
        'created_at', now()
    ]);

}

   

    /**
     * <?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    // Activity
    public function GenerateActivity(Request $request)
    {
        $request->validate([
            'activity' => 'required|string|max:500'
        ]);

        DB::table('activities')->insert([
            'activity'   => $request->activity,
            'club'       => $request->category,
            'created_by' => $request->name,
            'role'       => $request->role,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return redirect()->back()->with('success', 'Activity created successfully!');
    }

    // For Admin
    public function promote($id)
    {
        // Get user data from user_db
        $user = DB::table('user_db')->where('id', $id)->first();

        if (!$user) {
            return redirect()->back()->with('error', 'User not found!');
        }

        // Insert into staffs table
        DB::table('staffs')->insert([
            'id'        => $user->id,
            'name'      => $user->name,
            'last_name' => $user->last_name,
            'address'   => $user->address,
            'gender'    => $user->gender,
            'club'      => $user->club,
            'username'  => $user->username,
            'password'  => $user->password,
            'role'      => 'Staff',
        ]);

        DB::table('user_db')->where('id', $id)->update([
            'role' => 'Staff',
            'Verification' => 'Verified'
        ]);

        return redirect()->back()->with('success', 'User promoted to Staff successfully!');
    }

    public function verify($id)
    {
        DB::table('user_db')->where('id', $id)->update(['Verification' => "Verified"]);
        DB::table('staffs')->where('id', $id)->update(['Verification' => "Verified"]);

        return redirect()->back()->with('success', 'User verified successfully!');
    }

    public function delete($id)
    {
        DB::table('user_db')->where('id', $id)->delete();

        return redirect()->back()->with('success', 'User deleted successfully!');
    }

    // For Student
    public function SelectAct($num)
    {
        $selectAct = DB::table('activities')
            ->select('id', 'activity')
            ->where('id', '<=', $num)
            ->get();

        return Inertia::render('HomePage', [
            'selectAct' => $selectAct ?? []
        ]);
    }
}

     */

}
