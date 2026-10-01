import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../lib/nirmaan/auth';

export const Route = createFileRoute('/nirmaan/login')({
  component: NirmaanLogin,
});

function NirmaanLogin() {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithOtp, verifyOtp } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [otpToken, setOtpToken] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to hub
  React.useEffect(() => {
    if (user) {
      navigate({ to: '/nirmaan' });
    }
  }, [user, navigate]);

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
    setLoading(true);

    try {
      await signInWithOtp(email.trim());
      setSuccessMsg('OTP has been sent to your email.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await verifyOtp(email.trim(), otpToken.trim());
      navigate({ to: '/nirmaan' });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid OTP token.');
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
          <p className="text-xs text-neutral-400 font-mono">Sign in to participate in the speed challenge</p>
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
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Password</label>
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
      </div>
    </div>
  );
}
