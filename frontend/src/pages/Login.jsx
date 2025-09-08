import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../contexts/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, we'll just navigate to dashboard
        // In a real app, you would call your API here
        localStorage.setItem('token', 'demo-token');
        navigate('/');
        addToast('Welcome back! You have been successfully logged in.', 'success');
        setLoading(false);
      }, 1000);
    } catch (err) {
      setErrors({ general: 'Invalid email or password' });
      addToast('Invalid email or password. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 via-secondary-50 to-accent-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="h-12 w-12 rounded-full bg-white"></div>
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Sign in to your account
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-lg py-10 px-8 shadow-xl rounded-2xl border border-white/20 hover:shadow-2xl transition-shadow duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="rounded-lg bg-danger-50 p-4 border border-danger-100">
                <div className="text-sm text-danger-700 font-medium">{errors.general}</div>
              </div>
            )}
            <div>
              <Input
                id="email-address"
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Input
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-lg shadow-sm"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-300">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                size="lg"
                variant="primary"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>
        <div className="text-lg text-center text-gray-700">
          Don't have an account?{' '}
          <a href="/register" className="font-semibold text-primary-600 hover:text-primary-800 transition-colors duration-300">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;