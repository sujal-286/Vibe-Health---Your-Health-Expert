import React, { useState } from 'react';
import { AppState, UserProfile } from '../types';
import { db } from '../services/db';

interface AuthProps {
  state: AppState;
  setState: (s: AppState) => void;
  onLogin: (u: UserProfile) => void;
}

export const Auth: React.FC<AuthProps> = ({ state, setState, onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (db.login(email, pass)) {
      const user = db.getCurrentUser();
      if (user) onLogin(user);
    } else {
      alert("Invalid credentials or user not found.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sentOtp = db.register(email, pass);
      // Simulate Email sending
      setNotification(`(SIMULATION) Email sent to ${email} from schavan2867@gmail.com. OTP: ${sentOtp}`);
      setState(AppState.AUTH_VERIFY);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (db.verifyOTP(otp)) {
      setNotification(null);
      // Success, now login logic essentially
      onLogin({} as UserProfile); // Empty profile signals need for onboarding
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-vibe-dark p-6 relative">
      {notification && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-green-900/90 text-green-100 p-4 rounded-lg shadow-xl border border-green-500 max-w-lg text-center z-50">
          <p className="font-mono text-sm">{notification}</p>
          <button onClick={() => setNotification(null)} className="text-xs underline mt-2">Dismiss</button>
        </div>
      )}

      <div className="w-full max-w-md bg-vibe-card border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            {state === AppState.AUTH_LOGIN ? 'Welcome Back' : state === AppState.AUTH_REGISTER ? 'Join Vibe Health' : 'Verify Email'}
        </h2>
        <p className="text-center text-slate-400 mb-8 text-sm">Advanced Health Monitoring</p>

        {state === AppState.AUTH_LOGIN && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={pass} onChange={e => setPass(e.target.value)} />
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors">Log In</button>
            <div className="text-center text-sm text-slate-400">
              Don't have an account? <button type="button" onClick={() => setState(AppState.AUTH_REGISTER)} className="text-cyan-400 hover:underline">Sign Up</button>
            </div>
          </form>
        )}

        {state === AppState.AUTH_REGISTER && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="email" placeholder="Email" required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={pass} onChange={e => setPass(e.target.value)} />
            <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg transition-colors">Sign Up</button>
            <div className="text-center text-sm text-slate-400">
              Already have an account? <button type="button" onClick={() => setState(AppState.AUTH_LOGIN)} className="text-cyan-400 hover:underline">Log In</button>
            </div>
          </form>
        )}

        {state === AppState.AUTH_VERIFY && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-slate-300 text-center">Please enter the 6-digit code sent to your email.</p>
            <input type="text" placeholder="######" maxLength={6} required className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-center text-2xl tracking-widest focus:border-cyan-500 outline-none" value={otp} onChange={e => setOtp(e.target.value)} />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors">Verify & Continue</button>
          </form>
        )}
      </div>
    </div>
  );
};