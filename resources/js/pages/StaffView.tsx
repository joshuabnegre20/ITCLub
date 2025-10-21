import { usePage } from '@inertiajs/react'
import HomeStaffTab from './tabs/HomeStaffTab'
import { StringToBoolean } from 'class-variance-authority/types';
import activities from '@/routes/activities';

export default function StaffView(){

     const { projectList , username, students, countStudent , actives, activityList,club,last_name, sentActivities, user_id } = usePage().props as unknown as {
         username: string;
         students: {id:number; name:string; last_name: string; gender: string; address: string; status:string; Verification: string} [];
        countStudent: number;
        actives: number;
        activityList : {id:number; activity: string, club: string; created_by: string; role:string; created_at: string}[];
        club: string;
        last_name:string;
        sentActivities: {id: number; student_id: number; name: string; activity_id:number, links:string; last_name: string; status: string}[];
        user_id: number;
        projectList: {id:number ; title:string; user_id:number; name:string; club:string; project_type:string;  place:string, date:string; time:string; description:string;status:string;created_at:string }[]
        };


    return(
        <div>

            <HomeStaffTab projectList={projectList} user_id ={user_id} sentActivities = {sentActivities} club={club} last_name={last_name} activityList ={activityList}  actives={actives} countStudent= {countStudent} students= {students} username = {username} />

        </div>
    )
}