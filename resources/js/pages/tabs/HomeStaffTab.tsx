import { router, useForm } from "@inertiajs/react";
import { Divide } from "lucide-react";
import { act, useState } from "react";

function Home(){

    return(
        <div>
            <h1>Home Page</h1>
        </div>
    )
}

type SentActivities ={
  id:number,
  student_id: number,
  activity_id: number,
  name: string,
  last_name:string,
  links: string,
  status: string
}

function ManageRequest({ sentActivities }: { sentActivities: SentActivities[] }) {
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleAction = async (action: string, studentId: number, activityId: number) => {
    setActionLoading(activityId);
    
    try {
      if (action === 'verify') {
        await router.post(`/users/${studentId}/verify`);
      } else if (action === 'reject') {
        await router.post(`/users/${activityId}/reject`);
      }
    } catch (error) {
      // Handle error appropriately
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'verified':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '❌'
        };
      case 'pending':
      default:
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⏳'
        };
    }
  };

  const pendingRequests = sentActivities?.filter(act => act.status === 'Pending') || [];
  const processedRequests = sentActivities?.filter(act => act.status !== 'Pending') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📩 Activity Requests</h1>
          <p className="text-gray-600 mt-2">
            Review and manage activity submissions from students
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-blue-800 font-medium">
              Pending: {pendingRequests.length}
            </span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <span className="text-green-800 font-medium">
              Total: {sentActivities?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Activity Submissions</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Activity Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  GitHub Link
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(sentActivities ?? []).map((activity) => {
                const statusConfig = getStatusConfig(activity.status);
                const canVerify = activity.status !== 'Pending' && activity.status !== 'Rejected';

                return (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors duration-150">
                    {/* Student Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {activity.name?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {activity.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {activity.student_id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Activity Details */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">Activity ID:</span> #{activity.activity_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          
                        </div>
                      </div>
                    </td>

                    {/* GitHub Link */}
                    <td className="px-6 py-4">
                      <a
                        href={activity.links}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200 break-all max-w-xs"
                      >
                        <span>🔗</span>
                        <span className="truncate">{activity.links}</span>
                      </a>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                        <span>{statusConfig.icon}</span>
                        <span>{activity.status}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2 min-w-[140px]">
                        {canVerify && (
                          <button
                            onClick={() => handleAction('verify', activity.student_id, activity.activity_id)}
                            disabled={actionLoading === activity.activity_id}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            {actionLoading === activity.activity_id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <span>✅</span>
                                <span>Verify</span>
                              </>
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleAction('reject', activity.student_id, activity.activity_id)}
                          disabled={actionLoading === activity.activity_id || activity.status === 'Rejected'}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {actionLoading === activity.activity_id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <span>❌</span>
                              <span>Reject</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Empty State */}
              {(!sentActivities || sentActivities.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-2">📭</div>
                      <p className="text-lg font-medium text-gray-900 mb-2">No Requests Found</p>
                      <p className="text-gray-600">There are no activity requests to review at the moment.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Legend */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Status Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⏳</span>
            <span className="text-gray-700">Pending - Awaiting review</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="text-gray-700">Approved - Activity verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-600">❌</span>
            <span className="text-gray-700">Rejected - Needs revision</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {sentActivities && sentActivities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {sentActivities.length}
            </div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {pendingRequests.length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {sentActivities.filter(a => a.status === 'Approved' || a.status === 'Verified').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {sentActivities.filter(a => a.status === 'Rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      )}
    </div>
  );
}

type StudentList ={
  id: number,
  name: string,
  last_name: string,
  gender: string,
  address: string,
  status: string,
  Verification: string

}

function Dashboard({ actives, students, countStudent }: { 
  actives: number, 
  students: StudentList[], 
  countStudent: number 
}) {
  const stats = [
    {
      label: "Total Students",
      value: countStudent,
      icon: "👥",
      color: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      label: "Active Students",
      value: actives,
      icon: "🟢",
      color: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200"
    },
    {
      label: "Inactive Students",
      value: countStudent - actives,
      icon: "⚫",
      color: "bg-gray-50",
      textColor: "text-gray-600",
      borderColor: "border-gray-200"
    },
    {
      label: "Verified Students",
      value: students?.filter(s => s.Verification === "Verified").length || 0,
      icon: "✅",
      color: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVerificationColor = (verification: string) => {
    switch (verification?.toLowerCase()) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of student statistics and management
          </p>
        </div>
        <div className="text-4xl">📊</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-sm border ${stat.borderColor} p-6 hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Student List</h3>
            <span className="text-blue-100 bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
              {students?.length || 0} students
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Verification
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(students ?? []).map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                  {/* Student Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {student.name?.[0]}{student.last_name?.[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name} {student.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.gender}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Student Details */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Address:</span> {student.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>

                  {/* Verification */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getVerificationColor(student.Verification)}`}>
                      {student.Verification}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {(!students || students.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-2">👥</div>
                      <p className="text-lg font-medium text-gray-900 mb-2">No Students Found</p>
                      <p className="text-gray-600">There are no students assigned to your club.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Summary */}
      {students && students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {students.filter(s => s.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active Students</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {students.filter(s => s.Verification === 'Verified').length}
            </div>
            <div className="text-sm text-gray-600">Verified Accounts</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              
            </div>
            <div className="text-sm text-gray-600">Clubs Represented</div>
          </div>
        </div>
      )}
    </div>
  );
}

type ActivityList = {
id:number,
activity:string,
club: string,
created_by: string,
role: string;
created_at: string

}

function ActivityList({ activityList }: { activityList: ActivityList[] }) {
  const getClubColor = (club: string) => {
    const colors = {
      'Programming': 'bg-blue-100 text-blue-800 border-blue-200',
      'Graphic Design': 'bg-purple-100 text-purple-800 border-purple-200',
      'Video Editing': 'bg-pink-100 text-pink-800 border-pink-200',
      'IOT': 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[club as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'staff': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📃 Activity List</h1>
          <p className="text-gray-600 mt-2">
            Overview of all activities available for student verification
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <span className="text-blue-800 font-medium">
            Total Activities: {activityList?.length || 0}
          </span>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Available Activities</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Activity Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Club & Creator
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(activityList ?? []).map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors duration-150">
                  {/* Activity Details */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          #{activity.id}
                        </span>
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {activity.activity}
                      </p>
                    </div>
                  </td>

                  {/* Club & Creator */}
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getClubColor(activity.club)}`}>
                          {activity.club}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {activity.created_by?.[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {activity.created_by}
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(activity.role)}`}>
                            {activity.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        {new Date(activity.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {(!activityList || activityList.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-2">📃</div>
                      <p className="text-lg font-medium text-gray-900 mb-2">No Activities Found</p>
                      <p className="text-gray-600">There are no activities available at the moment.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clubs Summary */}
      {activityList && activityList.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activities by Club</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from(new Set(activityList.map(a => a.club))).map((club) => {
              const clubActivities = activityList.filter(a => a.club === club);
              return (
                <div key={club} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {clubActivities.length}
                  </div>
                  <div className="text-sm text-gray-600">{club}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Role Distribution */}
      {activityList && activityList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {activityList.filter(a => a.role === 'Staff').length}
            </div>
            <div className="text-sm text-gray-600">Staff Created</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {activityList.filter(a => a.role === 'Admin').length}
            </div>
            <div className="text-sm text-gray-600">Admin Created</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {activityList.length}
            </div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
        </div>
      )}
    </div>
  );
}
function GenerateActivity({ username, last_name, club }: { 
  username: string; 
  last_name: string; 
  club: string; 
}) {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) {
      alert("Please enter an activity description!");
      return;
    }

    if (!category) {
      alert("Please select a category!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await router.post("/activities/generates", { 
        activity: input.trim(), 
        name: username + ' ' + last_name, 
        club: club,
        category: category,
        role: 'staff'
      });
      setInput("");
      setCategory("");
      // You could add a success notification here
    } catch (error) {
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { 
      name: "Programming", 
      icon: "💻", 
      description: "Coding exercises and projects" 
    },
    { 
      name: "Video Editing", 
      icon: "🎬", 
      description: "Video production and editing tasks" 
    },
    { 
      name: "Graphic Design", 
      icon: "🎨", 
      description: "Design and creative projects" 
    },
    { 
      name: "IOT", 
      icon: "🔌", 
      description: "Hardware and embedded systems" 
    },
    { 
      name: "Research", 
      icon: "🔬", 
      description: "Research and analysis tasks" 
    },
    { 
      name: "Presentation", 
      icon: "📊", 
      description: "Presentation and public speaking" 
    }
  ];

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚙️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Generate Activity
          </h1>
          <p className="text-gray-600">
            Create new activities for students in your club to complete
          </p>
        </div>

        <div className="space-y-6">
          {/* Activity Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Activity Description *
            </label>
            <textarea
              placeholder="Describe the activity in detail. Include objectives, requirements, and expected outcomes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none text-black"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {input.length}/500 characters • Be clear and specific about what students need to accomplish
            </p>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Category *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    category === cat.name
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${
                      category === cat.name ? "text-blue-600" : "text-gray-600"
                    }`}>
                      {cat.icon}
                    </div>
                    <div>
                      <div className={`font-semibold ${
                        category === cat.name ? "text-blue-700" : "text-gray-800"
                      }`}>
                        {cat.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {cat.description}
                      </div>
                    </div>
                    {category === cat.name && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Creator Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {username[0]}{last_name[0]}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  Created by {username} {last_name}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Staff Member</span>
                  <span>•</span>
                  <span>{club} Club</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isSubmitting || !input.trim() || !category}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Activity...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Generate Activity</span>
              </>
            )}
          </button>

          {/* Form Requirements */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              All fields marked with * are required. Activities will be available for students to complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


function AddProject({
  username,
  last_name,
  club,
  user_id,
}: {
  username: string;
  last_name: string;
  user_id: number;
  club: string;
}) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: user_id,
    name: username + " " + last_name,
    club: club,
    project_type: "",
    place: "",
    date: "",
    description: "",
    time: "",
    title: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/AddProjectStaff", {
      onSuccess: () => {
        setData({
          ...data,
          project_type: '',
          place: '',
          date: '',
          description: '',
          time: '',
          title: ''
        });
      }
    });
  };

  const projectTypes = [
    { value: "Seminar", label: "Seminar", icon: "🎤" },
    { value: "Workshop", label: "Workshop", icon: "🔧" },
    { value: "Training", label: "Training", icon: "📚" },
    { value: "Meeting", label: "Meeting", icon: "🤝" },
    { value: "Practice", label: "Practice Session", icon: "⚡" },
    { value: "Review", label: "Review Session", icon: "📖" }
  ];

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📌</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Add New Project
          </h1>
          <p className="text-gray-600">
            Create a new project or event for {club} Club members
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              placeholder="Enter a clear and descriptive project title..."
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Project Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setData("project_type", type.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                    data.project_type === type.value
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div className={`text-sm font-medium ${
                    data.project_type === type.value ? "text-blue-700" : "text-gray-700"
                  }`}>
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
            {errors.project_type && (
              <p className="text-red-500 text-sm mt-1">{errors.project_type}</p>
            )}
          </div>

          {/* Location & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Place *
              </label>
              <input
                type="text"
                placeholder="e.g., Room 201, Computer Lab"
                value={data.place}
                onChange={(e) => setData("place", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
                required
              />
              {errors.place && (
                <p className="text-red-500 text-sm mt-1">{errors.place}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={data.date}
                onChange={(e) => setData("date", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
                required
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={data.time}
                onChange={(e) => setData("time", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
                required
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              placeholder="Describe the project objectives, what members will learn, and any requirements..."
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 min-h-[120px] resize-none text-black"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Staff Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {username[0]}{last_name[0]}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  Created by {username} {last_name}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Staff Member</span>
                  <span>•</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {club} Club
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Project...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Create Project</span>
              </>
            )}
          </button>

          {/* Form Requirements */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              All fields marked with * are required. Projects will be visible to {club} Club members.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProjectList({ projectList }: { projectList: ProjectList[] }) {
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleAction = async (action: string, projectId: number) => {
    setActionLoading(projectId);
    
    try {
      if (action === 'done') {
        await router.post(`/projects/${projectId}/done`);
      } else if (action === 'cancel') {
        if (confirm('Are you sure you want to cancel this project? This action cannot be undone.')) {
          await router.post(`/projects/${projectId}/cancel`);
        }
      }
    } catch (error) {
      // Handle error appropriately
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅',
          label: 'Completed'
        };
      case 'canceled':
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '❌',
          label: 'Canceled'
        };
      case 'ongoing':
      case 'active':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🔄',
          label: 'Ongoing'
        };
      default:
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⏳',
          label: status || 'Pending'
        };
    }
  };

  const getProjectTypeColor = (type: string) => {
    const colors = {
      'Seminar': 'bg-purple-100 text-purple-800 border-purple-200',
      'Workshop': 'bg-orange-100 text-orange-800 border-orange-200',
      'Training': 'bg-blue-100 text-blue-800 border-blue-200',
      'Meeting': 'bg-gray-100 text-gray-800 border-gray-200',
      'Practice': 'bg-green-100 text-green-800 border-green-200',
      'Review': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const activeProjects = projectList?.filter(p => p.status !== 'Done' && p.status !== 'Canceled') || [];
  const completedProjects = projectList?.filter(p => p.status === 'Done') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📂 Project List</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all projects for your club
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-blue-800 font-medium">
              Active: {activeProjects.length}
            </span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <span className="text-green-800 font-medium">
              Total: {projectList?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Club Projects</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Project Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type & Creator
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(projectList ?? []).map((project) => {
                const statusConfig = getStatusConfig(project.status);
                const typeConfig = getProjectTypeColor(project.project_type);
                const canMarkDone = project.status !== 'Done' && project.status !== 'Canceled';
                const canCancel = project.status !== 'Canceled';

                return (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-150">
                    {/* Project Details */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {project.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>📍 {project.place}</span>
                          {project.date && (
                            <>
                              <span>•</span>
                              <span>{project.date}</span>
                            </>
                          )}
                          {project.time && (
                            <>
                              <span>•</span>
                              <span>{project.time}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type & Creator */}
                    <td className="px-6 py-4">
                      <div className="space-y-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${typeConfig}`}>
                          {project.project_type}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {project.name?.[0]}
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {project.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {new Date(project.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(project.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                        <span>{statusConfig.icon}</span>
                        <span>{statusConfig.label}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2 min-w-[140px]">
                        {canMarkDone && (
                          <button
                            onClick={() => handleAction('done', project.id)}
                            disabled={actionLoading === project.id}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            {actionLoading === project.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <span>✅</span>
                                <span>Mark Done</span>
                              </>
                            )}
                          </button>
                        )}
                        
                        {canCancel && (
                          <button
                            onClick={() => handleAction('cancel', project.id)}
                            disabled={actionLoading === project.id}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                          >
                            {actionLoading === project.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <span>❌</span>
                                <span>Cancel</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Empty State */}
              {(!projectList || projectList.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-2">📂</div>
                      <p className="text-lg font-medium text-gray-900 mb-2">No Projects Found</p>
                      <p className="text-gray-600">There are no projects created for your club yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      {projectList && projectList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {projectList.length}
            </div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {completedProjects.length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {activeProjects.length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Array.from(new Set(projectList.map(p => p.project_type))).length}
            </div>
            <div className="text-sm text-gray-600">Project Types</div>
          </div>
        </div>
      )}
    </div>
  );
}
type ProjectList ={

  id:number; user_id:number; title:string; name:string; club:string; project_type:string;  place:string, date:string; time:string; description:string;status:string;created_at:string 

}

export default function HomeStaffTab({ 
  projectList, 
  sentActivities, 
  activityList, 
  username, 
  students, 
  countStudent, 
  actives, 
  club, 
  last_name, 
  user_id 
}: { 
  projectList: ProjectList[]; 
  user_id: number; 
  sentActivities: SentActivities[]; 
  club: string; 
  last_name: string; 
  activityList: ActivityList[]; 
  actives: number; 
  username: string; 
  students: StudentList[]; 
  countStudent: number;
}) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "projectList" | "addProject" | "manageUsers" | "home" | "activityList" | "generateAct">("dashboard");

  const HandleLogout = () => {
    router.post("/logout");
  };

  const menuItems = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "manageUsers", label: "User Requests", icon: "👥" },
    { id: "activityList", label: "Activity List", icon: "📃" },
    { id: "generateAct", label: "Generate Activity", icon: "⚙️" },
    { id: "addProject", label: "Add Project", icon: "➕" },
    { id: "projectList", label: "Project List", icon: "📋" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-purple-700 flex flex-col justify-between py-6 px-4 shadow-xl overflow-y-auto">
        {/* User Info */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-blue-600 font-bold text-xl">
              {username[0]}{last_name[0]}
            </span>
          </div>
          <h2 className="text-white font-semibold text-lg">{username}</h2>
          <p className="text-blue-100 text-sm">Staff Member</p>
          <div className="mt-2 bg-blue-500 bg-opacity-50 rounded-full px-3 py-1">
            <span className="text-white text-xs font-medium">{club} Club</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-white hover:bg-blue-500 hover:bg-opacity-30"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-left">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={HandleLogout}
          className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-md mt-4 flex items-center justify-center space-x-2"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {activeTab === "dashboard" && (
            <Dashboard 
              actives={actives} 
              countStudent={countStudent} 
              students={students} 
            />
          )}
          {activeTab === "manageUsers" && (
            <ManageRequest sentActivities={sentActivities} />
          )}
          {activeTab === "home" && <Home />}
          {activeTab === "activityList" && (
            <ActivityList activityList={activityList} />
          )}
          {activeTab === "generateAct" && (
            <GenerateActivity 
              username={username} 
              last_name={last_name} 
              club={club} 
            />
          )}
          {activeTab === "addProject" && (
            <AddProject 
              username={username} 
              last_name={last_name} 
              club={club} 
              user_id={user_id} 
            />
          )}
          {activeTab === "projectList" && (
            <ProjectList projectList={projectList} />
          )}
        </div>
      </div>
    </div>
  );
}