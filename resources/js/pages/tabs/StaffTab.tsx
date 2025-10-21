import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useForm } from '@inertiajs/react';

function Login() {
  const { data, setData, post, processing } = useForm({
    username: '',
    password: '',
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post('/staff/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">🔐</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Staff Login</h2>
            <p className="text-gray-600">Sign in to your staff account</p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter username"
                value={data.username}
                onChange={(e) => setData('username', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Signup() {
  const { data, setData, post, processing } = useForm({
    username: '',
    password: '',
    name: '',
    last_name: '',
    gender: '',
    club: '',
    address: ''
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post('/StaffSigninController');
  };

  const clubs = [
    { value: "Programming", label: "Programming Club", icon: "💻" },
    { value: "Graphic Design", label: "Graphic Design Club", icon: "🎨" },
    { value: "Video Editing", label: "Video Editing Club", icon: "🎬" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">👥</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Staff Sign Up</h2>
            <p className="text-gray-600">Create a new staff account</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Information
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="First name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  value={data.last_name}
                  onChange={(e) => setData('last_name', e.target.value)}
                  placeholder="Last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
                  required
                />
              </div>
            </div>

            <input
              type="text"
              name="address"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              placeholder="Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
              required
            />

            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="male"
                    name="gender"
                    checked={data.gender === 'male'}
                    onChange={(e) => setData('gender', e.target.value)}
                    className="text-blue-500 focus:ring-blue-500 text-black"
                    required
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="female"
                    name="gender"
                    checked={data.gender === 'female'}
                    onChange={(e) => setData('gender', e.target.value)}
                    className="text-blue-500 focus:ring-blue-500 text-black"
                    required
                  />
                  <span className="text-gray-700">Female</span>
                </label>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Information
            </label>
            
            <input
              type="text"
              placeholder="Enter username"
              name="username"
              value={data.username}
              onChange={(e) => setData('username', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
              required
            />
            
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
              required
            />

            {/* Club Selection */}
            <select
              value={data.club}
              onChange={(e) => setData('club', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white text-black"
              required
            >
              <option value="">Select Club</option>
              {clubs.map((club) => (
                <option key={club.value} value={club.value}>
                  {club.icon} {club.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Creating Account...' : 'Create Staff Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function StaffTab() {
  return (
    <Router>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-bold text-xl text-white">
            TMC IT CLUB - Staff Portal
          </span>

          <nav className="flex space-x-8">
            <Link 
              to="/StaffPage" 
              className="text-white font-medium hover:text-gray-200 transition-colors duration-200"
            >
              Staff Login
            </Link>
            <Link 
              to="/signinstaff" 
              className="text-white font-medium hover:text-gray-200 transition-colors duration-200"
            >
              Staff Signup
            </Link>
          </nav>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/StaffPage" element={<Login />} />
        <Route path="/signinstaff" element={<Signup />} />
      </Routes>
    </Router>
  );
}