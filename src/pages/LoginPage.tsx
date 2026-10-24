import React, { useState } from 'react';
import {
  BookOpen,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      if (!result.success) {
        setErrorMessage(
          result.message || 'Nama pengguna atau kata sandi tidak sesuai. Gunakan Username: smkfania dan Password: 2009'
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUsername('smkfania');
    setPassword('2009');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Bar / Branding */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-900/40 ring-1 ring-teal-400/30">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-tight">Ruang Kelas</span>
              <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                Aplikasi Resmi
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Kesepakatan & Pendampingan Siswa</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3.5 py-1.5 text-xs text-slate-300 backdrop-blur-md">
          <ShieldCheck className="h-4 w-4 text-teal-400" />
          <span>Portal Aman Terenkripsi</span>
        </div>
      </div>

      {/* Main Login Card Area */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          {/* Form Header */}
          <div className="mb-6 text-center space-y-1.5 relative z-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-2">
              <KeyRound className="h-6 w-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Masuk ke Aplikasi
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Silakan masukkan kredensial akun petugas resmi sekolah untuk mengakses sistem.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Gagal Masuk:</span>
                <p className="text-[11px] text-rose-200/90 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nama Pengguna (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username (smkfania)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-10 pr-4 py-2.5 text-xs font-semibold text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">Kata Sandi (Password)</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password (2009)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-10 pr-11 py-2.5 text-xs font-semibold text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-2.5 px-4 text-xs font-bold text-white shadow-lg shadow-teal-900/30 hover:from-teal-500 hover:to-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>Memverifikasi akun...</span>
              ) : (
                <>
                  <span>Masuk ke Aplikasi</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-fill helper for convenience */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center relative z-10">
            <button
              type="button"
              onClick={handleQuickFill}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-[11px] font-semibold text-teal-300 hover:bg-teal-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Klik di sini untuk mengisi otomatis: smkfania / 2009</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto w-full text-center py-2 space-y-1 text-slate-500 text-xs">
        <p className="text-[11px]">
          Ruang Kelas • Kesepakatan Kelas & Pendampingan Siswa Berprinsip Restoratif
        </p>
        <p className="text-[10px] text-slate-600">
          Seluruh data peserta didik dilindungi dan bersifat rahasia sesuai etika pendidikan.
        </p>
      </div>
    </div>
  );
};
