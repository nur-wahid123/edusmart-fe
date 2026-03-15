'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

interface TeacherLoginProps {
  onLoginSuccess: (teacherId: string) => void;
  onLogout: () => void;
}

export default function TeacherLogin({ onLoginSuccess, onLogout }: TeacherLoginProps) {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState('');
  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!teacherId || !pin) {
      setLoginError("Mohon isi ID dan PIN.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await authService.login({
        teacherId: teacherId.trim().toUpperCase(),
        pin,
      });
      onLoginSuccess(response.teacherId);
    } catch (error: any) {
      setLoginError(error.response?.data?.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="flex-1 flex flex-col justify-center w-full max-w-sm">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Login Guru</h2>
            <p className="text-slate-400 text-xs font-bold mt-2">EduSmart Multi-Account</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                ID Guru
              </label>
              <input
                type="text"
                placeholder="Kode Akun"
                className="w-full p-4 bg-slate-50 border-2 rounded-2xl text-center text-xl font-bold font-mono outline-none focus:border-indigo-500 transition-colors uppercase"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                PIN Akses
              </label>
              <input
                type="password"
                placeholder="******"
                className="w-full p-4 bg-slate-50 border-2 rounded-2xl text-center text-xl font-bold font-mono outline-none focus:border-indigo-500 transition-colors"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>
          {loginError && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl mt-4 text-center">
              {loginError}
            </div>
          )}
          <button
            disabled={isLoggingIn}
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all mt-6 disabled:opacity-50"
          >
            {isLoggingIn ? "Memeriksa..." : "Masuk Akun"}
          </button>
          <div className="text-center mt-6">
            <span className="text-[10px] text-slate-400 font-medium">Default PIN: 123456</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full mt-2 text-slate-400 text-sm font-bold hover:text-slate-600"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
