import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, ArrowRight, AlertCircle, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../lib/nirmaan/auth';
import { supabase } from '../../lib/nirmaan/supabase';

export const Route = createFileRoute('/nirmaan/login')({
  component: NirmaanLogin,
});

function NirmaanLogin() {
  const navigate = useNavigate();
  const {
    user,
    signIn,
    signUp,
    signInWithOtp,
    verifyOtp,
    resetPasswordForEmail,
    verifyRecoveryOtp,
    updatePassword,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'otp' | 'reset'>('signin');
  const [resetStep, setResetStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [otpToken, setOtpToken] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for auth errors or recovery triggers in URL
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
      window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
    );

    const error = searchParams.get('error') || hashParams.get('error');
    const errorCode = searchParams.get('error_code') || hashParams.get('error_code');
    const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');

    if (error || errorCode || errorDescription) {
      if (errorCode === 'otp_expired' || errorDescription?.toLowerCase().includes('expired')) {
        setErrorMsg('The sign-in link or OTP has expired. Please enter your email and request a new code.');
      } else {
        setErrorMsg(
          errorDescription
            ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
            : 'Authentication failed. Please try again.'
        );
      }
      setMode('otp');
      // Clean up hash/query in URL so it doesn't persist on refresh or interfere with new attempts
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch {
        // ignore
      }
      return;
    }

    const type = searchParams.get('type') || hashParams.get('type');
    const modeParam = searchParams.get('mode');

    if (modeParam === 'reset' || type === 'recovery') {
      setMode('reset');
      if (type === 'recovery') {
        setResetStep('verify');
      }
    }
  }, []);

  // Listen for Supabase password recovery auth event
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
        setResetStep('verify');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // If user object has email and email state is empty, auto-populate email
  React.useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user, email]);

  // If already logged in and not currently resetting password, redirect to hub
  React.useEffect(() => {
    if (user && mode !== 'reset') {
      navigate({ to: '/nirmaan' });
    }
  }, [user, mode, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await signIn(email.trim(), password);
      navigate({ to: '/nirmaan' });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await signUp(email.trim(), password, {
        full_name: fullName.trim(),
        college: college.trim(),
        roll_number: rollNumber.trim(),
        phone: phone.trim(),
      });
      setSuccessMsg('Account created successfully! You are now logged in.');
      setTimeout(() => navigate({ to: '/nirmaan' }), 1200);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await signInWithOtp(email.trim());
      setSuccessMsg('A 6-digit OTP code has been sent to your email.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await verifyOtp(email.trim(), otpToken.trim());
      navigate({ to: '/nirmaan' });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await resetPasswordForEmail(email.trim());
      setSuccessMsg('A 6-digit recovery code and reset link have been sent to your email.');
      setResetStep('verify');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send recovery email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const targetEmail = (user?.email || email).trim();
    if (!targetEmail) {
      setErrorMsg('Please provide your registered email address.');
      return;
    }

    if (!user && !otpToken.trim()) {
      setErrorMsg('Please enter the 6-digit recovery code sent to your email.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (!user && otpToken.trim()) {
        await verifyRecoveryOtp(targetEmail, otpToken.trim());
      }
      await updatePassword(newPassword);
      setSuccessMsg('Password updated successfully! Redirecting...');
      setTimeout(() => {
        navigate({ to: '/nirmaan' });
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Failed to update password. Please check your recovery code or request a new one.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md border border-neutral-800 bg-neutral-900/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 items-center justify-center shadow-lg shadow-amber-500/20 mb-2">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">NIRMAAN Daily Quiz</h1>
          <p className="text-xs text-neutral-400 font-mono">
            {mode === 'reset' ? 'Reset your account password' : 'Sign in to participate in the speed challenge'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-lg transition ${mode === 'signin' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-lg transition ${mode === 'signup' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setMode('otp'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-lg transition ${mode === 'otp' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
          >
            Email OTP
          </button>
        </div>

        {/* Alert banners */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@rgipt.ac.in"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-neutral-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset');
                    setResetStep('request');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 transition"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aman Sharma"
                className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="25mc3027@rgipt.ac.in"
                className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">College</label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="RGIPT"
                  className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Roll Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="25MC3027"
                  className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition flex items-center justify-center gap-2 disabled:opacity-50 pt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>
        )}

        {/* OTP Flow */}
        {mode === 'otp' && (
          <div className="space-y-4">
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@rgipt.ac.in"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-neutral-800 text-white font-medium text-xs hover:bg-neutral-700 transition"
              >
                Send OTP Code
              </button>
            </form>

            <form onSubmit={handleVerifyOtp} className="space-y-3 pt-2 border-t border-neutral-800">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm font-mono tracking-widest text-center focus:outline-none focus:border-white/40 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition flex items-center justify-center gap-2"
              >
                <span>Verify & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Password Reset Flow */}
        {mode === 'reset' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-white">Reset Password</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>

            {resetStep === 'request' ? (
              <form onSubmit={handleRequestReset} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Registered Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@rgipt.ac.in"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
                    We will send a 6-digit recovery code and reset instructions to your registered email via Brevo.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{loading ? 'Sending Code...' : 'Send Recovery Code'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep('verify');
                      setErrorMsg(null);
                    }}
                    className="text-xs text-neutral-400 hover:text-amber-400 transition"
                  >
                    Already have a 6-digit code? Enter it here &rarr;
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    readOnly={Boolean(user?.email)}
                    value={user?.email || email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@rgipt.ac.in"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600 read-only:opacity-70"
                  />
                </div>

                {!user && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">6-Digit Recovery Code</label>
                    <input
                      type="text"
                      required
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm font-mono tracking-widest text-center focus:outline-none focus:border-white/40 transition"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white/40 transition placeholder:text-neutral-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Updating Password...' : 'Reset Password & Sign In'}</span>
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep('request');
                      setErrorMsg(null);
                    }}
                    className="text-neutral-400 hover:text-white transition"
                  >
                    &larr; Resend recovery code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-amber-400 hover:text-amber-300 transition"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
