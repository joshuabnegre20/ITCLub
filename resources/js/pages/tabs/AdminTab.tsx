import { useState,  } from "react";
import { router, useForm } from "@inertiajs/react";
import Certification from '../pdf/Certificate'
import { pdf } from "@react-pdf/renderer";

function Dashboard({ verifiedUsers, totalUsers, totalStaffs, totalActives }: { 
  verifiedUsers: string; 
  totalActives: number; 
  totalUsers: number; 
  totalStaffs: number; 
}) {
  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: "👥",
      color: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      label: "Total Staffs",
      value: totalStaffs,
      icon: "👨‍💼",
      color: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      label: "Total Actives",
      value: totalActives,
      icon: "🟢",
      color: "bg-green-50",
      textColor: "text-green-600",
      borderColor: "border-green-200"
    },
    {
      label: "Verified Users",
      value: verifiedUsers,
      icon: "✅",
      color: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of platform statistics and metrics</p>
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

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
              <span className="font-medium text-blue-700">📋 View Activity Reports</span>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
              <span className="font-medium text-green-700">👥 Manage User Requests</span>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
              <span className="font-medium text-purple-700">📊 Generate Analytics</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Platform Status</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-800 font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type User ={
  id: number,
  name: string,
  lastName: string,
  address: string,
  gender :string,
  club: string,
  status: string,
  role: string,
  Verification: string
}

type Activities = {
  id: number,
  activity:string,
  club:string,
  created_by:string,
  role:string,
  created_at:string
}


function ManageUsers({ users }: { users: User[] }) {
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleAction = async (action: string, userId: number, userRole: string) => {
    setActionLoading(userId);
    
    try {
      if (action === 'promote') {
        await router.post(`/users/${userId}/promote`);
      } else if (action === 'verify') {
        await router.post(`/users/${userId}/verify`, { 
          type: userRole === 'Staff' ? 'staff' : 'user' 
        });
      } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          await router.delete(`/users/${userId}/delete`, { 
            data: { type: userRole === 'Staff' ? 'staff' : 'user' } 
          });
        }
      }
    } catch (error) {
      // Handle error appropriately
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (verification: string) => {
    switch (verification?.toLowerCase()) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👥 Manage Users</h1>
          <p className="text-gray-600 mt-2">
            Manage user accounts, permissions, and verification status
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <span className="text-blue-800 font-medium">
            Total Users: {users?.length || 0}
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">User Management</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Details
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
              {(users ?? []).map((user, index) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.[0]}{user.lastName?.[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.gender}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* User Details */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Club:</span> {user.club}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Address:</span> {user.address}
                      </div>
                    </div>
                  </td>

                  {/* Status Info */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(user.Verification)}`}>
                        {user.Verification}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2 min-w-[200px]">
                      {user.role !== 'Staff' && user.role !== 'Admin' && (
                        <button
                          onClick={() => handleAction('promote', user.id, user.role)}
                          disabled={actionLoading === user.id}
                          className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {actionLoading === user.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <span>⬆️</span>
                              <span>Promote to Staff</span>
                            </>
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleAction('verify', user.id, user.role)}
                        disabled={actionLoading === user.id}
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {actionLoading === user.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>✅</span>
                            <span>Verify User</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleAction('delete', user.id, user.role)}
                        disabled={actionLoading === user.id}
                        className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {actionLoading === user.id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>🗑️</span>
                            <span>Delete User</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-2">👥</div>
                      <p className="text-lg font-medium text-gray-900 mb-2">No Users Found</p>
                      <p className="text-gray-600">There are no users to display at the moment.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SentActivities({ sentActivities }: { sentActivities: SentActivities[] }) {
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
      case 'done':
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

  const pendingActivities = sentActivities?.filter(act => act.status === 'Pending') || [];
  const reviewedActivities = sentActivities?.filter(act => act.status !== 'Pending') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📤 Sent Activities</h1>
          <p className="text-gray-600 mt-2">
            Review and manage activity submissions from students
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-blue-800 font-medium">
              Pending: {pendingActivities.length}
            </span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <span className="text-green-800 font-medium">
              Total: {sentActivities?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Activities Table */}
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
                const canReject = activity.status !== 'Rejected';

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
                            {activity.club}
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
                          <span className="font-medium">Student ID:</span> {activity.student_id}
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
                      <div className="flex space-x-2">
                        {canVerify && (
                          <button
                            onClick={() => handleAction('verify', activity.student_id, activity.activity_id)}
                            disabled={actionLoading === activity.activity_id}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                        
                        {canReject && (
                          <button
                            onClick={() => handleAction('reject', activity.student_id, activity.activity_id)}
                            disabled={actionLoading === activity.activity_id}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                        )}
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
                      <div className="text-4xl mb-2">📤</div>
                      <p className="text-lg font-medium text-gray-900 mb-2">No Activities Submitted</p>
                      <p className="text-gray-600">There are no activity submissions to review at the moment.</p>
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Guide</h3>
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
    </div>
  );
}

function GenerateActivity({ username }: { username: string }) {
  const [activity, setActivity] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activity.trim() || !category) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await router.post("/activities/generate", {
        activity: activity.trim(),
        category,
        name: username,
        role: 'admin'
      });

      setActivity(""); 
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
      description: "Coding and software development activities" 
    },
    { 
      name: "Video Editing", 
      icon: "🎬", 
      description: "Video production and editing tasks" 
    },
    { 
      name: "Graphic Design", 
      icon: "🎨", 
      description: "Design and creative visual projects" 
    },
    { 
      name: "Computer Engineering", 
      icon: "🔌", 
      description: "Hardware and systems engineering tasks" 
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
            Create new activities for students to complete and verify their skills
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Activity Description
            </label>
            <textarea
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none text-black"
              placeholder="Describe the activity in detail. Include requirements, objectives, and any specific instructions for students..."
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {activity.length}/500 characters
            </p>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Category
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

          {/* Submission Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {username[0]}
              </div>
              <div>
                <p className="font-medium text-gray-800">Created by {username}</p>
                <p className="text-sm text-gray-600">Role: Administrator</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !activity.trim() || !category}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
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
              Make sure to provide clear instructions and select the appropriate category
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function ActivityList({ activities }: { activities: Activities[] }) {
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
            Overview of all generated activities across different clubs
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <span className="text-blue-800 font-medium">
            Total Activities: {activities?.length || 0}
          </span>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {(activities ?? []).map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Activity #{activity.id}
                </h3>
                <span className="text-white text-sm bg-black bg-opacity-20 px-2 py-1 rounded">
                  ID: {activity.id}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4">
              {/* Activity Description */}
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {activity.activity}
                </p>
              </div>

              {/* Details Grid */}
              <div className="space-y-3">
                {/* Club */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Club:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getClubColor(activity.club)}`}>
                    {activity.club}
                  </span>
                </div>

                {/* Created By */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Created By:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {activity.created_by?.[0]}
                    </div>
                    <span className="text-sm text-gray-800 font-medium">
                      {activity.created_by}
                    </span>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Role:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(activity.role)}`}>
                    {activity.role}
                  </span>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Created:</span>
                  <span className="text-sm text-gray-700">
                    {new Date(activity.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Time */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Time:</span>
                  <span className="text-sm text-gray-700">
                    {new Date(activity.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Activity ID: {activity.id}</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!activities || activities.length === 0) && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="text-6xl mb-4">📃</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Activities Found
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            There are no activities generated yet. Create your first activity to get started!
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium">
            Create Activity
          </button>
        </div>
      )}

      {/* Clubs Summary */}
      {activities && activities.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activities by Club</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from(new Set(activities.map(a => a.club))).map((club) => {
              const clubActivities = activities.filter(a => a.club === club);
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
    </div>
  );
}
type SentActivities ={
  id: number,
  student_id: number,
  activity_id: number,
  name: string,
  club: string,
  links: string,
  status: string

}

function AddProject({
  username,
  lastName,
  user_id,
}: {
  username: string;
  lastName: string;
  user_id: number;
}) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: user_id,
    name: username + " " + lastName,
    club: "",
    project_type: "",
    place: "",
    date: "",
    description: "",
    time: "",
    title: ""
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    
    post("/AddProjectAdmin", {
      onSuccess: () => {
        setData({
          ...data,
          project_type: '',
          place: '',
          date: '',
          club: '',
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
    { value: "Research", label: "Research Project", icon: "🔬" },
    { value: "Competition", label: "Competition", icon: "🏆" },
    { value: "Training", label: "Training", icon: "📚" },
    { value: "Meeting", label: "Meeting", icon: "🤝" }
  ];

  const clubs = [
    { value: "Programming", label: "Programming Club", icon: "💻" },
    { value: "IOT", label: "IoT Club", icon: "🔌" },
    { value: "Graphic Design", label: "Graphic Design Club", icon: "🎨" },
    { value: "Video Editing", label: "Video Editing Club", icon: "🎬" }
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
            Create a new project or event for students to join and participate
          </p>
        </div>

        <form onSubmit={handlePost} className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              placeholder="Enter project title..."
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

          {/* Club Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Club *
            </label>
            <select
              value={data.club}
              onChange={(e) => setData("club", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white text-black"
              required
            >
              <option value="">Select a club...</option>
              {clubs.map((club) => (
                <option key={club.value} value={club.value}>
                  {club.icon} {club.label}
                </option>
              ))}
            </select>
            {errors.club && (
              <p className="text-red-500 text-sm mt-1">{errors.club}</p>
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
                placeholder="e.g., Room 101, Main Hall"
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
              placeholder="Describe the project objectives, requirements, and what students will learn..."
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 min-h-[120px] resize-none text-black"
              required
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Creator Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {username[0]}{lastName[0]}
              </div>
              <div>
                <p className="font-medium text-gray-800">Created by {username} {lastName}</p>
                <p className="text-sm text-gray-600">User ID: {user_id}</p>
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
              All fields marked with * are required
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
      if (action === 'cancel') {
        if (confirm('Are you sure you want to cancel this project? This action cannot be undone.')) {
          await router.post(`/projects/${projectId}/cancel`);
        }
      } else if (action === 'done') {
        await router.post(`/projects/${projectId}/done`);
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
          icon: '✅'
        };
      case 'active':
      case 'ongoing':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🔄'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⏳'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '📋'
        };
    }
  };

  const getProjectTypeColor = (type: string) => {
    const colors = {
      'Seminar': 'bg-purple-100 text-purple-800 border-purple-200',
      'Workshop': 'bg-orange-100 text-orange-800 border-orange-200',
      'Research': 'bg-blue-100 text-blue-800 border-blue-200',
      'Competition': 'bg-red-100 text-red-800 border-red-200',
      'Training': 'bg-green-100 text-green-800 border-green-200',
      'Meeting': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📂 Project List</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all generated projects and events
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <span className="text-blue-800 font-medium">
            Total Projects: {projectList?.length || 0}
          </span>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">All Projects</h3>
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
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created
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
                          <span>🏛️ {project.club}</span>
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

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                        <span>{statusConfig.icon}</span>
                        <span>{project.status}</span>
                      </span>
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

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleAction('done', project.id)}
                          disabled={actionLoading === project.id || project.status === 'Done'}
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
                        
                        <button
                          onClick={() => handleAction('cancel', project.id)}
                          disabled={actionLoading === project.id}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          {actionLoading === project.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <span></span>
                              <span>Cancel</span>
                            </>
                          )}
                        </button>
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
                      <p className="text-gray-600">There are no projects created yet.</p>
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
              {projectList.filter(p => p.status === 'Done').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {projectList.filter(p => p.status !== 'Done').length}
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



type ProjectList = {
  id:number;user_id:number;name:string;club: string; project_type:string;title:string;place:string;date:string;time:string;description:string;status:string;created_at:string
}
type JoinedProject = {
  id:number;student_id:string;name:string;club:string;joined_project_id:number;project_type:string;title:string;joined_at:string;
}

function JoinedProjectList({
  joinedProject,
  projectList,
}: {
  joinedProject: JoinedProject[];
  projectList: ProjectList[];
}) {
  const [generatingCert, setGeneratingCert] = useState<number | null>(null);

  const handleGenerateCertificate = async (participantName: string, projectTitle: string, joinId: number) => {
  setGeneratingCert(joinId);
  
  try {
    // Use a more robust PDF generation approach
    const MyDocument = () => (
      <Certification
        participantName={participantName}
        projectTitle={projectTitle}
        date={new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      />
    );

    // Use toBlob with better error handling
    const pdfBlob = await pdf(<MyDocument />).toBlob();
    
    // Create a more robust download process
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Sanitize filename
    const sanitizedName = participantName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const sanitizedProject = projectTitle.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    
    link.download = `Certificate_${sanitizedName}_${sanitizedProject}.pdf`;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL
    window.URL.revokeObjectURL(url);
    
    // Success feedback
    console.log('Certificate generated successfully');
    
  } catch (error) {
    console.error('Error generating certificate:', error);
    // Fallback: Show error to user
    alert('Failed to generate certificate. Please try again.');
  } finally {
    setGeneratingCert(null);
  }
};

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing':
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!projectList || projectList.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
        <div className="text-6xl mb-4">🎓</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Projects Available
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          There are no projects with participants to display.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🎓 Joined Projects</h1>
          <p className="text-gray-600 mt-2">
            Manage participants and generate certificates for completed projects
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <span className="text-blue-800 font-medium">
            Total Projects: {projectList.length}
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projectList.map((project) => {
          const filteredJoins = (joinedProject ?? []).filter(
            (joined) => Number(joined.joined_project_id) === Number(project.id)
          );

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Project Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {project.title}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {project.project_type} • {project.club} Club
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                      {filteredJoins.length} participants
                    </span>
                  </div>
                </div>
              </div>

              {/* Participants Table */}
              <div className="p-6">
                {filteredJoins.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Participant
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Club
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Joined Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Certificate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredJoins.map((joined) => (
                          <tr key={joined.id} className="hover:bg-gray-50 transition-colors duration-150">
                            {/* Participant Info */}
                            <td className="px-4 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {joined.name?.[0]}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {joined.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {joined.student_id}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Club */}
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {joined.club}
                              </span>
                            </td>

                            {/* Joined Date */}
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                {new Date(joined.joined_at).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(joined.joined_at).toLocaleTimeString()}
                              </div>
                            </td>

                            {/* Certificate Action */}
                            <td className="px-4 py-4">
                              {project.status === 'Done' ? (
                                <button
                                  onClick={() => handleGenerateCertificate(joined.name, project.title, joined.id)}
                                  disabled={generatingCert === joined.id}
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                  {generatingCert === joined.id ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      <span>Generating...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>🏆</span>
                                      <span>Generate Certificate</span>
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="text-gray-400 text-sm">
                                  Complete project first
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">👥</div>
                    <p className="text-gray-500 text-lg font-medium">
                      No participants have joined this project yet
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Participants will appear here once they join the project
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default function AdminTab({
  joinedProject, 
  projectList, 
  user_id, 
  lastName, 
  sentActivities, 
  activities, 
  verifiedUsers, 
  totalUsers,  
  totalStaffs, 
  username, 
  users, 
  totalActives 
}: {
  joinedProject: JoinedProject[];
  projectList: ProjectList[];
  user_id: number;
  lastName: string;
  sentActivities: SentActivities[];
  activities: Activities[];
  verifiedUsers: string;
  totalActives: number;
  users: User[];
  username: string;
  totalUsers: number;
  totalStaffs: number;
}) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "createCertificate" | "generateCertificate" | "projectList" | "manageUsers" | "userRequest" | "addProject" | "sentActivities" | "generateActivity" | "activityList">("dashboard");

  const HandleLogout = () => {
    router.post("/logout");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "manageUsers", label: "Manage Users", icon: "👥" },
    { id: "sentActivities", label: "Sent Activities", icon: "📩" },
    { id: "activityList", label: "Activity List", icon: "📃" },
    { id: "generateActivity", label: "Generate Activity", icon: "⚙️" },
    { id: "addProject", label: "Add Project", icon: "➕" },
    { id: "projectList", label: "Project List", icon: "📋" },
    { id: "generateCertificate", label: "Joined Projects", icon: "🎓" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-purple-700 flex flex-col justify-between py-6 px-4 shadow-xl overflow-y-auto">
        {/* User Info */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-blue-600 font-bold text-xl">
              {username[0]}{lastName[0]}
            </span>
          </div>
          <h2 className="text-white font-semibold text-lg">{username}</h2>
          <p className="text-blue-100 text-sm">Administrator</p>
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
              verifiedUsers={verifiedUsers} 
              totalActives={totalActives} 
              totalUsers={totalUsers} 
              totalStaffs={totalStaffs} 
            />
          )}
          {activeTab === "manageUsers" && <ManageUsers users={users} />}
          {activeTab === "sentActivities" && <SentActivities sentActivities={sentActivities} />}
          {activeTab === "generateActivity" && <GenerateActivity username={username} />}
          {activeTab === "activityList" && <ActivityList activities={activities} />}
          {activeTab === "addProject" && <AddProject username={username} lastName={lastName} user_id={user_id} />}
          {activeTab === "projectList" && <ProjectList projectList={projectList} />}
          {activeTab === "generateCertificate" && (
            <JoinedProjectList 
              joinedProject={joinedProject} 
              projectList={projectList} 
            />
          )}
         
        </div>
      </div>
    </div>
  );
}