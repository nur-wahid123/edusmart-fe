'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, X, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

const VALID_TEACHER_IDS = [
  "GA1024", "GA5829", "GA9102", "GA3381", "GA7721",
  "GA4921", "GA1105", "GA6632", "GA8819", "GA2031",
  "GA5512", "GA9403", "GA3129", "GA0042", "GA7856",
  "GA2910", "GA6234", "GA8111", "GA4590", "GA1337",
  "GA9001", "GA3742", "GA7283", "GA0921", "GA5467",
  "GA1823", "GA6540", "GA8923", "GA2451", "GA7012",
  "GA3219", "GA1192", "GA4433", "GA9821", "GA5601",
  "GA0723", "GA6891", "GA2219", "GA8005", "GA3546",
  "GA7321", "GA1452", "GA5098", "GA9234", "GA4118",
  "GA2673", "GA6112", "GA0889", "GA8345", "GA5921",
  "GA3667", "GA7492", "GA1902", "GA9754", "GA4231",
  "GA0556", "GA2841", "GA6339", "GA8520", "GA1293",
  "GA5117", "GA9602", "GA3021", "GA7114", "GA4882",
  "GA0239", "GA2558", "GA6942", "GA8221", "GA1776",
  "GA5309", "GA9315", "GA3999", "GA7662", "GA4654",
  "GA0411", "GA2118", "GA6444", "GA8672", "GA5771",
  "GA1503", "GA9981", "GA3420", "GA7993", "GA2789",
  "GA4002", "GA0667", "GA5225", "GA8431", "GA1648",
  "GA6010", "GA9555", "GA3888", "GA7519", "GA2345",
  "GA4723", "GA0129", "GA5881", "GA8704", "GA1890",
  "GA6772", "GA9222", "GA3553", "GA7001", "GA2992",
  "GA4311", "GA0334", "GA5446", "GA8119", "GA2665",
  "GA1112", "GA9889", "GA3221", "GA7554", "GA0990"
];

export default function PinMonitorPage() {
  const router = useRouter();
  const [showPinAuth, setShowPinAuth] = useState(true);
  const [authPassword, setAuthPassword] = useState('');
  const [pinMap, setPinMap] = useState<Record<string, string>>({});
  const [loadingPins, setLoadingPins] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePinAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authPassword === '470162') {
      setShowPinAuth(false);
      await fetchPins();
    } else {
      alert("Password Akses Salah! Akses Ditolak.");
      setAuthPassword('');
    }
  };

  const fetchPins = async () => {
    setLoadingPins(true);
    try {
      const data = await authService.getAllPins();
      setPinMap(data || {});
    } catch (error) {
      console.error("Error fetching pins:", error);
      alert("Gagal memuat data PIN. Pastikan koneksi internet lancar.");
    } finally {
      setLoadingPins(false);
    }
  };

  const filteredAccounts = VALID_TEACHER_IDS.filter(id =>
    id.includes(searchTerm.toUpperCase())
  );

  if (showPinAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-white text-slate-900 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl">
          <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h3 className="text-xl font-black text-center text-slate-800 mb-2">Akses Terbatas</h3>
          <p className="text-center text-slate-400 font-bold text-xs mb-6">Masukkan Password Administrator</p>
          <form onSubmit={handlePinAuthSubmit}>
            <input
              type="password"
              autoFocus
              placeholder="Passcode..."
              className="w-full p-4 bg-slate-50 border-2 rounded-2xl text-center text-xl font-bold font-mono outline-none focus:border-indigo-500 transition-colors mb-4 text-slate-800"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 py-3 font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-colors"
              >
                Buka
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <ShieldCheck size={24} className="text-indigo-600" /> Database Akun
              </h3>
              <p className="text-xs text-slate-400 font-bold mt-1">
                Status PIN dari {VALID_TEACHER_IDS.length} Akun Guru
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 p-3 rounded-xl">
              <Search size={18} className="text-slate-400" />
              <input
                className="bg-transparent outline-none font-bold text-slate-700 w-full uppercase placeholder:normal-case"
                placeholder="Cari ID Guru (Misal: GA1024)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
            {loadingPins ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
                <span className="text-xs font-bold">Memuat data...</span>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredAccounts.map((id) => {
                  const customPin = pinMap[id];
                  const isDefault = !customPin || customPin === '123456';
                  return (
                    <div
                      key={id}
                      className={`flex items-center justify-between p-4 rounded-2xl border ${
                        isDefault
                          ? 'bg-slate-50 border-slate-100'
                          : 'bg-indigo-50 border-indigo-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                            isDefault
                              ? 'bg-slate-200 text-slate-500'
                              : 'bg-indigo-200 text-indigo-700'
                          }`}
                        >
                          {id.replace('GA', '')}
                        </div>
                        <div>
                          <div className="font-black text-slate-700">{id}</div>
                          <div
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                              isDefault
                                ? 'bg-slate-200 text-slate-500'
                                : 'bg-indigo-200 text-indigo-600'
                            }`}
                          >
                            {isDefault ? 'Default' : 'Custom'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          PIN Akses
                        </div>
                        <div className="font-mono font-bold text-lg tracking-wider text-slate-800">
                          {customPin || '123456'}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredAccounts.length === 0 && (
                  <div className="text-center py-10 text-slate-400 font-bold">
                    Tidak ada akun dengan ID "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
