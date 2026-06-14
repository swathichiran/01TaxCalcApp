import React, { useState } from 'react';
import { useTax } from '../context/TaxContext';
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export const SignUp: React.FC = () => {
  const { registerUser, loginUser, setCurrentStep } = useTax();
  const [isLoginView, setIsLoginView] = useState<boolean>(false);
  
  // Form States
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  // Validation Errors
  const [validationError, setValidationError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setValidationError('');
    setSuccessMsg('');
  };

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    clearForm();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Basic Validations
    if (!name.trim()) {
      setValidationError('Full Name is required.');
      return;
    }
    if (name.trim().length < 2) {
      setValidationError('Name must be at least 2 characters.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    // Attempt mock registration
    const res = registerUser(name, email, password);
    if (!res.success) {
      setValidationError(res.error || 'Registration failed.');
      return;
    }

    setSuccessMsg('Account created successfully!');
    setTimeout(() => {
      setCurrentStep(1); // Proceed to step 1
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setValidationError('Password is required.');
      return;
    }

    // Attempt mock login
    const res = loginUser(email, password);
    if (!res.success) {
      setValidationError(res.error || 'Login failed.');
      return;
    }

    setSuccessMsg('Logged in successfully!');
    setTimeout(() => {
      setCurrentStep(1); // Proceed to step 1
    }, 1000);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 bg-gradient-to-b from-blue-50/20 via-transparent to-transparent">
      <div className="max-w-md w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-premium space-y-6 relative overflow-hidden transition-all duration-300">
        
        {/* visual decoration bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 pb-3 justify-center gap-6">
          <button
            onClick={() => {
              setIsLoginView(false);
              clearForm();
            }}
            className={`font-outfit font-bold text-sm uppercase tracking-wider pb-1.5 transition-all ${
              !isLoginView
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setIsLoginView(true);
              clearForm();
            }}
            className={`font-outfit font-bold text-sm uppercase tracking-wider pb-1.5 transition-all ${
              isLoginView
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Welcome Back
          </button>
        </div>

        {/* Dynamic Title */}
        <div className="text-center">
          <h2 className="text-2xl font-outfit font-extrabold text-slate-800">
            {isLoginView ? 'Sign in to TaxCalc' : 'Sign up for free check'}
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {isLoginView
              ? 'Enter your email and password to access your tax profile'
              : 'Create a local profile to compare your regimes and save your calculations'}
          </p>
        </div>

        {/* Success / Error Alerts */}
        {validationError && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-xs font-semibold text-red-600 rounded-xl text-left">
            ⚠️ {validationError}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-600 rounded-xl text-left">
            ✓ {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-4 text-left">
          
          {/* Full Name (SignUp only) */}
          {!isLoginView && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm bg-slate-50/30"
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm bg-slate-50/30"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm bg-slate-50/30"
            />
          </div>

          {/* Confirm Password (SignUp only) */}
          {!isLoginView && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm Password</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm bg-slate-50/30"
              />
            </div>
          )}

          {/* CTA Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center font-outfit flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            <span>{isLoginView ? 'Sign In' : 'Sign Up'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* View toggle helper */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-50 pt-4 flex flex-col space-y-3">
          <button
            onClick={handleToggleView}
            className="text-blue-600 font-bold hover:underline"
          >
            {isLoginView ? "Don't have a profile? Sign up" : 'Already have a profile? Sign in'}
          </button>
          
          <div className="flex items-start justify-center gap-1.5 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/40">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-left text-slate-500 font-medium">
              Privacy-First: Data is encrypted and stored locally in your browser cache — it never goes to our servers.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
