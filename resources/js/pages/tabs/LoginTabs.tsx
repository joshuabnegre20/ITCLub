import { Inertia } from '@inertiajs/inertia';
import { router, useForm } from '@inertiajs/react';
import { setDefaultAutoSelectFamily } from 'net';
import { useState } from 'react';
import { text } from 'stream/consumers';

function Step2({ generatedCode,email, onVerificationSuccess }: { 
  generatedCode: string;
  email:string;
  onVerificationSuccess: () => void;
}) {
  const { data, setData, processing } = useForm({
    code: '',
    email: email
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email)
    // Local verification - check if entered code matches generated code
    if (data.code === generatedCode) {
      // Code is correct - proceed to step 3
      onVerificationSuccess();
    } else {
      // Code is incorrect
      alert('Invalid verification code. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📧</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Verification Code</h2>
        <p className="text-gray-600">We sent a 6-digit code to your email</p>
        {/* Debug: Show the generated code (remove in production) */}
        <p className="text-xs text-gray-400">Debug: Code is {generatedCode}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            id="code"
            value={data.code}
            onChange={(e) => setData('code', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-center text-lg font-mono tracking-widest"
            placeholder="000000"
            maxLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify Code
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          className="text-blue-500 hover:text-blue-600 font-medium text-sm"
        >
          Resend Code
        </button>
      </div>
    </div>
  );
}

function Step3({email}:{email:string}) {
  const { data, setData, post, processing, errors } = useForm({
    password: '',
    password_confirmation: '',
    email: email
  });

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Email:', data.email);
  console.log('Password:', data.password);
  
  post('/change-password', {
    onSuccess: (response) => {
      console.log('Success response:', response);
      alert('Password reset successfully! You can now login.');
      window.location.href = '/';
    },
    onError: (errors) => {
      console.error('Error response:', errors);
      if (errors.password) {
        alert('Password error: ' + errors.password);
      } else if (errors.email) {
        alert('Email error: ' + errors.email);
      } else {
        alert('Failed to reset password. Please try again.');
      }
    }
  });
};

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔑</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Password</h2>
        <p className="text-gray-600">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Enter new password"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="Confirm new password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

function Verification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [getData, setGetData] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(''); // Store the generated code
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    code: ''
  });
  const[email,setEmail]  = useState('')

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    post('/send-verification', {
      onSuccess: () => {
        alert('Verification code sent! Check your email.');
        setCurrentStep(2);
      },
      onError: (errors) => {
        console.error('Verification error:', errors);
        if (errors.email) {
          alert('Email not found or verification failed.');
        } else {
          alert('Failed to send verification code. Please try again.');
        }
      }
    });
  };

  const handleGet = () => {
    alert('Make sure the email is in our database!');
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('Sending verification to:', data.email);
    console.log('Verification code:', verificationCode);
    
    // Store the generated code in state
    setGeneratedCode(verificationCode);
    
    // Update form data
    setData({
      email: data.email,
      code: verificationCode
    });
    setEmail(data.email)
    setGetData(true);
  };

  const handleVerificationSuccess = () => {
    alert('Email verified successfully!');
    setCurrentStep(3); // Move to password reset after successful verification
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-6 relative">
      {/* IT-Themed Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/10 to-transparent"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md relative z-10">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
              <p className="text-gray-600">Enter your email to receive a verification code</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter your email address"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {getData === false ? (
              <button
                onClick={handleGet}
                type="button"
                disabled={processing}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Email
              </button>
            ) : (
              <button
                onClick={handleEmailSubmit}
                type="button"
                disabled={processing}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button 
                  onClick={() => window.history.back()}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Back to Login
                </button>
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <Step2 
            generatedCode={generatedCode}  email = {email}
            onVerificationSuccess={handleVerificationSuccess} 
          />
        )}
        {currentStep === 3 && <Step3 email = {email}/>}
      </div>
    </div>
  );
}

function Login({ onSwitchToSignup, onSwitchToVerification }: { 
  onSwitchToSignup: () => void; 
  onSwitchToVerification: () => void;
}) {
  const { data, setData, post } = useForm({
    username: '',
    password: '',
  });

  const [isError, setError] = useState(false)
   const [textError, setTextError] = useState('')

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    post('/LoginController', {
    onSuccess: (response) => {
      
    },
    onError: (errors) => {
      console.error('Error response:', errors);
      if (errors.password) {
        alert('Password error: ' + errors.password);
      
      } else {
        
        setTextError('Invalid username or password')
        
      }
    }
  });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-6 relative">
      {/* IT-Themed Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/10 to-transparent"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md relative z-10">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">💻</span>
              </div>
            </div>
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black placeholder-gray-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black placeholder-gray-500"
                required
              />
            </div>
          </div>

          <p style={{color: 'red'}} >  {textError}</p> 

          <div className="text-center">
            <button 
              type="button"
              onClick={onSwitchToVerification}
              className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Sign In
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={onSwitchToSignup}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function Signin({ club, onSwitchToLogin }: { 
  club: Club[]; 
  onSwitchToLogin: () => void;
}) {
  const { data, setData, post } = useForm({
    username: '',
    password: '',
    name: '',
    last_name: '',
    gender: '',
    club: '',
    address: '',
    email:''
  });

   const [textError, setTextError] = useState('')

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(data.password.length <8 ){
      setTextError('Password must be at least 8 characters')

      return
    }
    setTextError('')
    post('/SignInController', {
      onSuccess: () => {
        setData({
          username: '',
          password: '',
          name: '',
          last_name: '',
          gender: '',
          club: '',
          address: '',
          email: ''
        }); alert('account created succesfully')
         router.reload()
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-6 relative">
      {/* IT-Themed Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/10 to-transparent"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative z-10">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🚀</span>
              </div>
            </div>
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black placeholder-gray-500"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  value={data.last_name}
                  onChange={(e) => setData('last_name', e.target.value)}
                  placeholder="Last name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black placeholder-gray-500"
                  required
                />
              </div>
            </div>
            
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black placeholder-gray-500"
              required
            />
            
            <input
              type="text"
              name="address"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              placeholder="Address"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black placeholder-gray-500"
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
                    className="text-blue-500 focus:ring-blue-500"
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
                    className="text-blue-500 focus:ring-blue-500"
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black placeholder-gray-500"
              required
            />
            
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black placeholder-gray-500"
              required
            />

            {/* Club Selection */}
            <select
              value={data.club}
              onChange={(e) => setData('club', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 text-black"
              required
            >
              <option value="">Select Club</option>
              {(club || []).map((clubItem, index) => (
                <option key={index} value={clubItem.club}>
                  {clubItem.club} Club
                </option>
              ))}
            </select>
          </div>

              <p style={{color: 'red'}}>{textError}</p>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Account
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToLogin}
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

type Club = { club: string; created_at: string }

type ActiveTab = 'login' | 'signup' | 'verification';

export default function LoginTabs({ club }: { club: Club[] }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');
  const { post } = useForm();

  const handleSwitchToSignup = () => {
    // Simply switch to signup page without sending verification email
    setActiveTab('signup');
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
  };

  const handleSwitchToVerification = () => {
    setActiveTab('verification');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'login':
        return (
          <Login 
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToVerification={handleSwitchToVerification}
          />
        );
      case 'signup':
        return (
          <Signin 
            club={club} 
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      case 'verification':
        return <Verification />;
      default:
        return (
          <Login 
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToVerification={handleSwitchToVerification}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Enhanced IT-Themed Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 px-8 py-4 shadow-2xl border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo/Brand with Tech Style */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">💻</span>
            </div>
            <span className="font-bold text-2xl text-white bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              TMC IT CLUB
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('login')}
              className={`font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
                activeTab === 'login' 
                  ? 'text-white' 
                  : 'text-cyan-100 hover:text-white'
              }`}
            >
              <span>🔐</span>
              <span>Login</span>
            </button>
            <button 
              onClick={handleSwitchToSignup}
              className={`font-medium transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
                activeTab === 'signup' 
                  ? 'text-white' 
                  : 'text-cyan-100 hover:text-white'
              }`}
            >
              <span>🚀</span>
              <span>Sign Up</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      {renderContent()}
    </div>
  );
}