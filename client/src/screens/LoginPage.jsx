import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, LogIn, Shield } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (userInfo) navigate("/hotels");
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const handleSignUpClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-6 shadow-lg animate-pulse">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-white/70 text-lg">
              Sign in to continue your journey
            </p>
          </div>

          {/* Error Display */}
          {/* {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 text-sm backdrop-blur-sm animate-shake">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                {error}
              </div>
            </div>
          )} */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-semibold block flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15"
                  placeholder="Enter your email address"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-semibold block flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200 z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button 
                type="button"
                className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg group"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  Sign In
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="px-4 text-white/50 text-sm">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-white/70 mb-4 text-lg">Don't have an account?</p>
            <button 
              onClick={handleSignUpClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-sm hover:scale-105"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Security Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-white/50 text-xs">
            <Shield className="w-4 h-4" />
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500/30 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute -top-4 -right-8 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl animate-bounce delay-300"></div>
        <div className="absolute -bottom-8 -left-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-bounce delay-700"></div>
        <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-blue-500/25 rounded-full blur-xl animate-bounce delay-1000"></div>
      </div>

      {/* Additional Background Glow */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};

export default LoginPage;