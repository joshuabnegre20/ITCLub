import { usePage } from "@inertiajs/react";
import SideBar from "./tabs/AdminTab";

export default function AdminView() {

  const { projectList, club , user_id, lastName, staffs ,totalUsers, totalStaffs, username, users, totalActives, verifiedUsers, activities,sentActivities, joinedProject } = usePage().props as unknown as {
    totalUsers: number;
    totalStaffs: number;
    username: string;
    totalActives: number;
    verifiedUsers: string;
    users: {id: number;name: string; lastName: string; address: string; gender: string; club: string; status: string; role: string; Verification: string }[];
    activities: {id: number; activity:string;club:string;created_by:string;role:string;created_at:string}[];
    sentActivities : {id: number; student_id: number;created_at:string ;activity_id: number; name: string; club:string; links: string; status: string}[];
    lastName: string;
    user_id: number;
    club: {club:string; created_at:string}[]
    projectList: {id:number;user_id:number;name:string;club: string; project_type:string;place:string;date:string;time:string;description:string;status:string;created_at:string; title:string}[];
    staffs :{id:number;name:string;last_name:string;address:string;gender:string;email:string;club:string;status:string}[];
    joinedProject: {id:number;student_id:string;name:string;club:string;joined_project_id:number;project_type:string;title:string;joined_at:string;}[];
  };
  console.log(totalActives)
  return (
    <div>
      <SideBar club={club} staffs={staffs} joinedProject ={joinedProject} projectList ={projectList} user_id={user_id} lastName={lastName} sentActivities ={sentActivities} activities ={activities} verifiedUsers= {verifiedUsers} totalActives= {totalActives} username= {username} totalUsers={totalUsers} totalStaffs={totalStaffs} users = {users} />
    </div>
  );
}
