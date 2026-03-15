'use client';

import { useRouter } from 'next/navigation';
import { BrainCircuit, GraduationCap, UserCircle, ShieldCheck } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-700 to-blue-900 text-white relative">
      <div className="max-w-md w-full text-center flex-1 flex flex-col justify-center">
        <div className="bg-white/10 p-6 rounded-3xl inline-block mb-6 backdrop-blur-sm border border-white/20 mx-auto w-fit shadow-xl">
          <BrainCircuit size={64} className="text-yellow-300" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">EduSmart Pro</h1>
        <p className="text-indigo-200 mb-8 font-medium">Platform Ujian AI (Multi-Account)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 w-full">
          <button
            onClick={() => router.push('/teacher')}
            className="bg-white text-indigo-700 py-5 rounded-2xl font-bold shadow-xl hover:bg-indigo-50 transition-all active:scale-95 flex flex-col items-center gap-2"
          >
            <GraduationCap size={24} /> Panel Guru
          </button>
          <button
            onClick={() => router.push('/student')}
            className="bg-indigo-500 border border-indigo-400 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-indigo-400 transition-all active:scale-95 flex flex-col items-center gap-2"
          >
            <UserCircle size={24} /> Portal Siswa
          </button>
        </div>

        <button
          onClick={() => router.push('/admin/pins')}
          className="w-full py-4 rounded-2xl font-bold text-sm bg-indigo-900/50 hover:bg-indigo-800 text-indigo-200 border border-indigo-800 transition-colors flex items-center justify-center gap-2"
        >
          <ShieldCheck size={16} /> Monitor Database PIN
        </button>
      </div>

      <div className="w-full text-center py-6 mt-auto">
        <span className="text-[10px] font-mono text-slate-300 tracking-wider">
          EduSmart Pro v4.7 • Stability Update
        </span>
      </div>
    </div>
  );
}
