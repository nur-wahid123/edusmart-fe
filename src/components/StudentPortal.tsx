'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentPortal() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white p-4 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-slate-800">EduSmart Pro - Student Portal</h1>
          <button
            onClick={() => router.push('/')}
            className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-slate-400 text-sm">
          Student portal components will be implemented here. This is a placeholder.
        </p>
      </div>
    </div>
  );
}
