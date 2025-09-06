import { useState, type FC, useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Eye, EyeOff, Loader2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PasswordChecks, RegisterCredentials, LoginCredentials } from '../types/global';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../context/AppContext';
import { registerUser, loginUser } from '../api/authApi';

const Login: FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const context = useContext(AppContext);
  if (!context) throw new Error('Login must be used within an AppContextProvider');
  const { isLoggedIn, checkAuthAndFetchUser } = context;

  // Google Login Handler
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/auth/google`;
  };

  // Github Login Handler
  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/auth/github`;
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setIsSubmitting(true);
      const response = await registerUser(credentials);
      setName('');
      setEmail('');
      setPassword('');
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      await checkAuthAndFetchUser(); // Fetch user data after successful registration
      navigate('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsSubmitting(true);
      const response = await loginUser(credentials);
      if (response.success) {
        toast.success(response.message);
        navigate('/');
      } else {
        toast.error(response.message);
      }
      await checkAuthAndFetchUser(); // Fetch user data after successful login
    } catch (error: unknown) {
      setEmail('');
      setPassword('');
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (state === 'signup') {
      if (strength < 80) {
        toast.warning('Please use a stronger password');
        return;
      }
      handleRegister({ name, email, password });
    } else {
      handleLogin({ email, password });
    }
  };

  // Password strength checks
  const passwordChecks: PasswordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Calculate strength percentage (20% per criteria)
  const strength = Math.round((Object.values(passwordChecks).filter(Boolean).length / 5) * 100);

  // Get strength label with color
  const getStrengthLabel = (): { text: string; color: string } => {
    if (strength === 100) return { text: 'Very Strong', color: 'text-emerald-400' };
    if (strength >= 80) return { text: 'Strong', color: 'text-green-400' };
    if (strength >= 60) return { text: 'Good', color: 'text-blue-400' };
    if (strength >= 40) return { text: 'Weak', color: 'text-yellow-400' };
    return { text: 'Very Weak', color: 'text-red-400' };
  };

  // Get strength meter color
  const getStrengthMeterColor = (): string => {
    if (strength === 100) return 'bg-emerald-400';
    if (strength >= 80) return 'bg-green-400';
    if (strength >= 60) return 'bg-blue-400';
    if (strength >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 via-purple-100 to-purple-400">
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer hover:scale-105 transition-transform duration-300 z-10"
      />

      <div className="bg-slate-900/90 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl w-full sm:w-96 text-indigo-200 border border-indigo-800/30 relative overflow-hidden">
        {/* Futuristic accent elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl"></div>

        {/* Card structure with tabs */}
        <div className="relative z-10">
          <div className="flex mb-8 border-b border-indigo-700/30">
            <button
              type="button"
              onClick={() => !isSubmitting && setState('signup')}
              className={`flex-1 py-3 text-center font-medium transition-all duration-300 ${
                state === 'signup'
                  ? 'text-white border-b-2 border-purple-400'
                  : 'text-indigo-400 hover:text-indigo-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => !isSubmitting && setState('login')}
              className={`flex-1 py-3 text-center font-medium transition-all duration-300 ${
                state === 'login'
                  ? 'text-white border-b-2 border-purple-400'
                  : 'text-indigo-400 hover:text-indigo-300'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              Login
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 text-white">
              {state === 'signup' ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-indigo-300/80">
              {state === 'signup' ? 'Join us today!' : 'Sign in to continue your journey'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {state === 'signup' && (
              <div className="group">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/70 border border-indigo-700/30 focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all duration-300">
                  <img src={assets.person_icon} alt="person" className="w-4 opacity-80" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="bg-transparent outline-none w-full placeholder-indigo-300/50 text-white"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            <div className="group">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/70 border border-indigo-700/30 focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all duration-300">
                <img src={assets.mail_icon} alt="email" className="w-4 opacity-80" />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  className="bg-transparent outline-none w-full placeholder-indigo-300/50 text-white"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="group">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/70 border border-indigo-700/30 focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all duration-300">
                <img src={assets.lock_icon} alt="password" className="w-4 opacity-80" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  className="bg-transparent outline-none w-full placeholder-indigo-300/50 text-white"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className={`text-indigo-300 hover:text-indigo-200 transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Meter (only shown during signup) */}
            {state === 'signup' && (
              <div className="mt-3 p-4 rounded-xl bg-slate-800/60 border border-indigo-700/20">
                <div className="flex justify-between text-xs text-indigo-300 mb-2">
                  <span>Password strength</span>
                  <span className={`font-medium ${getStrengthLabel().color}`}>
                    {getStrengthLabel().text}
                  </span>
                </div>
                <div
                  className="w-full h-1.5 bg-indigo-900/70 rounded-full overflow-hidden mb-3"
                  role="progressbar"
                  aria-valuenow={strength}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Password strength meter"
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getStrengthMeterColor()} shadow-md`}
                    style={{ width: `${strength}%` }}
                  ></div>
                </div>

                {/* Password Requirements */}
                <div className="grid grid-cols-2 gap-2 text-xs text-indigo-300/80">
                  <div
                    className={`flex items-center ${
                      passwordChecks.length ? 'text-emerald-400' : ''
                    }`}
                  >
                    <span className="mr-1.5">{passwordChecks.length ? '✓' : '•'}</span>
                    8+ characters
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordChecks.upper ? 'text-emerald-400' : ''
                    }`}
                  >
                    <span className="mr-1.5">{passwordChecks.upper ? '✓' : '•'}</span>
                    Uppercase
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordChecks.lower ? 'text-emerald-400' : ''
                    }`}
                  >
                    <span className="mr-1.5">{passwordChecks.lower ? '✓' : '•'}</span>
                    Lowercase
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordChecks.number ? 'text-emerald-400' : ''
                    }`}
                  >
                    <span className="mr-1.5">{passwordChecks.number ? '✓' : '•'}</span>
                    Number
                  </div>
                  <div
                    className={`flex items-center col-span-2 ${
                      passwordChecks.special ? 'text-emerald-400' : ''
                    }`}
                  >
                    <span className="mr-1.5">{passwordChecks.special ? '✓' : '•'}</span>
                    Special character
                  </div>
                </div>
              </div>
            )}

            {state === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
                  onClick={() => navigate('/reset-password')}
                  disabled={isSubmitting}
                >
                  Forgot Password? <ChevronRight size={14} className="ml-0.5" />
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group ${
                isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              <span className="absolute inset-0 bg-white/10 group-hover:bg-white/5 transition-all duration-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></span>
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2 relative">
                  <Loader2 size={20} className="animate-spin" />
                  {state === 'signup' ? 'Creating Account...' : 'Logging In...'}
                </span>
              ) : state === 'signup' ? (
                <span className="relative">Create Account</span>
              ) : (
                <span className="relative">Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-5">
              <div className="flex-grow border-t border-indigo-400/30"></div>
              <span className="mx-4 text-sm text-indigo-300/80">or continue with</span>
              <div className="flex-grow border-t border-indigo-400/30"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className={`py-3 rounded-xl bg-white/95 text-gray-800 font-medium border border-gray-300/50 hover:bg-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <span className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-all duration-300"></span>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5 relative z-10"
                />
                <span className="text-sm relative z-10">Google</span>
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={isSubmitting}
                className={`py-3 rounded-xl bg-gray-800 text-white font-medium border border-gray-700 hover:bg-gray-900 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <span className="absolute inset-0 bg-white/5 group-hover:bg-white/0 transition-all duration-300"></span>
                <img
                  src="https://github.com/favicon.ico"
                  alt="Github"
                  className="w-5 h-5 relative z-10"
                />
                <span className="text-sm relative z-10">GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
