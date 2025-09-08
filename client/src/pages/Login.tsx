import { useState, type FC, useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Eye, EyeOff } from 'lucide-react';
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
    // Backend ke Google OAuth endpoint pe redirect karenge
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/auth/google`;
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
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer hover:scale-105 transition-transform"
      />

      <div className="bg-slate-900/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-2xl w-full sm:w-96 text-indigo-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-white bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text">
            {state === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-indigo-300/80">
            {state === 'signup' ? 'Join us today!' : 'Login to continue your journey'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {state === 'signup' && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#333A5C]/80 focus-within:bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500">
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
          )}

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#333A5C]/80 focus-within:bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500">
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

          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#333A5C]/80 focus-within:bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500">
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
              className={`text-indigo-300 hover:text-indigo-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-indigo-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Password Strength Meter (only shown during signup) */}
          {state === 'signup' && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-indigo-300">
                <span>Password strength</span>
                <span className={getStrengthLabel().color}>{getStrengthLabel().text}</span>
              </div>
              <div
                className="w-full h-1.5 bg-indigo-900/70 rounded-full mt-1.5 overflow-hidden"
                role="progressbar"
                aria-valuenow={strength}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Password strength meter"
              >
                <div
                  className={`h-full rounded-full ${getStrengthMeterColor()}`}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>

              {/* Password Requirements */}
              <ul className="mt-3 text-xs text-indigo-300/80 space-y-1">
                <li className={passwordChecks.length ? 'text-emerald-400' : ''}>
                  {passwordChecks.length ? '✓' : '✗'} At least 8 characters
                </li>
                <li className={passwordChecks.upper ? 'text-emerald-400' : ''}>
                  {passwordChecks.upper ? '✓' : '✗'} Contains Uppercase letter
                </li>
                <li className={passwordChecks.lower ? 'text-emerald-400' : ''}>
                  {passwordChecks.lower ? '✓' : '✗'} Contains Lowercase letter
                </li>
                <li className={passwordChecks.number ? 'text-emerald-400' : ''}>
                  {passwordChecks.number ? '✓' : '✗'} Contains a number
                </li>
                <li className={passwordChecks.special ? 'text-emerald-400' : ''}>
                  {passwordChecks.special ? '✓' : '✗'} Contains Special character
                </li>
              </ul>
            </div>
          )}

          {state === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-indigo-400 hover:text-indigo-300"
                onClick={() => navigate('/reset-password')}
                disabled={isSubmitting}
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98] transition-all ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {state === 'signup' ? 'Signing Up...' : 'Logging In...'}
              </span>
            ) : state === 'signup' ? (
              'Sign Up'
            ) : (
              'Login'
            )}
          </button>

          <div
            className={`text-center pt-4 ${
              state === 'signup' ? 'bg-[#333A5C]/40 -mx-6 -mb-6 px-6 py-4 rounded-b-xl' : ''
            }`}
          >
            <p className="text-sm text-indigo-300">
              {state === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => !isSubmitting && setState(state === 'signup' ? 'login' : 'signup')}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                disabled={isSubmitting}
              >
                {state === 'signup' ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative flex items-center justify-center mb-4">
            <div className="flex-grow border-t border-indigo-400/30"></div>
            <span className="mx-4 text-sm text-indigo-300/80">or continue with</span>
            <div className="flex-grow border-t border-indigo-400/30"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl bg-white text-gray-800 font-medium border border-gray-300 hover:bg-gray-50 shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
