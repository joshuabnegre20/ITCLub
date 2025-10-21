import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function Login() {
  const { data, setData, post } = useForm({
    username: '',
    password: '',
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post('/LoginController');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
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
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold text-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function Signin() {
  const { data, setData, post } = useForm({
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
    post('/SignInController', {
      onSuccess: () => {
        setData({
          username: '',
          password: '',
          name: '',
          last_name: '',
          gender: '',
          club: '',
          address: ''
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join TMC IT Club today</p>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
              required
            >
              <option value="">Select Club</option>
              <option value="Programming">Programming Club</option>
              <option value="Graphic Design">Graphic Design Club</option>
              <option value="Video Editing">Video Editing Club</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold text-lg text-black"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginTabs() {
  return (
    <Router>
      {/* Header - Same gradient as home page header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo/Brand */}
          <span className="font-bold text-xl text-white">
            TMC IT CLUB
          </span>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <Link 
              to="/" 
              className="text-white font-medium hover:text-gray-200 transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="text-white font-medium hover:text-gray-200 transition-colors duration-200"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signin />} />
      </Routes>
    </Router>
  );
}