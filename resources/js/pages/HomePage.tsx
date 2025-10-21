import { usePage } from "@inertiajs/react";
import UserHomeTab from "./tabs/UserHomeTab";


export default function HomePage() {
  const { username, verification, selectAct, lastName, club, studentId, selectedAct, projects, activeStaffs, getPostedData, students, notifications, admin, team, studentPost, usernameP } =
    usePage().props as unknown as {
      username: string;
      verification: string;
      lastName: string;
      club: string;
      studentId: number;
      selectAct: { id: number; activity: string }[];
      selectedAct: {activity_id: number; status: string}[];
      projects : {id: number; user_id: number; name: string; club: string; project_type:string;title:string;place:string;date:string;time:string;description:string;status:string;created_at:string;} []
      activeStaffs: {id: number, name:string; last_name: string; status:string;}[],
      getPostedData: {id:number, name:string, picture:string; caption:string; created_at:string; club:string;userid:number}[],
      students: {id:number; name:string; last_name:string; club:string;status:string;}[],
      notifications: {id:number;user_id:number;name:string;club:string;notification:string;created_at:string;caption:string;}[],
      admin : {name:string;last_name:string;status:string}[];
      team: {name:string;last_name:string;status:string}[];
      studentPost : {id:number;name:string; club:string; caption:string; picture:string; created_at:string;}[];
      usernameP : string;
    };


  return (
    <div>
      <UserHomeTab usernameP={usernameP}
      selectedAct = {selectedAct}
        selectAct={selectAct}
        username={username}
        verification={verification}
        lastName={lastName}
        club={club}
        studentId={studentId}
        projects ={projects}
        activeStaffs = {activeStaffs}
        getPostedData = {getPostedData}
        students = {students}
        notifications = {notifications}
        admin = {admin}
        team = {team}
        studentPost = {studentPost}
       
      />
    </div>
  );
}
