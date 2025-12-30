import { useState } from "react";
import { router, useForm, WhenVisible } from "@inertiajs/react";
import { buttonVariants } from "@/components/ui/button";
import { Divide } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";

type Activity = {
  id: number;
  activity: string;
};

function Home({
  
  likes,
  verification,
  getPostedData,
  name,
  club,
  studentId,
  lastName,
  students,
  notifications
}: {
 
  likes:number
  getPostedData: postedData[];
  name: string;
  club: string;
  studentId: number;
  lastName: string;
  students: Students[];
  verification: string;
  notifications: Notifications[];
}) {
  const [visible, setVisible] = useState(false);
  const [openCommentIndex, setOpenCommentIndex] = useState<number | null>(null);

  const { data, setData, post } = useForm({
    userid: 0,
    club: "",
    name: "",
    description: "",
    picture: null as File | null,
    comment: ''
  });

  

  const getData = () => {
    setData("userid", studentId);
    setData("club", club);
    setData("name", name + " " + lastName);
    setVisible(true);
  };

  const posts = () => {
    post("/PostData", {
      onSuccess: () => {
        setData("description", "");
        setData("picture", null);
        setVisible(false);
      },
    });
  };

  const toggleCommentSection = (index: number, id:number) => {
    setOpenCommentIndex(openCommentIndex === index ? null : index);
    
    console.log()
  };

  const handleComment =(postId:number)=>{

    post(`/add-comment/${postId}/${studentId}`)
    setData('comment', '')


  }

  

  return (
    <div className="flex h-screen bg-gray-50  ">
      {/* Left Sidebar - Members */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6 overflow-y-auto">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Madlang People</h3>
          
          {/* Current User Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {name[0]}{lastName[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{name} {lastName}</p>
                <p className="text-sm text-gray-600">ID: {studentId}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                {club}
              </span>
              <span className={`px-2 py-1 rounded-full font-medium ${
                verification === "Verified" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {verification}
              </span>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            Club Members ({students?.length || 0})
          </h4>
          <div className="space-y-2">
            {(students ?? []).map((student, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  student.status === "Active" 
                    ? "bg-green-500" 
                    : "bg-gray-400"
                }`}>
                  {student.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {student.name} {student.last_name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{student.club}</span>
                    <span className={`font-medium ${
                      student.status === "Active" 
                        ? "text-green-600" 
                        : "text-gray-500"
                    }`}>
                      • {student.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Posts */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🏠 Home Feed</h1>
            <p className="text-gray-600">Welcome back, {name}! Here's what's happening in your community.</p>
          </div>

          {/* Create Post Card */}
          {verification === "Verified" ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Share your thoughts</h3>
              
              <textarea
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="What's on your mind?..."
                className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                required
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-3">
                  <input
                    id="picture"
                    type="file"
                    onChange={(e) =>
                      setData("picture", e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                    accept="image/*"
                  />
                  <label
                    htmlFor="picture"
                    className="cursor-pointer flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <span className="text-lg">📸</span>
                    <span className="text-sm font-medium">Add Photo</span>
                  </label>
                </div>

                {visible ? (
                  <button
                    onClick={posts}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-sm"
                  >
                    Post Now
                  </button>
                ) : (
                  <button
                    onClick={getData}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm"
                  >
                    Create Post
                  </button>
                )}
              </div>

              {data.picture && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Selected: {data.picture.name}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600">🔒</span>
                </div>
                <div>
                  <h3 className="text-yellow-800 text-lg font-semibold">
                    Account Verification Required
                  </h3>
                  <p className="text-yellow-600 text-sm">
                    Verify your account to unlock all features
                  </p>
                </div>
              </div>
              
              <p className="text-yellow-700 mb-4">
                Please verify your account to create posts and interact with the community.
              </p>
              
              <div className="bg-white border border-yellow-300 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                  <span className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                    !
                  </span>
                  Follow these steps to verify:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      1
                    </div>
                    <span className="text-yellow-700">Click <strong>"Others"</strong> on the upper right corner</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      2
                    </div>
                    <span className="text-yellow-700">Click <strong>"Verify Account"</strong></span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      3
                    </div>
                    <span className="text-yellow-700">Choose an activity to solve</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-4">
            {[...(getPostedData ?? [])].reverse().map((post, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Post Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{post.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-700 mb-4 leading-relaxed">{post.caption}</p>
                
                {/* Post Image */}
                {post.picture && (
                  <div className="mb-4">
                    <img
                      src={`/storage/${post.picture}`}
                      alt="Post content"
                      className="rounded-lg max-h-96 w-full object-cover shadow-sm"
                    />
                  </div>
                )}

                {/* Post Footer */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <button onClick={() => router.post(`/plus-like/${post.id}/${studentId}`)} className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-200">
                    <span>❤️</span>
                    <span className="text-sm text-black">{ post.likes }</span>
                  </button>
                  { /* <button 
                    onClick={() => toggleCommentSection(index,post.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                  >
                    <span>💬</span>
                    <span className="text-sm">
                      {openCommentIndex === index ? 'Close' : 'Comment'}
                    </span>
                  </button> 
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors duration-200">
                    <span>🔄</span>
                    <span className="text-sm">Share</span>
                  </button>*/}
                </div>

                {/* Comment Section */}
                {openCommentIndex === index && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-4">
                      {/* Comment Input */}
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {name[0]}{lastName[0]}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={data.comment}
                            placeholder="Write a comment..."
                            onChange={(e)=> setData('comment', e.target.value)}
                            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                          />
                        </div>
                        <button
                        onClick={() => handleComment(post.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-200">
                          Post
                        </button>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-3">
                        {/* Sample Comment - Replace with actual comments data */}
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            JD
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="font-semibold text-sm text-gray-800">John Doe</p>
                              <p className="text-sm text-gray-600 mt-1">This is a great post! Thanks for sharing.</p>
                            </div>
                            <div className="flex items-center space-x-3 mt-2 ml-3 text-xs text-gray-500">
                              <button className="hover:text-blue-500">Like</button>
                              <span>•</span>
                              <span>2h ago</span>
                            </div>
                          </div>
                        </div>

                        {/* Another sample comment */}
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            SJ
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="font-semibold text-sm text-gray-800">Sarah Johnson</p>
                              <p className="text-sm text-gray-600 mt-1">I completely agree with this! 👏</p>
                            </div>
                            <div className="flex items-center space-x-3 mt-2 ml-3 text-xs text-gray-500">
                              <button className="hover:text-blue-500">Like</button>
                              <span>•</span>
                              <span>1h ago</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* No comments state */}
                      {/* <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {(!getPostedData || getPostedData.length === 0) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No posts yet</h3>
                <p className="text-gray-500">Be the first to share something with the community!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Notifications */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6 overflow-y-auto">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
          
          <div className="space-y-3">
            {[...(notifications ?? [])].reverse().map((notification, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm flex-shrink-0">
                    🔔
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">{notification.name}</span> from {notification.club}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{notification.notification}</p>
                    {notification.caption && (
                      <p className="text-sm font-medium text-gray-800 bg-white p-2 rounded border">
                        "{notification.caption}"
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {(!notifications || notifications.length === 0) && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Profile({
  studentId,
  name,
  lastName,
  club,
  studentPost,
}: {
  studentPost: StudentPost[];
  studentId: number;
  name: string;
  lastName: string;
  club: string;
}) {
  const [visible, setVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");

  const handleEdit = (post: StudentPost) => {
    setEditingPost(post.id);
    setEditCaption(post.caption);
  };

  const handleSaveEdit = (postId: number) => {
    // Implement your update logic here
    router.put(`/post/${postId}/update`, { caption: editCaption });
    setEditingPost(null);
    setEditCaption("");
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditCaption("");
  };

  const handleDelete = (postId: number) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      router.delete(`/post/${postId}/delete`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* User Avatar */}
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {name[0]}{lastName[0]}
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {name} {lastName}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      🆔 {studentId}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      🏛️ {club}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {studentPost?.length || 0}
              </div>
              <div className="text-gray-600 text-sm">Total Posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <span className="w-2 h-8 bg-blue-500 rounded-full mr-3"></span>
            My Posts
          </h2>
          <p className="text-gray-600">
            Manage and view all your shared posts in one place
          </p>
        </div>

        {/* Posts Grid */}
        <div className="space-y-6">
          {[...(studentPost ?? [])].reverse().map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {post.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{post.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setVisible(!visible)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <span className="text-lg">⋯</span>
                    </button>

                    {visible && (
                      <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-32">
                        <button
                          onClick={() => handleEdit(post)}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <span>✏️</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <span>🗑️</span>
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                {editingPost === post.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSaveEdit(post.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {post.caption}
                  </p>
                )}
              </div>

              {/* Post Image */}
              {post.picture && (
                <div className="px-6 pb-4">
                  <img
                    src={`/storage/${post.picture}`}
                    alt="Post content"
                    className="rounded-lg w-full max-h-96 object-cover shadow-sm"
                  />
                </div>
              )}

              {/* Post Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200">
                      <span>❤️</span>
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200">
                      <span>💬</span>
                      <span>Comment</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📊</span>
                    <span>0 interactions</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {(!studentPost || studentPost.length === 0) && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                You haven't created any posts yet. Share your thoughts with the community!
              </p>
              
            </div>
          )}
        </div>

        {/* Load More Button (if needed) */}
        {studentPost && studentPost.length > 5 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Projects({
  activeStaffs,
  team,
  verification,
  projects,
  name,
  lastName,
  club,
  student_id,
  admin
}: {
  activeStaffs: ActiveStaffs[];
  verification: string;
  name: string;
  lastName: string;
  club: string;
  student_id: number;
  projects: Projects[];
  admin: Admin[];
  team: Team[];
}) {
  const [get, setGet] = useState(false);
  const [getIdx, setIdx] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<Projects | null>(null);

  const { data, setData, post } = useForm({
    name: name + " " + lastName,
    club: club,
    student_id: student_id,
    joined_project_id: 0,
    project_type: "",
    title: "",
  });

  const handleJoin = (project: Projects, idx: number) => {
    setIdx(idx);
    setData("joined_project_id", project.id);
    setData("project_type", project.project_type);
    setData("title", project.title);
    setGet(true);
  };

  const proceed = () => {
    post("/JoinProject", {
      preserveScroll: true,
      onSuccess: () => {
        alert("✅ Successfully joined the project!");
      },
      onError: () => {
        alert("⚠️ Failed to join project. Please try again.");
      },
    });
    setGet(false);
    setIdx(null);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-green-400' : 'text-gray-400';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Seminar': 'bg-purple-500',
      'Workshop': 'bg-blue-500',
      'Research': 'bg-green-500',
      'Competition': 'bg-orange-500',
      'Default': 'bg-gray-500'
    };
    return colors[type as keyof typeof colors] || colors.Default;
  };

  if (verification !== "Verified") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Required</h2>
          <p className="text-gray-600 mb-6">
            Please verify your account to access projects and participate in club activities.
          </p>
          <div className="bg-white border border-yellow-300 rounded-lg p-4">
    <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
      <span className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
        !
      </span>
      Follow these steps to verify:
    </h4>
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          1
        </div>
        <span className="text-yellow-700">Click <strong>"Others"</strong> on the upper right corner</span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          2
        </div>
        <span className="text-yellow-700">Click <strong>"Verify Account"</strong></span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          3
        </div>
        <span className="text-yellow-700">Choose an activity to solve</span>
      </div>
    </div>
  </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Admin & Advisers */}
      <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-8 overflow-y-auto">
        {/* Admin Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <span className="w-2 h-6 bg-red-500 rounded-full mr-2"></span>
            Administrators
          </h3>
          <div className="space-y-3">
            {admin?.length > 0 ? admin.map((admin, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {admin.name[0]}{admin.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {admin.name} {admin.last_name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getStatusColor(admin.status)}`}>
                        • {admin.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No administrators available
              </div>
            )}
          </div>
        </div>

        {/* Advisers Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <span className="w-2 h-6 bg-blue-500 rounded-full mr-2"></span>
            Advisers
          </h3>
          <div className="space-y-3">
            {activeStaffs?.length > 0 ? activeStaffs.map((staff, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {staff.name[0]}{staff.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {staff.name} {staff.last_name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getStatusColor(staff.status)}`}>
                        • {staff.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No advisers available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Projects */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📂 Projects & Seminars</h1>
            <p className="text-gray-600">
              Explore available projects and seminars. Join the ones that interest you!
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-6">
            {[...(projects ?? [])].reverse().map((project, idx) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                {/* Project Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(project.project_type)}`}>
                          {project.project_type}
                        </span>
                        <span className="text-sm text-gray-500">
                          ID: {project.id}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {project.name}
                      </h3>
                      <p className="text-gray-700 font-medium">
                        {project.title}
                      </p>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="text-lg">📍</span>
                      <span>Room {project.place}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="text-lg">📅</span>
                      <span>{project.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="text-lg">⏰</span>
                      <span>{project.time}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end">
                    {get && getIdx === idx ? (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setGet(false);
                            setIdx(null);
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={proceed}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium flex items-center space-x-2"
                        >
                          <span>✅</span>
                          <span>Confirm Join</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoin(project, idx)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center space-x-2"
                      >
                        <span>🚀</span>
                        <span>Join Project</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {(!projects || projects.length === 0) && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Projects Available
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  There are no active projects at the moment. Check back later for new opportunities!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Team Members */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-8 overflow-y-auto">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <span className="w-2 h-6 bg-green-500 rounded-full mr-2"></span>
            Club Members
            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
              {team?.length || 0}
            </span>
          </h3>
          <div className="space-y-3">
            {team?.length > 0 ? team.map((member, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {member.name[0]}{member.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {member.name} {member.last_name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getStatusColor(member.status)}`}>
                        • {member.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No team members available
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-3">Quick Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Projects:</span>
              <span className="font-semibold">{projects?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Members:</span>
              <span className="font-semibold text-green-600">
                {team?.filter(m => m.status === 'Active').length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageProfile({
  username,
  lastName,
  club,
  studentId,
  usernameP
}: {
  username: string;
  lastName: string;
  club: string;
  studentId: number;
  usernameP: string;
}) {
  const [activeSection, setActiveSection] = useState<'profile' | 'privacy'>('profile');
  const [editingField, setEditingField] = useState<'name' | 'club' | 'password' | null>(null);
  
  const { data, setData, post, processing, errors } = useForm({
    studentId: studentId,
    name: username,
    lastName: lastName,
    club: club,
    password: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = () => {
    post('/update', {
      onSuccess: () => {
        setEditingField(null);
        // Show success message
      },
      onError: () => {
        // Handle errors
      }
    });
  };

  const handlePrivacyUpdate = () => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    Inertia.post('/UpdatePrivacy', {
      password: data.password,
      studentId: studentId
    }, {
      onSuccess: () => {
        setEditingField(null);
        setData('password', '');
        setData('confirmPassword', '');
        // Show success message
      }
    });
  };

  const cancelEdit = () => {
    setEditingField(null);
    setData('name', username);
    setData('lastName', lastName);
    setData('club', club);
    setData('password', '');
    setData('confirmPassword', '');
  };

  const clubs = [
    { value: "Programming", label: "Programming Club", icon: "💻" },
    { value: "Video Editing", label: "Video Editing Club", icon: "🎬" },
    { value: "Graphic Design", label: "Graphic Design Club", icon: "🎨" },
    { value: "IOT", label: "IoT Club", icon: "🔌" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">👤 Account Settings</h1>
          <p className="text-gray-600">Manage your profile information and privacy settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveSection('profile')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                activeSection === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📝 Profile Information
            </button>
            <button
              onClick={() => setActiveSection('privacy')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                activeSection === 'privacy'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🔒 Privacy & Security
            </button>
          </div>

          <div className="p-6">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                  <div className="text-sm text-gray-500">
                    Student ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{studentId}</span>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    {editingField === 'name' ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter first name"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">{username}</span>
                        <button
                          onClick={() => setEditingField('name')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    {editingField === 'name' ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={data.lastName}
                          onChange={(e) => setData('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">{lastName}</span>
                        <button
                          onClick={() => setEditingField('name')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Club Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Club Membership</label>
                  {editingField === 'club' ? (
                    <div className="space-y-2">
                      <select
                        value={data.club}
                        onChange={(e) => setData('club', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {clubs.map((clubOption) => (
                          <option key={clubOption.value} value={clubOption.value}>
                            {clubOption.icon} {clubOption.label}
                          </option>
                        ))}
                      </select>
                      {errors.club && <p className="text-red-500 text-sm">{errors.club}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-800">{club}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          Current Club
                        </span>
                      </div>
                      <button
                        onClick={() => setEditingField('club')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons for Profile */}
                {editingField && (
                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={editingField === 'name' ? handleProfileUpdate : () => setData('club', club)}
                      disabled={processing}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium disabled:opacity-50"
                    >
                      {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>

                {/* Username Display */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 font-mono">{usernameP}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Permanent
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Change Password</label>
                  
                  {editingField === 'password' ? (
                    <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          value={data.password}
                          onChange={(e) => setData('password', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                          type="password"
                          value={data.confirmPassword}
                          onChange={(e) => setData('confirmPassword', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                      </div>

                      <div className="flex items-center space-x-3 pt-2">
                        <button
                          onClick={handlePrivacyUpdate}
                          disabled={processing}
                          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium disabled:opacity-50"
                        >
                          {processing ? 'Updating...' : 'Update Password'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <p className="text-yellow-800 font-medium">Password</p>
                        <p className="text-yellow-700 text-sm">Last changed: Recently</p>
                      </div>
                      <button
                        onClick={() => setEditingField('password')}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium"
                      >
                        Change Password
                      </button>
                    </div>
                  )}
                </div>

                {/* Security Tips */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">🔒 Security Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use a strong, unique password</li>
                    <li>• Avoid using personal information in your password</li>
                    <li>• Consider using a password manager</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-2xl mb-2">👤</div>
            <p className="font-medium text-gray-800">Profile Complete</p>
            <p className="text-sm text-gray-600">All information provided</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-2xl mb-2">🏛️</div>
            <p className="font-medium text-gray-800">{club} Club</p>
            <p className="text-sm text-gray-600">Current membership</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-2xl mb-2">🆔</div>
            <p className="font-medium text-gray-800">ID: {studentId}</p>
            <p className="text-sm text-gray-600">Student identifier</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Verify({
  selectAct,
  username,
  lastName,
  club,
  studentId,
}: {
  selectAct: Activity[];
  username: string;
  lastName: string;
  club: string;
  studentId: number;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
    setLink("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedId || !link) {
      alert("Please enter a GitHub link before submitting!");
      return;
    }

    const githubPattern = /^(https?:\/\/)?(www\.)?github\.com\/.+$/i;
    if (!githubPattern.test(link.trim())) {
      alert('Please enter a valid GitHub repository link (e.g., https://github.com/username/repository)');
      return;
    }

    setIsSubmitting(true);
    
    router.post("/activities/select", {
      student_id: studentId,
      activity_id: selectedId,
      name: username,
      last_name: lastName,
      club: club,
      link: link.trim(),
    }, {
      onSuccess: () => {
        setSelectedId(null);
        setLink("");
        setIsSubmitting(false);
        // You could add a success notification here
      },
      onError: () => {
        setIsSubmitting(false);
        // Handle error appropriately
      }
    });
  };

  if (!selectAct || selectAct.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Activities Available</h2>
          <p className="text-gray-600">
            There are currently no verification activities available. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">✅ Account Verification</h1>
          <p className="text-lg text-gray-600 mb-2">
            Complete an activity to verify your account and unlock all features
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
              <p className="text-yellow-700">
                Make sure you have already created a GitHub repository before selecting an activity. 
                You'll need to provide the GitHub link immediately after selection.
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div>
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-semibold text-gray-800">{username} {lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Club</p>
              <p className="font-semibold text-gray-800">{club}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-semibold text-gray-800">{studentId}</p>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
            Available Activities ({selectAct.length})
          </h2>

          {selectAct.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Activity Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Activity #{activity.id}
                      </span>
                      
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {activity.activity}
                    </h3>
                    
                  </div>

                  <button
                    onClick={() => handleSelect(activity.id)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedId === activity.id
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                        : 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                    }`}
                  >
                    {selectedId === activity.id ? 'Selected' : 'Select Activity'}
                  </button>
                </div>

                {/* GitHub Link Form */}
                {selectedId === activity.id && (
                  <form onSubmit={handleSubmit} className="bg-blue-50 rounded-xl p-4 border border-blue-200 mt-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          📍 GitHub Repository Link
                        </label>
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          placeholder="https://github.com/your-username/your-repository"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
                          required
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Make sure your repository is public and contains the completed activity
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="submit"
                          disabled={isSubmitting || !link.trim()}
                          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <span>✅</span>
                              <span>Submit for Verification</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(null);
                            setLink("");
                          }}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Activity Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <span>📅</span>
                      
                    </span>
                    
                  </div>
                  
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="text-xl mr-2">💡</span>
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Creating a GitHub Repository</h4>
              <ul className="text-gray-600 space-y-1">
                <li>1. Go to <a href="https://github.com" className="text-blue-500 hover:underline">GitHub.com</a></li>
                <li>2. Click the '+' icon and select "New repository"</li>
                <li>3. Name your repository and make it public</li>
                <li>4. Upload your activity files</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Verification Process</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Select an activity that matches your skills</li>
                <li>• Complete the activity requirements</li>
                <li>• Upload your work to GitHub</li>
                <li>• Submit the repository link for review</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type SelectedActivity ={

  activity_id: number,
  status: string

}

function SubmittedActivity({ selectedAct }: { selectedAct: SelectedActivity[] }) {
  const [isMarking, setIsMarking] = useState<number | null>(null);

  const handleMarkAsDone = async (activityId: number) => {
    setIsMarking(activityId);
    router.post(`/submitted/activity/${activityId}`);
  };

  const getStatusConfig = (status: string) => {
    if (status === "Done") {
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✅"
      };
    } else if (status === "Rejected") {
      return {
        color: "bg-red-100 text-red-800 border-red-200", 
        icon: "❌"
      };
    } else {
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏳"
      };
    }
  };

  if (!selectedAct || selectedAct.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-2xl shadow-sm p-8 max-w-md w-full">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Submitted Activities</h2>
          <p className="text-gray-600">
            You haven't submitted any activities for verification yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Submitted Activities</h1>
          <p className="text-gray-600">Track your submitted verification activities</p>
        </div>

        {/* Activities List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {selectedAct.map((activity) => {
              const statusConfig = getStatusConfig(activity.status);
              const canMarkDone = activity.status !== "Rejected" && activity.status !== "Done";

              return (
                <div
                  key={activity.activity_id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-semibold text-blue-600">
                            #{activity.activity_id}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Activity #{activity.activity_id}
                        </h3>
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                          <span>{statusConfig.icon}</span>
                          <span>{activity.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      {canMarkDone && (
                        <button
                          onClick={() => handleMarkAsDone(activity.activity_id)}
                          disabled={isMarking === activity.activity_id}
                          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isMarking === activity.activity_id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <span>✅</span>
                              <span>Mark as Done</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Legend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span className="text-gray-700">Done - Activity completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">⏳</span>
              <span className="text-gray-700">Pending - Under review</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-red-600">❌</span>
              <span className="text-gray-700">Rejected - Needs revision</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Projects ={
 id: number; user_id: number; name: string; club: string; project_type:string;title:string;place:string;date:string;time:string;description:string;status:string;created_at:string;
}

type ActiveStaffs ={
  id:number; name:string; last_name: string; status:string;
}

type postedData = {
  id:number;
  name:string;
  caption:string;
  picture:string;
  club:string;
  created_at:string;
  userid:number;
  likes:number
}

type Students ={
  id:number,
  name:string,
  last_name:string,
  club:string,
  status: string
}
type Notifications ={
  id:number;user_id:number;name:string;club:string;notification:string;created_at:string;caption:string;
}
type Admin ={
  name:string,
  last_name:string,
  status:string

}
type Team ={
  name:string,
  last_name:string,
  status:string

}
type StudentPost ={
  id:number,
  name: string,
  club:string,
  caption:string,
  picture:string,
  created_at:string
}

type Comments ={
  comments: { 
    [postId: number]: { 
      id: number; 
      comment: string; 
      postId: number; 
      created_at: string; 
      name: string; 
      last_name: string; 
    }
  };
}

export default function UserHomeTab({
 
  likes,
  activeStaffs,
  selectAct,
  username,
  verification,
  lastName,
  club,
  studentId,
  selectedAct,
  projects,
  getPostedData,
  students,
  notifications,
  admin,
  team,
  studentPost,
  usernameP
}: {
 
  likes:number;
  activeStaffs: ActiveStaffs[];
  selectedAct: SelectedActivity[];
  selectAct: Activity[];
  username: string;
  verification: string;
  lastName: string;
  club: string;
  studentId: number;
  projects: Projects[];
  getPostedData: postedData[];
  students: Students[];
  notifications: Notifications[];
  admin: Admin[];
  team: Team[];
  studentPost: StudentPost[];
  usernameP: string;
}) {
  const [activeTab, setActiveTab] = useState<
    "home" | "profile" | "projects" | "verify" | "manageProfile" | "submitted"
  >("home");
  const [showDropdown, setShowDropdown] = useState(false);

  const HandleLogout = () => {
    router.post("/logout");
  };

  const isVerified = verification === "Verified";
  const verificationColor = isVerified ? "text-green-600" : "text-red-600";
  const verificationBg = isVerified ? "bg-green-50" : "bg-red-50";
  const verificationBorder = isVerified ? "border-green-200" : "border-red-200";

  const tabs = [
    { id: "home" as const, label: "Home", icon: "🏠" },
    { id: "profile" as const, label: "Profile", icon: "👤" },
    { id: "projects" as const, label: "Projects", icon: "💼" },
  ];

  const dropdownItems = [
    { label: "Manage Profile", action: "manageProfile", icon: "⚙️" },
    { label: "Verify Account", action: "verify", icon: "🔒" },
    { label: "Submitted Activities", action: "submitted", icon: "📋" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-4 shadow-lg sticky top-0 z-50">
        <div className="flex justify-between items-center">
          {/* Left Section - User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-white">{username}</h1>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${verificationBg} ${verificationBorder}`}>
                <span className={`text-sm font-semibold ${verificationColor}`}>
                  {isVerified ? "✓" : "!"}
                </span>
                <span className={`text-xs font-semibold ${verificationColor}`}>
                  {verification}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Navigation */}
          <div className="flex items-center space-x-8">
            {/* Main Navigation */}
            <nav className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all duration-200"
              >
                <span>📑</span>
                <span className="text-sm font-medium">Others</span>
                <span className="text-xs">{showDropdown ? "▲" : "▼"}</span>
              </button>

              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
                  {dropdownItems.map((item) => (
                    <button
                      key={item.action}
                      onClick={() => {
                        setActiveTab(item.action as any);
                        setShowDropdown(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                  
                  <div className="border-t border-gray-200 my-1" />
                  
                  <button
                    onClick={() => {
                      HandleLogout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <span className="text-base">🚪</span>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "home" && (
          <Home 
          likes = {likes}
            notifications={notifications}
            verification={verification}
            students={students}
            getPostedData={getPostedData}
            club={club}
            studentId={studentId}
            name={username}
            lastName={lastName}
          />
        )}
        {activeTab === "profile" && (
          <Profile 
            studentPost={studentPost}
            name={username}
            lastName={lastName}
            club={club}
            studentId={studentId}
          />
        )}
        {activeTab === "projects" && (
          <Projects 
            team={team}
            admin={admin}
            activeStaffs={activeStaffs}
            verification={verification}
            name={username}
            lastName={lastName}
            club={club}
            student_id={studentId}
            projects={projects}
          />
        )}
        {activeTab === "manageProfile" && (
          <ManageProfile 
            usernameP={usernameP}
            studentId={studentId}
            username={username}
            lastName={lastName}
            club={club}
          />
        )}
        {activeTab === "verify" && (
          <Verify
            username={username}
            lastName={lastName}
            club={club}
            studentId={studentId}
            selectAct={selectAct}
          />
        )}
        {activeTab === "submitted" && (
          <SubmittedActivity selectedAct={selectedAct} />
        )}
      </main>
    </div>
  );
}